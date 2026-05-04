'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    // Admin pages render their own layout (AdminSidebar + AdminHeader)
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-selah-orange selection:text-white bg-selah-bg">
      <Navbar />
      <main>{children}</main>
      <div className="h-px w-full bg-selah-dark/5" />
      <Footer />
    </div>
  );
}
