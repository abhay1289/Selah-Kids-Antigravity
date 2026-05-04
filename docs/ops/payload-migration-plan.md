# Selah Kids — Payload CMS Migration Plan (Autonomous Execution)

## Overview

Wire a production-grade admin panel into the existing Next.js app using
Payload CMS v3. Payload runs INSIDE the Next.js process — no separate
server, no extra container, no second deployment. The public frontend
stays 100% unchanged. The 42 custom admin pages get deleted; Payload's
built-in admin replaces them at `/admin`.

## Decision Record

**Why Payload over Strapi/Supabase** (researched via godspeed + Codex + web search):
- Runs inside Next.js = 1 process, 1 deploy, 1 container, 1 SSL cert
- Half the ops burden vs Strapi (which needs a separate Node.js server)
- Field-level i18n stores both ES+EN in same document (better for a solo
  bilingual editor than Strapi's per-row-per-locale model)
- Figma-backed (acquired June 2025) — strong long-term investment signal
- Admin UX is sufficient for weekly blog posts + image uploads by a
  non-technical client (WYSIWYG Lexical editor, drag-drop media, locale tabs)
- RAM: ~500MB shared with Next.js runtime. Builds offloaded to GitHub Actions.

## Current State

- **Frontend**: Next.js 15.5, React 19, Tailwind 4, Framer Motion. 50+ components.
- **CMS**: None connected. `supabase.ts` returns mock data. Admin pages fake saves.
- **Data**: All content in static TS files under `src/data/` (blogPosts.ts,
  characters.ts, catalog.ts, team.ts, page-content-*.ts, chrome-*.ts).
- **VM**: Hetzner CPX11 (2GB), Ubuntu 24.04, Caddy, systemd. IP 87.99.148.55.
  SSH currently broken (host key changed). Needs re-provisioning.
- **Repo**: `feat/admin-merge` branch on GitHub, SSH push working.

## Target State

```
┌─ :443/:80 ──────────────────────────┐
│  Caddy (auto Let's Encrypt)         │
│  selahkids.com → :3000              │
└─────────┬───────────────────────────┘
          │
┌─────────▼───────────────────────────┐
│  Next.js 15 + Payload CMS v3       │
│  (SINGLE PROCESS)                   │
│                                     │
│  /          → public site (unchanged)│
│  /admin     → Payload admin panel   │
│  /api/*     → Payload REST API      │
│                                     │
│  ┌────────────────────────────┐     │
│  │  PostgreSQL (via Drizzle)  │     │
│  └────────────────────────────┘     │
└─────────────────────────────────────┘
```

One process. One deploy. One container. One database.

## Content Collections (Payload Schema)

### 1. Blog Posts (`blog-posts`)
```ts
{
  slug: 'blog-posts',
  admin: { useAsTitle: 'titleEs', defaultColumns: ['titleEs', 'category', 'updatedAt'] },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'slugEs', type: 'text' },
    { name: 'titleEn', type: 'text', required: true },
    { name: 'titleEs', type: 'text', required: true },
    { name: 'contentEn', type: 'richText' },  // Lexical WYSIWYG
    { name: 'contentEs', type: 'richText' },
    { name: 'dateEn', type: 'text' },
    { name: 'dateEs', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'select', options: ['faith', 'family', 'worship'] },
  ],
}
```

### 2. Characters (`characters`)
```ts
{
  slug: 'characters',
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'nameEn', type: 'text', required: true },
    { name: 'nameEs', type: 'text', required: true },
    { name: 'descriptionEn', type: 'richText' },
    { name: 'descriptionEs', type: 'richText' },
    { name: 'color', type: 'text' },         // hex color
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'personality', type: 'text' },
  ],
}
```

### 3. Episodes (`episodes`)
```ts
{
  slug: 'episodes',
  fields: [
    { name: 'slug', type: 'text', required: true },
    { name: 'titleEn', type: 'text', required: true },
    { name: 'titleEs', type: 'text', required: true },
    { name: 'youtubeId', type: 'text', required: true },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'duration', type: 'text' },
    { name: 'season', type: 'number' },
    { name: 'episode', type: 'number' },
  ],
}
```

### 4. Team Members (`team-members`)
```ts
{
  slug: 'team-members',
  fields: [
    { name: 'nameEn', type: 'text', required: true },
    { name: 'nameEs', type: 'text' },
    { name: 'roleEn', type: 'text' },
    { name: 'roleEs', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'richText' },
  ],
}
```

### 5. Media (`media`) — built-in Payload upload collection
```ts
{
  slug: 'media',
  upload: {
    staticDir: 'public/media',    // persisted via host volume mount
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 768, height: 512 },
    ],
  },
  fields: [
    { name: 'alt', type: 'text' },
  ],
}
```

### 6. Page Content (`page-content`) — flexible key-value for page editors
```ts
{
  slug: 'page-content',
  fields: [
    { name: 'page', type: 'text', required: true },      // e.g. 'home', 'about'
    { name: 'section', type: 'text', required: true },
    { name: 'field', type: 'text', required: true },
    { name: 'valueEn', type: 'richText' },
    { name: 'valueEs', type: 'richText' },
    { name: 'fieldType', type: 'select', options: ['text','textarea','richtext','image','url','color','number'] },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
```

### 7. Site Settings (`site-settings`) — Payload Global
```ts
{
  slug: 'site-settings',
  fields: [
    { name: 'siteTitle', type: 'text' },
    { name: 'metaDescription', type: 'text' },
    { name: 'metaDescriptionEs', type: 'text' },
    { name: 'youtubeUrlEn', type: 'text' },
    { name: 'youtubeUrlEs', type: 'text' },
    { name: 'instagramUrlEn', type: 'text' },
    { name: 'instagramUrlEs', type: 'text' },
    { name: 'spotifyUrl', type: 'text' },
    { name: 'appleMusicUrl', type: 'text' },
  ],
}
```

### 8. Navigation (`navigation`) — Payload Global
```ts
{
  slug: 'navigation',
  fields: [
    { name: 'links', type: 'array', fields: [
      { name: 'label', type: 'text' },
      { name: 'labelEs', type: 'text' },
      { name: 'href', type: 'text' },
      { name: 'isExternal', type: 'checkbox' },
    ]},
    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaLabelEs', type: 'text' },
    { name: 'ctaHref', type: 'text' },
  ],
}
```

### 9. SEO Pages (`seo-pages`)
```ts
{
  slug: 'seo-pages',
  fields: [
    { name: 'page', type: 'text', required: true, unique: true },
    { name: 'titleEn', type: 'text' },
    { name: 'titleEs', type: 'text' },
    { name: 'descriptionEn', type: 'text' },
    { name: 'descriptionEs', type: 'text' },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}
```

### 10. Users (`users`) — built-in Payload auth collection
```ts
{
  slug: 'users',
  auth: true,     // Payload handles login, sessions, password reset
  fields: [
    { name: 'role', type: 'select', options: ['admin', 'editor'] },
  ],
}
```

## Execution Phases

### Phase 0 — Prerequisites

**Required before starting:**
- [ ] Hetzner Cloud access restored (console or API — for VM re-provisioning + CPX21 upgrade)
- [ ] GitHub push access (confirmed working via SSH key `codexstar69`)
- [ ] PostgreSQL instance (options ranked):
  - A) Supabase free tier Postgres (fastest — create project, get connection string)
  - B) Neon free tier Postgres (serverless, auto-scales to zero)
  - C) Self-hosted Postgres on Hetzner (cheapest long-term, needs Docker)

**Recommendation:** Option A or B for now (zero setup), migrate to self-hosted
later during Coolify migration. Payload connects via a standard `DATABASE_URI`
connection string — swapping providers later is a one-env-var change.

### Phase 1 — Install Payload into the Next.js App (local dev)

**No production impact. All work on the local machine.**

```sh
cd /Users/codex/Downloads/Code/Selah-Kids-Antigravity

# Install Payload + Postgres adapter
bun add payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical

# Payload needs these Next.js config changes:
# 1. withPayload() wrapper in next.config
# 2. Catch-all admin route at src/app/(payload)/admin/[[...segments]]/page.tsx
# 3. API route at src/app/(payload)/api/[...slug]/route.ts
# 4. payload.config.ts at project root
```

Create `payload.config.ts`:
```ts
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { BlogPosts } from './src/collections/BlogPosts';
import { Characters } from './src/collections/Characters';
import { Episodes } from './src/collections/Episodes';
import { TeamMembers } from './src/collections/TeamMembers';
import { Media } from './src/collections/Media';
import { PageContent } from './src/collections/PageContent';
import { SeoPages } from './src/collections/SeoPages';
import { Users } from './src/collections/Users';
import { SiteSettings } from './src/globals/SiteSettings';
import { Navigation } from './src/globals/Navigation';

export default buildConfig({
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  collections: [
    BlogPosts,
    Characters,
    Episodes,
    TeamMembers,
    Media,
    PageContent,
    SeoPages,
    Users,
  ],
  globals: [
    SiteSettings,
    Navigation,
  ],
  admin: {
    meta: {
      titleSuffix: ' — Selah Kids',
      icons: [{ rel: 'icon', url: '/favicon.ico' }],
    },
  },
  typescript: { outputFile: 'src/payload-types.ts' },
});
```

### Phase 2 — Create Collection Config Files

Create `src/collections/` and `src/globals/` directories with one file
per collection/global, matching the schemas in the Content Collections
section above. Each file exports a Payload `CollectionConfig` or
`GlobalConfig` object.

Total: 8 collection files + 2 global files = 10 small TypeScript files.

### Phase 3 — Rewrite CMS Data Layer

**Files changed (2 files):**

`src/lib/cms-server.ts` — swap Supabase calls to Payload local API:

```ts
import { getPayload } from 'payload';
import config from '@payload-config';

// Before: supabase.from('blog_posts').select('*')
// After:
export async function getBlogPosts() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'blog-posts',
    limit: 100,
    sort: '-createdAt',
  });
  return docs;
}

export async function getBlogPostBySlug(slug: string) {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: {
      or: [
        { slug: { equals: slug } },
        { slugEs: { equals: slug } },
      ],
    },
    limit: 1,
  });
  return docs[0] || null;
}

// Same pattern for getCharacters(), getEpisodes(), getTeamMembers(),
// getPageContent(page), getSiteSettings(), getSeoPages() — each is
// a 5-line function calling payload.find() or payload.findGlobal().
```

`src/lib/cms.ts` — simplified. Client-side CMS calls are no longer needed
(Payload admin handles all writes). Keep only the type exports that
components import.

**Files deleted (44 files):**
- `src/lib/supabase.ts` — mock Supabase client (replaced by Payload)
- `src/lib/auth.ts` — Supabase auth helpers (Payload handles auth)
- `src/app/admin/**` — all 42 custom admin pages (Payload replaces them)
- `supabase-schema.sql` — no longer needed (Payload auto-migrates)
- `scripts/seed-cms.ts` — replaced by `seed-payload.ts`

**Files unchanged:** every component, page, and layout under `src/app/[locale]/`
or `src/app/` (Apr 20 flat routes) — zero frontend changes.

### Phase 4 — Seed Content from Fallbacks

`scripts/seed-payload.ts`:

```ts
import { getPayload } from 'payload';
import config from '@payload-config';
import { BLOG_POSTS } from '../src/data/blogPosts';
import { CHARACTERS } from '../src/data/characters';
import { EPISODES } from '../src/data/catalog';
import { TEAM_MEMBERS } from '../src/data/team';

async function seed() {
  const payload = await getPayload({ config });

  // Seed blog posts
  for (const post of BLOG_POSTS) {
    const existing = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: post.slug } },
    });
    if (existing.docs.length > 0) continue; // idempotent

    await payload.create({
      collection: 'blog-posts',
      data: {
        slug: post.slug,
        slugEs: (post as any).slugEs || undefined,
        titleEn: post.titleEn,
        titleEs: post.titleEs,
        dateEn: post.dateEn,
        dateEs: post.dateEs,
        category: 'faith', // default
        // contentEn/Es need Lexical JSON conversion from HTML strings
        // — handled by a converter utility
      },
    });
  }

  // Same pattern for characters, episodes, team members
  // Page content, site settings, navigation seeded similarly

  console.log('✓ Seed complete');
  process.exit(0);
}

seed();
```

### Phase 5 — Theme the Admin Panel

Payload supports custom CSS and components for the admin panel:

```ts
// payload.config.ts → admin section
admin: {
  meta: {
    titleSuffix: ' — Selah Kids',
  },
  components: {
    graphics: {
      Logo: '/src/components/admin/PayloadLogo',  // Selah Kids logo
      Icon: '/src/components/admin/PayloadIcon',   // Favicon-sized icon
    },
  },
  css: '/src/styles/payload-admin.css',  // Brand colors override
},
```

`src/styles/payload-admin.css`:
```css
:root {
  --theme-elevation-0: #FDFCF8;
  --theme-elevation-50: #f1f8e7;
  --theme-success-500: #93d35c;
  --theme-error-500: #ff5c00;
  --font-body: 'Fredoka', var(--font-sans);
}
```

### Phase 6 — Local Testing

Before any production deployment:

```sh
# Start dev with Payload
DATABASE_URI="postgres://..." bun run dev

# Visit localhost:3000/admin — should show Payload login
# Create first admin user
# Verify:
#   - All 10 content types visible in sidebar
#   - Can create a blog post with WYSIWYG editor
#   - Can upload an image via drag-and-drop
#   - Can switch locale tabs (ES/EN)
#   - Public site at localhost:3000 still renders with fallback data
#   - After seeding, public site renders CMS data
```

### Phase 7 — Production Deployment

**Approach: build in GitHub Actions, deploy artifact to Hetzner.**

The build happens in CI (8GB RAM free tier) — never on the 2-4GB VPS.
Only the pre-built `.next/standalone` output ships to the VM.

Updated `.github/workflows/deploy-hetzner.yml`:
```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run build
        env:
          DATABASE_URI: ${{ secrets.DATABASE_URI }}
      - name: Deploy to Hetzner
        run: |
          # rsync .next/standalone + public/ + .next/static to VM
          # restart systemd unit
```

Systemd env (on VM):
```
Environment=DATABASE_URI=postgres://...
Environment=PAYLOAD_SECRET=<random-32-char-string>
Environment=NODE_ENV=production
```

Media uploads: persistent host directory mounted at `public/media/`.

### Phase 8 — Verification Checklist

- [ ] `selahkids.com/` → 200, Spanish content, all animations working
- [ ] `selahkids.com/blog` → shows all 4 blog posts from Payload DB
- [ ] `selahkids.com/blog/the-servants-heart-love-in-action` → 200
- [ ] `selahkids.com/blog/el-corazon-de-siervo-amor-en-accion` → 200
- [ ] `selahkids.com/resources` → shows 9 printables + 2 coming-soon
- [ ] `selahkids.com/characters` → character grid from Payload
- [ ] `selahkids.com/watch` → episode playlist
- [ ] `selahkids.com/admin` → Payload login page
- [ ] Admin login → dashboard with all collections
- [ ] Create draft blog post → NOT visible on public site
- [ ] Publish blog post → visible on public site
- [ ] Upload image in admin → accessible at `/media/<filename>`
- [ ] Edit existing post → change appears on site after revalidation
- [ ] Language toggle on public site switches all content ES↔EN
- [ ] Mobile responsive on all pages (unchanged)

### Phase 9 — Client Handoff

1. Create client user with `editor` role (can edit content, can't modify schema)
2. Write 1-page visual guide: "How to add a blog post" with screenshots
3. Record a 3-minute Loom walkthrough of the admin panel
4. Test with client: have them add a test blog post while you watch

### Phase 10 — Rollback

If anything breaks:
1. `cms-server.ts` still has offline fallback: if `getPayload()` fails or
   `DATABASE_URI` is unset, return data from `cms-fallbacks.ts`
2. To fully revert: `git revert` the Payload commits, rebuild, deploy
3. The frontend never changed — rollback has zero risk to the public site

## Risks

1. **Build RAM on VPS**: Payload + Next.js build needs 2-3GB.
   **Mitigation**: Build in GitHub Actions (8GB free), deploy pre-built artifact.

2. **Payload Lexical vs existing HTML content**: Current blog content is
   HTML strings (`<strong>`, `<em>`). Payload uses Lexical JSON.
   **Mitigation**: Write an HTML→Lexical converter for the seed script,
   OR store content as plain `textarea` fields instead of `richText` for
   the initial migration, upgrade to Lexical later.

3. **PostgreSQL hosting**: Need a Postgres instance.
   **Mitigation**: Supabase/Neon free tier for immediate start. Migrate to
   self-hosted later. Connection string is one env var to swap.

4. **Media upload persistence**: Container redeploys lose local files.
   **Mitigation**: `public/media/` is a host-mounted volume that persists
   across container lifecycles. Also back up to S3/Supabase Storage later.

5. **Admin panel theming**: Payload admin may look generic out of the box.
   **Mitigation**: Phase 5 applies Selah Kids brand colors + logo. Takes
   30 minutes.

## Effort Estimate

| Phase | Time | Owner |
|---|---|---|
| 0: Prerequisites (DB + VM access) | 15 min | User + Agent |
| 1: Install Payload | 15 min | Agent (autonomous) |
| 2: Collection configs (10 files) | 1 hour | Agent (autonomous) |
| 3: Rewrite cms-server.ts | 1.5 hours | Agent (autonomous) |
| 4: Seed content | 30 min | Agent (autonomous) |
| 5: Theme admin panel | 30 min | Agent (autonomous) |
| 6: Local testing | 30 min | Agent + User verify |
| 7: Production deploy | 30 min | Agent (autonomous) |
| 8: Verification | 15 min | Agent (autonomous) |
| 9: Client handoff materials | 30 min | Agent |
| **Total** | **~5 hours** | Mostly autonomous |

## Dependencies (must have before Phase 1)

- [ ] PostgreSQL connection string (Supabase free tier or Neon)
- [ ] `PAYLOAD_SECRET` (generate: `openssl rand -hex 16`)
- [ ] VM SSH access restored (for Phase 7)
