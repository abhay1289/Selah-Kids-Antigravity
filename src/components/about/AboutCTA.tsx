"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '../UI';

export const AboutCTA = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-20 mb-20 relative z-10">
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
            Join Our Growing Family
          </h2>
          <p className="text-white/90 mb-16 body-text max-w-2xl">
            We're just getting started on this incredible journey. Subscribe and be part of the Selah Kids community today!
          </p>
          <Button 
            icon={ArrowRight}
            onClick={() => window.open("https://www.youtube.com/@selahkidsworship", "_blank")}
            className="!bg-white hover:!bg-selah-dark !text-selah-dark hover:!text-white !border-none !px-16 !py-8 !text-2xl transition-all duration-500 hover:scale-105 whitespace-nowrap shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
          >
            Explore Our Videos
          </Button>
        </div>
      </motion.div>
    </section>
  );
};
