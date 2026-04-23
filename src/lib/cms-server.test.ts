/**
 * Tests for src/lib/cms-server.ts — the three-mode reader.
 *
 * Coverage:
 *   offline  → returns fallback when env vars are absent
 *   public   → tagged fetch against PostgREST with force-cache + backstop
 *   preview  → no-store read via @supabase/ssr when admin cookie present
 *   empty    → throws EmptyCmsError in prod when env is set but DB is empty
 *   tags     → CACHE_TAGS / isAllowedTag are consistent
 *
 * Runtime: `bun test src/lib/cms-server.test.ts`. Bun loads TS natively.
 * We stub global fetch and next/headers via module mocking.
 */

import { describe, test, expect, beforeEach, afterEach, mock } from 'bun:test';

// ───────────────────────────────────────────────────────────
// Module mocks — must run BEFORE importing cms-server
// ───────────────────────────────────────────────────────────

// next/headers: cookies() is async; return a store with .getAll().
let __cookies: Array<{ name: string; value: string }> = [];
mock.module('next/headers', () => ({
  cookies: async () => ({
    getAll: () => __cookies,
    get: (name: string) => __cookies.find((c) => c.name === name),
    set: () => {},
  }),
}));

// server-only: no-op import guard in test context.
mock.module('server-only', () => ({}));

// @supabase/ssr: createServerClient returns a chainable builder that
// resolves to the value stashed in __previewResult.
let __previewResult: { data: unknown[]; error: null | { message: string } } = {
  data: [],
  error: null,
};
mock.module('@supabase/ssr', () => ({
  createServerClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: async () => __previewResult,
        }),
      }),
    }),
  }),
}));

// ───────────────────────────────────────────────────────────
// Env helpers
// ───────────────────────────────────────────────────────────

const ENV_KEYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NODE_ENV',
] as const;
type EnvKey = (typeof ENV_KEYS)[number];
type EnvSnapshot = Partial<Record<EnvKey, string | undefined>>;

function snapshot(): EnvSnapshot {
  const s: EnvSnapshot = {};
  for (const k of ENV_KEYS) s[k] = process.env[k];
  return s;
}
function restore(s: EnvSnapshot) {
  const e = process.env as Record<string, string | undefined>;
  for (const k of ENV_KEYS) {
    const v = s[k];
    if (v === undefined) delete e[k];
    else e[k] = v;
  }
}

function setEnv(url: string | undefined, anon: string | undefined, nodeEnv = 'test') {
  // process.env values are typed as read-only in TS 5.x; cast to work around.
  const e = process.env as Record<string, string | undefined>;
  if (url === undefined) delete e.NEXT_PUBLIC_SUPABASE_URL;
  else e.NEXT_PUBLIC_SUPABASE_URL = url;
  if (anon === undefined) delete e.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  else e.NEXT_PUBLIC_SUPABASE_ANON_KEY = anon;
  e.NODE_ENV = nodeEnv;
}

// cms-server reads env at call time, so a single import per test is enough.
async function loadCmsServer() {
  return await import('./cms-server');
}

// ───────────────────────────────────────────────────────────
// Tests
// ───────────────────────────────────────────────────────────

describe('cms-server — offline mode', () => {
  let env: EnvSnapshot;
  beforeEach(() => {
    env = snapshot();
    setEnv(undefined, undefined);
  });
  afterEach(() => restore(env));

  test('getCollection returns the fallback array unchanged', async () => {
    const mod = await loadCmsServer();
    const fallback = [{ id: 'a', title: 'Hi' }];
    const out = await mod.getCollection('blog_posts', fallback);
    expect(out).toBe(fallback);
  });

  test('getPageContent returns the fallback map unchanged', async () => {
    const mod = await loadCmsServer();
    const fallback = { 'hero.headline': { en: 'Hi', es: 'Hola' } };
    const out = await mod.getPageContent('home', fallback);
    expect(out).toBe(fallback);
  });

  test('getSiteSettings returns the fallback', async () => {
    const mod = await loadCmsServer();
    const fallback = { site_title: 'Selah' };
    const out = await mod.getSiteSettings(fallback);
    expect(out).toBe(fallback);
  });

  test('isOfflineMode() returns true when env vars absent', async () => {
    const mod = await loadCmsServer();
    expect(mod.isOfflineMode()).toBe(true);
  });
});

describe('cms-server — public mode', () => {
  let env: EnvSnapshot;
  let fetchSpy: ReturnType<typeof mock>;
  beforeEach(() => {
    env = snapshot();
    setEnv('https://example.supabase.co', 'anon-key-xyz', 'test');
    __cookies = []; // no admin cookie → public mode
  });
  afterEach(() => {
    restore(env);
    fetchSpy?.mockRestore?.();
  });

  test('getCollection passes force-cache + tag + backstop to fetch', async () => {
    const rows = [
      { id: 'r1', collection: 'blog_posts', data: { id: 'r1', title: 'A' }, sort_order: 0, is_published: true, updated_at: '' },
    ];
    fetchSpy = mock(async () => new Response(JSON.stringify(rows), { status: 200 }));
    (globalThis as { fetch: typeof fetch }).fetch = fetchSpy as unknown as typeof fetch;

    const mod = await loadCmsServer();
    const out = await mod.getCollection<{ id: string; title: string }>('blog_posts', []);

    expect(out).toEqual([{ id: 'r1', title: 'A' }]);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const call = fetchSpy.mock.calls[0];
    const [url, init] = call as [string, RequestInit & { next?: { tags?: string[]; revalidate?: number } }];
    expect(url).toContain('/rest/v1/collections');
    expect(url).toContain('collection=eq.blog_posts');
    expect(url).toContain('is_published=eq.true');
    expect(init.cache).toBe('force-cache');
    expect(init.next?.tags).toEqual(['collection:blog_posts']);
    expect(init.next?.revalidate).toBe(86400);
  });

  test('getPageContent merges DB rows over fallback', async () => {
    const rows = [
      { id: '1', page: 'home', section: 'hero', field: 'headline', value_en: 'Hi', value_es: 'Hola', field_type: 'text', sort_order: 0, is_published: true, updated_at: '' },
    ];
    fetchSpy = mock(async () => new Response(JSON.stringify(rows), { status: 200 }));
    (globalThis as { fetch: typeof fetch }).fetch = fetchSpy as unknown as typeof fetch;

    const fallback = {
      'hero.headline': { en: 'OLD', es: 'OLD' },
      'hero.sub': { en: 'keep', es: 'mantener' },
    };
    const mod = await loadCmsServer();
    const out = await mod.getPageContent('home', fallback);
    expect(out['hero.headline']).toEqual({ en: 'Hi', es: 'Hola' });
    expect(out['hero.sub']).toEqual({ en: 'keep', es: 'mantener' });
  });

  test('getSiteSettings returns fallback when dev DB is empty (no throw)', async () => {
    fetchSpy = mock(async () => new Response('[]', { status: 200 }));
    (globalThis as { fetch: typeof fetch }).fetch = fetchSpy as unknown as typeof fetch;
    const mod = await loadCmsServer();
    const fallback = { site_title: 'Fallback' };
    const out = await mod.getSiteSettings(fallback);
    expect(out).toEqual(fallback);
  });

  test('throws on non-2xx response', async () => {
    fetchSpy = mock(async () => new Response('boom', { status: 500 }));
    (globalThis as { fetch: typeof fetch }).fetch = fetchSpy as unknown as typeof fetch;
    const mod = await loadCmsServer();
    await expect(mod.getCollection('blog_posts', [])).rejects.toThrow(/PostgREST 500/);
  });
});

describe('cms-server — empty-DB guard in production', () => {
  let env: EnvSnapshot;
  let fetchSpy: ReturnType<typeof mock>;
  beforeEach(() => {
    env = snapshot();
    setEnv('https://example.supabase.co', 'anon-key-xyz', 'production');
    __cookies = [];
    fetchSpy = mock(async () => new Response('[]', { status: 200 }));
    (globalThis as { fetch: typeof fetch }).fetch = fetchSpy as unknown as typeof fetch;
  });
  afterEach(() => {
    restore(env);
    fetchSpy?.mockRestore?.();
  });

  // Empty-DB fail-fast ONLY fires on getSiteSettings (no is_published filter,
  // so zero rows = genuinely unseeded). getCollection / getPageContent filter
  // by is_published=true and therefore can legitimately return zero rows when
  // an admin unpublishes everything — throwing would take the public site
  // down. They must degrade gracefully to an empty list / fallback map.
  test('getCollection returns [] when DB is empty (does NOT throw)', async () => {
    const mod = await loadCmsServer();
    const out = await mod.getCollection<{ id: string }>('blog_posts', []);
    expect(out).toEqual([]);
  });

  test('getPageContent returns fallback when DB is empty (does NOT throw)', async () => {
    const mod = await loadCmsServer();
    const fallback = { 'hero.headline': { en: 'x', es: 'y' } };
    const out = await mod.getPageContent('home', fallback);
    expect(out).toEqual(fallback);
  });

  test('getSiteSettings throws EmptyCmsError when DB is empty', async () => {
    const mod = await loadCmsServer();
    await expect(mod.getSiteSettings({})).rejects.toThrow(/CMS not seeded/);
  });
});

describe('cms-server — preview mode', () => {
  let env: EnvSnapshot;
  let fetchSpy: ReturnType<typeof mock>;
  beforeEach(() => {
    env = snapshot();
    setEnv('https://example.supabase.co', 'anon-key-xyz', 'test');
    // Admin cookie present → preview mode when opts.mode === 'preview'.
    __cookies = [{ name: 'sb-proj-auth-token', value: 'token' }];
    fetchSpy = mock(async () => new Response('[]', { status: 200 }));
    (globalThis as { fetch: typeof fetch }).fetch = fetchSpy as unknown as typeof fetch;
  });
  afterEach(() => {
    restore(env);
    fetchSpy?.mockRestore?.();
  });

  test('getCollection in preview returns rows via supabase client (no PostgREST fetch)', async () => {
    __previewResult = {
      data: [
        { id: 'p1', collection: 'blog_posts', data: { id: 'p1', title: 'Draft' }, sort_order: 0, is_published: false, updated_at: '' },
      ],
      error: null,
    };
    const mod = await loadCmsServer();
    const out = await mod.getCollection<{ id: string; title: string }>(
      'blog_posts',
      [],
      { mode: 'preview' },
    );
    expect(out).toEqual([{ id: 'p1', title: 'Draft' }]);
    // The PostgREST fetch path is NOT taken in preview mode.
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test('getPageContent in preview merges DB rows over fallback', async () => {
    __previewResult = {
      data: [
        { id: 'x', page: 'home', section: 'hero', field: 'headline', value_en: 'DRAFT', value_es: 'BORRADOR', field_type: 'text', sort_order: 0, is_published: false, updated_at: '' },
      ],
      error: null,
    };
    const mod = await loadCmsServer();
    const fallback = { 'hero.headline': { en: 'x', es: 'y' }, 'hero.sub': { en: 's', es: 't' } };
    const out = await mod.getPageContent('home', fallback, { mode: 'preview' });
    expect(out['hero.headline']).toEqual({ en: 'DRAFT', es: 'BORRADOR' });
    expect(out['hero.sub']).toEqual({ en: 's', es: 't' });
  });

  test('falls back to public mode when preview requested but no admin cookie', async () => {
    __cookies = []; // strip the admin cookie
    fetchSpy = mock(async () =>
      new Response(
        JSON.stringify([
          { id: 'r1', collection: 'blog_posts', data: { id: 'r1', title: 'Pub' }, sort_order: 0, is_published: true, updated_at: '' },
        ]),
        { status: 200 },
      ),
    );
    (globalThis as { fetch: typeof fetch }).fetch = fetchSpy as unknown as typeof fetch;
    const mod = await loadCmsServer();
    const out = await mod.getCollection<{ id: string; title: string }>(
      'blog_posts',
      [],
      { mode: 'preview' },
    );
    expect(out).toEqual([{ id: 'r1', title: 'Pub' }]);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});

describe('cms-server — cache tags', () => {
  test('CACHE_TAGS builders produce the same strings as the allowlist', async () => {
    const mod = await loadCmsServer();
    expect(mod.CACHE_TAGS.collection('blog_posts')).toBe('collection:blog_posts');
    expect(mod.CACHE_TAGS.pageContent('home')).toBe('page_content:home');
    expect(mod.CACHE_TAGS.siteSettings).toBe('site_settings');
  });

  test('isAllowedTag accepts allowlisted tags and rejects others', async () => {
    const mod = await loadCmsServer();
    expect(mod.isAllowedTag('collection:blog_posts')).toBe(true);
    expect(mod.isAllowedTag('page_content:home')).toBe(true);
    expect(mod.isAllowedTag('site_settings')).toBe(true);
    expect(mod.isAllowedTag('collection:bogus')).toBe(false);
    expect(mod.isAllowedTag('arbitrary')).toBe(false);
  });
});
