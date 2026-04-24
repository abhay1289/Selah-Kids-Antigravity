'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageShell } from '@/components/design';
import { Button } from '@/components/UI';
import { Home, ArrowRight } from 'lucide-react';

/**
 * Locale-scoped 404 page. Mounted automatically by Next.js whenever a
 * /[locale]/... route fails to match. Kept intentionally small — the
 * goal is to reassure, not to sell.
 *
 * Copy is duplicated EN/ES statically (no `useLanguage()` here because
 * the locale-to-hook wiring would add a render dependency for a page
 * that must bootstrap from any auth/CMS failure).
 */
export default function LocaleNotFound() {
  return (
    <PageShell showScrollBar={false} mainClassName="pt-36 md:pt-48 pb-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="text-[120px] md:text-[180px] font-display font-black text-selah-orange/20 leading-none select-none">
          404
        </div>
        <h1 className="hero-headline mt-4">
          This page wandered off
        </h1>
        <p className="body-text mx-auto mt-6">
          The page you were looking for doesn&apos;t exist here. Try the home
          page or head over to Watch to sing along with the crew.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link href="/en">
            <Button variant="primary" icon={Home}>
              <span>Back to home</span>
            </Button>
          </Link>
          <Link href="/en/watch">
            <Button variant="white" icon={ArrowRight}>
              <span>Explore videos</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </PageShell>
  );
}
