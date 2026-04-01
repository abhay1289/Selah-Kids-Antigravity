"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '../UI';
import { useLanguage } from '../../contexts/LanguageContext';

export const AboutCTA = () => {
  const { t } = useLanguage();
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12 md:py-16 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        className="bg-selah-orange rounded-[4rem] md:rounded-[5rem] p-16 md:p-32 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
        <div className="absolute -left-40 -top-40 w-[500px] h-[500px] bg-white/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute -right-40 -bottom-40 w-[500px] h-[500px] bg-selah-yellow/40 rounded-full blur-3xl opacity-20" />
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Star size={64} className="text-white mb-10 fill-white" />
          </motion.div>
          <h2 className="content-h2 text-white mb-10 leading-[1.1] tracking-tight">
            {t("Join Our Growing Family", "Únete a Nuestra Familia")}
          </h2>
          <p className="text-white/90 mb-12 body-text max-w-2xl">
            {t(
              "We're just getting started on this incredible journey. Subscribe and be part of the Selah Kids community today!",
              "Apenas estamos comenzando este increíble viaje. ¡Suscríbete y sé parte de la comunidad Selah Kids hoy!"
            )}
          </p>
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button 
              icon={ArrowRight}
              onClick={() => { window.location.href = "/watch"; }}
              className="!bg-white hover:!bg-selah-dark !text-selah-dark hover:!text-white !border-none !px-10 !py-4 ui-button transition-all duration-500 whitespace-nowrap shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
            >
              {t("Explore Our Videos", "Explora Nuestros Videos")}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
