"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Music } from 'lucide-react';
import { staggerContainer, slideInRight, fadeInRight } from '../../utils/animations';

export const ContactSidebar = () => {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="lg:col-span-5 space-y-6"
    >
      {/* Contact Cards */}
      <motion.div variants={slideInRight} whileHover={{ scale: 1.02, x: -10 }} className="bg-white rounded-[3rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer group">
        <h3 className="content-h2 mb-2 group-hover:text-[#00BFFF] transition-colors">General Inquiries</h3>
        <a href="mailto:info.selahkids@gmail.com" className="body-text hover:text-selah-dark transition-colors">
          info.selahkids@gmail.com
        </a>
      </motion.div>

      <motion.div variants={slideInRight} whileHover={{ scale: 1.02, x: -10 }} className="bg-white rounded-[3rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer group">
        <h3 className="content-h2 mb-2 group-hover:text-[#FFD700] transition-colors">Partnership & Ministry</h3>
        <a href="mailto:partners@selahkids.com" className="body-text hover:text-selah-dark transition-colors">
          partners@selahkids.com
        </a>
      </motion.div>

      <motion.div variants={slideInRight} whileHover={{ scale: 1.02, x: -10 }} className="bg-white rounded-[3rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer group">
        <h3 className="content-h2 mb-2 group-hover:text-[#FF69B4] transition-colors">Press & Media</h3>
        <a href="mailto:press@selahkids.com" className="body-text hover:text-selah-dark transition-colors">
          press@selahkids.com
        </a>
      </motion.div>

      {/* Follow Us Box */}
      <motion.div variants={fadeInRight} className="bg-gradient-to-br from-selah-orange to-selah-yellow rounded-[3rem] p-10 text-center shadow-[0_20px_40px_-15px_rgba(255,92,0,0.3)] mt-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full pointer-events-none transition-transform duration-700 group-hover:scale-150" />
        
        <h3 className="content-h3 text-white mb-8 relative z-10">Follow Us</h3>
        <div className="flex items-center justify-center gap-6 relative z-10">
          {[
            { icon: Youtube, color: "hover:bg-[#FF0000]", name: "YouTube" },
            { icon: Instagram, color: "hover:bg-[#E1306C]", name: "Instagram" },
            { icon: Music, color: "hover:bg-[#1DB954]", name: "Spotify" } // Spotify placeholder
          ].map((social, i) => (
            <button 
              key={i}
              aria-label={social.name}
              className={`w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-500 ${social.color} hover:scale-110 hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:-translate-y-2`}
            >
              <social.icon size={28} />
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
