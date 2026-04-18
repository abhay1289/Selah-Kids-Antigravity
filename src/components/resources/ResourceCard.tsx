"use client";

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
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
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.23, 1, 0.32, 1] as const }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onDownloadAction}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group cursor-pointer ${resource.featured ? 'md:col-span-2 md:row-span-2' : 'col-span-1 row-span-1'} bg-white rounded-[2.5rem] p-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-selah-dark/5 transition-shadow duration-500 flex flex-col`}
    >
      <motion.div 
        className="absolute inset-0 z-30 rounded-[2.5rem] pointer-events-none mix-blend-soft-light opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
        style={{ background: useTransform(() => `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.8) 0%, transparent 60%)`) }} 
      />

      <div className={`relative w-full ${resource.featured ? 'h-72' : 'h-56'} rounded-[2rem] bg-gradient-to-br ${resource.gradient} overflow-hidden shadow-inner mb-6 flex-shrink-0`}>
        {resource.img ? (
          <NextImage src={resource.img} alt={resource.title || "Resource"} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
        ) : (
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />
        )}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full ui-button text-white border border-white/30 shadow-sm">
            {resource.category}
          </div>
          <div className="px-4 py-1.5 bg-white shadow-sm rounded-full ui-label text-selah-dark">
            {resource.type}
          </div>
        </div>
      </div>

      <div className="px-4 pb-2 flex flex-col flex-grow overflow-hidden">
        <div className="flex-grow min-w-0">
          <h3 className={`content-h3 mb-2 leading-tight truncate`}>{resource.title}</h3>
          <p className="body-text !max-w-none mb-6 line-clamp-2">{resource.description}</p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-selah-dark/5 mt-auto">
          <span className="text-selah-dark ui-button">
            {t("Download", "Descargar")} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="w-10 h-10 rounded-full bg-selah-bg flex items-center justify-center group-hover:bg-selah-orange group-hover:text-white text-selah-dark transition-colors duration-300 shadow-sm border border-selah-dark/5">
            <Download size={16} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
