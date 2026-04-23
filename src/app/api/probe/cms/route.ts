/**
 * Phase 1 end-to-end probe for the CMS wiring.
 *
 * GET  /api/probe/cms?tag=<name>
 *    Read-only — fetches via cms-server.ts in public mode, returns row count
 *    and a compact shape sample. Admin-gated. Used for a quick health check.
 *
 * POST /api/probe/cms
 *    Full round-trip — writes a fixture row to `collections` (collection =
 *    'probe', id = 'probe-fixture'), calls revalidateTag('collection:probe'),
 *    re-reads via cms-server.ts public mode, asserts the fixture is visible.
 *    Returns {writeOk, revalidateOk, readOk, roundtripMs, fixtureVisible}.
 *    Deletes the fixture before returning.
 *
 * This proves Phase 1's seed → read → publish-gate → revalidate pipeline
 * works BEFORE Phase 2 deletes any hardcoded constants. Addresses Codex
 * HIGH finding: read-only probes don't validate the full write path.
 *
 * Admin-only. Never expose publicly — returning DB shape info on 500 would
 * be a minor leak, and the POST path mutates the collections table.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getCollection, isAllowedTag } from '../../../../lib/cms-server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface ProbeItem {
  id: string;
  marker: string;
  ts: number;
}

async function requireAdmin(): Promise<
  | { ok: true; userId: string; email: string }
  | { ok: false; status: number; error: string }
> {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    return { ok: false, status: 503, error: 'Offline mode — probe disabled' };
  }
  const store = await cookies();
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (refreshed) => {
        for (const { name, value, options } of refreshed) {
          try {
            store.set(name, value, options);
          } catch {
            /* read-only */
          }
        }
      },
    },
  });
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { ok: false, status: 401, error: 'Unauthorized' };

  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('user_id, email')
    .eq('user_id', data.user.id)
    .maybeSingle();
  if (!adminRow) return { ok: false, status: 403, error: 'Forbidden' };
  return { ok: true, userId: data.user.id, email: adminRow.email };
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const tag = req.nextUrl.searchParams.get('tag');
  if (!tag || !isAllowedTag(tag)) {
    return NextResponse.json({ error: 'Missing or disallowed ?tag' }, { status: 400 });
  }

  // Only collection:<name> and page_content:<name> are readable via the
  // getCollection path; site_settings has its own reader. Keep the probe
  // scoped to collections to avoid a branchy surface.
  if (!tag.startsWith('collection:')) {
    return NextResponse.json({ error: 'Probe only supports collection:* tags' }, { status: 400 });
  }
  const collection = tag.slice('collection:'.length);

  const start = Date.now();
  try {
    const rows = await getCollection<{ id: string }>(collection, []);
    return NextResponse.json({
      mode: 'public',
      tag,
      rowCount: rows.length,
      firstId: rows[0]?.id ?? null,
      roundtripMs: Date.now() - start,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(_req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  if (!SUPABASE_URL || !SUPABASE_ANON) {
    return NextResponse.json({ error: 'Offline mode' }, { status: 503 });
  }

  const store = await cookies();
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (refreshed) => {
        for (const { name, value, options } of refreshed) {
          try {
            store.set(name, value, options);
          } catch {
            /* read-only */
          }
        }
      },
    },
  });

  const FIXTURE_ID = 'probe-fixture';
  const marker = `probe-${Date.now().toString(36)}`;
  const start = Date.now();
  const result: {
    writeOk: boolean;
    revalidateOk: boolean;
    readOk: boolean;
    fixtureVisible: boolean;
    roundtripMs: number;
    error?: string;
  } = {
    writeOk: false,
    revalidateOk: false,
    readOk: false,
    fixtureVisible: false,
    roundtripMs: 0,
  };

  try {
    // 1. Write fixture with is_published=true so the public (anon) RLS
    //    policy lets it through on the subsequent read.
    const { error: upErr } = await supabase.from('collections').upsert({
      id: FIXTURE_ID,
      collection: 'probe',
      data: { id: FIXTURE_ID, marker, ts: Date.now() } satisfies ProbeItem,
      sort_order: 0,
      is_published: true,
    });
    if (upErr) throw new Error(`Write: ${upErr.message}`);
    result.writeOk = true;

    // 2. Flush the tag. This proves revalidateTag is wired on the server.
    revalidateTag('collection:probe');
    result.revalidateOk = true;

    // 3. Re-read via cms-server.ts public mode. Because we tagged the fetch
    //    with 'collection:probe' on the prior call (if any), the flush in
    //    step 2 should invalidate the cache and force a fresh PostgREST
    //    read. The fixture should come back with our marker.
    const rows = await getCollection<ProbeItem>('probe', []);
    result.readOk = true;
    result.fixtureVisible = rows.some((r) => r.id === FIXTURE_ID && r.marker === marker);
  } catch (e) {
    result.error = e instanceof Error ? e.message : String(e);
  } finally {
    // 4. Always clean up. The probe fixture shouldn't linger in the DB.
    await supabase.from('collections').delete().eq('id', FIXTURE_ID).eq('collection', 'probe');
    revalidateTag('collection:probe');
    result.roundtripMs = Date.now() - start;
  }

  const status = result.fixtureVisible ? 200 : 500;
  return NextResponse.json(result, { status });
}
