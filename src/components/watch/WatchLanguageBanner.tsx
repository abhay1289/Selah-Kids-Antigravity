"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const WatchLanguageBanner = () => {
  const { language, setLanguage } = useLanguage();

  const handleSwitch = () => {
    setLanguage(l => l === 'EN' ? 'ES' : 'EN');
    // Scroll to top for a fresh feel
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-5xl mx-auto px-6 mb-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[2.5rem] border border-selah-border/20 shadow-lg"
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 ${
          language === 'EN' 
            ? 'bg-gradient-to-r from-[#00BFFF]/10 via-[#87CEEB]/5 to-[#00BFFF]/10' 
            : 'bg-gradient-to-r from-selah-orange/10 via-selah-yellow/5 to-selah-orange/10'
        }`} />
        
        {/* Decorative dots */}
        <div className="absolute top-4 right-8 w-3 h-3 rounded-full bg-selah-orange/20 animate-pulse" />
        <div className="absolute bottom-6 left-12 w-2 h-2 rounded-full bg-[#00BFFF]/30 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 p-8 md:p-10">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${
              language === 'EN'
                ? 'bg-[#00BFFF]/15 border border-[#00BFFF]/20'
                : 'bg-selah-orange/15 border border-selah-orange/20'
            }`}
          >
            <Globe size={32} className={language === 'EN' ? 'text-[#00BFFF]' : 'text-selah-orange'} />
          </motion.div>

          {/* Text */}
          <div className="flex-grow text-center sm:text-left">
            <h3 className="content-h3 text-selah-dark mb-1">
              {language === 'EN' 
                ? 'Do you speak Spanish?' 
                : '¿Hablas Inglés?'}
            </h3>
            <p className="text-selah-muted body-text">
              {language === 'EN' 
                ? 'Check out our Spanish page!' 
                : '¡Visita nuestra página en inglés!'}
            </p>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSwitch}
            className={`shrink-0 flex items-center gap-2 px-8 py-4 rounded-2xl ui-button transition-all duration-300 shadow-md hover:shadow-lg ${
              language === 'EN' 
                ? 'bg-[#00BFFF] text-white hover:bg-[#00BFFF]/90' 
                : 'bg-selah-orange text-white hover:bg-selah-orange/90'
            }`}
          >
            {language === 'EN' ? 'View in Spanish' : 'Watch in English'}
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};
