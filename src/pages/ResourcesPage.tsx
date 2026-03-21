import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BookOpen, Music, PenTool, School, Palette } from 'lucide-react';
import { Button } from '../components/UI';
import { ResourcesHero } from '../components/resources/ResourcesHero';
import { ResourceCard } from '../components/resources/ResourceCard';

const CATEGORIES = ['All', 'Lyrics', 'Coloring', 'Guides', 'Printables'];

const RESOURCES = [
  {
    id: 1,
    title: "Jesus Loves Me Lyrics",
    description: "Printable lyric sheet for our most popular song. Perfect for singing along at home or church.",
    type: "PDF",
    category: "Lyrics",
    iconLarge: Music,
    gradient: "from-[#FF7F50] to-[#FF5C00]", // Coral
    featured: true,
  },
  {
    id: 2,
    title: "Andy Coloring Page",
    description: "A fun, high-quality coloring page featuring Andy and his pet sheep, Shiloh.",
    type: "PDF",
    category: "Coloring",
    iconLarge: PenTool,
    gradient: "from-[#00BFFF] to-[#87CEEB]", // Sky Blue
    featured: false,
  },
  {
    id: 3,
    title: "Bible Verse Memory Cards",
    description: "A set of 10 beautifully illustrated memory verse cards to help kids learn Scripture.",
    type: "PDF",
    category: "Printables",
    iconLarge: BookOpen,
    gradient: "from-[#FFD700] to-[#FEB835]", // Gold
    featured: false,
  },
  {
    id: 4,
    title: "Sunday School Guide",
    description: "A 4-week curriculum guide using Selah Kids videos for children's ministry.",
    type: "PDF",
    category: "Guides",
    iconLarge: School,
    gradient: "from-[#98FF98] to-[#93D35C]", // Mint
    featured: true,
  },
  {
    id: 5,
    title: "Jesús Me Ama Letras",
    description: "Spanish lyric sheet for 'Jesus Loves Me'. Great for bilingual families.",
    type: "PDF",
    category: "Lyrics",
    iconLarge: Music,
    gradient: "from-[#E6E6FA] to-[#D8BFD8]", // Lavender
    featured: false,
  },
  {
    id: 6,
    title: "Libni Coloring Page",
    description: "Color in Libni as she dances and sings her favorite worship songs.",
    type: "PDF",
    category: "Coloring",
    iconLarge: Palette,
    gradient: "from-[#FFB6C1] to-[#FF69B4]", // Pink
    featured: false,
  }
];

export const ResourcesPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredResources = RESOURCES.filter(res => 
    activeCategory === 'All' ? true : res.category === activeCategory
  );

  return (
    <div className="bg-selah-bg min-h-screen pt-32 pb-20 relative overflow-hidden selection:bg-selah-orange selection:text-white">
      {/* Natural Paper Texture Background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />
      
      {/* Soft Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-selah-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-selah-yellow/10 rounded-full blur-[120px] pointer-events-none" />

      <ResourcesHero />

      {/* Filter Bar (Premium Segmented Control) */}
      <section className="max-w-4xl mx-auto px-6 mb-16 relative z-20">
        <div className="flex flex-wrap justify-center gap-1 p-1.5 bg-white rounded-full border border-selah-dark/5 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-6 py-2.5 rounded-full text-sm sm:text-base font-bold transition-colors duration-300 z-10 ${
                activeCategory === category ? 'text-white' : 'text-selah-muted hover:text-selah-dark'
              }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-selah-orange rounded-full shadow-[0_4px_12px_rgba(255,92,0,0.2)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-20">{category}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Resources Bento Grid */}
      <section className="max-w-[1400px] mx-auto px-6 mb-32 relative z-10" style={{ perspective: "2000px" }}>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-[400px] md:auto-rows-[450px]">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource, i) => (
              <ResourceCard key={resource.id} resource={resource} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Premium Callout Banner */}
      <section className="max-w-[1400px] mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[3rem] p-16 md:p-24 text-center overflow-hidden group bg-white border border-selah-dark/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
        >
          {/* Animated Gradient Background */}
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
            <h2 className="text-5xl md:text-7xl font-display text-selah-dark mb-6 tracking-tighter drop-shadow-sm">
              More Magic Coming!
            </h2>
            <p className="text-xl md:text-2xl text-selah-muted font-sans font-medium max-w-2xl mx-auto leading-relaxed mb-10 tracking-tight">
              We are constantly creating new coloring pages, devotionals, and activity sheets. Join our newsletter to get notified when they drop!
            </p>
            <Button className="!px-10 !py-5 !text-xl shadow-[0_10px_30px_-10px_rgba(255,92,0,0.4)]">
              Subscribe Now
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
