-- ============================================
-- SELAH KIDS CMS — Migration: per-locale SEO fields
-- Date: 2026-04-24
-- ============================================
--
-- Context
-- -------
-- The `seo_pages` collection stores each page's SEO block as a JSONB
-- `data` row under the shared `collections` table. Prior to this
-- migration each row carried a single language's copy in
--     metaTitle, metaDescription, ogTitle, ogDescription
-- which the public metadata reader would hand back on both /en/* and
-- /es/* URLs — i.e. Spanish pages showed English SEO copy.
--
-- Phase 2b of the design plan introduced four per-locale pairs:
--     metaTitleEn / metaTitleEs
--     metaDescriptionEn / metaDescriptionEs
--     ogTitleEn / ogTitleEs
--     ogDescriptionEn / ogDescriptionEs
-- The public reader (`selectSeoField` in `src/lib/cms-server.ts`) prefers
-- the locale-matching variant, falls back to the opposite locale, and
-- finally to the legacy flat field. This migration guarantees every
-- existing `seo_pages` row has at least the EN/ES keys so readers are
-- never fetched a stale value.
--
-- Idempotency
-- -----------
-- The UPDATE only writes when the key is missing (||) and never touches
-- the legacy flat fields, so the migration is safe to re-run. It uses
-- `jsonb_set(…, create_missing => true)` with a `COALESCE` fallback on
-- the legacy value to avoid hard-coding English strings.
--
-- Roll-forward plan
-- -----------------
-- Once the admin has populated real Spanish copy for every row, the
-- legacy flat fields (`metaTitle`, `metaDescription`, `ogTitle`,
-- `ogDescription`) can be dropped in a follow-up migration — leave for
-- now so older clients don't break mid-deploy.

BEGIN;

-- Guard: abort cleanly if the collections table doesn't exist yet
-- (e.g. a local clone running before supabase-schema.sql has been
-- applied).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'collections'
  ) THEN
    RAISE EXCEPTION
      'collections table not found — run supabase-schema.sql first.';
  END IF;
END $$;

-- Backfill metaTitleEn / metaTitleEs from legacy metaTitle
UPDATE collections
SET data = jsonb_set(
  jsonb_set(
    data,
    '{metaTitleEn}',
    to_jsonb(COALESCE(data->>'metaTitleEn', data->>'metaTitle', '')),
    true
  ),
  '{metaTitleEs}',
  to_jsonb(COALESCE(data->>'metaTitleEs', data->>'metaTitle', '')),
  true
)
WHERE collection = 'seo_pages'
  AND (
    NOT (data ? 'metaTitleEn')
    OR NOT (data ? 'metaTitleEs')
  );

-- Backfill metaDescriptionEn / metaDescriptionEs
UPDATE collections
SET data = jsonb_set(
  jsonb_set(
    data,
    '{metaDescriptionEn}',
    to_jsonb(COALESCE(data->>'metaDescriptionEn', data->>'metaDescription', '')),
    true
  ),
  '{metaDescriptionEs}',
  to_jsonb(COALESCE(data->>'metaDescriptionEs', data->>'metaDescription', '')),
  true
)
WHERE collection = 'seo_pages'
  AND (
    NOT (data ? 'metaDescriptionEn')
    OR NOT (data ? 'metaDescriptionEs')
  );

-- Backfill ogTitleEn / ogTitleEs
UPDATE collections
SET data = jsonb_set(
  jsonb_set(
    data,
    '{ogTitleEn}',
    to_jsonb(COALESCE(data->>'ogTitleEn', data->>'ogTitle', '')),
    true
  ),
  '{ogTitleEs}',
  to_jsonb(COALESCE(data->>'ogTitleEs', data->>'ogTitle', '')),
  true
)
WHERE collection = 'seo_pages'
  AND (
    NOT (data ? 'ogTitleEn')
    OR NOT (data ? 'ogTitleEs')
  );

-- Backfill ogDescriptionEn / ogDescriptionEs
UPDATE collections
SET data = jsonb_set(
  jsonb_set(
    data,
    '{ogDescriptionEn}',
    to_jsonb(COALESCE(data->>'ogDescriptionEn', data->>'ogDescription', '')),
    true
  ),
  '{ogDescriptionEs}',
  to_jsonb(COALESCE(data->>'ogDescriptionEs', data->>'ogDescription', '')),
  true
)
WHERE collection = 'seo_pages'
  AND (
    NOT (data ? 'ogDescriptionEn')
    OR NOT (data ? 'ogDescriptionEs')
  );

COMMIT;
