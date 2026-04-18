"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, Download, Palette, BookOpen } from 'lucide-react';
import { Badge } from '../UI';
import { useLanguage } from '../../contexts/LanguageContext';

export const ResourcesHero = () => {
  const { t } = useLanguage();
  return (
    <section className="text-center px-6 mb-16 relative z-10 max-w-5xl mx-auto">
      {/* Premium Pill Badge — same style as Home hero */}
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
        <Download size={16} className="text-selah-orange relative z-10" />
        <span className="ui-label text-selah-dark/90 relative z-10">{t("FREE DOWNLOADS", "DESCARGAS GRATIS")}</span>
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
        className="body-text mx-auto mb-10 text-center text-balance max-w-2xl"
      >
        {t(
          "Download printables, coloring pages, and lesson guides to help your kids learn and grow in faith.",
          "Descarga imprimibles, páginas para colorear y guías de lecciones para ayudar a tus hijos a aprender y crecer en la fe."
        )}
      </motion.p>

      {/* Floating Stats — like platform badges on home */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 50, damping: 15, delay: 1 }}
        className="flex flex-wrap justify-center gap-4 sm:gap-6"
      >
        {[
          { icon: Palette, label: t("Coloring Pages", "Para Colorear"), count: "4", color: "text-[#FF69B4]", bg: "bg-[#FF69B4]/10", shadow: "shadow-[0_8px_24px_-8px_rgba(255,105,180,0.25)]" },
          { icon: BookOpen, label: t("Lesson Guides", "Guías"), count: "1", color: "text-[#00BFFF]", bg: "bg-[#00BFFF]/10", shadow: "shadow-[0_8px_24px_-8px_rgba(0,191,255,0.25)]" },
          { icon: SparklesIcon, label: t("Devotionals", "Devocionales"), count: "1", color: "text-selah-orange", bg: "bg-selah-orange/10", shadow: "shadow-[0_8px_24px_-8px_rgba(255,92,0,0.25)]" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -4, scale: 1.05 }}
            className={`flex items-center gap-3 px-5 py-3 bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl ${stat.shadow} cursor-default group transition-all duration-300`}
          >
            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="text-left">
              <p className="text-selah-dark font-bold text-sm leading-tight">{stat.count}</p>
              <p className="text-selah-muted text-[11px] font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
