"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ShieldCheck, Lightbulb, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const ParentsAccordion = () => {
  const { t, language } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>("learn");
  const toggleSection = (id: string) => setOpenSection(openSection === id ? null : id);

  const ACCORDION_DATA = [
    {
      id: "learn",
      icon: Leaf,
      title: t("What Your Kids Will Learn", "Lo Que Aprenderán Tus Hijos"),
      items: language === 'ES'
        ? ["El amor incondicional y la gracia de Dios", "Historias y personajes clave de la Biblia", "El fruto del Espíritu (amor, alegría, paz...)", "Cómo orar y hablar con Dios", "Bondad, compartir y amar a los demás"]
        : ["God's unconditional love and grace", "Key stories and characters from the Bible", "The fruit of the Spirit (love, joy, peace...)", "How to pray and talk to God", "Kindness, sharing, and loving others"]
    },
    {
      id: "promise",
      icon: ShieldCheck,
      title: t("Our Content Promise", "Nuestra Promesa de Contenido"),
      items: language === 'ES'
        ? ["Experiencia 100% segura y sin anuncios", "Letras teológicamente sólidas revisadas por pastores", "Animación de alta calidad que respeta la inteligencia de los niños", "Sin imágenes aterradoras o temas inapropiados", "Ritmo calmante adecuado para mentes jóvenes en desarrollo"]
        : ["100% safe, ad-free viewing experience", "Theologically sound lyrics checked by pastors", "High-quality animation that respects kids' intelligence", "No scary imagery or inappropriate themes", "Calming pacing suitable for young developing minds"]
    },
    {
      id: "usage",
      icon: Lightbulb,
      title: t("How to Use Selah Kids", "Cómo Usar Selah Kids"),
      items: language === 'ES'
        ? ["Adoración matutina para comenzar bien el día", "Canciones durante viajes largos en auto", "Contenido atractivo para clases de Escuela Dominical", "Videos sensoriales calmantes antes de dormir", "Noches de adoración familiar juntos"]
        : ["Morning worship to start the day right", "Sing-alongs during long car rides", "Engaging content for Sunday School classes", "Calming sensory videos before bedtime", "Family worship nights together"]
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 pb-8 relative z-10">
      <div className="text-center mb-12">
        <h2 className="content-h2 tracking-tight mb-6">{t("What to Expect", "Qué Esperar")}</h2>
        <p className="body-text mx-auto">{t("Everything you need to know about our content and philosophy.", "Todo lo que necesitas saber sobre nuestro contenido y filosofía.")}</p>
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
