"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Badge } from '../UI';
import { useLanguage } from '../../contexts/LanguageContext';

interface Impact {
  amount: number;
  icon: any;
  title: string;
  titleEs?: string;
  desc: string;
  descEs?: string;
  color: string;
  bg: string;
}

interface DonateImpactProps {
  impacts: Impact[];
  amount: number;
}

export const DonateImpact: React.FC<DonateImpactProps> = ({ impacts, amount }) => {
  const { t, language } = useLanguage();
  return (
    <section className="max-w-[1400px] mx-auto px-6 pb-8 relative z-10">
      <div className="text-center mb-12">
        <Badge color="light" className="mb-6 shadow-sm bg-white border border-black/5">{t("YOUR IMPACT", "TU IMPACTO")}</Badge>
        <h2 className="content-h2 tracking-tight">{t("What Your Gift Funds", "Lo Que Financia Tu Donación")}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {impacts.map((impact, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }} whileHover={{ y: -12, scale: 1.02 }} className={`bg-white rounded-[3rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-500 relative overflow-hidden cursor-default group ${amount >= impact.amount ? 'ring-2 ring-selah-orange/20 bg-gradient-to-b from-[#FFFDF5] to-white' : ''}`}>
            <AnimatePresence>
              {amount >= impact.amount && (
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="absolute top-0 right-0 w-24 h-24 bg-selah-orange rounded-bl-full flex items-start justify-end p-6 z-10 shadow-lg">
                  <Heart size={24} className="text-white fill-white drop-shadow-md" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className={`w-20 h-20 rounded-[2rem] ${impact.bg} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10`}>
              <impact.icon size={40} className={impact.color} />
            </div>
            <div className="ui-label text-selah-orange mb-4 relative z-10">${impact.amount} / {t("Month", "Mes")}</div>
            <h3 className="content-h3 mb-6 leading-tight relative z-10 group-hover:text-selah-blue transition-colors">
              {language === 'ES' && impact.titleEs ? impact.titleEs : impact.title}
            </h3>
            <p className="body-text leading-relaxed relative z-10">
              {language === 'ES' && impact.descEs ? impact.descEs : impact.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
