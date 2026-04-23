"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cross, Smile, BookOpen, Globe, Sparkles } from 'lucide-react';
import { Badge } from '../UI';
import { staggerContainer, zoomInUp } from '../../utils/animations';
import { useFieldResolver } from '../../lib/page-fields';
import type { PageFieldMap } from '../../lib/cms-server';

const VALUE_DEFS = [
  {
    icon: Cross,
    keyTitle: 'values.v1_title',
    keyDesc: 'values.v1_desc',
    titleEn: 'All About Jesus', titleEs: 'Todo Sobre Jesús',
    descEn: "Jesus is at the center of every story, teaching children about God's love and grace through engaging, faith-based videos.",
    descEs: 'Jesús está en el centro de cada historia, enseñando a los niños sobre el amor y la gracia de Dios a través de videos atractivos y basados en la fe.',
    color: 'bg-selah-orange',
  },
  {
    icon: Smile,
    keyTitle: 'values.v2_title',
    keyDesc: 'values.v2_desc',
    titleEn: 'Made for Kids', titleEs: 'Hecho para Niños',
    descEn: 'Our Christian cartoons are safe, wholesome, and crafted for children to watch, learn, and grow in faith.',
    descEs: 'Nuestras caricaturas cristianas son seguras, sanas y hechas para que los niños vean, aprendan y crezcan en la fe.',
    color: 'bg-selah-yellow',
  },
  {
    icon: BookOpen,
    keyTitle: 'values.v3_title',
    keyDesc: 'values.v3_desc',
    titleEn: 'True to the Bible', titleEs: 'Fiel a la Biblia',
    descEn: 'Every song and story is carefully reviewed to make sure it teaches accurate and helpful biblical lessons.',
    descEs: 'Cada canción e historia es cuidadosamente revisada para asegurar que enseñe lecciones bíblicas precisas y útiles.',
    color: 'bg-selah-light',
  },
  {
    icon: Globe,
    keyTitle: 'values.v4_title',
    keyDesc: 'values.v4_desc',
    titleEn: 'For Everyone', titleEs: 'Para Todos',
    descEn: "We celebrate the beautiful diversity of God's entire creation in all our kids worship videos — in English and Spanish.",
    descEs: 'Celebramos la hermosa diversidad de toda la creación de Dios en todos nuestros videos de adoración para niños — en inglés y español.',
    color: 'bg-[#FF7F50]',
  },
  {
    icon: Sparkles,
    keyTitle: 'values.v5_title',
    keyDesc: 'values.v5_desc',
    titleEn: 'Sensory Friendly', titleEs: 'Amigable Sensorial',
    descEn: 'Our content is thoughtfully designed with gentle pacing, clear visuals, and calming music to support children of all sensory needs.',
    descEs: 'Nuestro contenido está diseñado con ritmo gentil, visuales claros y música calmante para apoyar a niños con todas las necesidades sensoriales.',
    color: 'bg-[#9B59B6]',
  },
] as const;

const CreativeIcon: React.FC<{ children: React.ReactNode, color: string }> = ({ children, color }) => {
  return (
    <motion.div
      animate={{ y: [0, -4, 0], rotate: [0, 2, -2, 0] }}
      transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      className="relative flex items-center justify-center w-full h-full"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-3xl"
        style={{ backgroundColor: color }}
      />
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

interface AboutCoreValuesProps {
  fields?: PageFieldMap;
}

export const AboutCoreValues = ({ fields }: AboutCoreValuesProps) => {
  const f = useFieldResolver(fields);

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12 md:py-16 relative z-10">
      <div className="text-center mb-12">
        <Badge color="yellow" className="mb-6">{f('values.v_badge', 'OUR VALUES', 'NUESTROS VALORES')}</Badge>
        <h2 className="content-h2 leading-[1.1] tracking-tight">
          {f('values.v_title', 'What Guides Us', 'Lo Que Nos Guía')}
        </h2>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {VALUE_DEFS.map((value, i) => (
          <motion.div
            key={i}
            variants={zoomInUp}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="bg-white/80 backdrop-blur-lg rounded-[2.5rem] p-8 border border-white/80 shadow-sm flex flex-col items-start group hover:bg-selah-orange transition-colors duration-500 relative"
          >
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 ${value.color} text-white group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-out relative z-10 shadow-lg`}>
              <CreativeIcon color="#ffffff">
                <value.icon size={28} strokeWidth={1.5} />
              </CreativeIcon>
            </div>
            <h3 className="content-h3 text-selah-orange mb-3 leading-tight group-hover:text-white transition-colors duration-500 relative z-10">{f(value.keyTitle, value.titleEn, value.titleEs)}</h3>
            <p className="body-text !max-w-none leading-relaxed group-hover:text-white/80 transition-colors duration-500 relative z-10">
              {f(value.keyDesc, value.descEn, value.descEs)}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
