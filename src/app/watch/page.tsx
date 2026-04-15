'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WatchHero } from '../../components/watch/WatchHero';
import { WatchCategories } from '../../components/watch/WatchCategories';
import { WatchGrid } from '../../components/watch/WatchGrid';
import { WatchCTA } from '../../components/watch/WatchCTA';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/UI';

const sectionEntrance = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const VIDEOS = [
  // ── English Videos ──
  {
    id: 1,
    title: "The Good News",
    date: "March 20, 2026",
    description: "Join Andy, Libni, and Shiloh in their very first adventure as they learn about God's amazing love for us!",
    category: "cartoons",
    categoryLabel: "Cartoon",
    language: "EN",
    gradient: "from-[#FF7F50] to-[#FF5C00]",
    img: "/TGN_SingleFrames+(3).jpg"
  },
  {
    id: 2,
    title: "Jesus Loves Me",
    date: "March 15, 2026",
    description: "A fun and upbeat modern rendition of the classic Sunday school song, perfect for young voices.",
    category: "music",
    categoryLabel: "Music Video",
    language: "EN",
    gradient: "from-[#00BFFF] to-[#87CEEB]",
    img: "/rroque_ALA_Shot1050_v02.png"
  },
  {
    id: 3,
    title: "God is So Good",
    date: "March 10, 2026",
    description: "Sing along with our beautiful acoustic version of this beloved worship chorus.",
    category: "singalong",
    categoryLabel: "Sing-Along",
    language: "EN",
    gradient: "from-[#FF69B4] to-[#FF1493]",
    img: "/TGN_SingleFrames+(7).jpg"
  },
  {
    id: 4,
    title: "Peaceful Garden",
    date: "March 5, 2026",
    description: "A calming sensory video featuring gentle music and floating animations to help kids relax.",
    category: "sensory",
    categoryLabel: "Sensory",
    language: "EN",
    gradient: "from-[#98FF98] to-[#93D35C]",
    img: "/rroque_ALA_Shot1190_v01.png"
  },
  {
    id: 5,
    title: "He's Got The Whole World",
    date: "March 1, 2026",
    description: "A wonderful reminder of God's care for all creation in this classic worship song.",
    category: "music",
    categoryLabel: "Music Video",
    language: "EN",
    gradient: "from-[#00BFFF] to-[#87CEEB]",
    img: "/TGN_SingleFrames+(9).jpg"
  },

  // ── Spanish Videos ──
  {
    id: 6,
    title: "Las Buenas Nuevas",
    date: "20 de Marzo, 2026",
    description: "¡Únete a Andy, Libni y Shiloh en su primera aventura mientras aprenden sobre el asombroso amor de Dios por nosotros!",
    category: "cartoons",
    categoryLabel: "Caricatura",
    language: "ES",
    gradient: "from-[#FF7F50] to-[#FF5C00]",
    img: "/TGN_SingleFrames+(3).jpg"
  },
  {
    id: 7,
    title: "Dios Es Tan Bueno",
    date: "15 de Marzo, 2026",
    description: "Canta con nosotros esta hermosa versión acústica de este amado coro de adoración.",
    category: "singalong",
    categoryLabel: "Canta Conmigo",
    language: "ES",
    gradient: "from-[#FF69B4] to-[#FF1493]",
    img: "/rroque_ALA_Shot1130_v01.png"
  },
  {
    id: 8,
    title: "Jardín de Calma y Paz",
    date: "8 de Marzo, 2026",
    description: "Un video sensorial relajante con música suave y animaciones gentiles para momentos de tranquilidad.",
    category: "sensory",
    categoryLabel: "Sensorial",
    language: "ES",
    gradient: "from-[#98FF98] to-[#93D35C]",
    img: "/TGN_SingleFrames+(7).jpg"
  },
  {
    id: 9,
    title: "Él Tiene al Mundo Entero",
    date: "5 de Marzo, 2026",
    description: "Un hermoso recordatorio del cuidado de Dios por toda la creación en este clásico canto de adoración.",
    category: "music",
    categoryLabel: "Video Musical",
    language: "ES",
    gradient: "from-[#00BFFF] to-[#87CEEB]",
    img: "/rroque_ALA_Shot1200_v02.png"
  },
  {
    id: 10,
    title: "Jesús Me Ama",
    date: "1 de Marzo, 2026",
    description: "La versión en español de nuestro querido himno clásico que a los niños les encantará cantar.",
    category: "music",
    categoryLabel: "Video Musical",
    language: "ES",
    gradient: "from-[#FF7F50] to-[#FF5C00]",
    img: "/rroque_ALA_Shot1050_v02.png"
  }
];

export default function WatchPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { language, setLanguage } = useLanguage();

  const filteredVideos = VIDEOS.filter(video => 
    video.language === language && (activeCategory === 'all' || video.category === activeCategory)
  );

  return (
    <div className="bg-gradient-to-b from-[#FFF5EE] via-white to-[#FFF8F0] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden">
      {/* Cinematic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-selah-orange/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-selah-yellow/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionEntrance}>
        <WatchHero />
      </motion.div>
      
      {/* Filter Bar */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl py-4 mb-12 border-b border-selah-orange/10">
        <WatchCategories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </div>

      {/* Notice Blurb */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionEntrance} className="max-w-4xl mx-auto px-6 mb-12 text-center">
        {language === 'EN' ? (
          <p className="text-selah-dark bg-selah-orange/10 rounded-2xl p-6 m-0 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-sm border border-selah-orange/20">
            <span className="font-medium text-lg">Do you speak Spanish? Check out our Spanish page!</span>
            <Button variant="primary" onClick={() => setLanguage('ES')} className="!py-2 !px-6 hover:scale-105 transition-transform">
              🇪🇸 Switch to Spanish
            </Button>
          </p>
        ) : (
          <p className="text-selah-dark bg-selah-orange/10 rounded-2xl p-6 m-0 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-sm border border-selah-orange/20">
            <span className="font-medium text-lg">¿Hablas inglés? ¡Visita nuestra página en inglés!</span>
            <Button variant="primary" onClick={() => setLanguage('EN')} className="!py-2 !px-6 hover:scale-105 transition-transform">
              🇺🇸 Cambiar a Inglés
            </Button>
          </p>
        )}
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionEntrance}>
        <WatchGrid filteredVideos={filteredVideos} />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <WatchCTA />
      </motion.div>
    </div>
  );
}
