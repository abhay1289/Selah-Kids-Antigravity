'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import type { Character } from '../../data/characters';
import { useLanguage } from '../../contexts/LanguageContext';

interface CharacterHeroProps {
  character: Character;
}

/**
 * Character detail hero — lifted to the site's light/cream theme so it
 * blends seamlessly with CharacterVerse and CharacterEpisodes below.
 *
 * Previous version used `bg-zinc-950 text-white` and rendered the
 * favorite verse inline, which collided with the now-uniform paper-cream
 * aesthetic and duplicated the verse card in CharacterVerse. Both fixed:
 *   - No local background color — PageShell / AtmosSpine owns the page
 *     ambience now, so the hero flows into the sections below without a
 *     visual seam.
 *   - Verse rendering moved entirely to CharacterVerse.
 *   - The character's `colorPrimary` still drives the name color, the
 *     blurred accent blob, and the watermark letters — just at tasteful
 *     opacities for a light surface.
 *   - Dropped the unwired `Play my theme song` button (it was
 *     console.log-only, dead weight).
 */
export default function CharacterHero({ character }: CharacterHeroProps) {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  // Gentler parallax on the light surface — aggressive transforms look
  // jittery against the paper-grain; ±6% keeps it subtle.
  const textX = useTransform(smoothProgress, [0, 1], ['0%', '6%']);
  const characterY = useTransform(smoothProgress, [0, 1], ['0%', '-6%']);

  const role = language === 'ES' ? (character.roleEs || character.role) : character.role;
  const catchphrase = language === 'ES' ? character.catchphrase?.es : character.catchphrase?.en;

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden"
    >
      {/* Soft color washes — tuned for a light surface so they read as
          ambient glow, not saturated slabs. */}
      <div
        className="absolute top-[-10%] left-[10%] w-[480px] h-[480px] rounded-full pointer-events-none opacity-[0.18] blur-[120px]"
        style={{ backgroundColor: character.colorPrimary }}
      />
      <div
        className="absolute bottom-[-8%] right-[8%] w-[420px] h-[420px] rounded-full pointer-events-none opacity-[0.14] blur-[110px]"
        style={{ backgroundColor: character.colorAccent || character.colorPrimary }}
      />

      {/* Giant watermark — low opacity so it's a texture, not a focal point. */}
      <motion.div
        aria-hidden="true"
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[22vw] font-black tracking-tighter pointer-events-none uppercase font-display select-none"
        style={{ x: textX, color: character.colorPrimary, opacity: 0.06 }}
      >
        {character.name}
      </motion.div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Character pose */}
        <motion.div
          className="relative h-[48vh] lg:h-[60vh] flex items-center justify-center lg:justify-end"
          style={{ y: characterY }}
        >
          <div className="relative w-full h-full max-w-lg">
            <Image
              src={character.posePng}
              alt={character.name}
              fill
              priority
              className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
              sizes="(max-width: 1024px) 92vw, 520px"
            />
          </div>
        </motion.div>

        {/* Right column — role, name, catchphrase */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="ui-label text-selah-muted tracking-[0.2em]"
          >
            {role}
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="hero-headline tracking-tight leading-[1.02]"
            style={{ color: character.colorPrimary }}
          >
            {character.name}
          </motion.h1>

          {catchphrase && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="text-2xl md:text-3xl italic font-light text-selah-dark/75 border-l-4 pl-6 max-w-xl"
              style={{ borderColor: character.colorPrimary }}
            >
              &ldquo;{catchphrase}&rdquo;
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
