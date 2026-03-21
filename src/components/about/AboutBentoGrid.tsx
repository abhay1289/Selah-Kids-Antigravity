import React from 'react';
import { motion } from 'motion/react';
import { Music, Video } from 'lucide-react';
import { Badge } from '../UI';

export const AboutBentoGrid = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-20 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Bento 1: The Mission (Large) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-8 bg-selah-dark rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 flex flex-col justify-between relative overflow-hidden group min-h-[500px] md:min-h-[600px] shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
          <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-selah-orange/20 rounded-full blur-3xl opacity-30 group-hover:bg-selah-orange/40 transition-colors duration-700" />
          <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-selah-blue/20 rounded-full blur-3xl opacity-30 group-hover:bg-selah-blue/40 transition-colors duration-700" />
          
          <div className="relative z-10">
            <Badge color="yellow" className="mb-8 border-none shadow-lg">OUR MISSION</Badge>
            <h2 className="text-5xl md:text-6xl font-display text-white leading-[1.1] tracking-tight mb-8">
              Learning About God <br /> Through Fun Songs
            </h2>
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <p className="text-xl text-white/80 font-sans font-medium leading-relaxed">
              Started in 2024 by parents looking for better Christian media, Selah Kids! is a safe place for children to enjoy faith-based videos. We want kids and parents to get up, move, and worship God together with our catchy Sunday school songs.
            </p>
          </div>
        </motion.div>

        {/* Bento 2: Music & Joy (Tall) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-4 bg-selah-yellow rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px] md:min-h-[600px] shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-40 h-40 bg-white rounded-[2.5rem] flex items-center justify-center mb-10 shadow-xl rotate-3"
            >
              <Music size={64} className="text-selah-orange" />
            </motion.div>
            <h3 className="text-4xl font-display text-selah-dark leading-none mb-6">Sing & Dance</h3>
            <p className="text-selah-dark/80 font-sans font-medium text-lg">
              Catchy tunes that make learning about the Bible super fun!
            </p>
          </div>
        </motion.div>

        {/* Bento 3: Animation Quality (Wide) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-12 bg-white rounded-[3rem] md:rounded-[4rem] border border-black/5 p-4 md:p-6 flex flex-col md:flex-row items-stretch gap-6 min-h-[500px] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] bg-selah-pink/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-full md:w-1/2 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative group">
            <img 
              src="/TGN_SingleFrames+28729.jpg" 
              alt="Beautiful Animation" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500">
              <Video size={16} className="text-selah-dark" />
              <span className="text-selah-dark text-sm font-accent font-bold tracking-widest uppercase">Beautiful Cartoons</span>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative z-10">
            <Badge color="orange" className="mb-6 self-start shadow-md">TOP QUALITY</Badge>
            <h2 className="text-5xl md:text-6xl font-display text-selah-dark mb-8 leading-[1.1] tracking-tight">
              Stunning Animation
            </h2>
            <p className="text-xl text-selah-muted font-sans font-medium leading-relaxed mb-12">
              Kids deserve the best! That's why our kids worship videos feature stunning animation made by amazing artists from around the world. Every colorful video is designed to catch your eye and make learning about Jesus fun and exciting.
            </p>
            
            <div className="flex items-center gap-12">
              <div className="group">
                <div className="text-6xl font-display text-selah-orange mb-2 group-hover:scale-110 transition-transform origin-left">4K</div>
                <div className="text-sm font-accent font-bold tracking-widest text-selah-muted uppercase">Resolution</div>
              </div>
              <div className="w-px h-16 bg-black/10" />
              <div className="group">
                <div className="text-6xl font-display text-selah-light mb-2 group-hover:scale-110 transition-transform origin-left">60</div>
                <div className="text-sm font-accent font-bold tracking-widest text-selah-muted uppercase">FPS</div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
