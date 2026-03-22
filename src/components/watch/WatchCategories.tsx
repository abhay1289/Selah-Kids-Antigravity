"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Film, Music, Mic, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Videos', icon: Film },
  { id: 'music', label: 'Music Videos', icon: Music },
  { id: 'singalong', label: 'Sing-Alongs', icon: Mic },
  { id: 'sensory', label: 'Sensory Videos', icon: Sparkles }
];

interface WatchCategoriesProps {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

export const WatchCategories = ({ activeCategory, setActiveCategory }: WatchCategoriesProps) => {
  return (
    <div className="max-w-7xl mx-auto px-6 flex items-center justify-start md:justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full ui-button whitespace-nowrap transition-all duration-300 ${ isActive ? 'bg-white text-[#0B0F19] shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white' }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-white rounded-full -z-10"
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
