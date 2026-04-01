"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../UI';
import { useLanguage } from '../../contexts/LanguageContext';

export const ResourcesHero = () => {
  const { t } = useLanguage();
  return (
    <section className="text-center px-6 mb-12 relative z-10">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
        <Badge color="orange" className="mb-6 shadow-md">{t("FREE DOWNLOADS", "DESCARGAS GRATIS")}</Badge>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
        {t("Resources for Families", "Recursos para Familias")}
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="body-text max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
        {t(
          "Download printables, coloring pages, and lesson guides to help your kids learn and grow in faith.",
          "Descarga imprimibles, páginas para colorear y guías de lecciones para ayudar a tus hijos a aprender y crecer en la fe."
        )}
      </motion.p>
    </section>
  );
};
