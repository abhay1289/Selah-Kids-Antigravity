'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../../components/UI';
import { ResourcesHero } from '../../components/resources/ResourcesHero';
import { ResourceCard } from '../../components/resources/ResourceCard';
import { useLanguage } from '../../contexts/LanguageContext';

const CATEGORIES = ['All', 'Printables', 'Lessons'];

const RESOURCES = [
  {
    id: 1,
    title: "Bible Verse Memory Cards",
    description: "A set of 10 beautifully illustrated memory verse cards to help kids learn Scripture.",
    type: "PDF",
    category: "Printables",
    gradient: "from-[#FFD700] to-[#FEB835]",
    featured: true,
  },
  {
    id: 2,
    title: "Andy Coloring Page",
    description: "A colorful coloring page featuring Andy and his pet sheep, Shiloh.",
    type: "PDF",
    category: "Printables",
    gradient: "from-[#00BFFF] to-[#87CEEB]",
    featured: false,
  },
  {
    id: 3,
    title: "Libni Coloring Page",
    description: "Color in Libni as she dances and sings her favorite worship songs.",
    type: "PDF",
    category: "Printables",
    gradient: "from-[#FFB6C1] to-[#FF69B4]",
    featured: false,
  },
  {
    id: 4,
    title: "Sunday School Guide",
    description: "A 4-week curriculum guide using Selah Kids videos for children's ministry.",
    type: "PDF",
    category: "Lessons",
    gradient: "from-[#98FF98] to-[#93D35C]",
    featured: true,
  },
  {
    id: 5,
    title: "Family Devotional",
    description: "A week of daily devotionals designed to help families worship and learn together.",
    type: "PDF",
    category: "Lessons",
    gradient: "from-[#FF7F50] to-[#FF5C00]",
    featured: false,
  },
  {
    id: 6,
    title: "Fruit of the Spirit Activity Sheet",
    description: "An engaging activity sheet teaching kids about the fruit of the Spirit with puzzles and coloring.",
    type: "PDF",
    category: "Printables",
    gradient: "from-[#E6E6FA] to-[#D8BFD8]",
    featured: false,
  }
];

export default function ResourcesPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredResources = RESOURCES.filter(res => 
    activeCategory === 'All' ? true : res.category === activeCategory
  );

  return (
    <div className="bg-gradient-to-b from-[#FFF8EE] via-selah-bg to-[#F0FAE6] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden selection:bg-selah-orange selection:text-white">
      {/* Natural Paper Texture Background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />
      
      {/* Soft Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-selah-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-selah-yellow/10 rounded-full blur-[120px] pointer-events-none" />

      <ResourcesHero />

      {/* Filter Bar */}
      <section className="max-w-4xl mx-auto px-6 mb-12 relative z-20">
        <div className="flex flex-wrap justify-center gap-1 p-1.5 bg-white rounded-full border border-selah-dark/5 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-6 py-2.5 rounded-full ui-button transition-colors duration-300 z-10 ${ activeCategory === category ? 'text-white' : 'text-selah-muted hover:text-selah-dark' }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-selah-orange rounded-full shadow-[0_4px_12px_rgba(255,92,0,0.2)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-20">{category === 'All' ? t('All', 'Todos') : category === 'Printables' ? t('Printables', 'Imprimibles') : t('Lessons', 'Lecciones')}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Resources Grid */}
      <section className="max-w-[1400px] mx-auto px-6 mb-12 relative z-10" style={{ perspective: "2000px" }}>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource, i) => (
              <ResourceCard key={resource.id} resource={resource} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Callout Banner */}
      <section className="max-w-[1400px] mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative rounded-[3rem] p-16 md:p-24 text-center overflow-hidden group bg-white border border-selah-dark/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-selah-yellow/10 via-selah-orange/5 to-selah-pink/10 opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-[0.04] mix-blend-multiply pointer-events-none" />
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -top-32 -right-32 text-selah-yellow/20 pointer-events-none group-hover:text-selah-yellow/30 transition-colors duration-700"
          >
            <Sparkles size={300} />
          </motion.div>
          
          <div className="relative z-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm border border-selah-dark/5">
              <Sparkles size={32} className="text-selah-orange" />
            </div>
            <h2 className="hero-headline text-selah-dark mb-6 tracking-tighter drop-shadow-sm">
              {t("More Coming Soon!", "¡Más Próximamente!")}
            </h2>
            <p className="text-selah-muted body-text max-w-2xl mx-auto leading-relaxed mb-10 tracking-tight">
              {t(
                "We are constantly creating new printables, lessons, and activity sheets. Join our newsletter to get notified!",
                "Constantemente creamos nuevos imprimibles, lecciones y hojas de actividades. ¡Únete a nuestro boletín para recibir notificaciones!"
              )}
            </p>
            <Button className="!px-10 !py-4 ui-button shadow-[0_10px_30px_-10px_rgba(255,92,0,0.4)]">
              {t("Subscribe Now", "Suscríbete Ahora")}
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
