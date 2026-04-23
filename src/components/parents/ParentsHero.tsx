"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../UI';
import NextImage from 'next/image';
import { useFieldResolver } from '../../lib/page-fields';
import type { PageFieldMap } from '../../lib/cms-server';

export const ParentsHero = ({ fields }: { fields?: PageFieldMap } = {}) => {
  const f = useFieldResolver(fields);
  return (
    <section className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
      <div className="flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2 text-left">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <Badge color="yellow" className="mb-6 shadow-sm">{f('hero.badge', 'PEACE OF MIND', 'TRANQUILIDAD')}</Badge>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
            {f('hero.title1', 'Built for Kids.', 'Hecho para Niños.')} <span className="text-selah-muted">{f('hero.title2', 'Trusted by Parents.', 'Confiado por Padres.')}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="body-text max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
            {f(
              'hero.desc',
              "We created Selah Kids because we're parents too. We know how hard it is to find high-quality, safe, and faith-filled media for little ones. Our content is designed to nurture children wholistically — spirit, mind, and heart — through music, stories, and worship.",
              "Creamos Selah Kids porque también somos padres. Sabemos lo difícil que es encontrar medios de alta calidad, seguros y llenos de fe para los pequeños. Nuestro contenido está diseñado para nutrir a los niños de manera integral — espíritu, mente y corazón — a través de música, historias y adoración."
            )}
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.85, rotate: 6 }} animate={{ opacity: 1, scale: 1, rotate: 3 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="w-full md:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-selah-yellow/20 to-selah-orange/20 rounded-[3rem] blur-3xl transform -rotate-6 scale-105" />
          <div className="relative bg-white rounded-[3rem] p-12 shadow-2xl border border-black/5 transform hover:rotate-0 transition-transform duration-700">
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-sm">
              <NextImage src="/selah-family-hero.jpg" alt="Selah Kids Family" fill className="object-cover hover:scale-105 transition-transform duration-700 ease-out" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
