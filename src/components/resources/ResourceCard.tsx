"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, ArrowRight, FileText, Sparkles, Eye } from 'lucide-react';
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

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
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
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.23, 1, 0.32, 1] as const }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onDownloadAction}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative group cursor-pointer col-span-1 bg-white rounded-[2rem] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-selah-dark/[0.06] transition-all duration-700 flex flex-col overflow-hidden"
    >
      {/* Holographic Glare Effect */}
      <motion.div 
        className="absolute inset-0 z-40 rounded-[2rem] pointer-events-none mix-blend-soft-light opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
        style={{ background: useTransform(() => `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.6) 0%, transparent 50%)`) }} 
      />

      {/* Image Container */}
      <div className="relative w-full h-64 overflow-hidden flex-shrink-0">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${resource.gradient} transition-all duration-700`} />
        
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-multiply pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

        {resource.img ? (
          <>
            <NextImage 
              src={resource.img} 
              alt={resource.title || "Resource"} 
              fill 
              className="object-contain p-6 transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1 z-10" 
            />
            {/* Soft shadow under the image */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/10 blur-xl rounded-full z-[5]" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText size={64} className="text-white/30" />
          </div>
        )}

        {/* Badges Row */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 + 0.3 }}
            className="px-4 py-2 bg-selah-orange text-white rounded-xl ui-label shadow-lg shadow-selah-orange/30 flex items-center gap-1.5"
          >
            <Sparkles size={12} />
            {resource.category}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 + 0.4 }}
            className="px-3.5 py-2 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl ui-label text-selah-dark border border-white/50"
          >
            {resource.type}
          </motion.div>
        </div>

        {/* Hover Preview Overlay */}
        <motion.div 
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-selah-dark/40 backdrop-blur-[2px] z-20 flex items-center justify-center"
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: isHovered ? 1 : 0.8 }}
            className="flex items-center gap-2.5 px-6 py-3 bg-white rounded-2xl shadow-2xl text-selah-dark ui-button"
          >
            <Eye size={18} className="text-selah-orange" />
            {t("Preview & Download", "Ver y Descargar")}
          </motion.div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-lg font-bold font-display text-selah-dark tracking-tight mb-2 leading-snug line-clamp-2">
            {resource.title}
          </h3>
          <p className="text-selah-muted text-sm leading-relaxed line-clamp-2 mb-5">
            {resource.description}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-selah-dark/[0.06] mt-auto">
          <motion.span 
            className="flex items-center gap-2 text-selah-orange ui-button font-semibold"
            animate={{ x: isHovered ? 4 : 0 }}
          >
            <Download size={16} strokeWidth={2.5} />
            {t("Download", "Descargar")}
            <motion.span animate={{ x: isHovered ? 4 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
              <ArrowRight size={16} strokeWidth={2.5} />
            </motion.span>
          </motion.span>
          <motion.div 
            animate={{ 
              scale: isHovered ? 1.15 : 1,
              rotate: isHovered ? 12 : 0 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-11 h-11 rounded-2xl bg-selah-orange/10 flex items-center justify-center group-hover:bg-selah-orange group-hover:text-white text-selah-orange transition-colors duration-500 shadow-sm"
          >
            <Download size={18} strokeWidth={2.5} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
