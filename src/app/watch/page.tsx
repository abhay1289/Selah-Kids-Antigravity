'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WatchHero } from '../../components/watch/WatchHero';
import { WatchCategories } from '../../components/watch/WatchCategories';
import { WatchGrid } from '../../components/watch/WatchGrid';
import { WatchCTA } from '../../components/watch/WatchCTA';
import { WatchLanguageBanner } from '../../components/watch/WatchLanguageBanner';
import { useLanguage } from '../../contexts/LanguageContext';

const sectionEntrance = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const VIDEOS = [
  {
    id: 1,
    title: "Jesus Loves Me",
    date: "March 15, 2026",
    description: "An upbeat version of the classic hymn that kids will love to sing along to.",
    category: "music",
    categoryLabel: "Music Video",
    language: "EN",
    gradient: "from-[#FF7F50] to-[#FF5C00]",
    img: "/TGN_SingleFrames+28729.jpg"
  },
  {
    id: 2,
    title: "Jesús Me Ama",
    date: "March 12, 2026",
    description: "La versión en español de nuestro querido video musical 'Jesus Loves Me'.",
    category: "music",
    categoryLabel: "Video Musical",
    language: "ES",
    gradient: "from-[#00BFFF] to-[#87CEEB]",
    img: "/TGN_SingleFrames+28329.jpg"
  },
  {
    id: 3,
    title: "The Fruit of the Spirit",
    date: "March 10, 2026",
    description: "Learn about love, joy, peace, and more in this catchy song based on Galatians 5:22-23.",
    category: "singalong",
    categoryLabel: "Sing-Along",
    language: "EN",
    gradient: "from-[#FFD700] to-[#FEB835]",
    img: "/TGN_SingleFrames+28229.jpg"
  },
  {
    id: 4,
    title: "Calm & Peaceful Garden",
    date: "March 8, 2026",
    description: "A relaxing sensory video featuring soft music and gentle animations for quiet time.",
    category: "sensory",
    categoryLabel: "Sensory",
    language: "EN",
    gradient: "from-[#98FF98] to-[#93D35C]",
    img: "/TGN_SingleFrames+28729.jpg"
  },
  {
    id: 5,
    title: "He's Got the Whole World",
    date: "March 5, 2026",
    description: "A beautiful reminder of God's care for all of creation in this classic worship song.",
    category: "music",
    categoryLabel: "Music Video",
    language: "EN",
    gradient: "from-[#FF7F50] to-[#FF5C00]",
    img: "/TGN_SingleFrames+28229.jpg"
  },
  {
    id: 6,
    title: "This Little Light of Mine",
    date: "March 1, 2026",
    description: "Encouraging children to let their light shine for Jesus every day through music.",
    category: "singalong",
    categoryLabel: "Sing-Along",
    language: "EN",
    gradient: "from-[#FFD700] to-[#FEB835]",
    img: "/TGN_SingleFrames+28329.jpg"
  },
  {
    id: 7,
    title: "El Fruto del Espíritu",
    date: "March 10, 2026",
    description: "Aprende sobre el amor, la alegría, la paz y más con esta canción pegadiza basada en Gálatas 5:22-23.",
    category: "singalong",
    categoryLabel: "Canta Conmigo",
    language: "ES",
    gradient: "from-[#FFD700] to-[#FEB835]",
    img: "/TGN_SingleFrames+28229.jpg"
  },
  {
    id: 8,
    title: "Jardín de Calma y Paz",
    date: "March 8, 2026",
    description: "Un video sensorial relajante con música suave y animaciones gentiles para momentos de tranquilidad.",
    category: "sensory",
    categoryLabel: "Sensorial",
    language: "ES",
    gradient: "from-[#98FF98] to-[#93D35C]",
    img: "/TGN_SingleFrames+28729.jpg"
  },
  {
    id: 9,
    title: "Él Tiene al Mundo Entero",
    date: "March 5, 2026",
    description: "Un hermoso recordatorio del cuidado de Dios por toda la creación en este clásico canto de adoración.",
    category: "music",
    categoryLabel: "Video Musical",
    language: "ES",
    gradient: "from-[#FF7F50] to-[#FF5C00]",
    img: "/TGN_SingleFrames+28229.jpg"
  },
  {
    id: 10,
    title: "Esta Lucecita Mía",
    date: "March 1, 2026",
    description: "Animando a los niños a dejar brillar su luz por Jesús cada día a través de la música.",
    category: "singalong",
    categoryLabel: "Canta Conmigo",
    language: "ES",
    gradient: "from-[#FFD700] to-[#FEB835]",
    img: "/TGN_SingleFrames+28329.jpg"
  }
];

export default function WatchPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { language } = useLanguage();

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

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={sectionEntrance}>
        <WatchGrid filteredVideos={filteredVideos} />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <WatchLanguageBanner />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <WatchCTA />
      </motion.div>
    </div>
  );
}
