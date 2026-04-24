'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import { fromLanguageKey, localeHref } from '../../lib/i18n';
import { trackLanguageSwitch } from '../../lib/analytics';
import { Button } from '../UI';

export interface LanguageCrossPromoProps {
  /** Extra Tailwind classes on the outer wrapper. */
  className?: string;
  /**
   * Optional bare (un-prefixed) path to navigate to in the target locale
   * when the user flips language. Use this on slug pages where the EN
   * slug differs from the ES slug so the visitor lands on the translated
   * article instead of a 404 or the list page.
   *
   *   pairedPath="/blog/la-torre-fuerte-de-seguridad"  // on EN page
   *
   * When omitted the component falls back to the default behavior: flip
   * the language and stay on the same-shape URL under the new locale.
   */
  pairedPath?: string;
}

/**
 * Cross-promo card that asks EN visitors if they speak Spanish (and vice
 * versa) and flips the language on click. LanguageContext handles the
 * actual URL navigation for the default (same-path) case — this
 * component only takes over navigation when `pairedPath` is supplied,
 * because LanguageContext doesn't know about slug pairings.
 *
 * Factored out of the previous inline block in
 * `src/app/[locale]/watch/WatchPageClient.tsx` so Blog, Resources,
 * Characters, and Home can drop it in without re-implementing the copy.
 */
export function LanguageCrossPromo({
  className = '',
  pairedPath,
}: LanguageCrossPromoProps) {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const isEn = language === 'EN';
  const message = isEn
    ? 'Do you speak Spanish? Check out our Spanish page!'
    : '¿Hablas inglés? ¡Visita nuestra página en inglés!';
  const cta = isEn ? '🇪🇸 Switch to Spanish' : '🇺🇸 Cambiar a Inglés';
  const nextKey = isEn ? 'ES' : 'EN';

  const handleClick = () => {
    if (pairedPath) {
      // Slug page: we know the exact translated URL, so bypass
      // LanguageContext's same-path flip and push directly to it.
      trackLanguageSwitch(language, nextKey);
      const targetLocale = fromLanguageKey(nextKey);
      router.push(localeHref(pairedPath, targetLocale));
      return;
    }
    setLanguage(nextKey);
  };

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
          onClick={handleClick}
          className="!py-2 !px-6 hover:scale-105 transition-transform"
        >
          {cta}
        </Button>
      </p>
    </motion.div>
  );
}
