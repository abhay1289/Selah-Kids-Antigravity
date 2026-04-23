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
 * Shapes here must mirror the `INITIAL_*` constants in the corresponding
 * admin page files (`src/app/admin/**`). The shape contract is enforced by
 * type re-export: the admin page imports the type from here, and the
 * seed-diff checksum fails if the admin page's runtime value disagrees with
 * the DB. Additions to an admin editor must land here first, then be seeded.
 */

// ───────────────────────────────────────────────────────────
// Shared shape from cms-server.ts
// ───────────────────────────────────────────────────────────

export interface PageField {
  en: string;
  es: string;
}
export type PageFieldMap = Record<string, PageField>;

// ───────────────────────────────────────────────────────────
// Collection item shapes
// ───────────────────────────────────────────────────────────

// BlogPost re-exports the richer shape from src/data/blogPosts.ts (which has
// contentEn / contentEs / category). Phase 3 migrates the blog pages to read
// through cms-server.ts; by keeping blogPosts.ts as the single source of
// shape truth during the transition, we avoid drift between the two.
// Post-Phase-3 consolidation will inline this type here and delete blogPosts.ts.
export type { BlogPost } from './blogPosts';

// Video re-exports Episode from src/data/catalog.ts — the canonical shape
// that the watch page and WatchGrid both render from. The admin editor's
// simpler shape (title, titleEs, category, language, img, youtubeUrl, date,
// isPublished) is a subset; when the admin editor eventually writes Episode
// rows, the shape contract is enforced by this type export + seed:diff.
export type { Episode as Video } from './catalog';

// TeamMember re-exports the richer shape from src/data/team.ts.
// Same transition rationale as BlogPost / Character above.
export type { TeamMember } from './team';

// Character re-exports the richer shape from src/data/characters.ts (catchphrase,
// favoriteVerse, originStory, etc). Same transition rationale as BlogPost above.
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
// INITIAL_* constants
//
// These are populated in phases:
//   Phase 2 — content collections (blog, videos, team, characters,
//             testimonials) + page content (home, about, watch, parents,
//             donate, contact, resources)
//   Phase 5 — chrome (navbar, footer, announcements, SEO, theme,
//             redirects, forms, custom code, sitemap, users)
//
// Until a constant is populated here, its admin page keeps its local
// INITIAL_* definition. Seeding and the `seed:diff` drift check only cover
// constants exported from this file.
// ───────────────────────────────────────────────────────────

// Phase 3 — content collections (populated as each page migrates to cms-server)
// Blog posts: re-exported from src/data/blogPosts.ts as the Phase 3 fallback
// until the DB is seeded. Once seed:diff is clean on prod, consumers move to
// getCollection('blog_posts', INITIAL_BLOG_POSTS) and this array is the
// fail-open default the server falls back to in offline mode.
import { BLOG_POSTS } from './blogPosts';
import type { BlogPost } from './blogPosts';
export const INITIAL_BLOG_POSTS: BlogPost[] = BLOG_POSTS;

// Characters: same pattern — re-exported from src/data/characters.ts.
import { CHARACTERS } from './characters';
import type { Character } from './characters';
export const INITIAL_CHARACTERS: Character[] = CHARACTERS;

import { EPISODES } from './catalog';
import type { Episode } from './catalog';
export const INITIAL_VIDEOS: Episode[] = EPISODES;
import { TEAM_MEMBERS } from './team';
import type { TeamMember } from './team';
export const INITIAL_TEAM: TeamMember[] = TEAM_MEMBERS;
export const INITIAL_TESTIMONIALS: Testimonial[] = [];

// Phase 2 — page content (per-page field maps, keyed `section.field`)
export const INITIAL_PAGE_HOME: PageFieldMap = {};
export const INITIAL_PAGE_ABOUT: PageFieldMap = {};
export const INITIAL_PAGE_WATCH: PageFieldMap = {};
export const INITIAL_PAGE_PARENTS: PageFieldMap = {};
export const INITIAL_PAGE_DONATE: PageFieldMap = {};
export const INITIAL_PAGE_CONTACT: PageFieldMap = {};
export const INITIAL_PAGE_RESOURCES: PageFieldMap = {};
