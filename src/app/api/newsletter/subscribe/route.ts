/**
 * POST /api/newsletter/subscribe
 *
 * Public-facing newsletter signup endpoint. Currently a stub — it
 * validates the shape of the submission, drops honeypot hits silently,
 * logs the signup to server stdout, and returns 200. When the ESP
 * integration (Mailchimp, ConvertKit, Buttondown, etc.) is chosen in a
 * follow-up ticket, the `deliver()` call below is the only site that
 * needs to flip from console.log to the real provider SDK.
 *
 * Security posture:
 *   - Email format check (RFC 5321-ish, not strict — an ESP will reject
 *     malformed input anyway).
 *   - Honeypot: the `website` field must be empty. If populated,
 *     respond 200 but drop the submission. Bots see success; the list
 *     stays clean.
 *   - No CSRF token — this is a same-origin POST from the site's own
 *     newsletter form. When we wire the ESP, consider a short-lived
 *     Turnstile/hCaptcha if abuse materializes.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// RFC 5321-ish: catches obvious garbage without rejecting unusual TLDs or
// quoted-local-parts that real inboxes still use.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Submission {
  email: string;
  locale: 'en' | 'es';
  source: string;
}

function sanitizeLocale(raw: unknown): 'en' | 'es' {
  return raw === 'es' ? 'es' : 'en';
}

function sanitizeSource(raw: unknown): string {
  if (typeof raw !== 'string') return 'unknown';
  // Keep source labels to a short identifier; longer strings are likely
  // noise or an attempted payload.
  return raw.slice(0, 64).replace(/[^a-zA-Z0-9_-]/g, '');
}

async function deliver(submission: Submission): Promise<void> {
  // TODO: wire ESP (Mailchimp `/lists/{id}/members`, ConvertKit
  // `/forms/{id}/subscribe`, Buttondown `/subscribers`, etc.).
  console.log('[newsletter]', JSON.stringify(submission));
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot — bot-filled forms get a fake success so the bot reports
  // "done" and moves on, but the submission is dropped before delivery.
  const honeypot = typeof body.website === 'string' ? body.website : '';
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || !EMAIL_RE.test(email) || email.length > 320) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const submission: Submission = {
    email,
    locale: sanitizeLocale(body.locale),
    source: sanitizeSource(body.source) || 'newsletter',
  };

  await deliver(submission);
  return NextResponse.json({ ok: true }, { status: 200 });
}
