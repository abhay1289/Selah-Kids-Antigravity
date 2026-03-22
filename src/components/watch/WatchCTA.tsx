"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Youtube } from 'lucide-react';
import { Button } from '../UI';

export const WatchCTA = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-8 pb-8 relative z-10">
      <div className="bg-gradient-to-br from-selah-orange/10 to-selah-yellow/10 backdrop-blur-2xl rounded-[4rem] p-12 md:p-20 text-center shadow-[0_8px_32px_rgba(255,92,0,0.08)] border border-selah-orange/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#FF0000]/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-24 h-24 bg-selah-orange/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-selah-orange/20 shadow-xl"
          >
            <Youtube size={48} className="text-[#FF0000]" />
          </motion.div>
          <h2 className="content-h2 mb-6 tracking-tight">Want more videos?</h2>
          <p className="text-xl md:text-2xl text-selah-muted font-body italic mb-12 max-w-2xl mx-auto leading-relaxed">
            Subscribe to our YouTube channel to never miss a new release!
          </p>
          <Button 
            onClick={() => window.open("https://www.youtube.com/@selahkidsworship", "_blank")}
            className="!bg-[#FF0000] hover:!bg-white !text-white hover:!text-[#FF0000] !border-none !px-12 !py-6 !text-xl transition-all duration-500 hover:scale-105 shadow-[0_20px_40px_-15px_rgba(255,0,0,0.3)] hover:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.4)]"
          >
            Subscribe Now
          </Button>
        </div>
      </div>
    </section>
  );
};
