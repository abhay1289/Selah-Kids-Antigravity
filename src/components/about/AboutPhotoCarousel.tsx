'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '../../contexts/LanguageContext';

const photosRow1 = ['/rroque_ALA_Shot1020_v01.png', '/TGN_SingleFrames+(3).jpg', '/rroque_ALA_Shot1040_v01.png', '/rroque_ALA_Shot1040_v02.png', '/TGN_SingleFrames+(7).jpg', '/rroque_ALA_Shot1050_v02.png', '/rroque_ALA_Shot1060_v02.png'];
const photosRow2 = ['/TGN_SingleFrames+(9).jpg', '/rroque_ALA_Shot1130_v01.png', '/rroque_ALA_Shot1190_v01.png', '/TGN_SingleFrames+28229.jpg', '/rroque_ALA_Shot1200_v02.png', '/TGN_SingleFrames+28329.jpg', '/rroque_ALA_Shot1260_v01.png', '/TGN_SingleFrames+28729.jpg'];

const PhotoCard = ({ src, index, onOpen }: { src: string; index: number; onOpen: (src: string) => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ rotateX: (y - 0.5) * -12, rotateY: (x - 0.5) * 12 });
    setGlare({ x: x * 100, y: y * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setGlare({ x: 50, y: 50 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(src)}
      className="relative flex-shrink-0 w-[260px] h-[170px] md:w-[340px] md:h-[220px] lg:w-[400px] lg:h-[250px] rounded-2xl overflow-hidden group cursor-pointer"
      style={{ margin: '0 12px', perspective: '800px', transformStyle: 'preserve-3d' }}
      animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.04 }}
    >
      <Image src={src} alt={`Behind the scenes photo ${index + 1}`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="(max-width: 768px) 260px, (max-width: 1024px) 340px, 400px" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)` }} />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20"><ZoomIn className="w-5 h-5 text-white" /></div>
      </div>
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/30 group-hover:shadow-[0_0_30px_rgba(255,92,0,0.15)] transition-all duration-500" />
    </motion.div>
  );
};

const Lightbox = ({ src, onClose }: { src: string | null; onClose: () => void }) => {
  const { t } = useLanguage();
  return (
    <AnimatePresence>
      {src && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-xl cursor-pointer" onClick={onClose}>
          <motion.button initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors backdrop-blur-sm cursor-pointer z-10" onClick={onClose} aria-label="Close lightbox">
            <X className="w-6 h-6" />
          </motion.button>
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 25 }} className="relative w-[90vw] h-[80vh] max-w-[1200px] rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <Image src={src} alt="Full view" fill className="object-contain" priority />
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.4 }} className="absolute bottom-6 text-white/50 text-sm font-sans">
            {t("Click anywhere to close", "Haz clic en cualquier lugar para cerrar")}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const AboutPhotoCarousel = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const headerY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const row1Items = [...photosRow1, ...photosRow1, ...photosRow1, ...photosRow1, ...photosRow1];
  const row2Items = [...photosRow2, ...photosRow2, ...photosRow2, ...photosRow2, ...photosRow2];

  const openLightbox = useCallback((src: string) => { setLightboxSrc(src); document.body.style.overflow = 'hidden'; }, []);
  const closeLightbox = useCallback(() => { setLightboxSrc(null); document.body.style.overflow = ''; }, []);

  return (
    <>
      <section ref={sectionRef} className="py-12 md:py-16 bg-selah-bg relative overflow-hidden" id="photo-carousel">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-selah-orange/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-selah-orange/20 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-selah-orange/[0.04] rounded-full blur-[100px]" />
          <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-selah-yellow/[0.06] rounded-full blur-[80px]" />
        </div>

        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="text-center mb-12 px-4 relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="ui-label text-selah-orange inline-block mb-4 tracking-[0.2em]">
            {t("Gallery", "Galería")}
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="content-h2 mb-4">
            {t("Behind the Scenes", "Detrás de Escenas")}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="body-text mx-auto text-center" style={{ maxWidth: '480px' }}>
            {t(
              "A glimpse into the making of Selah Kids — capturing the joy, creativity, and heart behind every episode.",
              "Un vistazo a la creación de Selah Kids — capturando la alegría, creatividad y corazón detrás de cada episodio."
            )}
          </motion.p>
        </motion.div>

        <div className="relative mb-6 md:mb-8">
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-selah-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-selah-bg to-transparent z-10 pointer-events-none" />
          <motion.div className="flex will-change-transform" animate={{ x: ['0%', '-50%'] }} transition={{ x: { repeat: Infinity, repeatType: 'loop', duration: 50, ease: 'linear' } }} style={{ width: 'max-content' }}>
            {row1Items.map((src, i) => (<PhotoCard key={`r1-${i}`} src={src} index={i} onOpen={openLightbox} />))}
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-selah-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-selah-bg to-transparent z-10 pointer-events-none" />
          <motion.div className="flex will-change-transform" animate={{ x: ['-50%', '0%'] }} transition={{ x: { repeat: Infinity, repeatType: 'loop', duration: 55, ease: 'linear' } }} style={{ width: 'max-content' }}>
            {row2Items.map((src, i) => (<PhotoCard key={`r2-${i}`} src={src} index={i} onOpen={openLightbox} />))}
          </motion.div>
        </div>
      </section>
      <Lightbox src={lightboxSrc} onClose={closeLightbox} />
    </>
  );
};
