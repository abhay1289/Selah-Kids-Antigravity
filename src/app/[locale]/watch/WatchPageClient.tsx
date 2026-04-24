'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WatchHero } from '@/components/watch/WatchHero';
import { WatchCategories } from '@/components/watch/WatchCategories';
import { WatchGrid } from '@/components/watch/WatchGrid';
import { WatchCTA } from '@/components/watch/WatchCTA';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageShell, LanguageCrossPromo } from '@/components/design';
import type { Episode } from '@/data/catalog';
import type { PageFieldMap } from '@/lib/cms-server';

const UI_CATEGORY_TO_CANONICAL: Record<string, Episode['category'] | 'all'> = {
  all: 'all',
  music: 'music-video',
  singalong: 'sing-along',
  sensory: 'sensory',
};

const sectionEntrance = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  }
};

/**
 * Client half of the watch route. Parent Server Component fetches the
 * episodes via cms-server and hands the array down.
 */
export default function WatchPageClient({ episodes, fields }: { episodes: Episode[]; fields?: PageFieldMap }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const { language } = useLanguage();

  const canonicalCategory = UI_CATEGORY_TO_CANONICAL[activeCategory] ?? 'all';
  const filteredEpisodes = episodes.filter(ep =>
    ep.language === language && (canonicalCategory === 'all' || ep.category === canonicalCategory)
  );

  return (
    <PageShell mainClassName="pt-36 md:pt-44 pb-16">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionEntrance}>
        <WatchHero fields={fields} />
      </motion.div>

      {/* Filter Bar — paper-cream cardstock sticky strip. */}
      <div className="sticky top-20 z-40 bg-[var(--paper-cream)]/92 bg-[image:var(--paper-grain)] bg-[length:96px_96px] py-4 mb-12 shadow-[var(--paper-shadow-2)]">
        <WatchCategories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>

      {/* LanguageCrossPromo owns its own viewport-triggered entrance — no
         parent motion wrapper, otherwise both animations fight for the
         same viewport enter event and the card jitters. */}
      <LanguageCrossPromo className="mb-12" />

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionEntrance}>
        <WatchGrid episodes={filteredEpisodes} />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <WatchCTA fields={fields} />
      </motion.div>
    </PageShell>
  );
}
