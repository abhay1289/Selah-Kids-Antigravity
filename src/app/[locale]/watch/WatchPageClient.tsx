'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WatchHero } from '@/components/watch/WatchHero';
import { WatchCategories } from '@/components/watch/WatchCategories';
import { WatchGrid } from '@/components/watch/WatchGrid';
import { WatchCTA } from '@/components/watch/WatchCTA';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/UI';
import type { Episode } from '@/data/catalog';

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
export default function WatchPageClient({ episodes }: { episodes: Episode[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const { language, setLanguage } = useLanguage();

  const canonicalCategory = UI_CATEGORY_TO_CANONICAL[activeCategory] ?? 'all';
  const filteredEpisodes = episodes.filter(ep =>
    ep.language === language && (canonicalCategory === 'all' || ep.category === canonicalCategory)
  );

  return (
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F0FAE6] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden selection:bg-selah-orange selection:text-white">
      {/* Vivid Color Washes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-selah-orange/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#93D35C]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-0 w-[40vw] h-[40vh] bg-[#FEB835]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[5%] w-[35vw] h-[35vh] bg-[#FF69B4]/6 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vh] bg-[#00BFFF]/6 rounded-full blur-[100px] pointer-events-none" />
      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionEntrance}>
        <WatchHero />
      </motion.div>
      
      {/* Filter Bar */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl py-4 mb-12 border-b border-selah-orange/10">
        <WatchCategories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>

      {/* Notice Blurb */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionEntrance} className="max-w-4xl mx-auto px-6 mb-12 text-center">
        {language === 'EN' ? (
          <p className="text-selah-dark bg-selah-orange/10 rounded-2xl p-6 m-0 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-sm border border-selah-orange/20">
            <span className="font-medium text-lg">Do you speak Spanish? Check out our Spanish page!</span>
            <Button variant="primary" onClick={() => setLanguage('ES')} className="!py-2 !px-6 hover:scale-105 transition-transform">
              🇪🇸 Switch to Spanish
            </Button>
          </p>
        ) : (
          <p className="text-selah-dark bg-selah-orange/10 rounded-2xl p-6 m-0 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-sm border border-selah-orange/20">
            <span className="font-medium text-lg">¿Hablas inglés? ¡Visita nuestra página en inglés!</span>
            <Button variant="primary" onClick={() => setLanguage('EN')} className="!py-2 !px-6 hover:scale-105 transition-transform">
              🇺🇸 Cambiar a Inglés
            </Button>
          </p>
        )}
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionEntrance}>
        <WatchGrid episodes={filteredEpisodes} />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <WatchCTA />
      </motion.div>
    </div>
  );
}
