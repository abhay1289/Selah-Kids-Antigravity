# Admin Dashboard Merge — Implementation Plan

**Date:** 2026-04-22
**Branch:** `feat/admin-merge` (new, cut from `design/p0-truth-and-trust`)
**Author:** Claude Code (lead)
**Reviewers:** Codex (pre + post), Gemini (pre + post)

---

## 1. Context

Two sibling working trees share the same last pushed commit `29ae535` on the upstream
repo `github.com/abhay1289/Selah-Kids-Antigravity`:

| Path | What it has (diverged locally) |
|---|---|
| `/Users/codex/Downloads/Code/Selah-Kids-Antigravity` (this repo, branch `design/p0-truth-and-trust`) | P0 design polish, atmos-spine seamless fixes, hero fade, TodaysEpisode, world/player/music/sensory/characters components, MediaContext, Zustand store |
| `/Users/codex/Downloads/ selah kids antigravity` (unpushed) | 40-route admin CMS dashboard at `/admin/*`, Supabase integration, 3-table schema, auth guard, media browser |

The unpushed branch was never committed upstream. Goal: take only the admin additions and
land them in this repo without disturbing the design polish.

---

## 2. Why this is low-risk

- **Same upstream base.** Both trees branched from the same commit — clean three-way merge
  is unnecessary; this is a selective file copy.
- **Completely isolated at route level.** Admin lives under `/admin/*` with its own
  `layout.tsx`. It does not touch the public site layout, navigation, or shared components.
- **Zero imports into landing code.** Verified via grep: admin files import only
  `react`, `next/*`, `lucide-react`, `framer-motion`, `@supabase/*`, and internal
  `../../lib/*` + `../../components/admin/*`. No import of any `home/`, `about/`, `UI.tsx`,
  etc.
- **Versions match exactly.** Next 15.5.14, React 19, Tailwind 4.2.2, framer-motion
  12.4.7, lucide-react 0.546.0 — identical in both `package.json` files.
- **Offline fallback built-in.** `src/lib/supabase.ts` mocks all Supabase calls when env
  vars are missing, so the admin boots locally without a live DB. No deploy-blocking
  dependency on Supabase being provisioned.

---

## 3. Files to copy (additive only — nothing overwritten)

### 3.1 Admin routes — `src/app/admin/**` (40 files)

```
src/app/admin/
├── layout.tsx                 (auth guard + shell)
├── page.tsx                   (dashboard home)
├── login/page.tsx
├── content-quality/page.tsx
├── content/
│   ├── blog/page.tsx
│   ├── characters/page.tsx
│   ├── team/page.tsx
│   ├── testimonials/page.tsx
│   └── videos/page.tsx
├── pages/
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── donate/page.tsx
│   ├── home/page.tsx
│   ├── parents/page.tsx
│   ├── resources/page.tsx
│   └── watch/page.tsx
├── accessibility/page.tsx
├── activity/page.tsx
├── analytics/page.tsx
├── announcements/page.tsx
├── backups/page.tsx
├── code/page.tsx
├── footer/page.tsx
├── forms/page.tsx
├── keywords/page.tsx
├── links/page.tsx
├── media/page.tsx
├── media/actions.ts           (server action; reads public/ dir)
├── navbar/page.tsx
├── performance/page.tsx
├── redirects/page.tsx
├── scheduler/page.tsx
├── security/page.tsx
├── seo/page.tsx
├── settings/page.tsx
├── sitemap/page.tsx
├── theme/page.tsx
├── translations/page.tsx
├── uptime/page.tsx
└── users/page.tsx
```

### 3.2 Admin shell components — `src/components/admin/**` (2 files)

```
src/components/admin/
├── AdminSidebar.tsx
└── AdminHeader.tsx
```

### 3.3 Supabase + CMS lib — `src/lib/**` (3 files, NEW folder)

```
src/lib/
├── supabase.ts   (client + mock fallback)
├── auth.ts       (signIn, signOut, getSession, getUser)
└── cms.ts        (CMS read/write helpers, 181 LOC)
```

### 3.4 Schema + docs (root)

- `supabase-schema.sql` → project root
- `ADMIN_PANEL_FEATURES.md` → project root (reference doc)

---

## 4. Files NOT copied (our versions are newer or incompatible)

All of these differ between trees, but ours are ahead due to P0 polish. Do not touch:

`src/app/blog/`, `src/app/characters/`, `src/app/donate/`, `src/app/globals.css`,
`src/app/layout.tsx`, `src/app/music/`, `src/app/parents/`, `src/app/resources/`,
`src/app/watch/`, `src/components/Footer.tsx`, `src/components/LayoutShell.tsx`,
`src/components/Navbar.tsx`, `src/components/UI.tsx`, `src/components/about/**`,
`src/components/contact/**`, `src/components/home/**`, `src/components/resources/**`,
`src/components/watch/**`, `src/constants.tsx`, `src/contexts/LanguageContext.tsx`,
`src/data/blogPosts.ts`.

Also skip `src/components/home/ScrollHeroSection.tsx` (only in other tree, appears unused
by admin — likely a stale experiment).

---

## 5. package.json changes

Add to `dependencies`:

```json
"@supabase/ssr": "^0.10.2",
"@supabase/supabase-js": "^2.103.3"
```

No devDependency changes. Keep our `scripts` block unchanged.

---

## 6. Environment variables

Append to `.env.example` (root, currently absent — create it):

```
# Supabase Configuration (for /admin CMS)
# Get these from: https://supabase.com/dashboard → Project Settings → API
# ADMIN DASHBOARD RUNS IN OFFLINE MODE IF THESE ARE BLANK — safe to deploy without them.
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Secrets policy:** never commit real values. `SUPABASE_SERVICE_ROLE_KEY` is a
server-only key — must not have the `NEXT_PUBLIC_` prefix.

---

## 7. Supabase provisioning (deferred — does not block merge)

Once the product team has a Supabase project:

1. Create three tables via `supabase-schema.sql` in the Supabase SQL Editor.
2. Create storage bucket named `media`, public = true.
3. Create an admin user via Supabase Auth.
4. Set env vars in Vercel project settings for production.

Until that happens, the admin panel boots with mock data (any email/password logs in,
all collections return `[]`). This is intentional.

---

## 8. Execution steps

```
# 1. Branch
git checkout -b feat/admin-merge

# 2. Copy admin app routes
cp -R "/Users/codex/Downloads/ selah kids antigravity/src/app/admin" src/app/admin

# 3. Copy admin shell components
mkdir -p src/components/admin
cp "/Users/codex/Downloads/ selah kids antigravity/src/components/admin/"*.tsx src/components/admin/

# 4. Copy lib
mkdir -p src/lib
cp "/Users/codex/Downloads/ selah kids antigravity/src/lib/"*.ts src/lib/

# 5. Schema + docs
cp "/Users/codex/Downloads/ selah kids antigravity/supabase-schema.sql" .
cp "/Users/codex/Downloads/ selah kids antigravity/ADMIN_PANEL_FEATURES.md" .

# 6. Remove any .DS_Store that tagged along
find src/app/admin src/components/admin src/lib -name .DS_Store -delete

# 7. Install deps
bun add @supabase/ssr @supabase/supabase-js

# 8. Create .env.example
# (hand-written per Section 6)

# 9. Verify
bun run lint
bunx tsc --noEmit
bun run build

# 10. Smoke test
bun run dev
# Navigate to http://localhost:3000/admin/login → loads
# Any email+password → redirects to http://localhost:3000/admin (offline mode)
# Click each sidebar category → pages render without errors
# Navigate to http://localhost:3000/ → landing page unaffected
```

---

## 8.5 Codex review fixes (NO_SHIP → SHIP)

Codex review (2026-04-22) flagged 5 issues. All resolved below before execution:

**F1 — LayoutShell wraps /admin with public Navbar/Footer/MediaProvider/player UI**
Fix: patch `src/components/LayoutShell.tsx` to short-circuit when `pathname.startsWith('/admin')`:

```tsx
'use client';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MediaProvider } from '../contexts/MediaContext';
import VideoOverlay from './player/VideoOverlay';
import MiniPlayer from './player/MiniPlayer';
import { WorldProvider } from './world/WorldProvider';
import ShilohCompanion from './world/ShilohCompanion';
import { useWorld } from '../stores/world';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shilohEnabled = useWorld((s) => s.shilohEnabled);

  // Admin has its own layout shell (sidebar + header). Don't double-wrap.
  if (pathname?.startsWith('/admin')) return <>{children}</>;

  return (
    <WorldProvider>
      <MediaProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <VideoOverlay />
        {shilohEnabled && <ShilohCompanion />}
        <MiniPlayer />
      </MediaProvider>
    </WorldProvider>
  );
}
```

**F2 + F3 — Client-only auth guard + unused `@supabase/ssr` dep**
Fix: add `src/middleware.ts` using `@supabase/ssr` to server-side protect every
`/admin/*` route except `/admin/login`. Redirect unauthenticated requests to the
login page. This both hardens auth AND justifies the `@supabase/ssr` dep.

```ts
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Offline mode (no Supabase configured) — let client-side guard handle it.
  // This preserves the "dashboard runs without Supabase" dev story.
  if (!url || !anon) return NextResponse.next();

  const res = NextResponse.next();
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookies) => cookies.forEach(({ name, value, options }) => {
        res.cookies.set(name, value, options);
      }),
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const login = req.nextUrl.clone();
    login.pathname = '/admin/login';
    login.searchParams.set('redirect', pathname);
    return NextResponse.redirect(login);
  }
  return res;
}

export const config = { matcher: ['/admin/:path*'] };
```

**F4 — `media/actions.ts` is non-recursive and has no auth check**
Fix: patch post-copy to (a) verify user via `createServerClient` + `getUser()` before
returning data, and (b) walk `public/` recursively so nested assets (`public/render/**`,
`public/SK_ColoringBook/**`) are discoverable. Offline-mode path skips the auth check
to preserve local dev.

**F5 — TS friction on `icon: any` and `as any` in supabase mock**
Fix: only patch if `bunx tsc --noEmit` reports errors. The mock `as any` is intentional
to satisfy the `SupabaseClient` interface without constructing every nested type.

---

## 9. Risks / known follow-ups

| # | Issue | Severity | Mitigation |
|---|---|---|---|
| R1 | Sidebar links to `/admin/content` and `/admin/pages` (parent nav items) — these resolve to 404s if clicked directly (no index `page.tsx`). | Low | Parents are likely expand-only in the sidebar. Verify during smoke test; if clickable, add 2 tiny redirect pages. |
| R2 | `src/lib/supabase.ts` silently falls back to a mock when env vars are absent. Could hide auth bugs in prod if vars aren't set. | Medium | Add a `console.warn` once in prod only (there's already one). Add a health-check endpoint later. Not blocking. |
| R3 | Admin uses `useEffect` throughout — our repo's CLAUDE.md has a "no useEffect" rule. | Informational | This rule applies to *new* code we author. Incoming admin code was authored by another dev; blanket-refactoring is out of scope for merge. File as follow-up debt. |
| R4 | `supabase-schema.sql` uses RLS with `auth.role() = 'authenticated'` for writes — any signed-in user could edit CMS. | Medium | Before enabling Supabase in prod, tighten policies to role-check a custom `is_admin` claim or email allow-list. Document in schema comment. Not blocking. |
| R5 | `src/app/admin/media/actions.ts` reads `public/` from the server at runtime. On Vercel this works because files are bundled into the lambda's filesystem, but only at project root. | Low | Pre-tested pattern in Next 15. Add note to admin README. |
| R6 | `.env.example` doesn't exist in our repo yet; creating it is net-new. | Low | OK — it'll help future contributors. |

---

## 10. Acceptance criteria

1. `bun run lint` passes (zero errors; warnings OK).
2. `bunx tsc --noEmit` passes (zero errors).
3. `bun run build` succeeds.
4. `GET /` — landing page unchanged, no visual regressions (atmos-spine still seamless).
5. `GET /admin/login` — renders login form.
6. `POST` login with any credentials (offline mode) → redirects to `/admin`.
7. All 5 sidebar category main pages render (Dashboard, Content, Website, Marketing, Technical, System).
8. Zero broken imports, zero red-underline TS in IDE.
9. No new `console.error` during admin page loads.

---

## 11. Rollback plan

If anything breaks:

```
git checkout design/p0-truth-and-trust
git branch -D feat/admin-merge
```

Because the merge is purely additive, rollback is a single branch-delete. No reverts needed.

---

## 12. Out of scope for this merge

- Wiring public-facing pages to read CMS data from Supabase (landing still reads from
  `src/data/*` hardcoded). That's a separate, larger migration once CMS is provisioned.
- Replacing `useEffect` per our house rule (see R3).
- Writing tests for admin routes (deferred until Supabase live so tests have a real target).
- Tightening RLS policies (see R4).
- Removing admin from the public sitemap / robots.txt (should add a rule: `Disallow: /admin/`).

---

End of plan.
