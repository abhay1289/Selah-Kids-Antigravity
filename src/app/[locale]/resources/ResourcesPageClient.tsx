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
// translated). resolveResource() flattens these per the active locale
// before the card renders, so ResourceCard stays a dumb consumer of
// `title`/`description`/`img`.
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
  {
    id: 9,
    titleEn: "Color by Number",
    titleEs: "Colorea por Número",
    descriptionEn: "A guided color-by-number printable for early learners.",
    descriptionEs: "Una hoja imprimible de colorear por números para los más pequeños.",
    type: "PNG",
    category: "Printables",
    gradient: "from-[#FFB347] to-[#FF7F50]",
    imgEn: "/SK_Activities/ENG/SK_ColoringActivity_ENG_ColorNumber_Page05_FN.png",
    imgEs: "/SK_Activities/SPN/SK_ColoringActivity_SPN_ColorNumber_Page05_FN.png",
  },
  {
    id: 10,
    titleEn: "Fruit of the Spirit — Page 1",
    titleEs: "El Fruto del Espíritu — Página 1",
    descriptionEn: "Coloring activity exploring love, joy, peace and more from Galatians 5.",
    descriptionEs: "Actividad para colorear que explora amor, gozo, paz y más, desde Gálatas 5.",
    type: "PNG",
    category: "Printables",
    gradient: "from-[#A8E6CF] to-[#3AB795]",
    imgEn: "/SK_Activities/ENG/SK_ColoringActivity_Fruit_of_the_Spirit_ENG_Page06_01_FN.png",
    imgEs: "/SK_Activities/SPN/SK_ColoringActivity_Fruit_of_the_Spirit_SPN_Page06_01_FN.png",
  },
  {
    id: 11,
    titleEn: "Fruit of the Spirit — Page 2",
    titleEs: "El Fruto del Espíritu — Página 2",
    descriptionEn: "The companion sheet to page 1 — keep growing the fruit together.",
    descriptionEs: "La hoja complementaria a la página 1 — sigamos cultivando el fruto juntos.",
    type: "PNG",
    category: "Printables",
    gradient: "from-[#B5EAD7] to-[#5AC18E]",
    imgEn: "/SK_Activities/ENG/SK_ColoringActivity_Fruit_of_the_Spirit_ENG_Page06_02_FN.png",
    imgEs: "/SK_Activities/SPN/SK_ColoringActivity_Fruit_of_the_Spirit_SPN_Page06_02_FN.png",
  },
  {
    id: 12,
    titleEn: "My Tiny Dancer — Page 1",
    titleEs: "Mi Pequeño Bailarín — Página 1",
    descriptionEn: "Worship through movement — a coloring activity for little dancers.",
    descriptionEs: "Adoración a través del movimiento — una actividad para pequeños bailarines.",
    type: "PNG",
    category: "Printables",
    gradient: "from-[#FFD3E0] to-[#FF85B3]",
    imgEn: "/SK_Activities/ENG/SK_ColoringActivity_MyTinyDancer_ENG_Page07_01_FN.png",
    imgEs: "/SK_Activities/SPN/SK_ColoringActivity_Bailarin_SPN_Page07_01_FN.png",
  },
  {
    id: 13,
    titleEn: "My Tiny Dancer — Page 2",
    titleEs: "Mi Pequeño Bailarín — Página 2",
    descriptionEn: "Continue the dance — page 2 of the My Tiny Dancer activity set.",
    descriptionEs: "Continúa el baile — página 2 del set Mi Pequeño Bailarín.",
    type: "PNG",
    category: "Printables",
    gradient: "from-[#FFC1D9] to-[#FF6FA3]",
    imgEn: "/SK_Activities/ENG/SK_ColoringActivity_MyTinyDancer_ENG_Page07_02_FN.png",
    imgEs: "/SK_Activities/SPN/SK_ColoringActivity_Bailarin_SPN_Page07_02_FN.png",
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
