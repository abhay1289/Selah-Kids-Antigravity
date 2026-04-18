"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const ResourcesHero = () => {
  const { t } = useLanguage();
  return (
    <section className="text-center px-6 mb-16 relative z-10 max-w-5xl mx-auto">
      {/* Premium Pill Badge — same style as Home hero, no download icon */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.2 }}
        className="relative inline-flex items-center gap-3 px-6 py-2.5 bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full mb-8 cursor-default overflow-hidden group hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-shadow duration-500"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent -skew-x-12"
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
        />
        <SparklesIcon size={16} className="text-selah-orange relative z-10" />
        <span className="ui-label text-selah-dark/90 relative z-10">{t("FREE RESOURCES FOR FAMILIES", "RECURSOS GRATUITOS PARA FAMILIAS")}</span>
      </motion.div>

      {/* Cinematic Title — word-by-word reveal like Home hero */}
      <h1 className="hero-headline flex flex-wrap justify-center gap-x-3 lg:gap-x-4 mb-6 drop-shadow-lg relative z-10 max-w-[800px] mx-auto leading-[1.1]">
        {t("Resources for", "Recursos para").split(" ").map((word, i) => (
          <span key={i} className="overflow-hidden inline-block pb-3 px-1">
            <motion.span
              initial={{ y: "150%", opacity: 0, rotateZ: 12, scale: 0.8, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, rotateZ: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: i * 0.1 + 0.3 }}
              className="inline-block origin-bottom-left"
            >
              {word}
            </motion.span>
          </span>
        ))}
        <span className="overflow-hidden inline-block pb-3">
          <motion.span
            initial={{ y: "150%", opacity: 0, rotateZ: -10, scale: 0.5, filter: "blur(12px)" }}
            animate={{ y: 0, opacity: 1, rotateZ: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", bounce: 0.5, duration: 1.5, delay: 0.6 }}
            className="inline-block origin-bottom-left pr-4 drop-shadow-[0_10px_20px_rgba(255,107,0,0.4)]"
          >
            {t("Families", "Familias")}
          </motion.span>
        </span>
      </h1>

      {/* Description */}
      <motion.p 
        initial={{ opacity: 0, y: 30, filter: "blur(10px)", scale: 0.95 }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.8 }}
        className="body-text mx-auto mb-4 text-center text-balance max-w-2xl"
      >
        {t(
          "Download printables, coloring pages, and lesson guides to help your kids learn and grow in faith.",
          "Descarga imprimibles, páginas para colorear y guías de lecciones para ayudar a tus hijos a aprender y crecer en la fe."
        )}
      </motion.p>
    </section>
  );
};
