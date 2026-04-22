import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Offline mode: Supabase not configured → let the client-side guard handle it.
  // Preserves the "admin runs locally without a DB" story while still hardening prod.
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const login = req.nextUrl.clone();
    login.pathname = '/admin/login';
    login.searchParams.set('redirect', pathname);
    return NextResponse.redirect(login);
  }

  return res;
}

export const config = { matcher: ['/admin/:path*'] };
