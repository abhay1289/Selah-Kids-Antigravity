"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, Heart, Star } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const AboutMarqueeSection = () => {
  const { t } = useLanguage();
  return (
    <div className="w-full overflow-hidden bg-selah-orange py-6 md:py-10 -rotate-2 scale-105 my-8 md:my-12 shadow-xl relative z-20">
      <motion.div 
        className="flex whitespace-nowrap gap-8 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="content-h3 text-white uppercase tracking-widest">{t("Joyful", "Gozoso")}</span>
            <SparklesIcon className="text-selah-yellow" size={40} />
            <span className="content-h3 text-white uppercase tracking-widest">{t("Faith-Filled", "Lleno de Fe")}</span>
            <Star className="text-selah-yellow" size={40} />
            <span className="content-h3 text-white uppercase tracking-widest">{t("Creative", "Creativo")}</span>
            <Heart className="text-selah-yellow" size={40} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
