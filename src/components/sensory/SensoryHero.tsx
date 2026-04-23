'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const VERSES_EN = ['Peace I leave with you.', 'The Lord is my shepherd.', 'He who dwells in the shelter of the Most High.', 'The Lord bless you and keep you.'];
const VERSES_ES = ['La paz os dejo.', 'El Señor es mi pastor.', 'El que habita al abrigo del Altísimo.', 'El Señor te bendiga y te guarde.'];

export default function SensoryHero() {
  const { t, language } = useLanguage();
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    const i = setInterval(() => setIdx((x) => (x + 1) % 4), 20000);
    return () => clearInterval(i);
  }, []);
  const verses = language === 'EN' ? VERSES_EN : VERSES_ES;
  return (
    <section className="max-w-2xl mx-auto px-6 text-center py-10 relative z-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 1.2 }} className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
        <Moon size={32} className="text-white/80" />
      </motion.div>
      <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">{t("Shiloh's Sensory Room", 'El Cuarto Sensorial de Shiloh')}</h1>
      <p className="text-white/70 max-w-md mx-auto mb-8">{t('A calm place to rest, listen, and remember God is near.', 'Un lugar tranquilo para descansar, escuchar y recordar que Dios está cerca.')}</p>
      <p className="italic text-white/50 text-sm min-h-[1.5rem]">{verses[idx]}</p>
    </section>
  );
}
