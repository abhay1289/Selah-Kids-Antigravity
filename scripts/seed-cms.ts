/**
 * scripts/seed-cms.ts — idempotent CMS seeder.
 *
 * Reads every INITIAL_* constant from src/data/cms-fallbacks.ts and upserts
 * them into Supabase. Safe to run multiple times: all writes are keyed by
 * stable IDs (collections.id, page_content (page,section,field) unique
 * tuple, site_settings.id='global').
 *
 * Modes:
 *   bun run seed:cms            Apply. Requires --confirm-prod when targeting prod.
 *   bun run seed:cms --dry      Print what would change; no writes.
 *   bun run seed:diff           Drift check: exit 0 if DB matches fallbacks,
 *                               exit 1 with a diff report otherwise. Used by
 *                               deploy:check.
 *
 * Auth: uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS). Never checked in.
 *
 * Prod guard: if NEXT_PUBLIC_SUPABASE_URL contains 'prod' or NODE_ENV=production,
 * require --confirm-prod flag before writing. Prevents a stray `bun run seed:cms`
 * from clobbering prod with empty dev fallbacks.
 */

// Bun auto-loads .env.local / .env — no dotenv import needed.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  INITIAL_BLOG_POSTS,
  INITIAL_VIDEOS,
  INITIAL_TEAM,
  INITIAL_CHARACTERS,
  INITIAL_TESTIMONIALS,
  INITIAL_PAGE_HOME,
  INITIAL_PAGE_ABOUT,
  INITIAL_PAGE_WATCH,
  INITIAL_PAGE_PARENTS,
  INITIAL_PAGE_DONATE,
  INITIAL_PAGE_CONTACT,
  INITIAL_PAGE_RESOURCES,
  type PageFieldMap,
} from '../src/data/cms-fallbacks';

// ───────────────────────────────────────────────────────────
// CLI flags
// ───────────────────────────────────────────────────────────

const args = new Set(process.argv.slice(2));
const MODE: 'apply' | 'dry' | 'diff' =
  args.has('--diff') ? 'diff' : args.has('--dry') ? 'dry' : 'apply';
const CONFIRM_PROD = args.has('--confirm-prod');

// ───────────────────────────────────────────────────────────
// Env / client
// ───────────────────────────────────────────────────────────

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required.');
  console.error('   Set them in .env.local before running the seeder.');
  process.exit(1);
}

const looksLikeProd = /prod/i.test(URL) || process.env.NODE_ENV === 'production';
if (MODE === 'apply' && looksLikeProd && !CONFIRM_PROD) {
  console.error(
    `❌ Refusing to write to what looks like production (${URL}).\n` +
      `   Re-run with --confirm-prod if this is intended.`,
  );
  process.exit(1);
}

const sb: SupabaseClient = createClient(URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ───────────────────────────────────────────────────────────
// Seed groups
// ───────────────────────────────────────────────────────────

interface CollectionGroup {
  name: string;
  items: ReadonlyArray<{ id: string }>;
}
interface PageGroup {
  page: string;
  fields: PageFieldMap;
}

const COLLECTIONS: CollectionGroup[] = [
  { name: 'blog_posts', items: INITIAL_BLOG_POSTS },
  { name: 'videos', items: INITIAL_VIDEOS },
  { name: 'team', items: INITIAL_TEAM },
  { name: 'characters', items: INITIAL_CHARACTERS },
  { name: 'testimonials', items: INITIAL_TESTIMONIALS },
];

const PAGES: PageGroup[] = [
  { page: 'home', fields: INITIAL_PAGE_HOME },
  { page: 'about', fields: INITIAL_PAGE_ABOUT },
  { page: 'watch', fields: INITIAL_PAGE_WATCH },
  { page: 'parents', fields: INITIAL_PAGE_PARENTS },
  { page: 'donate', fields: INITIAL_PAGE_DONATE },
  { page: 'contact', fields: INITIAL_PAGE_CONTACT },
  { page: 'resources', fields: INITIAL_PAGE_RESOURCES },
];

// ───────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────

interface DbCollectionRow {
  id: string;
  collection: string;
  data: Record<string, unknown>;
  sort_order: number;
}
interface DbPageRow {
  id: string;
  page: string;
  section: string;
  field: string;
  value_en: string;
  value_es: string;
}

async function fetchCollection(name: string): Promise<DbCollectionRow[]> {
  const { data, error } = await sb
    .from('collections')
    .select('id, collection, data, sort_order')
    .eq('collection', name);
  if (error) throw new Error(`fetchCollection(${name}): ${error.message}`);
  return (data ?? []) as DbCollectionRow[];
}

async function fetchPage(page: string): Promise<DbPageRow[]> {
  const { data, error } = await sb
    .from('page_content')
    .select('id, page, section, field, value_en, value_es')
    .eq('page', page);
  if (error) throw new Error(`fetchPage(${page}): ${error.message}`);
  return (data ?? []) as DbPageRow[];
}

function collectionDrift(
  group: CollectionGroup,
  db: DbCollectionRow[],
): { missing: string[]; stale: string[] } {
  const dbById = new Map(db.map((r) => [r.id, r]));
  const missing = group.items
    .filter((it) => !dbById.has(it.id))
    .map((it) => it.id);
  const stale = group.items
    .filter((it) => {
      const row = dbById.get(it.id);
      if (!row) return false;
      return JSON.stringify(row.data) !== JSON.stringify(it);
    })
    .map((it) => it.id);
  return { missing, stale };
}

function pageDrift(
  group: PageGroup,
  db: DbPageRow[],
): { missing: string[]; stale: string[] } {
  const key = (section: string, field: string) => `${section}.${field}`;
  const dbByKey = new Map(db.map((r) => [key(r.section, r.field), r]));
  const missing: string[] = [];
  const stale: string[] = [];
  for (const [k, val] of Object.entries(group.fields)) {
    const row = dbByKey.get(k);
    if (!row) missing.push(k);
    else if (row.value_en !== val.en || row.value_es !== val.es) stale.push(k);
  }
  return { missing, stale };
}

// ───────────────────────────────────────────────────────────
// Write paths
// ───────────────────────────────────────────────────────────

async function seedCollections(): Promise<void> {
  for (const group of COLLECTIONS) {
    if (group.items.length === 0) {
      console.log(`   · ${group.name}: no fallback items yet, skipping.`);
      continue;
    }
    const rows = group.items.map((item, idx) => ({
      id: item.id,
      collection: group.name,
      data: item,
      sort_order: idx,
      is_published: (item as { isPublished?: boolean }).isPublished ?? true,
    }));
    // onConflict: 'id' — idempotent replay updates in place.
    const { error } = await sb.from('collections').upsert(rows, { onConflict: 'id' });
    if (error) throw new Error(`upsert ${group.name}: ${error.message}`);
    console.log(`   ✓ ${group.name}: ${rows.length} rows`);
  }
}

async function seedPages(): Promise<void> {
  for (const group of PAGES) {
    const entries = Object.entries(group.fields);
    if (entries.length === 0) {
      console.log(`   · page_content:${group.page}: no fallback fields yet, skipping.`);
      continue;
    }
    const rows = entries.map(([k, val], idx) => {
      const [section, field] = k.split('.');
      return {
        page: group.page,
        section: section!,
        field: field!,
        value_en: val.en,
        value_es: val.es,
        field_type: 'text',
        sort_order: idx,
        is_published: true,
      };
    });
    // UNIQUE(page, section, field) — onConflict on the tuple.
    const { error } = await sb
      .from('page_content')
      .upsert(rows, { onConflict: 'page,section,field' });
    if (error) throw new Error(`upsert page_content:${group.page}: ${error.message}`);
    console.log(`   ✓ page_content:${group.page}: ${rows.length} fields`);
  }
}

async function ensureSiteSettings(): Promise<void> {
  // The schema already seeds the single row via `INSERT ... ON CONFLICT DO NOTHING`.
  // This is a belt-and-braces no-op: confirm presence, create if missing.
  const { data, error } = await sb.from('site_settings').select('id').eq('id', 'global').maybeSingle();
  if (error) throw new Error(`site_settings read: ${error.message}`);
  if (!data) {
    const { error: insertErr } = await sb.from('site_settings').insert({ id: 'global' });
    if (insertErr) throw new Error(`site_settings insert: ${insertErr.message}`);
    console.log('   ✓ site_settings: created global row');
  } else {
    console.log('   · site_settings: already present');
  }
}

// ───────────────────────────────────────────────────────────
// Diff paths
// ───────────────────────────────────────────────────────────

interface DriftReport {
  clean: boolean;
  collections: Record<string, { missing: string[]; stale: string[] }>;
  pages: Record<string, { missing: string[]; stale: string[] }>;
}

async function computeDrift(): Promise<DriftReport> {
  const report: DriftReport = { clean: true, collections: {}, pages: {} };
  for (const g of COLLECTIONS) {
    if (g.items.length === 0) continue;
    const db = await fetchCollection(g.name);
    const d = collectionDrift(g, db);
    report.collections[g.name] = d;
    if (d.missing.length || d.stale.length) report.clean = false;
  }
  for (const g of PAGES) {
    if (Object.keys(g.fields).length === 0) continue;
    const db = await fetchPage(g.page);
    const d = pageDrift(g, db);
    report.pages[g.page] = d;
    if (d.missing.length || d.stale.length) report.clean = false;
  }
  return report;
}

function printDrift(r: DriftReport): void {
  const lines: string[] = [];
  for (const [name, d] of Object.entries(r.collections)) {
    if (d.missing.length) lines.push(`   collection:${name} missing in DB → ${d.missing.join(', ')}`);
    if (d.stale.length) lines.push(`   collection:${name} stale in DB → ${d.stale.join(', ')}`);
  }
  for (const [page, d] of Object.entries(r.pages)) {
    if (d.missing.length) lines.push(`   page_content:${page} missing fields → ${d.missing.join(', ')}`);
    if (d.stale.length) lines.push(`   page_content:${page} stale fields → ${d.stale.join(', ')}`);
  }
  if (lines.length === 0) console.log('✓ No drift. DB matches cms-fallbacks.ts.');
  else {
    console.log('✗ Drift detected:');
    for (const l of lines) console.log(l);
  }
}

// ───────────────────────────────────────────────────────────
// Main
// ───────────────────────────────────────────────────────────

async function main() {
  console.log(`▶ seed-cms  mode=${MODE}  target=${URL}`);

  if (MODE === 'diff') {
    const r = await computeDrift();
    printDrift(r);
    process.exit(r.clean ? 0 : 1);
  }

  if (MODE === 'dry') {
    const r = await computeDrift();
    printDrift(r);
    console.log('(dry-run — no writes performed)');
    return;
  }

  console.log('▶ Applying seed…');
  await ensureSiteSettings();
  await seedCollections();
  await seedPages();
  console.log('✓ Seed complete.');
}

main().catch((err) => {
  console.error('✗ Seed failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
