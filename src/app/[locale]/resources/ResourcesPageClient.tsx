'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResourcesHero } from '@/components/resources/ResourcesHero';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { DownloadModal } from '@/components/resources/DownloadModal';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PageFieldMap } from '@/lib/cms-server';

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
    comingSoon: true,
  },
  {
    id: 5,
    title: "Family Devotional",
    description: "A week of daily devotionals designed to help families worship and learn together.",
    type: "PDF",
    category: "Devotionals",
    gradient: "from-[#FF7F50] to-[#FF5C00]",
    featured: false,
    comingSoon: true,
  }
];

export default function ResourcesPageClient({ fields }: { fields?: PageFieldMap }) {
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
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F0FAE6] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden selection:bg-selah-orange selection:text-white">
      {/* Vivid Color Washes — enterprise-grade vibrancy matching home */}
      <div className="absolute top-0 right-0 w-[60vw] h-[50vh] bg-gradient-to-bl from-[#FF7F50]/15 via-[#FF5C00]/8 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[55vw] h-[50vh] bg-gradient-to-tr from-[#93D35C]/15 via-[#98FF98]/8 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vh] bg-[#FEB835]/12 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[35vw] h-[35vh] bg-[#FF69B4]/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-[50%] right-[20%] w-[30vw] h-[30vh] bg-[#00BFFF]/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />



      <ResourcesHero fields={fields} />

      {/* Premium Filter Bar */}
      <section className="max-w-4xl mx-auto px-6 mb-14 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-1.5 p-2 bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative px-6 py-3 rounded-xl ui-button transition-colors duration-300 z-10 ${ activeCategory === category ? 'text-white' : 'text-selah-muted hover:text-selah-dark' }`}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-selah-orange rounded-xl shadow-[0_6px_20px_rgba(255,92,0,0.25)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-20">{category === 'All' ? t('All', 'Todos') : category === 'Printables' ? t('Printables', 'Imprimibles') : category === 'Lessons' ? t('Lessons', 'Lecciones') : t('Devotionals', 'Devocionales')}</span>
            </button>
          ))}
        </motion.div>
      </section>

      {/* Resources Grid */}
      <section className="max-w-[1200px] mx-auto px-6 mb-16 relative z-10" style={{ perspective: "2000px" }}>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
