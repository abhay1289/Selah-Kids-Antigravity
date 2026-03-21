import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Handshake, Newspaper, Youtube, Instagram, Music } from 'lucide-react';

export const ContactSidebar = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-5 space-y-6"
    >
      {/* Contact Cards */}
      <motion.div whileHover={{ scale: 1.02, x: -10 }} className="bg-white rounded-[3rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex items-start gap-6 cursor-pointer group">
        <div className="w-16 h-16 rounded-[2rem] bg-[#00BFFF]/10 flex items-center justify-center flex-shrink-0 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
          <Mail size={32} className="text-[#00BFFF]" />
        </div>
        <div>
          <h3 className="text-2xl font-display text-selah-dark mb-2 group-hover:text-[#00BFFF] transition-colors">General Inquiries</h3>
          <a href="mailto:info.selahkids@gmail.com" className="text-lg text-selah-muted font-sans font-medium hover:text-selah-dark transition-colors">
            info.selahkids@gmail.com
          </a>
        </div>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02, x: -10 }} className="bg-white rounded-[3rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex items-start gap-6 cursor-pointer group">
        <div className="w-16 h-16 rounded-[2rem] bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
          <Handshake size={32} className="text-[#FFD700]" />
        </div>
        <div>
          <h3 className="text-2xl font-display text-selah-dark mb-2 group-hover:text-[#FFD700] transition-colors">Partnership & Ministry</h3>
          <a href="mailto:partners@selahkids.com" className="text-lg text-selah-muted font-sans font-medium hover:text-selah-dark transition-colors">
            partners@selahkids.com
          </a>
        </div>
      </motion.div>

      <motion.div whileHover={{ scale: 1.02, x: -10 }} className="bg-white rounded-[3rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex items-start gap-6 cursor-pointer group">
        <div className="w-16 h-16 rounded-[2rem] bg-[#FFB6C1]/10 flex items-center justify-center flex-shrink-0 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
          <Newspaper size={32} className="text-[#FF69B4]" />
        </div>
        <div>
          <h3 className="text-2xl font-display text-selah-dark mb-2 group-hover:text-[#FF69B4] transition-colors">Press & Media</h3>
          <a href="mailto:press@selahkids.com" className="text-lg text-selah-muted font-sans font-medium hover:text-selah-dark transition-colors">
            press@selahkids.com
          </a>
        </div>
      </motion.div>

      {/* Follow Us Box */}
      <div className="bg-selah-dark rounded-[3rem] p-10 text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] mt-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full pointer-events-none transition-transform duration-700 group-hover:scale-150" />
        
        <h3 className="text-3xl font-display text-white mb-8 relative z-10">Follow Us</h3>
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
      </div>
    </motion.div>
  );
};
