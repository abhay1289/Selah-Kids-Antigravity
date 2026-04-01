"use client";

import React from 'react';
import { Badge } from '../UI';
import { useLanguage } from '../../contexts/LanguageContext';

export const WatchHero = () => {
  const { t } = useLanguage();

  return (
    <section className="text-center px-6 mb-12 relative z-10">
      <Badge color="light" className="mb-6 bg-selah-orange/10 text-selah-orange border-selah-orange/20 backdrop-blur-md">
        {t("WATCH & LISTEN", "VER Y ESCUCHAR")}
      </Badge>
      <h1 className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
        {t("Discover Our Videos", "Descubre Nuestros Videos")}
      </h1>
      <p className="text-base md:text-lg text-selah-muted font-body italic max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
        {t(
          "Sing, dance, and learn about God's love with our collection of high-quality Christian kids videos.",
          "Canta, baila y aprende del amor de Dios con nuestra colección de videos cristianos de alta calidad para niños."
        )}
      </p>
    </section>
  );
};
