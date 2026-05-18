'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResourcesHero } from '@/components/resources/ResourcesHero';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { DownloadModal } from '@/components/resources/DownloadModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageShell } from '@/components/design';
import type { PageFieldMap } from '@/lib/cms-server';

const CATEGORIES = ['All', 'Printables', 'Lessons', 'Devotionals'];

// Each resource carries bilingual title/description and either a single
// locale-agnostic `img` (line-art coloring pages — same artwork in both
// locales) or `imgEn`/`imgEs` (activity sheets where the in-page text is
// translated). Activity sheets also carry `pdfEn`/`pdfEs` — a multi-page
// PDF download — separate from the preview thumbnail. resolveResource()
// flattens these per the active locale before the card renders.
type RawResource = {
  id: number;
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
  type: string;
  category: string;
  gradient: string;
  img?: string;
  imgEn?: string;
  imgEs?: string;
  pdfEn?: string;
  pdfEs?: string;
  featured?: boolean;
  comingSoon?: boolean;
};

const RESOURCES: RawResource[] = [
  // ─── Coloring book (line art — locale-agnostic, single img) ───
  {
    id: 2,
    titleEn: "Andy Coloring Page",
    titleEs: "Página para Colorear de Andy",
    descriptionEn: "A colorful coloring page featuring Andy and his pet sheep, Shiloh.",
    descriptionEs: "Una página para colorear con Andy y su oveja Shiloh.",
    type: "PNG",
    category: "Printables",
    gradient: "from-[#00BFFF] to-[#87CEEB]",
    img: "/SK_ColoringBook/SK_ColoringBook_Andy_Page02_FN.png",
  },
  {
    id: 3,
    titleEn: "Libni Coloring Page",
    titleEs: "Página para Colorear de Libni",
    descriptionEn: "Color in Libni as she dances and sings her favorite worship songs.",
    descriptionEs: "Colorea a Libni mientras baila y canta sus canciones de adoración favoritas.",
    type: "PNG",
    category: "Printables",
    gradient: "from-[#FFB6C1] to-[#FF69B4]",
    img: "/SK_ColoringBook/SK_ColoringBook_Libni_Page03_FN.png",
  },
  {
    id: 7,
    titleEn: "Shiloh Coloring Page",
    titleEs: "Página para Colorear de Shiloh",
    descriptionEn: "A fun coloring page featuring Shiloh the sheep!",
    descriptionEs: "¡Una página divertida para colorear a Shiloh, la ovejita!",
    type: "PNG",
    category: "Printables",
    gradient: "from-[#FFD700] to-[#FEB835]",
    img: "/SK_ColoringBook/SK_ColoringBook_Shiloh_Page01_FN.png",
  },
  {
    id: 8,
    titleEn: "Best Friends Coloring Page",
    titleEs: "Página para Colorear: Mejores Amigos",
    descriptionEn: "Color Andy, Libni, and Shiloh together in this beautiful coloring page.",
    descriptionEs: "Colorea juntos a Andy, Libni y Shiloh en esta hermosa página.",
    type: "PNG",
    category: "Printables",
    gradient: "from-[#98FF98] to-[#93D35C]",
    img: "/SK_ColoringBook/SK_ColoringBook_BestFriends_Page04_FN.png",
  },

  // ─── Activity sheets (locale-specific artwork, EN ↔ ES paired) ───
  // Multi-page sheets are bundled into a single PDF; the card preview
  // uses a portrait JPG thumbnail of the first page.
  {
    id: 9,
    titleEn: "Color by Number",
    titleEs: "Colorea por Número",
    descriptionEn: "A guided color-by-number printable for early learners.",
    descriptionEs: "Una hoja imprimible de colorear por números para los más pequeños.",
    type: "PDF",
    category: "Printables",
    gradient: "from-[#FFB347] to-[#FF7F50]",
    imgEn: "/SK_Activities/previews/Color_by_Number_EN.jpg",
    imgEs: "/SK_Activities/previews/Color_by_Number_ES.jpg",
    pdfEn: "/SK_Activities/pdf/Color_by_Number_EN.pdf",
    pdfEs: "/SK_Activities/pdf/Color_by_Number_ES.pdf",
  },
  {
    id: 10,
    titleEn: "Fruit of the Spirit",
    titleEs: "El Fruto del Espíritu",
    descriptionEn: "Two-page coloring activity exploring love, joy, peace and more from Galatians 5.",
    descriptionEs: "Actividad de dos páginas para colorear que explora amor, gozo, paz y más, desde Gálatas 5.",
    type: "PDF",
    category: "Printables",
    gradient: "from-[#A8E6CF] to-[#3AB795]",
    imgEn: "/SK_Activities/previews/Fruit_of_the_Spirit_EN.jpg",
    imgEs: "/SK_Activities/previews/Fruit_of_the_Spirit_ES.jpg",
    pdfEn: "/SK_Activities/pdf/Fruit_of_the_Spirit_EN.pdf",
    pdfEs: "/SK_Activities/pdf/Fruit_of_the_Spirit_ES.pdf",
  },
  {
    id: 12,
    titleEn: "My Tiny Dancer",
    titleEs: "Mi Pequeño Bailarín",
    descriptionEn: "Two-page coloring activity for little worshippers who love to move.",
    descriptionEs: "Actividad de dos páginas para colorear, para pequeños adoradores que aman moverse.",
    type: "PDF",
    category: "Printables",
    gradient: "from-[#FFD3E0] to-[#FF85B3]",
    imgEn: "/SK_Activities/previews/My_Tiny_Dancer_EN.jpg",
    imgEs: "/SK_Activities/previews/My_Tiny_Dancer_ES.jpg",
    pdfEn: "/SK_Activities/pdf/My_Tiny_Dancer_EN.pdf",
    pdfEs: "/SK_Activities/pdf/My_Tiny_Dancer_ES.pdf",
  },

  // ─── Coming-soon placeholders ───
  {
    id: 4,
    titleEn: "Sunday School Guide",
    titleEs: "Guía de Escuela Dominical",
    descriptionEn: "A 4-week curriculum guide using Selah Kids videos for children's ministry.",
    descriptionEs: "Una guía curricular de 4 semanas usando los videos de Selah Kids para el ministerio infantil.",
    type: "PDF",
    category: "Lessons",
    gradient: "from-[#98FF98] to-[#93D35C]",
    featured: true,
    comingSoon: true,
  },
  {
    id: 5,
    titleEn: "Family Devotional",
    titleEs: "Devocional Familiar",
    descriptionEn: "A week of daily devotionals designed to help families worship and learn together.",
    descriptionEs: "Una semana de devocionales diarios para que las familias adoren y aprendan juntas.",
    type: "PDF",
    category: "Devotionals",
    gradient: "from-[#FF7F50] to-[#FF5C00]",
    comingSoon: true,
  },
];

function resolveResource(raw: RawResource, language: 'EN' | 'ES') {
  const isEs = language === 'ES';
  return {
    ...raw,
    title: isEs ? raw.titleEs : raw.titleEn,
    description: isEs ? raw.descriptionEs : raw.descriptionEn,
    img: raw.img ?? (isEs ? raw.imgEs : raw.imgEn),
    pdf: isEs ? raw.pdfEs : raw.pdfEn,
  };
}

export default function ResourcesPageClient({ fields }: { fields?: PageFieldMap }) {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [downloadModalData, setDownloadModalData] = useState<{isOpen: boolean, resource: any | null}>({ isOpen: false, resource: null });

  // Flatten EN/ES variants down to the shape ResourceCard expects.
  const resolvedResources = RESOURCES.map((r) => resolveResource(r, language));

  const handleDownloadClick = (resource: any) => {
    // If they already subscribed in the past, directly "download"
    if (typeof window !== 'undefined' && window.localStorage.getItem('selah_subscribed') === 'true') {
      executeDownload(resource);
    } else {
      setDownloadModalData({ isOpen: true, resource });
    }
  };

  const executeDownload = (resource: any) => {
    // Activity sheets ship as PDFs (pdf field); coloring pages ship as PNGs
    // (img field). Fall back to a generic sample if neither is present.
    const fileUrl = resource.pdf || resource.img || "/sample-download.pdf";

    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = resource.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredResources = resolvedResources.filter(res =>
    activeCategory === 'All' ? true : res.category === activeCategory
  );

  return (
    <PageShell mainClassName="pt-36 md:pt-44 pb-16">
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
    </PageShell>
  );
}
