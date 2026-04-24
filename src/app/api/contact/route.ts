/**
 * POST /api/contact
 *
 * Public contact-form submission endpoint. Currently a stub — validates
 * input, drops honeypot hits silently, logs to stdout, returns 200.
 * When a delivery mechanism is chosen (transactional email via Resend /
 * Postmark, a Notion inbox, a Linear intake project, etc.), the
 * `deliver()` call is the only site that needs to change.
 *
 * Security posture:
 *   - Required field validation (name, email, subject, message).
 *   - Email format check (loose).
 *   - Honeypot `website` field: bots see success, submission is dropped.
 *   - Length caps on every field to prevent payload abuse.
 *   - Interest radio normalized to a small allowlist.
 *   - Consent flag preserved verbatim for downstream compliance.
 *   - No CSRF token — same-origin form POST; if abuse surfaces, add a
 *     Turnstile/hCaptcha challenge.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INTEREST_ALLOWED = ['parent', 'educator', 'partner', 'press', 'other'] as const;
type Interest = (typeof INTEREST_ALLOWED)[number];

interface Submission {
  name: string;
  email: string;
  subject: string;
  message: string;
  interest: Interest;
  consent: boolean;
  locale: 'en' | 'es';
}

function clamp(raw: unknown, max: number): string {
  if (typeof raw !== 'string') return '';
  return raw.trim().slice(0, max);
}

function sanitizeInterest(raw: unknown): Interest {
  const lower = typeof raw === 'string' ? raw.toLowerCase() : '';
  return (INTEREST_ALLOWED as readonly string[]).includes(lower) ? (lower as Interest) : 'other';
}

async function deliver(submission: Submission): Promise<void> {
  // TODO: wire delivery. Candidates:
  //   - Resend: `resend.emails.send({ to: 'info.selahkids@gmail.com', ... })`
  //   - Postmark inbound template w/ audit trail
  //   - Notion DB insert for a triage queue
  console.log('[contact]', JSON.stringify(submission));
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot — silent drop with 200 so bots don't retry.
  const honeypot = typeof body.website === 'string' ? body.website : '';
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = clamp(body.name, 120);
  const email = clamp(body.email, 320).toLowerCase();
  const subject = clamp(body.subject, 160);
  const message = clamp(body.message, 4000);
  const consent = body.consent === true;
  const locale = body.locale === 'es' ? 'es' : 'en';

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'required';
  if (!email || !EMAIL_RE.test(email)) errors.email = 'invalid';
  if (!subject) errors.subject = 'required';
  if (!message || message.length < 10) errors.message = 'too_short';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
  }

  const submission: Submission = {
    name,
    email,
    subject,
    message,
    interest: sanitizeInterest(body.interest),
    consent,
    locale,
  };

  await deliver(submission);
  return NextResponse.json({ ok: true }, { status: 200 });
}
