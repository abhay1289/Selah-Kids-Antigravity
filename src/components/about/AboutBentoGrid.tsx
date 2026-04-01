"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';
import { Music, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../UI';
import { staggerContainer, zoomInUp, rollIn, slideInRight, fadeIn } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';

const CAROUSEL_IMAGES = [
  { src: "/TGN_SingleFrames+28729.jpg", caption: "Colorful Character Design", captionEs: "Diseño de Personajes Colorido" },
  { src: "/TGN_SingleFrames+28229.jpg", caption: "Cinematic Storytelling", captionEs: "Narrativa Cinematográfica" },
  { src: "/TGN_SingleFrames+28329.jpg", caption: "Vibrant World-Building", captionEs: "Construcción de Mundos Vibrantes" },
];

const ImageCarousel = () => {
  const { language } = useLanguage();
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  const next = () => setCurrent((c) => (c + 1) % CAROUSEL_IMAGES.length);
  return (
    <div className="w-full h-full min-h-[400px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative group">
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
          <NextImage src={CAROUSEL_IMAGES[current].src} alt={CAROUSEL_IMAGES[current].caption} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
            <Video size={16} className="text-selah-dark" />
            <span className="text-selah-dark ui-label">{language === 'ES' ? CAROUSEL_IMAGES[current].captionEs : CAROUSEL_IMAGES[current].caption}</span>
          </div>
        </motion.div>
      </AnimatePresence>
      <button onClick={prev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronLeft size={18} className="text-selah-dark" />
      </button>
      <button onClick={next} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight size={18} className="text-selah-dark" />
      </button>
      <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} aria-label={`Photo ${i+1}`} className={`h-2 rounded-full transition-all ${i === current ? 'w-5 bg-white' : 'w-2 bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
};

export const AboutBentoGrid = () => {
  const { t } = useLanguage();
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12 md:py-16 relative z-10">
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8"
      >
        {/* Bento 1: The Mission (Large) */}
        <motion.div 
          variants={zoomInUp}
          className="md:col-span-8 bg-gradient-to-br from-selah-orange/90 via-[#FF7F50] to-selah-yellow rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 flex flex-col justify-between relative overflow-hidden group min-h-[500px] md:min-h-[600px] shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
          <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-selah-orange/20 rounded-full blur-3xl opacity-30 group-hover:bg-selah-orange/40 transition-colors duration-700" />
          <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-selah-blue/20 rounded-full blur-3xl opacity-30 group-hover:bg-selah-blue/40 transition-colors duration-700" />
          
          <div className="relative z-10">
            <Badge color="yellow" className="mb-8 border-none shadow-lg">{t("OUR MISSION", "NUESTRA MISIÓN")}</Badge>
            <h2 className="content-h2 text-white leading-[1.1] tracking-tight mb-8">
              {t("Learning About God", "Aprendiendo Sobre Dios")} <br /> {t("Through Worship & Song", "A Través de Adoración y Canción")}
            </h2>
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <p className="text-xl text-white/80 font-body italic leading-relaxed max-w-2xl">
              {t(
                "Started in 2024 by parents longing for better Christian media, Selah Kids! is a safe place for children to grow in faith. We create bilingual content — in English and Spanish — so families can sing, worship, and learn about God together.",
                "Iniciado en 2024 por padres que anhelaban mejores medios cristianos, ¡Selah Kids! es un lugar seguro para que los niños crezcan en la fe. Creamos contenido bilingüe — en inglés y español — para que las familias puedan cantar, adorar y aprender sobre Dios juntos."
              )}
            </p>
          </div>
        </motion.div>

        {/* Bento 2: Music & Joy (Tall) */}
        <motion.div 
          variants={rollIn}
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
            <h3 className="content-h2 leading-none mb-6">{t("Sing & Dance", "Canta y Baila")}</h3>
            <p className="text-selah-dark/80 body-text !max-w-none">
              {t(
                "Songs that make learning about the Bible meaningful and joyful.",
                "Canciones que hacen que aprender sobre la Biblia sea significativo y gozoso."
              )}
            </p>
          </div>
        </motion.div>

        {/* Bento 3: Animation Quality (Wide) */}
        <motion.div 
          variants={slideInRight}
          className="md:col-span-12 bg-white rounded-[3rem] md:rounded-[4rem] border border-black/5 p-4 md:p-6 flex flex-col md:flex-row items-stretch gap-6 min-h-[500px] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] bg-selah-pink/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-full md:w-1/2 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative" style={{minHeight: '400px'}}>
            <ImageCarousel />
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative z-10">
            <Badge color="orange" className="mb-6 self-start shadow-md">{t("TOP QUALITY", "MÁXIMA CALIDAD")}</Badge>
            <h2 className="content-h2 mb-8 leading-[1.1] tracking-tight">
              {t("Stunning Animation", "Animación Impresionante")}
            </h2>
            <p className="body-text !max-w-none leading-relaxed mb-6">
              {t(
                "Children deserve the very best. Our videos feature breathtaking animation crafted by talented artists from around the world, designed to spark imagination and bring biblical stories to life.",
                "Los niños merecen lo mejor. Nuestros videos presentan animación impresionante creada por artistas talentosos de todo el mundo, diseñada para despertar la imaginación y dar vida a las historias bíblicas."
              )}
            </p>
            <p className="body-text !max-w-none leading-relaxed mb-12">
              {t(
                "From vibrant character design to rich, detailed backgrounds — every visual is intentionally created to build a world where children love to return.",
                "Desde un diseño de personajes vibrante hasta fondos ricos y detallados — cada visual está creado intencionalmente para construir un mundo al que los niños aman regresar."
              )}
            </p>
            
            <div className="flex items-center gap-12">
              <div className="group">
                <div className="content-h2 mb-2 group-hover:scale-110 transition-transform origin-left">4K</div>
                <div className="ui-label text-selah-muted uppercase">{t("Resolution", "Resolución")}</div>
              </div>
              <div className="w-px h-16 bg-black/10" />
              <div className="group">
                <div className="content-h3 text-selah-light mb-2 group-hover:scale-110 transition-transform origin-left">60</div>
                <div className="ui-label text-selah-muted uppercase">FPS</div>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};
