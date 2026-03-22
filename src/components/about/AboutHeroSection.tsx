"use client";

import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { SparklesIcon, Cloud, Sun } from 'lucide-react';

interface AboutHeroSectionProps {
  scrollYProgress: MotionValue<number>;
}

export const AboutHeroSection = ({ scrollYProgress }: AboutHeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-48 md:pt-56 pb-20 px-6">
      {/* Storytelling Background - Paper Texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, -150]) }}
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[10%] text-selah-dark/5"
        >
          <Cloud size={140} fill="currentColor" />
        </motion.div>
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, -200]) }}
          animate={{ scale: [1, 1.05, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-48 right-[12%] text-selah-yellow/20"
        >
          <Sun size={180} fill="currentColor" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative inline-flex items-center gap-3 px-6 py-2.5 bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full mb-10 cursor-default overflow-hidden group hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-shadow duration-500"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent -skew-x-12"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
          />
          <SparklesIcon size={16} className="text-selah-orange relative z-10" />
          <span className="ui-label text-selah-dark/90 relative z-10">The Selah Kids Story</span>
        </motion.div>

        <h1 className="hero-headline mb-6 drop-shadow-sm flex flex-wrap justify-center gap-x-3 lg:gap-x-4">
          {["Fun", "Bible", "Songs"].map((word, i) => (
            <span key={i} className="overflow-hidden inline-block pb-2">
              <motion.span
                initial={{ y: "100%", opacity: 0, rotateZ: 5, scale: 0.9, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, rotateZ: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
                className="inline-block origin-bottom-left"
              >
                {word}
              </motion.span>
            </span>
          ))}
          <span className="w-full block h-0" />
          <span className="overflow-hidden inline-block pb-4">
            <motion.span
              initial={{ y: "100%", opacity: 0, filter: "blur(10px)", scale: 0.9 }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              className="inline-block tracking-tight"
            >
              & Christian <span>Cartoons</span>
            </motion.span>
          </span>
        </h1>

        <motion.p 
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="body-text mx-auto text-center mb-8"
        >
          We are parents and creators making the best Christian kids music and faith-based videos. Our goal is to help your family sing, dance, and learn about God together!
        </motion.p>
      </div>
    </section>
  );
};
