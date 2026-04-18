"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, FileText, ArrowUpRight } from 'lucide-react';
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

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

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
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] as const }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onDownloadAction}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative group cursor-pointer col-span-1 flex flex-col overflow-hidden rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_80px_-20px_rgba(255,92,0,0.18)] transition-all duration-700"
    >
      {/* ── Decorative corner accent ── */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-selah-orange/[0.06] via-transparent to-transparent rounded-bl-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-selah-orange/[0.04] via-transparent to-transparent rounded-tr-full pointer-events-none z-0" />

      {/* ─── Image Area ─── */}
      <div className="relative w-full h-72 overflow-hidden flex-shrink-0">
        {/* Gradient base */}
        <div className={`absolute inset-0 bg-gradient-to-br ${resource.gradient} transition-all duration-700`} />
        
        {/* Inner shadow for depth */}
        <div className="absolute inset-0 shadow-[inset_0_-40px_40px_-20px_rgba(0,0,0,0.06)] z-[6] pointer-events-none" />

        {/* Paper texture */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

        {resource.img ? (
          <>
            {/* Image — subtle blur always on, consistent feel */}
            <NextImage 
              src={resource.img} 
              alt={resource.title || "Resource"} 
              fill 
              className="object-contain p-8 blur-[3px] scale-[0.97] transition-all duration-700 ease-out z-10"
            />
            {/* Drop shadow under the image */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-6 bg-black/8 blur-xl rounded-full z-[5]" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText size={56} className="text-white/25" />
          </div>
        )}

        {/* Category Badge */}
        <motion.div 
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
          className="absolute top-5 left-5 z-30"
        >
          <div className="flex items-center gap-1.5 px-4 py-2 bg-selah-orange text-white rounded-2xl ui-label shadow-lg shadow-selah-orange/25">
            <Download size={12} />
            {resource.category}
          </div>
        </motion.div>

        {/* Type Badge */}
        <motion.div 
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.5 }}
          className="absolute top-5 right-5 z-30"
        >
          <div className="px-4 py-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl ui-label text-selah-dark border border-white/50">
            {resource.type}
          </div>
        </motion.div>

        {/* Hover CTA Overlay */}
        <motion.div 
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-selah-dark/30 backdrop-blur-[2px] z-20 flex items-center justify-center"
        >
          <motion.div 
            initial={{ scale: 0.85, y: 10 }}
            animate={{ scale: isHovered ? 1 : 0.85, y: isHovered ? 0 : 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="px-8 py-3.5 bg-white rounded-2xl shadow-[0_16px_40px_-8px_rgba(0,0,0,0.2)] text-selah-dark font-bold text-sm font-display tracking-tight flex items-center gap-2.5"
          >
            <Download size={16} className="text-selah-orange" />
            {t("Tap to Download", "Toca para Descargar")}
          </motion.div>
        </motion.div>
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 p-7 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-xl font-black font-display text-selah-dark tracking-tight mb-2.5 leading-snug line-clamp-2">
            {resource.title}
          </h3>
          <p className="text-selah-muted/80 text-[15px] leading-relaxed line-clamp-2 font-medium">
            {resource.description}
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="flex items-center justify-between pt-5 mt-6 border-t border-selah-dark/[0.05]">
          <motion.span 
            className="flex items-center gap-2 text-selah-orange font-bold text-sm font-display tracking-tight"
            animate={{ x: isHovered ? 2 : 0 }}
          >
            {t("Get this resource", "Obtener recurso")}
            <motion.span 
              animate={{ x: isHovered ? 6 : 0 }} 
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </motion.span>
          </motion.span>
          <motion.div 
            animate={{ 
              scale: isHovered ? 1.15 : 1,
              rotate: isHovered ? 8 : 0 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-11 h-11 rounded-2xl bg-selah-orange/10 flex items-center justify-center group-hover:bg-selah-orange group-hover:text-white text-selah-orange transition-all duration-500 shadow-sm"
          >
            <Download size={18} strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
