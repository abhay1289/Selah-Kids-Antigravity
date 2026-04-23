"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';
import { Play } from 'lucide-react';
import { Episode } from '../../data/catalog';
import { useMedia } from '../../contexts/MediaContext';
import { useLanguage } from '../../contexts/LanguageContext';

const CATEGORY_LABEL: Record<Episode['category'], { en: string; es: string }> = {
  'music-video': { en: 'Music Video', es: 'Video Musical' },
  'sing-along': { en: 'Sing-Along', es: 'Videos Con Letras' },
  'sensory': { en: 'Sensory', es: 'Sensorial' },
};

interface WatchGridProps {
  episodes: Episode[];
}

export const WatchGrid = ({ episodes }: WatchGridProps) => {
  const { openEpisode } = useMedia();
  const { language } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {episodes.map((ep) => {
            const title = language === 'ES' && ep.titleEs ? ep.titleEs : ep.title;
            const description = language === 'ES' && ep.descriptionEs ? ep.descriptionEs : ep.description;
            const categoryLabel = CATEGORY_LABEL[ep.category][language === 'ES' ? 'es' : 'en'];
            const play = () => openEpisode(ep, episodes);
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                key={ep.id}
                onClick={play}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    play();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Watch ${title}`}
                className="group cursor-pointer flex flex-col h-full"
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  <NextImage src={ep.thumbnail} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" />

                  <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 shimmer-effect" />
                  </div>

                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-500">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out">
                      <Play className="text-selah-dark ml-1" size={24} fill="currentColor" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 z-30">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full ui-label text-selah-dark">
                      {ep.language}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 z-30">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full ui-label text-white">
                      {categoryLabel}
                    </span>
                  </div>
                </div>

                <div className="flex-grow flex flex-col mt-2">
                  <h3 className="content-h3 text-selah-dark mb-3 group-hover:text-selah-orange transition-colors drop-shadow-sm">
                    {title}
                  </h3>
                  <div className="ui-label text-selah-muted/60 mb-4">
                    {ep.dateLabel}
                  </div>
                  <p className="body-text !max-w-none leading-relaxed line-clamp-2 mb-3">
                    {description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
