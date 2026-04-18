'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../../components/UI';
import { ResourcesHero } from '../../components/resources/ResourcesHero';
import { ResourceCard } from '../../components/resources/ResourceCard';
import { DownloadModal } from '../../components/resources/DownloadModal';
import { useLanguage } from '../../contexts/LanguageContext';

const CATEGORIES = ['All', 'Printables', 'Lessons', 'Devotionals'];

const RESOURCES = [
  {
    id: 2,
    title: "Andy Coloring Page",
    description: "A colorful coloring page featuring Andy and his pet sheep, Shiloh.",
    type: "PDF",
    category: "Printables",
    gradient: "from-[#00BFFF] to-[#87CEEB]",
    img: "/SK_ColoringBook/SK_ColoringBook_Andy_Page02_FN.png",
    featured: false,
  },
  {
    id: 3,
    title: "Libni Coloring Page",
    description: "Color in Libni as she dances and sings her favorite worship songs.",
    type: "PDF",
    category: "Printables",
    gradient: "from-[#FFB6C1] to-[#FF69B4]",
    img: "/SK_ColoringBook/SK_ColoringBook_Libni_Page03_FN.png",
    featured: false,
  },
  {
    id: 7,
    title: "Shiloh Coloring Page",
    description: "A fun coloring page featuring Shiloh the sheep!",
    type: "PDF",
    category: "Printables",
    gradient: "from-[#FFD700] to-[#FEB835]",
    img: "/SK_ColoringBook/SK_ColoringBook_Shiloh_Page01_FN.png",
    featured: false,
  },
  {
    id: 8,
    title: "Best Friends Coloring Page",
    description: "Color Andy, Libni, and Shiloh together in this beautiful coloring page.",
    type: "PDF",
    category: "Printables",
    gradient: "from-[#98FF98] to-[#93D35C]",
    img: "/SK_ColoringBook/SK_ColoringBook_BestFriends_Page04_FN.png",
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
    category: "Devotionals",
    gradient: "from-[#FF7F50] to-[#FF5C00]",
    featured: false,
  }
];

export default function ResourcesPage() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [downloadModalData, setDownloadModalData] = useState<{isOpen: boolean, resource: any | null}>({ isOpen: false, resource: null });

  const handleDownloadClick = (resource: any) => {
    // If they already subscribed in the past, directly "download"
    if (typeof window !== 'undefined' && window.localStorage.getItem('selah_subscribed') === 'true') {
      executeDownload(resource);
    } else {
      setDownloadModalData({ isOpen: true, resource });
    }
  };

  const executeDownload = (resource: any) => {
    // For now, if the resource is an activity sheet/PDF, we would typically trigger the file download here.
    // If it has an img, maybe they can download the image for now.
    const fileUrl = resource.img || "/sample-download.pdf"; 
    
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = resource.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
              <span className="relative z-20">{category === 'All' ? t('All', 'Todos') : category === 'Printables' ? t('Printables', 'Imprimibles') : category === 'Lessons' ? t('Lessons', 'Lecciones') : t('Devotionals', 'Devocionales')}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Resources Grid */}
      <section className="max-w-[1400px] mx-auto px-6 mb-12 relative z-10" style={{ perspective: "2000px" }}>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource, i) => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                index={i} 
                onDownloadAction={() => handleDownloadClick(resource)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>



      {/* Download Mailchimp/Subscription Modal */}
      <DownloadModal 
        isOpen={downloadModalData.isOpen} 
        onClose={() => setDownloadModalData({ ...downloadModalData, isOpen: false })}
        resourceTitle={downloadModalData.resource?.title || ""}
        onSuccess={() => {
          if (downloadModalData.resource) {
            executeDownload(downloadModalData.resource);
          }
        }}
      />
    </div>
  );
}
