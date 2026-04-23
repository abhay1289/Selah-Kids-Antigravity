"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../UI';
import { staggerContainer, zoomInUp, fadeInDown } from '../../utils/animations';
import { useFieldResolver } from '../../lib/page-fields';
import type { PageFieldMap } from '../../lib/cms-server';

export const ContactHero = ({ fields }: { fields?: PageFieldMap } = {}) => {
  const f = useFieldResolver(fields);
  return (
    <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="text-center px-6 mb-12 relative z-10">
      <motion.div variants={fadeInDown}>
        <Badge color="light" className="mb-8 shadow-sm bg-white border border-black/5">{f('general.badge', 'GET IN TOUCH', 'CONTÁCTANOS')}</Badge>
      </motion.div>
      <motion.h1 variants={zoomInUp} className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
        {f('general.title1', "Let's", 'Vamos a')} <span className="text-selah-blue">{f('general.title_accent', 'Connect', 'Conectar')}</span>
      </motion.h1>
      <motion.p variants={zoomInUp} className="body-text max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
        {f(
          'general.desc',
          "We'd love to hear from you! Whether you have a question, want to partner, or just want to say hi.",
          "¡Nos encantaría saber de ti! Ya sea que tengas una pregunta, quieras colaborar, o simplemente quieras saludar."
        )}
      </motion.p>
    </motion.section>
  );
};
