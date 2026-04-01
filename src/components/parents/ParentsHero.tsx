"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, BookOpen, Smile } from 'lucide-react';
import { Badge } from '../UI';

export const ParentsHero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
      <div className="flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2 text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Badge color="yellow" className="mb-6 shadow-sm">PEACE OF MIND</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm"
          >
            Built for Kids. <span className="text-selah-muted">Trusted by Parents.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="body-text max-w-3xl mx-auto leading-relaxed tracking-tight mb-8"
          >
            We created Selah Kids because we're parents too. We know how hard it is to find high-quality, safe, and faith-filled media for little ones. Our content is designed to nurture children wholistically — spirit, mind, and heart — through music, stories, and worship.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: 6 }}
          animate={{ opacity: 1, scale: 1, rotate: 3 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-1/2 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-selah-yellow/20 to-selah-orange/20 rounded-[3rem] blur-3xl transform -rotate-6 scale-105" />
          <div className="relative bg-white rounded-[3rem] p-12 shadow-2xl border border-black/5 transform hover:rotate-0 transition-transform duration-700">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-[#00BFFF]/10 rounded-3xl p-6 aspect-square flex items-center justify-center"
                >
                  <Shield size={48} className="text-[#00BFFF]" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="bg-[#FF69B4]/10 rounded-3xl p-6 aspect-square flex items-center justify-center"
                >
                  <Heart size={48} className="text-[#FF69B4]" />
                </motion.div>
              </div>
              <div className="space-y-6 mt-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="bg-selah-yellow/10 rounded-3xl p-6 aspect-square flex items-center justify-center"
                >
                  <BookOpen size={48} className="text-selah-yellow" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="bg-[#98FF98]/20 rounded-3xl p-6 aspect-square flex items-center justify-center"
                >
                  <Smile size={48} className="text-[#93D35C]" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
