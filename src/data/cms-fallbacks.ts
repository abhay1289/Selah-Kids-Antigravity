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
import { INITIAL_PAGE_HOME as PAGE_HOME } from './page-content-home';
import { INITIAL_PAGE_ABOUT as PAGE_ABOUT } from './page-content-about';
import { INITIAL_PAGE_WATCH as PAGE_WATCH } from './page-content-watch';
import { INITIAL_PAGE_PARENTS as PAGE_PARENTS } from './page-content-parents';
import { INITIAL_PAGE_DONATE as PAGE_DONATE } from './page-content-donate';
import { INITIAL_PAGE_CONTACT as PAGE_CONTACT } from './page-content-contact';
import { INITIAL_PAGE_RESOURCES as PAGE_RESOURCES } from './page-content-resources';
import {
  INITIAL_NAV_LINKS as NAV_LINKS,
  INITIAL_NAV_SETTINGS as NAV_SETTINGS,
} from './chrome-navbar';
import type { NavLink, NavSettings } from './chrome-navbar';
import {
  INITIAL_FOOTER_LINKS as FOOTER_LINKS,
  INITIAL_FOOTER_SOCIAL as FOOTER_SOCIAL,
  INITIAL_FOOTER_SETTINGS as FOOTER_SETTINGS,
} from './chrome-footer';
import type { FooterLink, SocialLink, FooterSettings } from './chrome-footer';

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
export type { NavLink, NavSettings } from './chrome-navbar';
export type { FooterLink, SocialLink, FooterSettings } from './chrome-footer';

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

// Phase 4 — page content (per-page field maps, keyed `section.field`).
// Each page's field literals live in src/data/page-content-<page>.ts — the
// shape admin editors import AND the map the public pages pass to
// getPageContent() as fallback. Re-exported here so seeding + seed:diff keep
// their single-source-of-truth over every INITIAL_*.
export const INITIAL_PAGE_HOME: PageFieldMap = PAGE_HOME;
export const INITIAL_PAGE_ABOUT: PageFieldMap = PAGE_ABOUT;
export const INITIAL_PAGE_WATCH: PageFieldMap = PAGE_WATCH;
export const INITIAL_PAGE_PARENTS: PageFieldMap = PAGE_PARENTS;
export const INITIAL_PAGE_DONATE: PageFieldMap = PAGE_DONATE;
export const INITIAL_PAGE_CONTACT: PageFieldMap = PAGE_CONTACT;
export const INITIAL_PAGE_RESOURCES: PageFieldMap = PAGE_RESOURCES;

// Phase 5 — chrome. Single-row collections (nav_settings, footer_settings)
// still ride on the `collections` table — public readers pick items[0].
export const INITIAL_NAV_LINKS: NavLink[] = NAV_LINKS;
export const INITIAL_NAV_SETTINGS: NavSettings[] = NAV_SETTINGS;
export const INITIAL_FOOTER_LINKS: FooterLink[] = FOOTER_LINKS;
export const INITIAL_FOOTER_SOCIAL: SocialLink[] = FOOTER_SOCIAL;
export const INITIAL_FOOTER_SETTINGS: FooterSettings[] = FOOTER_SETTINGS;
