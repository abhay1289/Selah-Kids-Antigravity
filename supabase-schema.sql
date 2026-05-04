-- ============================================
-- SELAH KIDS CMS — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

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

-- Insert default row
INSERT INTO site_settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;

-- 2. Page Content (Every editable field on every page)
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,          -- 'home', 'about', 'watch', etc.
  section TEXT NOT NULL,       -- 'hero', 'about', 'youtube', etc.
  field TEXT NOT NULL,         -- 'badge', 'title', 'description', etc.
  value_en TEXT DEFAULT '',
  value_es TEXT DEFAULT '',
  field_type TEXT DEFAULT 'text', -- 'text', 'textarea', 'richtext', 'image', 'url', 'color', 'number'
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, section, field)
);

-- 3. Collections (Videos, Team, Characters, Testimonials, Blog Posts, etc.)
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection TEXT NOT NULL,     -- 'videos', 'team', 'characters', 'testimonials', 'blog_posts', 'why_features', 'trust_badges', 'impact_cards', 'resources'
  data JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_content_page ON page_content(page);
CREATE INDEX IF NOT EXISTS idx_page_content_page_section ON page_content(page, section);
CREATE INDEX IF NOT EXISTS idx_collections_collection ON collections(collection);
CREATE INDEX IF NOT EXISTS idx_collections_published ON collections(collection, is_published);

-- 4. Row Level Security (RLS)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Public read access (for the live site)
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read published page_content" ON page_content FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published collections" ON collections FOR SELECT USING (is_published = true);

-- Authenticated write access (for admin dashboard)
CREATE POLICY "Admin write site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write page_content" ON page_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write collections" ON collections FOR ALL USING (auth.role() = 'authenticated');

-- 5. Storage bucket for media uploads
-- Run this in the dashboard or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
