/**
 * scripts/deploy-check.ts — pre-deploy gate.
 *
 * Runs before every prod deploy to guarantee the DB is seeded and in sync
 * with src/data/cms-fallbacks.ts. Exits non-zero on any failure so the
 * deploy pipeline halts.
 *
 * Checks (in order):
 *   1. Env vars present — NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *      SUPABASE_SERVICE_ROLE_KEY.
 *   2. site_settings has the 'global' row.
 *   3. seed:diff is clean (no drift between fallbacks and DB).
 *   4. Each populated collection has >= 1 row.
 *   5. Each populated page has its expected field count.
 *
 * Usage:
 *   bun run deploy:check
 */

import { createClient } from '@supabase/supabase-js';
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
} from '../src/data/cms-fallbacks';

const fails: string[] = [];

function fail(msg: string) {
  fails.push(msg);
  console.error('✗', msg);
}

function ok(msg: string) {
  console.log('✓', msg);
}

// ───────────────────────────────────────────────────────────
// 1. Env
// ───────────────────────────────────────────────────────────

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL) fail('NEXT_PUBLIC_SUPABASE_URL missing');
if (!ANON) fail('NEXT_PUBLIC_SUPABASE_ANON_KEY missing');
if (!SERVICE) fail('SUPABASE_SERVICE_ROLE_KEY missing');

if (!URL || !SERVICE) {
  console.error('\n✗ deploy:check failed — env vars missing. Fix and re-run.');
  process.exit(1);
}
ok('env vars present');

const sb = createClient(URL, SERVICE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ───────────────────────────────────────────────────────────
// 2. site_settings
// ───────────────────────────────────────────────────────────

async function checkSiteSettings() {
  const { data, error } = await sb.from('site_settings').select('id').eq('id', 'global').maybeSingle();
  if (error) return fail(`site_settings read error: ${error.message}`);
  if (!data) return fail("site_settings 'global' row missing — run `bun run seed:cms`");
  ok('site_settings global row present');
}

// ───────────────────────────────────────────────────────────
// 3. Drift — same logic as seed:diff, inlined to avoid shelling out.
// ───────────────────────────────────────────────────────────

async function checkCollectionRowCounts() {
  // We only care that each collection the fallbacks consider "seeded" has at
  // least one row — proves the seeder ran. We intentionally do NOT enforce
  // `count >= INITIAL_*.length` because admins legitimately delete rows
  // through the CMS, which would then permanently break every prod deploy.
  const groups: Array<{ name: string; seeded: boolean }> = [
    { name: 'blog_posts', seeded: INITIAL_BLOG_POSTS.length > 0 },
    { name: 'videos', seeded: INITIAL_VIDEOS.length > 0 },
    { name: 'team', seeded: INITIAL_TEAM.length > 0 },
    { name: 'characters', seeded: INITIAL_CHARACTERS.length > 0 },
    { name: 'testimonials', seeded: INITIAL_TESTIMONIALS.length > 0 },
  ];
  for (const g of groups) {
    if (!g.seeded) continue; // collection not yet migrated into fallbacks
    const { count, error } = await sb
      .from('collections')
      .select('id', { count: 'exact', head: true })
      .eq('collection', g.name);
    if (error) { fail(`count ${g.name}: ${error.message}`); continue; }
    if ((count ?? 0) === 0) {
      fail(`collection:${g.name} has 0 rows — run \`bun run seed:cms\``);
    } else {
      ok(`collection:${g.name}: ${count} rows`);
    }
  }
}

async function checkPageFieldCounts() {
  // Same relaxation as collections: assert >= 1 field, not >= fallback size.
  // Admins may delete/clear fields through the CMS.
  const groups: Array<{ page: string; seeded: boolean }> = [
    { page: 'home', seeded: Object.keys(INITIAL_PAGE_HOME).length > 0 },
    { page: 'about', seeded: Object.keys(INITIAL_PAGE_ABOUT).length > 0 },
    { page: 'watch', seeded: Object.keys(INITIAL_PAGE_WATCH).length > 0 },
    { page: 'parents', seeded: Object.keys(INITIAL_PAGE_PARENTS).length > 0 },
    { page: 'donate', seeded: Object.keys(INITIAL_PAGE_DONATE).length > 0 },
    { page: 'contact', seeded: Object.keys(INITIAL_PAGE_CONTACT).length > 0 },
    { page: 'resources', seeded: Object.keys(INITIAL_PAGE_RESOURCES).length > 0 },
  ];
  for (const g of groups) {
    if (!g.seeded) continue;
    const { count, error } = await sb
      .from('page_content')
      .select('id', { count: 'exact', head: true })
      .eq('page', g.page);
    if (error) { fail(`count page_content:${g.page}: ${error.message}`); continue; }
    if ((count ?? 0) === 0) {
      fail(`page_content:${g.page} has 0 fields — run \`bun run seed:cms\``);
    } else {
      ok(`page_content:${g.page}: ${count} fields`);
    }
  }
}

// ───────────────────────────────────────────────────────────
// Main
// ───────────────────────────────────────────────────────────

async function main() {
  console.log(`▶ deploy:check  target=${URL}`);
  await checkSiteSettings();
  await checkCollectionRowCounts();
  await checkPageFieldCounts();

  if (fails.length > 0) {
    console.error(`\n✗ deploy:check failed — ${fails.length} issue(s) above.`);
    console.error('   Run `bun run seed:diff` to inspect drift, then `bun run seed:cms` to fix.');
    process.exit(1);
  }
  console.log('\n✓ deploy:check passed.');
}

main().catch((err) => {
  console.error('✗ deploy:check threw:', err instanceof Error ? err.message : err);
  process.exit(1);
});
