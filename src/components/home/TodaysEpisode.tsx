'use client';
import Image from 'next/image';
import { motion, useReducedMotion, useAnimationControls } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { EPISODES, getTodaysPick } from '../../data/catalog';
import { useMedia } from '../../contexts/MediaContext';
import { useLanguage } from '../../contexts/LanguageContext';

const LABELS_EN = ["Today’s Pick", 'Sunday Starter', 'Car-ride Special', 'Midweek Calm', 'Wake-up Joy', 'Family Story Time', 'Dinner Table Question'];
const LABELS_ES = ['Elección de Hoy', 'Comienzo del Domingo', 'Especial de Viaje', 'Calma de la Semana', 'Alegría Matutina', 'Cuento Familiar', 'Pregunta en la Mesa'];

export default function TodaysEpisode() {
  const { openEpisode, mode } = useMedia();
  const { t, language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimationControls();
  const [isHandingOff, setIsHandingOff] = useState(false);
  const prevModeRef = useRef(mode);
  // Single Date instance so weekday label can't skew from the UTC day
  // used for pick selection (and keeps the component deterministic even
  // if render spans a day boundary).
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const pick = getTodaysPick(today);
  const rest = EPISODES.filter((e) => e.id !== pick.id).slice(0, 6);
  const label = (language === 'EN' ? LABELS_EN : LABELS_ES)[now.getDay()];
  const pickTitle = language === 'ES' && pick.titleEs ? pick.titleEs : pick.title;
  const pickDuration = `${Math.floor(pick.durationSec / 60)}:${String(pick.durationSec % 60).padStart(2, '0')}`;

  // When the overlay transitions from expanded→hidden, restore the card (visible + interactive).
  // Derived from context mode — avoids useEffect.
  if (prevModeRef.current !== mode) {
    prevModeRef.current = mode;
    if (mode === 'hidden' && isHandingOff) {
      setIsHandingOff(false);
      controls.start({ opacity: 1, scale: 1, rotate: 0, y: 0, transition: { duration: 0.2 } });
    }
  }

  const openTodayPick = async () => {
    const el = buttonRef.current;
    if (!el) return;

    // Reduced motion: skip the paper-toss gesture, just open.
    if (shouldReduceMotion) {
      openEpisode(pick, EPISODES);
      return;
    }

    // Mobile edge: scroll the card into view first, then capture the post-scroll rect.
    const initialRect = el.getBoundingClientRect();
    const needsScroll = initialRect.top < 0 || initialRect.bottom > window.innerHeight;
    if (needsScroll) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      await new Promise((resolve) => window.setTimeout(resolve, 320));
    }

    const rect = el.getBoundingClientRect();
    const sourceRect = { x: rect.left, y: rect.top, width: rect.width, height: rect.height };

    // Paper-toss gesture: the card gets picked up, tilted, then fades out as the overlay takes over.
    setIsHandingOff(true);
    controls
      .start({
        scale: [1, 1.06, 1.04],
        rotate: [0, -3, 2],
        y: [0, -8, -4],
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], times: [0, 0.55, 1] },
      })
      .then(() => {
        controls.start({ opacity: 0, transition: { duration: 0.18, ease: 'easeOut' } });
      });

    // Launch the overlay slightly before the gesture finishes so the toss and catch overlap.
    window.setTimeout(() => openEpisode(pick, EPISODES, sourceRect), 220);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 flex items-center gap-3"
      >
        <span className="glass-thin inline-flex items-center gap-2 rounded-full px-4 py-2 ui-label text-selah-orange">
          <Sparkles size={14} aria-hidden className="text-selah-orange" />
          {label}
        </span>
        <span className="ui-label text-selah-muted/70 hidden sm:inline">
          {t('Hand-picked for your family', 'Elegido a mano para tu familia')}
        </span>
      </motion.div>

      <motion.button
        ref={buttonRef}
        initial={{ opacity: 0, y: 24, scale: 0.99 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: 'spring', stiffness: 250, damping: 25, mass: 1 }}
        animate={controls}
        whileHover={isHandingOff ? undefined : { scale: 1.006 }}
        whileTap={isHandingOff ? undefined : { scale: 0.996 }}
        onClick={openTodayPick}
        aria-label={t(`Play ${pickTitle}`, `Reproducir ${pickTitle}`)}
        aria-hidden={isHandingOff}
        style={{
          pointerEvents: isHandingOff ? 'none' : undefined,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
        className="group relative block w-full aspect-video rounded-[32px] overflow-hidden mb-12 cursor-pointer shadow-[0_40px_80px_-20px_rgba(20,10,0,0.35),0_10px_24px_-8px_rgba(20,10,0,0.18)] ring-1 ring-white/60 bg-black"
      >
        <Image
          src={pick.thumbnail}
          alt={pickTitle}
          fill
          className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white text-left">
          <div className="content-h2 leading-[1.05] tracking-[-0.02em] drop-shadow-lg mb-2">{pickTitle}</div>
          <div className="ui-label text-white/85">{pickDuration} · {pick.language}</div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={false}
            className="w-24 h-24 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-[0_20px_40px_-8px_rgba(0,0,0,0.45)] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
            aria-hidden
          >
            <Play size={40} className="text-selah-dark ml-1" fill="currentColor" />
          </motion.div>
        </div>
      </motion.button>

      <h3 className="content-h3 mb-6 tracking-tight">{t('From the catalog', 'Del catálogo')}</h3>
      <div className="flex gap-5 overflow-x-auto pb-4 snap-x scroll-smooth -mx-6 px-6 scrollbar-hide">
        {rest.map((ep) => {
          const title = language === 'ES' && ep.titleEs ? ep.titleEs : ep.title;
          return (
            <motion.button
              key={ep.id}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={() => openEpisode(ep, EPISODES)}
              aria-label={t(`Play ${title}`, `Reproducir ${title}`)}
              className="snap-start shrink-0 w-72 text-left rounded-2xl overflow-hidden glass-regular shadow-[0_12px_32px_-10px_rgba(20,10,0,0.18)] hover:shadow-[0_24px_60px_-16px_rgba(20,10,0,0.28)] transition-shadow duration-500"
            >
              <div className="relative aspect-video">
                <Image src={ep.thumbnail} alt={title} fill className="object-cover" sizes="288px" />
              </div>
              <div className="p-4">
                <div className="font-semibold text-selah-dark truncate">{title}</div>
                <div className="ui-label text-selah-muted mt-1">{ep.language} · {Math.floor(ep.durationSec / 60)}m</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
