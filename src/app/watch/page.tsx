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
    date: "Dec 2024",
    description: "Join Andy, Libni, and Shiloh in their very first adventure as they learn about God's amazing love for us!",
    category: "music",
    categoryLabel: "Music Video",
    language: "EN",
    gradient: "from-[#FF7F50] to-[#FF5C00]",
    img: "/thumb-good-news-en.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },
  {
    id: 2,
    title: "The Good News | Sing-Along",
    date: "Dec 2024",
    description: "Sing along with the lyrics on screen to the catchy theme song from The Good News episode!",
    category: "singalong",
    categoryLabel: "Sing-Along",
    language: "EN",
    gradient: "from-[#E6E6FA] to-[#D8BFD8]",
    img: "/thumb-good-news-singalong-en.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },
  {
    id: 3,
    title: "The Good News | Sensory",
    date: "Dec 2024",
    description: "A calming sensory video with gentle music from The Good News to help kids relax and unwind.",
    category: "sensory",
    categoryLabel: "Sensory",
    language: "EN",
    gradient: "from-[#98FF98] to-[#93D35C]",
    img: "/thumb-sensory-good-news-en.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },
  {
    id: 4,
    title: "This Is How We Praise The Lord",
    date: "Mar 2025",
    description: "A high-energy sing-along that gets kids moving and praising God with all their heart!",
    category: "music",
    categoryLabel: "Music Video",
    language: "EN",
    gradient: "from-[#FF69B4] to-[#FF1493]",
    img: "/thumb-praise-lord-en.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },
  {
    id: 5,
    title: "This Is How We Praise The Lord | Sing-Along",
    date: "Mar 2025",
    description: "Follow along with the lyrics and sing This Is How We Praise The Lord with your family!",
    category: "singalong",
    categoryLabel: "Sing-Along",
    language: "EN",
    gradient: "from-[#00BFFF] to-[#87CEEB]",
    img: "/thumb-praise-lord-singalong-en.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },
  {
    id: 6,
    title: "This Is How We Praise The Lord | Sensory",
    date: "Mar 2025",
    description: "A soothing sensory video featuring gentle visuals and the praise song for a calming worship experience.",
    category: "sensory",
    categoryLabel: "Sensory",
    language: "EN",
    gradient: "from-[#98FF98] to-[#93D35C]",
    img: "/thumb-praise-dance-sensory-en.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },
  {
    id: 7,
    title: "I Am Blessed",
    date: "Apr 2025",
    description: "A wonderful reminder that we are blessed by God! Sing along with Andy and Libni in this uplifting song.",
    category: "music",
    categoryLabel: "Music Video",
    language: "EN",
    gradient: "from-[#FFD700] to-[#FEB835]",
    img: "/thumb-i-am-blessed-en.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },

  // ── Spanish Videos ──
  {
    id: 8,
    title: "Jesús Me Ama",
    date: "Dic 2024",
    description: "¡Únete a Andy, Libni y Shiloh mientras aprenden sobre el asombroso amor de Dios por nosotros!",
    category: "music",
    categoryLabel: "Video Musical",
    language: "ES",
    gradient: "from-[#FF7F50] to-[#FF5C00]",
    img: "/thumb-jesus-me-ama-es.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },
  {
    id: 9,
    title: "Jesús Me Ama | Canta Conmigo",
    date: "Dic 2024",
    description: "¡Canta junto con las letras en pantalla esta hermosa canción de adoración para niños!",
    category: "singalong",
    categoryLabel: "Videos Con Letras",
    language: "ES",
    gradient: "from-[#E6E6FA] to-[#D8BFD8]",
    img: "/thumb-jesus-me-ama-singalong-es.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },
  {
    id: 10,
    title: "Jesús Me Ama | Sensorial",
    date: "Dic 2024",
    description: "Un video sensorial relajante con música suave y animaciones gentiles para momentos de tranquilidad.",
    category: "sensory",
    categoryLabel: "Sensorial",
    language: "ES",
    gradient: "from-[#98FF98] to-[#93D35C]",
    img: "/thumb-sensory-fruto-es.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },
  {
    id: 11,
    title: "Así Le Adoramos",
    date: "Mar 2025",
    description: "¡Una canción llena de energía que hace que los niños se muevan y alaben a Dios con todo su corazón!",
    category: "music",
    categoryLabel: "Video Musical",
    language: "ES",
    gradient: "from-[#FF69B4] to-[#FF1493]",
    img: "/thumb-asi-le-adoramos-es.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },
  {
    id: 12,
    title: "Así Le Adoramos | Canta Conmigo",
    date: "Mar 2025",
    description: "¡Sigue las letras y canta Así Le Adoramos junto con tu familia!",
    category: "singalong",
    categoryLabel: "Videos Con Letras",
    language: "ES",
    gradient: "from-[#00BFFF] to-[#87CEEB]",
    img: "/thumb-asi-le-adoramos-singalong-es.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },
  {
    id: 13,
    title: "Así Le Adoramos | Sensorial",
    date: "Mar 2025",
    description: "Un video sensorial relajante con la canción Así Le Adoramos para una experiencia de adoración calmante.",
    category: "sensory",
    categoryLabel: "Sensorial",
    language: "ES",
    gradient: "from-[#98FF98] to-[#93D35C]",
    img: "/thumb-asi-le-adoramos-sensory-es.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
  },
  {
    id: 14,
    title: "Bendecido Estoy",
    date: "Abr 2025",
    description: "¡Un hermoso recordatorio de que somos bendecidos por Dios! Canta junto con Andy y Libni.",
    category: "music",
    categoryLabel: "Video Musical",
    language: "ES",
    gradient: "from-[#FFD700] to-[#FEB835]",
    img: "/thumb-bendecido-estoy-es.jpg",
    youtubeUrl: "https://www.youtube.com/watch?v=PLACEHOLDER"
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
