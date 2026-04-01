"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../UI';
import { staggerContainer, zoomInUp, fadeInDown } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';

export const ContactHero = () => {
  const { t } = useLanguage();
  return (
    <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="text-center px-6 mb-12 relative z-10">
      <motion.div variants={fadeInDown}>
        <Badge color="light" className="mb-8 shadow-sm bg-white border border-black/5">{t("GET IN TOUCH", "CONTÁCTANOS")}</Badge>
      </motion.div>
      <motion.h1 variants={zoomInUp} className="hero-headline mb-6 tracking-tight leading-[1.1] drop-shadow-sm">
        {t("Let's", "Vamos a")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-selah-blue to-selah-pink">{t("Connect", "Conectar")}</span>
      </motion.h1>
      <motion.p variants={zoomInUp} className="body-text max-w-3xl mx-auto leading-relaxed tracking-tight mb-8">
        {t(
          "We'd love to hear from you! Whether you have a question, want to partner, or just want to say hi.",
          "¡Nos encantaría saber de ti! Ya sea que tengas una pregunta, quieras colaborar, o simplemente quieras saludar."
        )}
      </motion.p>
    </motion.section>
  );
};
