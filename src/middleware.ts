import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }

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
  // Preserves the "admin runs locally without a DB" story while still hardening prod.
  if (!url || !anon) return NextResponse.next();

  // Build a response we'll mutate with refreshed auth cookies, then use those
  // same cookies on either the passthrough or the redirect. Returning a new
  // response without copying cookies would drop any token-refresh side effects
  // from getUser(), bouncing the user to login even with a valid refresh token.
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('redirect', pathname);
    const redirect = NextResponse.redirect(loginUrl);
    // Carry over any refreshed cookies set during getUser() so we don't lose
    // session state in the rare "expired access token, valid refresh token" case.
    res.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie);
    });
    return redirect;
  }

  return res;
}

export const config = { matcher: ['/admin/:path*'] };
