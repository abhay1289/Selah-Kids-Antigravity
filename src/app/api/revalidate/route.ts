/**
 * POST /api/revalidate
 *
 * Admin-only endpoint that flushes Next.js's tag-based fetch cache after a
 * CMS save. Called by src/lib/useCms.ts on successful upsert / delete.
 *
 * Auth posture (reconciled from Codex + Gemini review):
 *   - Supabase session cookie → getUser() → must resolve to an admin_users row
 *     (`is_admin()` RLS helper used here as a direct table lookup for speed).
 *     This is the primary auth check. A valid admin JWT can't be forged by
 *     a third-party site, so we don't need Origin/Referer headers (unreliable
 *     through Vercel's edge).
 *   - Sec-Fetch-Site: same-origin — browser-set, reliable, defense-in-depth
 *     against a same-session CSRF from a malicious page.
 *   - Tag allowlist — only well-known tags invalidate. Prevents a compromised
 *     session from flooding the cache with arbitrary revalidations.
 *   - Rate limit — best-effort in-memory (serverless-instance-local). For
 *     true durability upgrade to Upstash Redis; this is flagged in the
 *     plan as a known limitation.
 *   - Audit log — every accepted call appends to cms_audit_log for
 *     after-the-fact inspection.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { isAllowedTag } from '../../../lib/cms-server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// In-memory sliding window: 10 invalidations per user per minute.
// Resets on cold-start, so a single malicious session can't churn harder
// than ~10/min per warm instance. Acceptable for humans, insufficient for a
// determined attacker across many instances — that's why the admin auth
// check is the load-bearing control.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10;
type Stamp = { ts: number };
const rateBucket = new Map<string, Stamp[]>();

function rateLimit(userId: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const stamps = (rateBucket.get(userId) ?? []).filter((s) => now - s.ts < RATE_WINDOW_MS);
  if (stamps.length >= RATE_MAX) {
    const oldest = stamps[0]!.ts;
    return { ok: false, retryAfter: Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000) };
  }
  stamps.push({ ts: now });
  rateBucket.set(userId, stamps);
  return { ok: true, retryAfter: 0 };
}

async function revalidateOne(
  req: NextRequest,
  rawTag: unknown,
): Promise<NextResponse> {
  // Offline mode: nothing to revalidate. Return 204 so admin save() succeeds
  // optimistically — offline edits persist to localStorage, no cache to flush.
  if (!SUPABASE_URL || !SUPABASE_ANON) {
    return new NextResponse(null, { status: 204 });
  }

  // Defense-in-depth: reject obvious cross-site calls. Real browsers send
  // Sec-Fetch-Site on every request; absence suggests a non-browser caller
  // (curl/bot/server) which has no legitimate need to hit this endpoint
  // outside explicit CI, and CI would use the service-role path instead.
  const fetchSite = req.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin') {
    return NextResponse.json({ error: 'Cross-site request rejected' }, { status: 403 });
  }

  // Tag allowlist check BEFORE auth so a malformed request fails cheaply.
  if (typeof rawTag !== 'string' || !isAllowedTag(rawTag)) {
    return NextResponse.json({ error: 'Unknown tag' }, { status: 400 });
  }
  const tag = rawTag;

  // Auth: read the caller's Supabase session and confirm they're in admin_users.
  const store = await cookies();
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (refreshed) => {
        for (const { name, value, options } of refreshed) {
          try {
            store.set(name, value, options);
          } catch {
            // Some runtimes (e.g. read-only fetches) disallow cookie writes.
            // Swallow — we still have the user identity above.
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

  // Rate limit AFTER auth so unauthenticated probes don't fill the bucket.
  const rl = rateLimit(userData.user.id);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', retryAfter: rl.retryAfter },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    );
  }

  // Fire the cache flush. revalidateTag is synchronous from the caller's
  // perspective; the actual invalidation is handled by Next.js internals.
  revalidateTag(tag);

  // Audit. Wrap the PostgrestBuilder in a Promise so we can attach .catch —
  // supabase-js builders are then-able but not promise-typed until awaited.
  try {
    const { error: auditErr } = await supabase.from('cms_audit_log').insert({
      user_id: userData.user.id,
      email: adminRow.email,
      tag,
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      user_agent: req.headers.get('user-agent') ?? null,
    });
    if (auditErr) {
      console.warn('[revalidate] audit log insert failed for tag', tag, auditErr.message);
    }
  } catch (e) {
    console.warn('[revalidate] audit log threw for tag', tag, e);
  }

  return NextResponse.json({ ok: true, tag });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const rawTag = (body as { tag?: unknown } | null)?.tag;
  return revalidateOne(req, rawTag);
}
