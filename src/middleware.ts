import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getLocaleFromPathname, negotiateLocale } from './lib/i18n';

/**
 * Middleware combines two independent responsibilities:
 *
 *   1. **Public-path locale redirect** — URLs without a /en or /es prefix
 *      308-redirect to the prefixed form using Accept-Language negotiation.
 *      Phase 2 invariant: every rendered public page lives under /[locale]/.
 *
 *   2. **Admin auth** — /admin/* requires a valid Supabase session; unauth'd
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
    const locale = negotiateLocale(req.headers.get('accept-language'));
    const url = req.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
    // 308 (permanent + preserve method) — POSTs to legacy URLs don't silently
    // downgrade to GET. SEO crawlers treat 308 like 301 for canonicalization.
    return NextResponse.redirect(url, 308);
  }

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

    const res = NextResponse.next();
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
