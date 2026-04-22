'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { getUser } from '../../lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Detect offline mode (Supabase env vars not configured). Both the
  // browser `createBrowserClient` and the middleware use the same env vars
  // so this correctly mirrors server-side behaviour. In offline mode the
  // client `getUser()` returns the mock admin, so we show a visible banner
  // to prevent an accidentally-unwired prod deploy from looking "signed in".
  const isOfflineMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    // Skip auth check on login page
    if (pathname === '/admin/login') {
      setIsLoading(false);
      setIsAuthenticated(true); // let the login page render
      return;
    }

    getUser()
      .then(({ user }) => {
        if (!user) {
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        // Network/auth service failure — bounce to login rather than stranding
        // the user on the "Loading Dashboard..." spinner forever.
        router.push('/admin/login');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [pathname, router]);

  // Login page renders without the shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f1f8e7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff5c00] to-[#feb835] animate-pulse" />
          <p className="text-[#5a7d62] text-sm font-medium" style={{ fontFamily: 'var(--font-fredoka)' }}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#f1f8e7]/60">
      <AdminSidebar />
      <div className="lg:ml-[280px] min-h-screen flex flex-col">
        <AdminHeader />
        {isOfflineMode && (
          <div className="bg-[#feb835]/15 border-b border-[#feb835]/25 text-[#8a6b00] text-[12px] font-semibold px-6 py-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#feb835]" />
            Offline mode — Supabase is not configured. Auth is mocked and edits are not persisted. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable the live CMS.
          </div>
        )}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
