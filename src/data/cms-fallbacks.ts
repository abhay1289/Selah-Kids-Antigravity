/**
 * CMS fallbacks — dual-purpose module:
 *
 *   1. **Seed source.** `scripts/seed-cms.ts` populates Supabase by reading
 *      every INITIAL_* constant from this file. Run once per environment
 *      (dev, staging, prod) before traffic.
 *   2. **Offline-mode data.** When NEXT_PUBLIC_SUPABASE_URL is absent,
 *      `src/lib/cms-server.ts` serves these constants directly so dev / demo
 *      environments still render without a live DB.
 *
 * **Never read at runtime in production.** Once the DB is seeded, all reads
 * go through Supabase. `bun run seed:diff` asserts zero drift between this
 * file and the DB before each Phase swaps a page from hardcoded to CMS-read.
 *
 * Shapes here re-export from the source-of-truth data files
 * (blogPosts.ts, characters.ts, catalog.ts, team.ts). Consolidation into
 * inline definitions happens once Phase 4/5 deletes the legacy files.
 */

import { BLOG_POSTS } from './blogPosts';
import type { BlogPost } from './blogPosts';
import { CHARACTERS } from './characters';
import type { Character } from './characters';
import { EPISODES } from './catalog';
import type { Episode } from './catalog';
import { TEAM_MEMBERS } from './team';
import type { TeamMember } from './team';

// ───────────────────────────────────────────────────────────
// Shared shapes
// ───────────────────────────────────────────────────────────

export interface PageField {
  en: string;
  es: string;
}
export type PageFieldMap = Record<string, PageField>;

// Re-export the canonical collection shapes so consumers can import every
// type from one place. Phase 4/5 may absorb these back in here once the
// legacy data files are retired.
export type { BlogPost } from './blogPosts';
export type { Episode as Video } from './catalog';
export type { TeamMember } from './team';
export type { Character } from './characters';

export interface Testimonial {
  id: string;
  quoteEn: string;
  quoteEs: string;
  author: string;
  roleEn: string;
  roleEs: string;
  color: string;
  isPublished: boolean;
}

// ───────────────────────────────────────────────────────────
// INITIAL_* constants — seed source + offline-mode fallback
//
// Populated in phases:
//   Phase 3 — collections: blog, videos, team, characters, testimonials
//   Phase 4 — page content maps (home, about, watch, …)
//   Phase 5 — chrome (navbar, footer, announcements, SEO, theme, …)
//
// Until a constant is populated here, its admin page keeps its local
// INITIAL_* definition. Seeding and the seed:diff drift check only
// cover constants exported from this file.
// ───────────────────────────────────────────────────────────

export const INITIAL_BLOG_POSTS: BlogPost[] = BLOG_POSTS;
export const INITIAL_CHARACTERS: Character[] = CHARACTERS;
export const INITIAL_VIDEOS: Episode[] = EPISODES;
export const INITIAL_TEAM: TeamMember[] = TEAM_MEMBERS;
export const INITIAL_TESTIMONIALS: Testimonial[] = [];

// Phase 4 — page content (per-page field maps, keyed `section.field`)
export const INITIAL_PAGE_HOME: PageFieldMap = {};
export const INITIAL_PAGE_ABOUT: PageFieldMap = {};
export const INITIAL_PAGE_WATCH: PageFieldMap = {};
export const INITIAL_PAGE_PARENTS: PageFieldMap = {};
export const INITIAL_PAGE_DONATE: PageFieldMap = {};
export const INITIAL_PAGE_CONTACT: PageFieldMap = {};
export const INITIAL_PAGE_RESOURCES: PageFieldMap = {};
