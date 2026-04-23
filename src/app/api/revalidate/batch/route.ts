/**
 * POST /api/revalidate/batch
 *
 * Same auth posture as /api/revalidate but accepts an array of tags in one
 * call. Used by:
 *   - seed script after full seed (invalidates every known tag at once)
 *   - bulk admin operations (e.g. publish-all)
 *
 * Rate limit is per-user not per-tag, so a batch of 20 tags counts as one
 * bucket slot — otherwise legitimate bulk ops would trip the limit on the
 * per-tag endpoint.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { isAllowedTag } from '../../../../lib/cms-server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const BATCH_RATE_WINDOW_MS = 60_000;
const BATCH_RATE_MAX = 5;
const batchBucket = new Map<string, number[]>();

function batchRateLimit(userId: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const hits = (batchBucket.get(userId) ?? []).filter((t) => now - t < BATCH_RATE_WINDOW_MS);
  if (hits.length >= BATCH_RATE_MAX) {
    return { ok: false, retryAfter: Math.ceil((BATCH_RATE_WINDOW_MS - (now - hits[0]!)) / 1000) };
  }
  hits.push(now);
  batchBucket.set(userId, hits);
  return { ok: true, retryAfter: 0 };
}

export async function POST(req: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    return new NextResponse(null, { status: 204 });
  }

  const fetchSite = req.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin') {
    return NextResponse.json({ error: 'Cross-site request rejected' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const raw = (body as { tags?: unknown } | null)?.tags;
  if (!Array.isArray(raw) || raw.length === 0) {
    return NextResponse.json({ error: "Body must be { tags: string[] }" }, { status: 400 });
  }
  if (raw.length > 50) {
    return NextResponse.json({ error: 'Batch too large (max 50 tags)' }, { status: 400 });
  }

  const accepted: string[] = [];
  const rejected: string[] = [];
  for (const t of raw) {
    if (typeof t === 'string' && isAllowedTag(t)) accepted.push(t);
    else rejected.push(String(t));
  }
  if (accepted.length === 0) {
    return NextResponse.json({ error: 'No allowed tags in batch', rejected }, { status: 400 });
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
            /* read-only context */
          }
        }
      },
    },
  });

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: adminRow, error: adminErr } = await supabase
    .from('admin_users')
    .select('user_id, email')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (adminErr || !adminRow) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const rl = batchRateLimit(userData.user.id);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', retryAfter: rl.retryAfter },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  for (const tag of accepted) revalidateTag(tag);

  // Single audit row for the batch (tag list comma-joined). Keeps the log
  // compact; individual tag granularity is recoverable from the comma-split.
  try {
    const { error: auditErr } = await supabase.from('cms_audit_log').insert({
      user_id: userData.user.id,
      email: adminRow.email,
      tag: `batch:${accepted.join(',')}`,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      user_agent: req.headers.get('user-agent') ?? null,
    });
    if (auditErr) {
      console.warn('[revalidate/batch] audit log insert failed', auditErr.message);
    }
  } catch (e) {
    console.warn('[revalidate/batch] audit log threw', e);
  }

  return NextResponse.json({ ok: true, accepted, rejected });
}
