'use client';

import { motion } from 'framer-motion';
import { PageShell } from '@/components/design';
import { Button } from '@/components/UI';
import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Locale-scoped error boundary. Mounted by Next.js App Router whenever
 * a child page throws during render. Must be a Client Component
 * per Next's convention (it receives `reset` as a prop).
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Surface the error digest to the console so a user-visible report
  // correlates to server logs. We deliberately don't render the error
  // message itself — copy leaks, especially from CMS/data errors.
  if (typeof window !== 'undefined') {
    console.error('[app-error]', error.digest ?? '(no digest)', error);
  }

  return (
    <PageShell showScrollBar={false} mainClassName="pt-36 md:pt-48 pb-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="text-[100px] md:text-[140px] font-display font-black text-selah-orange/20 leading-none select-none">
          Oops
        </div>
        <h1 className="hero-headline mt-4">Something went wobbly</h1>
        <p className="body-text mx-auto mt-6">
          An unexpected hiccup kept this page from loading. Give it another try,
          or head home while we sort things out.
        </p>
        {error.digest && (
          <p className="ui-caption text-selah-muted mt-4 font-mono">
            Reference: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Button variant="primary" icon={RefreshCw} onClick={reset}>
            <span>Try again</span>
          </Button>
          <Link href="/en">
            <Button variant="white" icon={Home}>
              <span>Go home</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </PageShell>
  );
}
