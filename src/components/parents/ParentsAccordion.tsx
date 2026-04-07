"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, ShieldCheck, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const ParentsAccordion = () => {
  const { t, language } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>("spirit");
  const toggleSection = (id: string) => setOpenSection(openSection === id ? null : id);

  const ACCORDION_DATA = [
    {
      id: "spirit",
      icon: Sparkles,
      title: t("Nurturing the Spirit", "Nutriendo el Espíritu"),
      items: language === 'ES'
        ? ["El amor incondicional y la gracia de Dios", "Historias y principios clave de la Biblia", "Cómo orar y tener una relación con Dios", "Adoración musical como familia", "El fruto del Espíritu (amor, alegría, paz)"]
        : ["God's unconditional love and grace", "Key stories and principles from the Bible", "How to pray and have a relationship with God", "Musical worship as a family", "The fruit of the Spirit (love, joy, peace)"]
    },
    {
      id: "mind",
      icon: Lightbulb,
      title: t("Engaging the Mind", "Involucrando la Mente"),
      items: language === 'ES'
        ? ["Animación de alta calidad que respeta la inteligencia de los niños", "Letras teológicamente sólidas revisadas por pastores", "Recursos educativos para la Escuela Dominical", "Ritmo calmante adecuado para mentes jóvenes en desarrollo", "Construcción de vocabulario a través de música estructurada"]
        : ["High-quality animation that respects kids' intelligence", "Theologically sound lyrics checked by pastors", "Educational resources for Sunday School", "Calming pacing suitable for young developing minds", "Vocabulary building through structured music"]
    },
    {
      id: "heart",
      icon: ShieldCheck,
      title: t("Guarding the Heart", "Guardando el Corazón"),
      items: language === 'ES'
        ? ["Experiencia de visualización 100% segura y confiable", "Sin imágenes aterradoras o temas inapropiados", "Promueve la bondad, el compartir y el amor al prójimo", "Desarrollo del carácter a través de historias positivas", "Entorno en línea confiable de extremo a extremo"]
        : ["100% safe and trustworthy viewing experience", "No scary imagery or inappropriate themes", "Promotes kindness, sharing, and loving others", "Character development through positive storytelling", "Trustworthy end-to-end online environment"]
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 pb-8 relative z-10">
      <div className="text-center mb-12">
        <h2 className="content-h2 tracking-tight mb-6">{t("A Wholistic Approach", "Un Enfoque Integral")}</h2>
        <p className="body-text mx-auto">{t("We carefully design every video, song, and story to nurture your child's entire being.", "Diseñamos cuidadosamente cada video, canción e historia para nutrir al niño de manera integral.")}</p>
      </div>
      <div className="space-y-6">
        {ACCORDION_DATA.map((section, i) => (
          <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`bg-white rounded-[2rem] border transition-all duration-500 overflow-hidden ${openSection === section.id ? 'border-selah-orange/30 shadow-[0_20px_40px_-15px_rgba(255,127,80,0.15)]' : 'border-black/5 shadow-sm hover:border-black/10 hover:shadow-md'}`}>
            <button onClick={() => toggleSection(section.id)} className="w-full px-8 py-8 flex items-center justify-between text-left focus:outline-none group">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${openSection === section.id ? 'bg-selah-orange text-white scale-110 rotate-3' : 'bg-selah-orange/10 text-selah-orange group-hover:scale-105'}`}>
                  <section.icon size={28} />
                </div>
                <h2 className={`content-h3 transition-colors duration-300 ${openSection === section.id ? 'text-selah-orange' : 'text-selah-dark group-hover:text-selah-orange'}`}>{section.title}</h2>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${openSection === section.id ? 'bg-selah-orange/10 rotate-180' : 'bg-selah-bg group-hover:bg-white group-hover:shadow-sm'}`}>
                <ChevronDown size={24} className={`transition-colors duration-300 ${openSection === section.id ? 'text-selah-orange' : 'text-selah-muted group-hover:text-selah-dark'}`} />
              </div>
            </button>
            <AnimatePresence>
              {openSection === section.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }} className="overflow-hidden">
                  <div className="px-8 pb-10 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mt-4 border-t border-black/5 pt-8">
                      {section.items.map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + (i * 0.05) }} className="flex items-start gap-4">
                          <div className="w-6 h-6 rounded-full bg-[#93D35C]/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <CheckCircle2 size={16} className="text-[#93D35C]" />
                          </div>
                          <p className="body-text !max-w-none leading-relaxed">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
