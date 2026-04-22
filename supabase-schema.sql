-- ============================================
-- SELAH KIDS CMS — Database Schema
-- Run this in the Supabase SQL Editor.
-- ============================================

-- 0. Admin allow-list
-- Every row in this table is a user permitted to write CMS content.
-- Populate via the Supabase dashboard (Auth → Users to get the uid).
-- RLS below checks membership in this table — NOT just "any authenticated
-- user", which was the original permissive policy.
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper: is the current caller an admin_users row?
-- SECURITY DEFINER so the function itself can read admin_users regardless of
-- the caller's RLS visibility. SET search_path pins lookups to the `public`
-- and `pg_temp` schemas — without this, a hijacked search_path could point
-- `admin_users` at an attacker-owned table in another schema.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$;

-- 1. Site Settings (Global config — single row)
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  site_title TEXT DEFAULT 'Selah Kids',
  meta_description TEXT DEFAULT '',
  meta_description_es TEXT DEFAULT '',
  logo_url TEXT DEFAULT '/SK_Logo_FN.jpg',
  footer_tagline TEXT DEFAULT '',
  footer_tagline_es TEXT DEFAULT '',
  footer_email TEXT DEFAULT 'info.selahkids@gmail.com',
  youtube_url_en TEXT DEFAULT '',
  youtube_url_es TEXT DEFAULT '',
  instagram_url_en TEXT DEFAULT '',
  instagram_url_es TEXT DEFAULT '',
  spotify_url TEXT DEFAULT '',
  apple_music_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO site_settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;

-- 2. Page Content
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  field TEXT NOT NULL,
  value_en TEXT DEFAULT '',
  value_es TEXT DEFAULT '',
  field_type TEXT NOT NULL DEFAULT 'text'
    CHECK (field_type IN ('text', 'textarea', 'richtext', 'image', 'url', 'color', 'number')),
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, section, field)
);

-- 3. Collections
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-bump updated_at on UPDATE
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE PLPGSQL AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS t_site_settings_touch ON site_settings;
CREATE TRIGGER t_site_settings_touch BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS t_page_content_touch ON page_content;
CREATE TRIGGER t_page_content_touch BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS t_collections_touch ON collections;
CREATE TRIGGER t_collections_touch BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_page_content_page ON page_content(page);
CREATE INDEX IF NOT EXISTS idx_page_content_page_section ON page_content(page, section);
CREATE INDEX IF NOT EXISTS idx_collections_collection ON collections(collection);
CREATE INDEX IF NOT EXISTS idx_collections_published ON collections(collection, is_published);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE admin_users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content   ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections    ENABLE ROW LEVEL SECURITY;

-- admin_users: only admins can see the allow-list
DROP POLICY IF EXISTS "Admins read admin_users" ON admin_users;
CREATE POLICY "Admins read admin_users" ON admin_users FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admins write admin_users" ON admin_users;
CREATE POLICY "Admins write admin_users" ON admin_users FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Public read (for the live site — anonymous visitors)
DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public read published page_content" ON page_content;
CREATE POLICY "Public read published page_content" ON page_content FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "Public read published collections" ON collections;
CREATE POLICY "Public read published collections" ON collections FOR SELECT USING (is_published = TRUE);

-- Admin write — only users listed in admin_users can mutate CMS content.
-- This replaces the original `auth.role() = 'authenticated'` policy, which
-- let any signed-in Supabase user edit the site.
DROP POLICY IF EXISTS "Admin write site_settings" ON site_settings;
CREATE POLICY "Admin write site_settings" ON site_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin write page_content" ON page_content;
CREATE POLICY "Admin write page_content" ON page_content FOR ALL USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin write collections" ON collections;
CREATE POLICY "Admin write collections" ON collections FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ============================================
-- Storage bucket
-- ============================================
-- Create the `media` bucket (public-read, admin-write). Idempotent via ON CONFLICT.
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Policies restrict uploads/updates/deletes to admin_users members. Without
-- these, a public bucket would accept writes from any anonymous caller.
DROP POLICY IF EXISTS "Public read media" ON storage.objects;
CREATE POLICY "Public read media" ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admin upload media" ON storage.objects;
CREATE POLICY "Admin upload media" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND is_admin());

DROP POLICY IF EXISTS "Admin update media" ON storage.objects;
CREATE POLICY "Admin update media" ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND is_admin());

DROP POLICY IF EXISTS "Admin delete media" ON storage.objects;
CREATE POLICY "Admin delete media" ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND is_admin());

-- ============================================
-- First-run bootstrap
-- ============================================
-- After creating an account in Supabase Auth, run this once with the UUID
-- from auth.users to seed yourself as the first admin:
--
--   INSERT INTO admin_users (user_id, email, role)
--   VALUES ('<your-uuid>', 'you@example.com', 'admin');
