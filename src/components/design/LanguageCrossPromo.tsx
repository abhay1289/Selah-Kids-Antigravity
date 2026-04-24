'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../UI';

export interface LanguageCrossPromoProps {
  /** Extra Tailwind classes on the outer wrapper. */
  className?: string;
}

/**
 * Cross-promo card that asks EN visitors if they speak Spanish (and vice
 * versa) and flips the language on click. LanguageContext handles the
 * actual URL navigation — this component is purely presentational plus
 * one button click.
 *
 * Factored out of the previous inline block in
 * `src/app/[locale]/watch/WatchPageClient.tsx` so Blog, Resources,
 * Characters, and Home can drop it in without re-implementing the copy.
 */
export function LanguageCrossPromo({ className = '' }: LanguageCrossPromoProps) {
  const { language, setLanguage } = useLanguage();

  const isEn = language === 'EN';
  const message = isEn
    ? 'Do you speak Spanish? Check out our Spanish page!'
    : '¿Hablas inglés? ¡Visita nuestra página en inglés!';
  const cta = isEn ? '🇪🇸 Switch to Spanish' : '🇺🇸 Cambiar a Inglés';
  const next = isEn ? 'ES' : 'EN';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`max-w-4xl mx-auto px-6 text-center ${className}`}
    >
      <p className="text-selah-dark bg-selah-orange/10 rounded-2xl p-6 m-0 flex flex-col sm:flex-row items-center justify-center gap-4 shadow-sm border border-selah-orange/20">
        <span className="font-medium text-lg">{message}</span>
        <Button
          variant="primary"
          onClick={() => setLanguage(next)}
          className="!py-2 !px-6 hover:scale-105 transition-transform"
        >
          {cta}
        </Button>
      </p>
    </motion.div>
  );
}
