'use client';

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
