# Fix plan for: Payload CMS Migration — Schema & API Layer

## Summary

Two confirmed findings require fixes before the Payload migration can ship. First, the schema hard-codes locale into field names (`titleEn`/`titleEs`) instead of using Payload's built-in i18n, locking the app to exactly two languages. Second, the BlogPosts collection lacks draft/publish workflow (`versions.drafts`) and the API has no status filter, causing the Phase 8 verification test "Create draft → NOT visible on public site" to fail. This plan fixes both issues with minimal scope: collection configs + cms-server.ts only.

## Strategy

**Ordering rationale**: Localization (Finding 1) is a schema foundation change — it restructures how data is stored. Drafts (Finding 2) are a workflow layer on top. Fix localization first, then add drafts. Both findings touch the same files, so they'll be addressed in sequence.

**Risk assessment**: The localization fix is medium-risk (changes data shape, requires re-seeding). The drafts fix is low-risk (adds Payload config + one API filter). If localization verification fails, rollback the collection config changes and keep the old schema; the seed script will need updating but that's a known dependency.

**Cross-finding dependency**: Finding 2's `getBlogPosts()` filter depends on Finding 1's schema being in place — the `_status` field only exists when `versions.drafts` is enabled.

## Steps

### Step 1: Enable Payload Localization in Config

**File**: `payload.config.ts` (root)
**Finding**: architect | migration | medium
**Change**:
```ts
// BEFORE (lines 1-30, conceptual)
export default buildConfig({
  editor: lexicalEditor(),
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } } }),
  // ... collections array
});

// AFTER — add localization config
export default buildConfig({
  editor: lexicalEditor(),
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } } }),
  localization: {
    locales: ['en', 'es'],
    defaultLocale: 'es',
  },
  // ... collections array
});
```
**Reasoning**: Payload's `localization` config enables the i18n feature at the CMS level. Without this, the `localized: true` field option in collections does nothing. This is the prerequisite for replacing hard-coded `*En/*Es` fields with locale-aware fields.
**Verify**: `godspeed payload.config.ts`
**Risk**: medium — if DATABASE_URI is missing, Payload fails to boot; ensure env var is set before testing

---

### Step 2: Convert BlogPosts Collection to Use Localized Fields

**File**: `src/collections/BlogPosts.ts`
**Finding**: architect | migration | medium
**Change**:
```ts
// BEFORE (lines 1-20, conceptual)
{
  slug: 'blog-posts',
  admin: { useAsTitle: 'titleEs', defaultColumns: ['titleEs', 'category', 'updatedAt'] },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'slugEs', type: 'text' },
    { name: 'titleEn', type: 'text', required: true },
    { name: 'titleEs', type: 'text', required: true },
    { name: 'contentEn', type: 'richText' },
    { name: 'contentEs', type: 'richText' },
    { name: 'dateEn', type: 'text' },
    { name: 'dateEs', type: 'text' },
    // ... rest
  ],
}

// AFTER — use localized fields
{
  slug: 'blog-posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'updatedAt'] },
  versions: { drafts: true },
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'slugEs', type: 'text', localized: true },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'content', type: 'richText', localized: true },
    { name: 'date', type: 'text', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'select', options: ['faith', 'family', 'worship'] },
  ],
}
```
**Reasoning**: Replaces duplicated `*En/*Es` pairs with single fields marked `localized: true`. Payload stores both EN/ES in the same field, accessible via locale parameter. Also adds `versions: { drafts: true }` here — this addresses Finding 2's draft workflow requirement in the same step to avoid touching the file twice. The `useAsTitle` changes from `titleEs` to `title` since the field is now locale-agnostic.
**Verify**: `godspeed src/collections/BlogPosts.ts`
**Risk**: medium — requires re-seeding; old seed script uses old field names (dependency noted in Step 5)

---

### Step 3: Convert Characters Collection to Use Localized Fields

**File**: `src/collections/Characters.ts`
**Finding**: architect | migration | medium
**Change**:
```ts
// BEFORE
{
  slug: 'characters',
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'nameEn', type: 'text', required: true },
    { name: 'nameEs', type: 'text', required: true },
    { name: 'descriptionEn', type: 'richText' },
    { name: 'descriptionEs', type: 'richText' },
    // ... rest
  ],
}

// AFTER
{
  slug: 'characters',
  fields: [
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'description', type: 'richText', localized: true },
    { name: 'color', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'personality', type: 'text' },
  ],
}
```
**Reasoning**: Same pattern as BlogPosts — collapse `nameEn`/`nameEs` → `name` (localized), `descriptionEn`/`descriptionEs` → `description` (localized). `color`, `image`, `personality` are not locale-specific (they're visual properties), so they stay as-is.
**Verify**: `godspeed src/collections/Characters.ts`
**Risk**: low — no draft workflow needed here, pure schema restructure

---

### Step 4: Convert Episodes Collection to Use Localized Fields

**File**: `src/collections/Episodes.ts`
**Finding**: architect | migration | medium
**Change**:
```ts
// BEFORE
{
  slug: 'episodes',
  fields: [
    { name: 'slug', type: 'text', required: true },
    { name: 'titleEn', type: 'text', required: true },
    { name: 'titleEs', type: 'text', required: true },
    // ... rest
  ],
}

// AFTER
{
  slug: 'episodes',
  fields: [
    { name: 'slug', type: 'text', required: true },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'youtubeId', type: 'text', required: true },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    { name: 'duration', type: 'text' },
    { name: 'season', type: 'number' },
    { name: 'episode', type: 'number' },
  ],
}
```
**Reasoning**: `title` becomes localized. `youtubeId`, `thumbnail`, `duration`, `season`, `episode` are metadata — not locale-specific, so they stay as single fields.
**Verify**: `godspeed src/collections/Episodes.ts`
**Risk**: low

---

### Step 5: Convert TeamMembers Collection to Use Localized Fields

**File**: `src/collections/TeamMembers.ts`
**Finding**: architect | migration | medium
**Change**:
```ts
// BEFORE
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

// AFTER
{
  slug: 'team-members',
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'role', type: 'text', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'richText', localized: true },
  ],
}
```
**Reasoning**: `name`, `role`, `bio` become localized. `image` is a media relation — not locale-specific.
**Verify**: `godspeed src/collections/TeamMembers.ts`
**Risk**: low

---

### Step 6: Convert PageContent Collection to Use Localized Fields

**File**: `src/collections/PageContent.ts`
**Finding**: architect | migration | medium
**Change**:
```ts
// BEFORE
{
  slug: 'page-content',
  fields: [
    { name: 'page', type: 'text', required: true },
    { name: 'section', type: 'text', required: true },
    { name: 'field', type: 'text', required: true },
    { name: 'valueEn', type: 'richText' },
    { name: 'valueEs', type: 'richText' },
    // ... rest
  ],
}

// AFTER
{
  slug: 'page-content',
  fields: [
    { name: 'page', type: 'text', required: true },
    { name: 'section', type: 'text', required: true },
    { name: 'field', type: 'text', required: true },
    { name: 'value', type: 'richText', localized: true },
    { name: 'fieldType', type: 'select', options: ['text','textarea','richtext','image','url','color','number'] },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
```
**Reasoning**: `valueEn`/`valueEs` → `value` (localized). The other fields are structural keys, not content.
**Verify**: `godspeed src/collections/PageContent.ts`
**Risk**: low

---

### Step 7: Convert SiteSettings Global to Use Localized Fields

**File**: `src/globals/SiteSettings.ts`
**Finding**: architect | migration | medium
**Change**:
```ts
// BEFORE
{
  slug: 'site-settings',
  fields: [
    { name: 'siteTitle', type: 'text' },
    { name: 'metaDescription', type: 'text' },
    { name: 'metaDescriptionEs', type: 'text' },
    { name: 'youtubeUrlEn', type: 'text' },
    { name: 'youtubeUrlEs', type: 'text' },
    // ... rest
  ],
}

// AFTER
{
  slug: 'site-settings',
  fields: [
    { name: 'siteTitle', type: 'text', localized: true },
    { name: 'metaDescription', type: 'text', localized: true },
    { name: 'youtubeUrl', type: 'text', localized: true },
    { name: 'instagramUrl', type: 'text', localized: true },
    { name: 'spotifyUrl', type: 'text' },
    { name: 'appleMusicUrl', type: 'text' },
  ],
}
```
**Reasoning**: Social URLs (`youtubeUrl`, `instagramUrl`) are locale-specific (different regional links). `spotifyUrl` and `appleMusicUrl` are global — same link everywhere, so not localized.
**Verify**: `godspeed src/globals/SiteSettings.ts`
**Risk**: low

---

### Step 8: Convert Navigation Global to Use Localized Fields

**File**: `src/globals/Navigation.ts`
**Finding**: architect | migration | medium
**Change**:
```ts
// BEFORE
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

// AFTER
{
  slug: 'navigation',
  fields: [
    { name: 'links', type: 'array', fields: [
      { name: 'label', type: 'text', localized: true },
      { name: 'href', type: 'text' },
      { name: 'isExternal', type: 'checkbox' },
    ]},
    { name: 'ctaLabel', type: 'text', localized: true },
    { name: 'ctaHref', type: 'text' },
  ],
}
```
**Reasoning**: `label` inside the array needs to be localized (nav link text differs by language). `href` is a URL — same regardless of locale. `ctaLabel` is localized, `ctaHref` is not.
**Verify**: `godspeed src/globals/Navigation.ts`
**Risk**: low

---

### Step 9: Convert SeoPages Collection to Use Localized Fields

**File**: `src/collections/SeoPages.ts`
**Finding**: architect | migration | medium
**Change**:
```ts
// BEFORE
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

// AFTER
{
  slug: 'seo-pages',
  fields: [
    { name: 'page', type: 'text', required: true, unique: true },
    { name: 'title', type: 'text', localized: true },
    { name: 'description', type: 'text', localized: true },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}
```
**Reasoning**: `title` and `description` are localized SEO properties. `ogImage` is a media upload — not locale-specific.
**Verify**: `godspeed src/collections/SeoPages.ts`
**Risk**: low

---

### Step 10: Update cms-server.ts to Request Locale + Filter by Published Status

**File**: `src/lib/cms-server.ts`
**Finding**: sonnet | code_quality | medium (also addresses Finding 2's API filter requirement)
**Change**:
```ts
// BEFORE (lines 5-15, conceptual)
export async function getBlogPosts() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'blog-posts',
    limit: 100,
    sort: '-createdAt',
  });
  return docs;
}

// AFTER — add locale + status filter
export async function getBlogPosts(locale: 'en' | 'es' = 'es') {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'blog-posts',
    locale,
    where: { _status: { equals: 'published' } },
    limit: 100,
    sort: '-createdAt',
  });
  return docs;
}
```
**Reasoning**: Two fixes in one step: (1) adds `locale` parameter so callers can request EN or ES content — this is the API side of Finding 1's localization fix. (2) adds `_status
