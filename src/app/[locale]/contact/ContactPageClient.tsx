'use client';

import React from 'react';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactSidebar } from '@/components/contact/ContactSidebar';
import { PageShell } from '@/components/design';
import type { PageFieldMap } from '@/lib/cms-server';

/**
 * Client half of the /contact route. Contact is a short page — the spine
 * stops are tightened slightly so the atmospheric drift doesn't feel
 * stranded halfway through.
 */
export default function ContactPageClient({ fields }: { fields?: PageFieldMap }) {
  return (
    <PageShell
      mainClassName="pt-36 md:pt-44 pb-16"
      spineStops={{
        stopsCx1: ['30%', '50%', '70%'],
        stopsCy1: ['22%', '40%', '58%'],
        stopsCx2: ['70%', '50%', '30%'],
        stopsCy2: ['72%', '58%', '42%'],
      }}
    >
      <ContactHero fields={fields} />

      <section className="max-w-[1400px] mx-auto px-6 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <ContactForm />
          <ContactSidebar />
        </div>
      </section>
    </PageShell>
  );
}
