/**
 * Server-side CMS reader with tagged SSG caching.
 *
 * Three modes, selected automatically per call:
 *   - 'public'  — anon PostgREST fetch with cache: 'force-cache' + 24h backstop.
 *                 RLS filters to is_published = true. This is the default for
 *                 every public page render.
 *   - 'preview' — authenticated fetch using the admin's Supabase session cookie.
 *                 RLS policy "Admin read all <table>" allows drafts through.
 *                 cache: 'no-store' — admins always see the latest saved state.
 *   - 'offline' — no Supabase env vars set. Returns constants from
 *                 src/data/cms-fallbacks.ts. Dev / demo only.
 *
 * Shape invariants:
 *   - Empty DB + env vars set (prod misconfig) = THROW. Never silently serve
 *     an empty site. Deploy must run seed before traffic.
 *   - Admin session cookies pass through via @supabase/ssr createServerClient,
 *     giving them access to the "Admin read all" RLS policy without service-role.
 *
 * Cache tags (invalidated by admin save via /api/revalidate):
 *   - collection:<name> for each collection row
 *   - page_content:<page> for page editors
 *   - site_settings for the global row
 */

import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import * as fallbacks from '../data/cms-fallbacks';
import { INITIAL_SEO_PAGES, SITE_ORIGIN, type PageSEO } from '../data/chrome-seo';

// Env is read at call-time (not module-load) so tests can toggle modes per
// test and so a late-set env var still flips the reader out of offline mode.
// Runtime cost is negligible — two property reads per call.
function env() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}
export function isOfflineMode(): boolean {
  const { url, anon } = env();
  return !url || !anon;
}

// 24h safety-net revalidate. On-demand `revalidateTag` wins for fresh edits.
// Backstop exists so a single missed revalidate call can't freeze a page
// forever — after 24h Next.js re-fetches on next request.
const BACKSTOP_SECONDS = 86400;

// ───────────────────────────────────────────────────────────
// Types (mirror src/lib/cms.ts plus PageFieldMap shape)
// ───────────────────────────────────────────────────────────

export interface CollectionRow {
  id: string;
  collection: string;
  data: Record<string, unknown>;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
}

export interface PageContentRow {
  id: string;
  page: string;
  section: string;
  field: string;
  value_en: string;
  value_es: string;
  field_type: string;
  sort_order: number;
  is_published: boolean;
  updated_at: string;
}

export interface PageField {
  en: string;
  es: string;
}
export type PageFieldMap = Record<string, PageField>;

type ReaderMode = 'public' | 'preview' | 'offline';

// ───────────────────────────────────────────────────────────
// Mode detection
// ───────────────────────────────────────────────────────────

/**
 * Whether the incoming request is an authenticated admin that should see
 * drafts. Checked by looking for a Supabase auth cookie; verification of the
 * cookie happens naturally when the RLS policy evaluates auth.uid().
 */
async function hasAdminSession(): Promise<boolean> {
  if (isOfflineMode()) return false;
  const store = await cookies();
  // @supabase/ssr stores the access token in sb-<project>-auth-token cookies.
  // Presence alone gates preview mode; RLS enforces admin_users membership.
  return store.getAll().some((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
}

async function resolveMode(explicit?: 'preview'): Promise<ReaderMode> {
  if (isOfflineMode()) return 'offline';
  // CRITICAL: short-circuit before reading cookies() when the caller
  // hasn't requested preview. Reading cookies()/headers() in a Server
  // Component opts the surrounding route into dynamic rendering and
  // kills SSG on every public page. The admin preview dispatcher passes
  // `explicit: 'preview'` to every read, so that path stays covered.
  if (explicit === 'preview' && (await hasAdminSession())) return 'preview';
  return 'public';
}

// ───────────────────────────────────────────────────────────
// Empty-DB guard — fail-fast in prod if env is set but site_settings is dry.
// Applied ONLY to site_settings (which has no is_published filter) because
// that's the unambiguous "DB was never seeded" signal. Collections and
// page_content can legitimately return zero published rows when an admin
// unpublishes content — throwing there would take the public site down.
// ───────────────────────────────────────────────────────────

class EmptyCmsError extends Error {
  constructor(source: string) {
    super(
      `CMS not seeded: ${source} returned zero rows with Supabase env configured. ` +
        `Run 'bun run seed:cms' before serving traffic.`,
    );
    this.name = 'EmptyCmsError';
  }
}

// ───────────────────────────────────────────────────────────
// Preview-mode Supabase client (reads cookies, bypasses public RLS
// via "Admin read all" policy)
// ───────────────────────────────────────────────────────────

async function getPreviewClient(): Promise<SupabaseClient | null> {
  const { url, anon } = env();
  if (!url || !anon) return null;
  const store = await cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: () => {
        // Preview is read-only; cookie refreshes get written on the next
        // admin write path. No-op here so we don't clash with that write.
      },
    },
  }) as unknown as SupabaseClient;
}

// ───────────────────────────────────────────────────────────
// Public-mode PostgREST fetch (tagged + force-cache + 24h backstop)
// ───────────────────────────────────────────────────────────

async function pgrestFetch<T>(path: string, tags: string[]): Promise<T[]> {
  const { url: base, anon } = env();
  const res = await fetch(`${base}/rest/v1/${path}`, {
    headers: {
      apikey: anon!,
      Authorization: `Bearer ${anon}`,
      // Explicit Accept. Supabase returns JSON either way but this makes the
      // cache key deterministic.
      Accept: 'application/json',
    },
    cache: 'force-cache',
    next: { tags, revalidate: BACKSTOP_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`PostgREST ${res.status} on ${path}: ${await res.text()}`);
  }
  return (await res.json()) as T[];
}

// ───────────────────────────────────────────────────────────
// Public API — getCollection / getPageContent / getSiteSettings
// ───────────────────────────────────────────────────────────

/**
 * Fetch a CMS collection. Unpacks rows' `data` JSONB into typed items.
 *
 * @param collection  Collection name (e.g. 'blog_posts', 'videos')
 * @param fallback    Offline-mode default. Must match the item shape.
 * @param opts.mode   Pass 'preview' from admin preview routes to see drafts.
 */
export async function getCollection<T extends { id: string }>(
  collection: string,
  fallback: T[],
  opts: { mode?: 'preview' } = {},
): Promise<T[]> {
  const mode = await resolveMode(opts.mode);

  if (mode === 'offline') return fallback;

  if (mode === 'preview') {
    const client = await getPreviewClient();
    if (!client) return fallback;
    const { data, error } = await client
      .from('collections')
      .select('*')
      .eq('collection', collection)
      .order('sort_order');
    if (error) throw new Error(`Preview read failed for ${collection}: ${error.message}`);
    return unpack<T>(data ?? []);
  }

  // Public mode. Zero published rows is a valid state (admin unpublished
  // everything, or the collection legitimately has no entries yet), so we
  // return an empty list rather than throwing. Empty-DB fail-fast only fires
  // in getSiteSettings, which has no is_published filter — if that row is
  // missing, the DB is genuinely unseeded.
  const rows = await pgrestFetch<CollectionRow>(
    `collections?collection=eq.${encodeURIComponent(collection)}&is_published=eq.true&order=sort_order`,
    [`collection:${collection}`],
  );
  return unpack<T>(rows);
}

function unpack<T extends { id: string }>(rows: CollectionRow[]): T[] {
  // Admin writes the item object into `data` and sets `id` from the same
  // payload. We merge so callers see a flat typed object with id present
  // even if the admin forgot to put it inside data.
  return rows.map((row) => {
    const d = row.data as Record<string, unknown>;
    return { ...(d as object), id: (d.id as string) ?? row.id } as T;
  });
}

/**
 * Fetch all published page_content rows for a page and return a flat
 * { 'section.field': { en, es } } map. Matches useCmsPageContent's shape so
 * admin editors and public readers render from the same structure.
 */
export async function getPageContent(
  page: string,
  fallback: PageFieldMap,
  opts: { mode?: 'preview' } = {},
): Promise<PageFieldMap> {
  const mode = await resolveMode(opts.mode);

  if (mode === 'offline') return fallback;

  if (mode === 'preview') {
    const client = await getPreviewClient();
    if (!client) return fallback;
    const { data, error } = await client
      .from('page_content')
      .select('*')
      .eq('page', page)
      .order('sort_order');
    if (error) throw new Error(`Preview read failed for page ${page}: ${error.message}`);
    return buildFieldMap(data ?? [], fallback);
  }

  // Zero published rows is valid (admin unpublished every field) — merge
  // against fallback and return. Only site_settings throws on empty.
  const rows = await pgrestFetch<PageContentRow>(
    `page_content?page=eq.${encodeURIComponent(page)}&is_published=eq.true&order=sort_order`,
    [`page_content:${page}`],
  );
  return buildFieldMap(rows, fallback);
}

function buildFieldMap(rows: PageContentRow[], fallback: PageFieldMap): PageFieldMap {
  // Merge DB rows OVER fallback so any field the admin hasn't edited yet still
  // renders from the seed, while deletions (cleared fields) show as empty
  // strings instead of resurrecting the seed.
  const map: PageFieldMap = { ...fallback };
  for (const row of rows) {
    map[`${row.section}.${row.field}`] = { en: row.value_en, es: row.value_es };
  }
  return map;
}

/**
 * @deprecated Use `getSiteSettingsFields()` instead.
 *
 * Legacy reader for the typed `site_settings` table. Kept for
 * backwards-compat and as a probe fixture — all active callers (admin
 * GlobalSettings editor, the public site) now use the generic
 * `site_settings_fields` collection via `getSiteSettingsFields()` or
 * `getCollection('site_settings_fields', …)`. When no code references this
 * function, delete it along with the `site_settings` table.
 */
export async function getSiteSettings<T>(fallback: T): Promise<T> {
  const mode = await resolveMode();

  if (mode === 'offline') return fallback;

  // site_settings has a public-read RLS policy (no is_published gate) so
  // this call is fine for both modes.
  const rows = await pgrestFetch<T>(`site_settings?select=*`, ['site_settings']);
  if (rows.length === 0) {
    if (process.env.NODE_ENV === 'production') throw new EmptyCmsError("site_settings");
    return fallback;
  }
  return rows[0]!;
}

/**
 * Fetch the seo_pages collection and turn the row matching `path` into a
 * Next.js `Metadata` object. Pass this into each page's
 * `generateMetadata()` — the collection is tagged and force-cached so the
 * SEO read piggybacks on the same request's /[locale]/layout fetch.
 *
 *   - `path`   — logical path with no locale prefix ('/', '/about', etc.)
 *   - `locale` — 'en' | 'es' — used to produce a locale-aware canonical
 *                and alternates map. Admins store a single canonical in
 *                the CMS; we rewrite it to `{origin}/${locale}${path}`
 *                so each locale gets its own canonical and alternate.
 *
 * Falls back to INITIAL_SEO_PAGES if the DB returns zero rows or no
 * matching path is found.
 */
function parseRobots(directive: PageSEO['robots'] | undefined | null): Metadata['robots'] {
  // Admin editor stores the directive as a union of four strings, but a
  // future migration could leave legacy rows with a null or missing value.
  // Default to the permissive case rather than crashing generateMetadata —
  // a broken <meta robots> tag is recoverable; a blank page is not.
  if (!directive) return { index: true, follow: true };
  const [indexDirective, followDirective] = directive.split(',');
  return {
    index: indexDirective === 'index',
    follow: followDirective === 'follow',
  };
}

function resolveImageUrl(raw: string): string {
  if (!raw) return `${SITE_ORIGIN}/SK_Logo_FN.png`;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('/')) return `${SITE_ORIGIN}${raw}`;
  return `${SITE_ORIGIN}/${raw}`;
}

/**
 * Pick the locale-matching value from a PageSEO row. Falls back through a
 * chain so older DB rows (or partial translations) keep producing valid
 * metadata instead of going undefined:
 *
 *   1. Requested locale (`_es` for es, `_en` for en).
 *   2. Opposite-locale variant (better to show EN copy on an ES page
 *      than to ship an empty `<title>`).
 *   3. Legacy single-locale field (pre-migration rows).
 */
function selectSeoField(
  seo: PageSEO,
  locale: 'en' | 'es',
  base: 'metaTitle' | 'metaDescription' | 'ogTitle' | 'ogDescription',
): string | undefined {
  const enKey = `${base}En` as const;
  const esKey = `${base}Es` as const;
  const enVal = (seo as unknown as Record<string, string | undefined>)[enKey];
  const esVal = (seo as unknown as Record<string, string | undefined>)[esKey];
  const legacy = (seo as unknown as Record<string, string | undefined>)[base];
  const primary = locale === 'es' ? esVal : enVal;
  const fallback = locale === 'es' ? enVal : esVal;
  const pick = primary || fallback || legacy;
  return pick && pick.length > 0 ? pick : undefined;
}

export async function getSeoMetadata(
  path: string,
  locale: 'en' | 'es',
): Promise<Metadata> {
  const rows = await getCollection<PageSEO>('seo_pages', INITIAL_SEO_PAGES);
  const pool = rows.length > 0 ? rows : INITIAL_SEO_PAGES;
  const seo =
    pool.find((p) => p.path === path) ??
    INITIAL_SEO_PAGES.find((p) => p.path === path);

  if (!seo) {
    // No seed entry and no DB row — let root metadata win.
    return {};
  }

  const localePath = path === '/' ? `/${locale}` : `/${locale}${path}`;
  const canonicalForLocale = `${SITE_ORIGIN}${localePath === `/${locale}` ? `/${locale}/` : localePath}`;
  const enUrl = `${SITE_ORIGIN}${path === '/' ? '/en/' : `/en${path}`}`;
  const esUrl = `${SITE_ORIGIN}${path === '/' ? '/es/' : `/es${path}`}`;
  const ogImageUrl = resolveImageUrl(seo.ogImage);

  const metaTitle = selectSeoField(seo, locale, 'metaTitle');
  const metaDescription = selectSeoField(seo, locale, 'metaDescription');
  const ogTitle = selectSeoField(seo, locale, 'ogTitle') ?? metaTitle;
  const ogDescription = selectSeoField(seo, locale, 'ogDescription') ?? metaDescription;

  return {
    // Admin-authored titles already include the brand suffix ("... — Selah
    // Kids"), so we use `absolute` to prevent any parent `title.template`
    // from duplicating the brand ("Our Story — Selah Kids | Selah Kids").
    title: metaTitle ? { absolute: metaTitle } : undefined,
    description: metaDescription,
    robots: parseRobots(seo.robots),
    alternates: {
      canonical: canonicalForLocale,
      languages: {
        en: enUrl,
        es: esUrl,
        // Google recommends an x-default hint for unmatched locales; we
        // point it at the English variant.
        'x-default': enUrl,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      siteName: 'Selah Kids',
      images: [{ url: ogImageUrl }],
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      url: canonicalForLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImageUrl],
    },
  };
}

/**
 * Canonical site-settings reader. Reads the `site_settings_fields`
 * collection (which the admin Global Settings editor writes to) and
 * returns a `Record<id, value>` dict so page code can do
 * `settings.footer_tagline_en` instead of iterating the array.
 *
 * Tagged + force-cached via getCollection — invalidated on-demand via
 * `revalidateTag('collection:site_settings_fields')`.
 */
export interface SiteSettingsField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'url';
  group: string;
}

export async function getSiteSettingsFields(
  opts: { mode?: 'preview' } = {},
): Promise<Record<string, string>> {
  const rows = await getCollection<SiteSettingsField>('site_settings_fields', [], opts);
  const out: Record<string, string> = {};
  for (const row of rows) {
    if (row && typeof row.id === 'string') out[row.id] = row.value ?? '';
  }
  return out;
}

// ───────────────────────────────────────────────────────────
// Tag naming (shared with /api/revalidate so allowlist stays honest)
// ───────────────────────────────────────────────────────────

export const CACHE_TAGS = {
  collection: (name: string) => `collection:${name}`,
  pageContent: (page: string) => `page_content:${page}`,
  siteSettings: 'site_settings',
} as const;

// Allowlist of tags that /api/revalidate will honor. Keeping this exported
// means the API route and admin call sites share a single enum — typos in
// one place don't silently drop cache invalidations.
export const REVALIDATE_TAG_ALLOWLIST = [
  // Collections (match admin useCmsCollection names)
  'collection:blog_posts',
  'collection:videos',
  'collection:team',
  'collection:characters',
  'collection:testimonials',
  'collection:nav_links',
  'collection:nav_settings',
  'collection:footer_links',
  'collection:footer_social',
  'collection:footer_settings',
  'collection:site_settings_fields',
  'collection:announcement_banners',
  'collection:redirects',
  'collection:forms',
  'collection:custom_code',
  'collection:sitemap_data',
  'collection:theme_colors',
  'collection:theme_tokens',
  'collection:seo_pages',
  'collection:admin_user_profiles',
  // Page content (one per page)
  'page_content:home',
  'page_content:about',
  'page_content:watch',
  'page_content:parents',
  'page_content:donate',
  'page_content:contact',
  'page_content:resources',
  // Site settings single-row
  'site_settings',
  // Probe fixture (Phase 1 validator only)
  'collection:probe',
] as const;

export type RevalidateTag = (typeof REVALIDATE_TAG_ALLOWLIST)[number];

export function isAllowedTag(tag: string): tag is RevalidateTag {
  return (REVALIDATE_TAG_ALLOWLIST as readonly string[]).includes(tag);
}
