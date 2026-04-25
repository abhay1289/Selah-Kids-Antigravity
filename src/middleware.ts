import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { DEFAULT_LOCALE, getLocaleFromPathname } from './lib/i18n';

/**
 * Middleware combines three responsibilities:
 *
 *   1. **Public-path locale redirect** — URLs without a /en or /es prefix
 *      307-redirect to the prefixed form using Accept-Language negotiation.
 *      Phase 2 invariant: every rendered public page lives under /[locale]/.
 *
 *   2. **Locale header for SSR `<html lang>`** — on /en/* and /es/*
 *      requests, stamp `x-selah-locale` on the forwarded request so the
 *      root layout can set the correct `lang` attribute before hydration.
 *
 *   3. **Admin auth** — /admin/* requires a valid Supabase session; unauth'd
 *      callers bounce to /admin/login. Preserves cookie refresh behavior.
 */

// Paths that must never get a locale prefix or auth check.
const NON_LOCALE_PUBLIC_PATHS = ['/api', '/admin', '/_next', '/favicon.ico', '/sitemap.xml', '/robots.txt'];

function isStaticAsset(pathname: string): boolean {
  // Files with extensions (images, manifests, fonts) bypass the locale shell.
  return /\.[a-zA-Z0-9]{2,5}$/.test(pathname);
}

function shouldLocaleRedirect(pathname: string): boolean {
  if (pathname === '/') return true;
  if (NON_LOCALE_PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return false;
  }
  if (isStaticAsset(pathname)) return false;
  return getLocaleFromPathname(pathname) === null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── 1. Locale redirect (public pages only, no locale prefix present) ──
  if (shouldLocaleRedirect(pathname)) {
    // Always redirect to DEFAULT_LOCALE (Spanish), regardless of the
    // browser's Accept-Language header. The site's primary audience is
    // Spanish-speaking; English visitors can still switch to /en via
    // the in-page language toggle or by visiting /en/* URLs directly.
    // Negotiating against Accept-Language meant English-system users
    // never saw the Spanish-default brand on first visit, which is the
    // wrong mental model for this product.
    const url = req.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`;
    // 307 (temporary + preserve method) — keep the redirect probable so
    // when the user toggles language and gets cookied onto /en, browsers
    // don't permanently cache the /→/es path.
    return NextResponse.redirect(url, 307);
  }

  // ── 1a. Locale header for downstream layouts ──
  // `<html lang>` must be correct in the SSR response, before hydration.
  // Middleware knows the pathname (and therefore the locale) for every
  // request — stamp it on the forwarded request headers so the root
  // layout can set `lang` via `headers().get('x-selah-locale')`.
  const localeFromPath = getLocaleFromPathname(pathname);
  if (localeFromPath) {
    const reqHeaders = new Headers(req.headers);
    reqHeaders.delete('x-selah-locale');
    reqHeaders.set('x-selah-locale', localeFromPath);
    // The /admin branch below will re-derive its own request headers from
    // `req.headers`, but non-admin public routes need this header on the
    // *forwarded* request. Apply it here and carry the NextResponse
    // forward. The admin branch returns its own response so won't stomp
    // on this one.
    if (!pathname.startsWith('/admin')) {
      return NextResponse.next({ request: { headers: reqHeaders } });
    }
  }

  // ── 2a. Preview mode marker — cms-server reads this to flip getCollection /
  // getPageContent into 'preview' mode (drafts visible). The cookie-backed
  // admin check still gates the actual data read, so setting this header
  // on a non-admin request is harmless.
  const isPreview = pathname.startsWith('/admin/preview/');

  // ── 2. Admin auth (unchanged from pre-locale behavior) ──
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Next 15 sends a separate RSC prefetch for each linked admin route. Skip
    // them — running getUser() on every prefetch triggers a round-trip to
    // Supabase and breaks under hover-prefetch. The page-level fetch still
    // enforces auth on the real navigation.
    if (req.headers.get('next-router-prefetch')) {
      return NextResponse.next();
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    // Offline mode: Supabase not configured → let the client-side guard handle it.
    if (!url || !anon) return NextResponse.next();

    // Defense in depth: drop any inbound `x-selah-preview` header before
    // re-setting it. Otherwise a public request that carried the header
    // could let an attacker push it onto the admin branch unchanged.
    const reqHeaders = new Headers(req.headers);
    reqHeaders.delete('x-selah-preview');
    if (isPreview) reqHeaders.set('x-selah-preview', '1');
    const res = NextResponse.next({ request: { headers: reqHeaders } });
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          }),
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.searchParams.set('redirect', pathname);
      const redirect = NextResponse.redirect(loginUrl);
      // Carry over any refreshed cookies set during getUser() so we don't lose
      // session state in the "expired access token, valid refresh token" case.
      res.cookies.getAll().forEach((cookie) => {
        redirect.cookies.set(cookie);
      });
      return redirect;
    }
    return res;
  }

  return NextResponse.next();
}

// Matcher: runs on every request *except* Next internals and files with an
// extension. The handler itself filters further (API, admin, etc.) so the
// matcher stays broad and we don't have to keep two allowlists in sync.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
