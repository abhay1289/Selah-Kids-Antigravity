"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { Download, FileText, ArrowUpRight, Clock } from 'lucide-react';
import NextImage from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';

interface ResourceCardProps {
  resource: any;
  index: number;
  onDownloadAction: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, index, onDownloadAction }) => {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  // Spotlight tracking
  const spotX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const spotY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightBg = useMotionTemplate`radial-gradient(500px circle at ${spotX} ${spotY}, rgba(255,92,0,0.06), transparent 60%)`;

  // Border glow tracking
  const borderGlow = useMotionTemplate`radial-gradient(400px circle at ${spotX} ${spotY}, rgba(255,92,0,0.15), transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={resource.comingSoon ? undefined : onDownloadAction}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group col-span-1 flex flex-col bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-3 border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-700 ${resource.comingSoon ? 'cursor-default' : 'cursor-pointer hover:shadow-[0_40px_100px_-20px_rgba(255,92,0,0.15)]'}`}
    >
      {/* ── Mouse-tracking spotlight overlay ── */}
      <motion.div 
        className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: spotlightBg }}
      />
      {/* ── Mouse-tracking border glow ── */}
      <motion.div 
        className="absolute -inset-px rounded-[2.5rem] pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: borderGlow, mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', maskComposite: 'xor', WebkitMaskComposite: 'xor', padding: '1px' }}
      />

      {/* ─── Image Island Container ─── */}
      <div className="relative w-full h-[260px] rounded-[2rem] overflow-hidden flex-shrink-0 shadow-inner z-[2]">
        {/* Colorful Gradient Wash Base */}
        <div className={`absolute inset-0 bg-gradient-to-br ${resource.gradient} opacity-90 transition-opacity duration-700 group-hover:opacity-100`} />
        
        {/* Depth shadow inside the image island */}
        <div className="absolute inset-0 shadow-[inset_0_4px_30px_rgba(0,0,0,0.08)] pointer-events-none z-[2]" />
        
        {/* Subtle Paper Texture */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-multiply pointer-events-none z-[3]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

        {/* Shimmer sweep on hover */}
        <motion.div
          initial={{ x: "-120%", opacity: 0 }}
          animate={{ x: isHovered ? "120%" : "-120%", opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent z-[15] pointer-events-none skew-x-[-20deg]"
        />

        {resource.img ? (
          <motion.div
             animate={{ scale: isHovered ? 1.06 : 1, rotate: isHovered ? 1 : 0 }}
             transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
             className="absolute inset-0 flex items-center justify-center p-6 z-[4]"
          >
            <div className="relative w-full h-full">
              <NextImage 
                src={resource.img} 
                alt={resource.title || "Resource"} 
                fill 
                className="object-contain filter blur-[2px] group-hover:blur-[2px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] transition-all duration-700"
              />
            </div>
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center z-[4]">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center">
              <FileText size={40} className="text-white/60" />
            </div>
          </div>
        )}

        {/* Coming Soon Badge */}
        {resource.comingSoon && (
          <div className="absolute inset-0 z-30 flex items-center justify-center">
            <div className="px-6 py-3 bg-selah-orange text-white rounded-full shadow-[0_16px_40px_-8px_rgba(255,92,0,0.4)] font-bold text-[13px] font-display tracking-tight flex items-center gap-2 uppercase">
              <Clock size={15} strokeWidth={2.5} />
              {t("Coming Soon", "Próximamente")}
            </div>
          </div>
        )}

        {/* Hover Dark Overlay inside the Island */}
        {!resource.comingSoon && (
          <motion.div 
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-selah-dark/20 backdrop-blur-[1px] z-20 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.85, y: 10 }}
              animate={{ scale: isHovered ? 1 : 0.85, y: isHovered ? 0 : 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="px-6 py-3 bg-white/95 backdrop-blur-xl rounded-full shadow-[0_16px_40px_-8px_rgba(0,0,0,0.3)] text-selah-dark font-bold text-[13px] font-display tracking-tight flex items-center gap-2"
            >
              <Download size={15} className="text-selah-orange" strokeWidth={2.5} />
              {t("Tap to Download", "Toca para Descargar")}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* ─── Clean Content Section ─── */}
      <div className="relative z-10 px-6 pt-6 pb-5 flex flex-col flex-grow">
        <div className="flex-grow">
          {/* Sleek Enterprise Category Tag */}
          <motion.div 
            className="mb-2.5"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <span className="inline-block px-2.5 py-1 bg-selah-orange/[0.08] text-selah-orange rounded border border-selah-orange/10 text-[9px] uppercase font-black tracking-[0.15em] shrink-0">
              {resource.category}
            </span>
          </motion.div>

          <h3 className="text-[22px] font-black font-display text-selah-dark tracking-tight mb-2 leading-snug line-clamp-2 group-hover:text-selah-orange transition-colors duration-400">
            {resource.title}
          </h3>
          <p className="text-selah-muted/70 text-[15px] leading-relaxed line-clamp-2 font-medium pr-2">
            {resource.description}
          </p>
        </div>

        {/* Action Bottom Row */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-selah-dark/[0.04]">
           <motion.span 
            className="flex items-center gap-1.5 text-selah-orange font-bold text-[14px] font-display tracking-tight"
            animate={{ x: isHovered ? 4 : 0 }}
          >
            {resource.comingSoon ? t("Coming Soon", "Próximamente") : t("Get this resource", "Obtener recurso")}
            <motion.span 
              animate={{ x: isHovered ? 4 : 0 }} 
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {resource.comingSoon ? <Clock size={15} strokeWidth={3} /> : <ArrowUpRight size={15} strokeWidth={3} />}
            </motion.span>
          </motion.span>
          <motion.div 
            animate={{ 
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 6 : 0,
              backgroundColor: isHovered && !resource.comingSoon ? '#FF5C00' : 'rgba(255,92,0,0.06)',
              color: isHovered && !resource.comingSoon ? '#FFFFFF' : '#FF5C00'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
          >
            {resource.comingSoon ? <Clock size={18} strokeWidth={2.5} /> : <Download size={18} strokeWidth={2.5} />}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
