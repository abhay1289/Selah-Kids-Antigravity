'use client';

import React from 'react';
import { motion } from 'framer-motion';
import NextImage from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/UI';
import { PageShell, ScrapbookCard, FloatingBadge, SectionShell } from '@/components/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalePath } from '@/hooks/useLocalePath';
import type { Character } from '@/data/characters';

/**
 * Characters list — rebuilt to match the site's scrapbook design
 * language (About, Watch, Resources).
 *
 * Structure:
 *   - PageShell root: inherits AtmosSpine mood-of-day + paper-grain.
 *     No local gradient washes — those double-bled with the spine.
 *   - Short hero: Badge + headline + body. No giant watermark name.
 *   - Grid: 1-col mobile → 2-col sm → 3-col md. Each card is a
 *     ScrapbookCard wrapped in a <Link> so click + keyboard + focus
 *     all navigate to `/[locale]/characters/{slug}`.
 *   - Role appears as a FloatingBadge corner flourish on each card.
 *   - Bottom CTA: SectionShell + bilingual-safe Link to /watch.
 *
 * Data contract: takes the CMS-shape `Character[]` from the server
 * page. Bilingual copy flips on LanguageContext.
 */
export default function CharactersListClient({ characters }: { characters: Character[] }) {
  const { t, language } = useLanguage();
  const { lh } = useLocalePath();

  return (
    <PageShell mainClassName="pt-36 md:pt-44 pb-16">
      {/* Hero — short, editorial, no background wash. */}
      <SectionShell className="text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Badge color="orange" className="mb-8 shadow-md">
            {t('MEET THE CREW', 'CONOCE AL EQUIPO')}
          </Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="hero-headline mb-6 tracking-tight leading-[1.05] drop-shadow-sm"
        >
          {t('Our Characters', 'Nuestros Personajes')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="body-text max-w-2xl mx-auto leading-relaxed tracking-tight"
        >
          {t(
            'Meet the friends who bring our songs to life. Tap a character to read their story, favorite verse, and the episodes they sing in.',
            'Conoce a los amigos que dan vida a nuestras canciones. Toca un personaje para leer su historia, versículo favorito y los episodios en los que canta.',
          )}
        </motion.p>
      </SectionShell>

      {/* Grid */}
      <section className="max-w-[1200px] mx-auto px-6 pt-8 pb-24">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 list-none p-0 m-0">
          {characters.map((char, i) => {
            const role = language === 'ES' ? (char.roleEs || char.role) : char.role;
            return (
              <motion.li
                key={char.slug}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={lh(`/characters/${char.slug}`)}
                  aria-label={t(`Meet ${char.name}`, `Conoce a ${char.name}`)}
                  className="block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-selah-orange/30 rounded-3xl"
                >
                  <ScrapbookCard
                    ratio="1/1"
                    tiltMain={i % 2 === 0 ? 1.5 : -1.5}
                    tiltBacking={i % 2 === 0 ? -3 : 3}
                    badge={<FloatingBadge rotate={i % 2 === 0 ? -6 : 6}>{role}</FloatingBadge>}
                  >
                    <div
                      className="relative w-full h-full"
                      style={{
                        background: `linear-gradient(180deg, ${char.colorPrimary}18 0%, transparent 65%)`,
                      }}
                    >
                      <NextImage
                        src={char.posePng}
                        alt={`${char.name} — ${role}`}
                        fill
                        className="object-contain p-4 drop-shadow-[0_12px_30px_rgba(0,0,0,0.1)]"
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 380px"
                        priority={i === 0}
                      />
                    </div>
                  </ScrapbookCard>

                  {/* Name + catchphrase under the card */}
                  <div className="mt-10 text-center space-y-2">
                    <h3 className="content-h3 text-selah-dark group-hover:text-selah-orange transition-colors">
                      {char.name}
                    </h3>
                    <p className="body-text !max-w-none text-selah-muted italic text-[0.95rem]">
                      {t(char.catchphrase.en, char.catchphrase.es)}
                    </p>
                    <p className="ui-caption text-selah-orange/80 inline-flex items-center gap-1.5">
                      {t('Read story', 'Leer historia')}
                      <ArrowRight size={12} className="translate-y-[0.5px]" />
                    </p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </section>

      {/* Bottom CTA — SectionShell-wrapped so it sits cleanly on the spine. */}
      <SectionShell className="text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="content-h2 mb-4 tracking-tight"
        >
          {t('Want to see them in action?', '¿Quieres verlos en acción?')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="body-text mx-auto mb-10 max-w-lg"
        >
          {t(
            'Watch the crew sing, dance, and worship together on our YouTube channel.',
            'Mira al equipo cantar, bailar y adorar juntos en nuestro canal de YouTube.',
          )}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.04, y: -3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="inline-block"
        >
          <Link
            href={lh('/watch')}
            className="inline-flex items-center gap-3 px-10 py-4 bg-selah-orange text-white rounded-2xl ui-button shadow-[0_20px_40px_-10px_rgba(255,92,0,0.4)] hover:shadow-[0_30px_60px_-10px_rgba(255,92,0,0.5)] transition-all duration-300"
          >
            {t('Watch Our Videos', 'Ver Nuestros Videos')}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </SectionShell>
    </PageShell>
  );
}
