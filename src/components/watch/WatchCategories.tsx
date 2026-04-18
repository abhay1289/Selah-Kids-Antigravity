"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Film, Music, Mic, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface WatchCategoriesProps {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

export const WatchCategories = ({ activeCategory, setActiveCategory }: WatchCategoriesProps) => {
  const { t } = useLanguage();

  const CATEGORIES = [
    { id: 'all', label: t('All Videos', 'Todos los Videos'), icon: Film },
    { id: 'music', label: t('Music Videos', 'Videos Musicales'), icon: Music },
    { id: 'singalong', label: t('Sing-Alongs', 'Videos Con Letras'), icon: Mic },
    { id: 'sensory', label: t('Sensory Videos', 'Videos Sensoriales'), icon: Sparkles }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 flex items-center justify-start md:justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full ui-button whitespace-nowrap transition-all duration-300 ${ isActive ? 'bg-selah-orange text-white shadow-[0_0_20px_rgba(255,92,0,0.3)] scale-105' : 'bg-white text-selah-muted border border-selah-border/30 hover:bg-selah-orange/10 hover:text-selah-dark' }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-selah-orange rounded-full -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <cat.icon size={18} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
