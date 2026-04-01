"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../UI';
import { useLanguage } from '../../contexts/LanguageContext';

export const WatchHero = () => {
  const { t } = useLanguage();

  return (
    <section className="text-center px-6 mb-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Badge color="light" className="mb-6 bg-selah-orange/10 text-selah-orange border-selah-orange/20 backdrop-blur-md">
          {t("WATCH & LISTEN", "VER Y ESCUCHAR")}
        </Badge>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm"
      >
        {t("Discover Our Videos", "Descubre Nuestros Videos")}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="body-text max-w-3xl mx-auto leading-relaxed tracking-tight mb-8"
      >
        {t(
          "Sing, dance, and learn about God's love with our collection of high-quality Christian kids videos.",
          "Canta, baila y aprende del amor de Dios con nuestra colección de videos cristianos de alta calidad para niños."
        )}
      </motion.p>
    </section>
  );
};
