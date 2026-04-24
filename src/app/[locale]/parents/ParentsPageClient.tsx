'use client';

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ParentsHero } from '@/components/parents/ParentsHero';
import { PageShell } from '@/components/design';
import type { PageFieldMap } from '@/lib/cms-server';

const ParentsTrustBadges = dynamic(() => import('@/components/parents/ParentsTrustBadges').then(m => ({ default: m.ParentsTrustBadges })), { ssr: false });
const ParentsAccordion = dynamic(() => import('@/components/parents/ParentsAccordion').then(m => ({ default: m.ParentsAccordion })), { ssr: false });
const ParentsCommunity = dynamic(() => import('@/components/parents/ParentsCommunity').then(m => ({ default: m.ParentsCommunity })), { ssr: false });

const sectionEntrance = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  }
};

/**
 * Client half of the /parents route. The parent Server Component fetches
 * CMS-managed page copy and passes it down via `fields`.
 */
export default function ParentsPageClient({ fields }: { fields?: PageFieldMap }) {
  return (
    <PageShell mainClassName="pt-36 md:pt-44 pb-16">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionEntrance}>
        <ParentsHero fields={fields} />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <ParentsTrustBadges fields={fields} />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <ParentsAccordion fields={fields} />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <ParentsCommunity fields={fields} />
      </motion.div>
    </PageShell>
  );
}
