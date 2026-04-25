'use client';
import Image from 'next/image';
import { motion, useReducedMotion, useAnimationControls } from 'framer-motion';
import { Play, Sparkles, ListMusic, Shuffle } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { EPISODES, getTodaysPick, type Episode } from '../../data/catalog';
import { useMedia } from '../../contexts/MediaContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { localDateString } from '../../lib/today';

const LABELS_EN = ["Today’s Pick", 'Sunday Starter', 'Car-ride Special', 'Midweek Calm', 'Wake-up Joy', 'Family Story Time', 'Dinner Table Question'];
const LABELS_ES = ['Elección de Hoy', 'Comienzo del Domingo', 'Especial de Viaje', 'Calma de la Semana', 'Alegría Matutina', 'Cuento Familiar', 'Pregunta en la Mesa'];

const CATEGORY_LABEL_EN: Record<Episode['category'], string> = {
  'music-video': 'Music Video',
  'sing-along': 'Sing-Along',
  sensory: 'Sensory',
};
const CATEGORY_LABEL_ES: Record<Episode['category'], string> = {
  'music-video': 'Video Musical',
  'sing-along': 'Canta con nosotros',
  sensory: 'Sensorial',
};

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Today's Episode + Playlist — YouTube-playlist styled.
 *
 * Layout (mobile → desktop):
 *
 *   ┌────────────────────────────────────────┐
 *   │  Today's Pick · header badge           │
 *   │  ┌────────────────────────────────┐    │
 *   │  │ Cover thumbnail (16:9 hero)    │    │  ← tap = play today's pick
 *   │  │   + title/meta overlay         │    │
 *   │  └────────────────────────────────┘    │
 *   │  [Play all ▶]  [Shuffle ⤮]  "7 videos" │
 *   ├────────────────────────────────────────┤
 *   │  #1  [thumb]  Title              ⏱3:35 │
 *   │             Music Video · EN           │
 *   │  #2  [thumb]  Title              ⏱3:20 │
 *   │  …                                     │
 *   └────────────────────────────────────────┘
 *
 * Why this shape:
 *   - The old horizontal rail (`flex overflow-x-auto`) forced users to
 *     swipe to see more — invisible discoverability on a one-handed
 *     mobile screen.
 *   - YouTube's vertical playlist pattern is the one non-technical users
 *     already recognize. Numbered rows + duration chips + 16:9 thumbs
 *     communicate "more where this came from" without explanation.
 *   - All tap targets are full-width rows ≥ 56px tall — thumb-native.
 *   - On desktop (md+) the hero stays large and the list takes the full
 *     width beneath it; no awkward side-by-side that breaks on narrow
 *     viewports.
 */
export default function TodaysEpisode() {
  const { openEpisode, mode } = useMedia();
  const { t, language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimationControls();
  const [isHandingOff, setIsHandingOff] = useState(false);
  const prevModeRef = useRef(mode);

  // Single Date instance — pick-date and weekday label must agree even
  // around a day boundary. Derived from LOCAL calendar.
  const now = new Date();
  const today = localDateString(now);
  const pick = getTodaysPick(today);
  const label = (language === 'EN' ? LABELS_EN : LABELS_ES)[now.getDay()];
  const pickTitle = language === 'ES' && pick.titleEs ? pick.titleEs : pick.title;
  const pickDuration = formatDuration(pick.durationSec);

  // The playlist body = the pick + 7 other episodes matching the current
  // locale so the list feels coherent to EN vs ES visitors. Falls back
  // to any-locale slots if there aren't enough same-locale episodes.
  const playlist = useMemo<Episode[]>(() => {
    const want = language === 'EN' ? 'EN' : 'ES';
    const sameLocale = EPISODES.filter((e) => e.id !== pick.id && e.language === want);
    const otherLocale = EPISODES.filter((e) => e.id !== pick.id && e.language !== want);
    const rest = [...sameLocale, ...otherLocale].slice(0, 7);
    return [pick, ...rest];
  }, [language, pick]);

  const categoryLabel = (c: Episode['category']) =>
    (language === 'EN' ? CATEGORY_LABEL_EN : CATEGORY_LABEL_ES)[c];

  // When the overlay transitions from expanded→hidden, restore the card.
  if (prevModeRef.current !== mode) {
    prevModeRef.current = mode;
    if (mode === 'hidden' && isHandingOff) {
      setIsHandingOff(false);
      controls.start({ opacity: 1, scale: 1, rotate: 0, y: 0, transition: { duration: 0.2 } });
    }
  }

  const openPickAnimated = async () => {
    const el = buttonRef.current;
    if (!el) return;

    if (shouldReduceMotion) {
      openEpisode(pick, EPISODES);
      return;
    }

    const initialRect = el.getBoundingClientRect();
    const needsScroll = initialRect.top < 0 || initialRect.bottom > window.innerHeight;
    if (needsScroll) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      await new Promise((resolve) => window.setTimeout(resolve, 320));
    }

    const rect = el.getBoundingClientRect();
    const sourceRect = { x: rect.left, y: rect.top, width: rect.width, height: rect.height };

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

    window.setTimeout(() => openEpisode(pick, EPISODES, sourceRect), 220);
  };

  const playAll = () => {
    // Open the first item (today's pick) with the full playlist as the
    // queue. MediaContext's `openEpisode(first, list)` signature already
    // supports this — the overlay's next/prev buttons cycle through the
    // supplied list.
    openEpisode(playlist[0], playlist);
  };

  const shufflePlay = () => {
    const shuffled = [...playlist].sort(() => Math.random() - 0.5);
    openEpisode(shuffled[0], shuffled);
  };

  // Action buttons — same shape on mobile + desktop, but they live in
  // different containers (under the hero on mobile, in the playlist
  // header on desktop). Defining once keeps copy + handlers DRY.
  const actionButtons = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={playAll}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-selah-dark text-white text-[13px] font-semibold shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)] hover:bg-selah-orange transition-colors"
        aria-label={t('Play all videos in this playlist', 'Reproducir todos los videos de la lista')}
      >
        <Play size={14} fill="currentColor" aria-hidden />
        {t('Play all', 'Reproducir todo')}
      </button>
      <button
        type="button"
        onClick={shufflePlay}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-selah-dark/10 text-selah-dark text-[13px] font-semibold hover:bg-selah-orange/10 hover:border-selah-orange/30 transition-colors"
        aria-label={t('Shuffle the playlist', 'Mezclar la lista')}
      >
        <Shuffle size={14} aria-hidden />
        {t('Shuffle', 'Mezclar')}
      </button>
    </div>
  );

  // Playlist <ol> — reused by both mobile (full width, no scroll) and
  // desktop (right column, max-height + overflow). The visual styling
  // adapts via the wrapper, not the rows themselves.
  const playlistList = (
    <ol className="divide-y divide-selah-dark/5">
      {playlist.map((ep, i) => {
        const title = language === 'ES' && ep.titleEs ? ep.titleEs : ep.title;
        const isActive = i === 0;
        return (
          <li key={ep.id}>
            <button
              type="button"
              onClick={() => openEpisode(ep, playlist)}
              aria-label={t(`Play ${title}`, `Reproducir ${title}`)}
              className={`w-full flex items-stretch gap-3 sm:gap-4 px-3 sm:px-4 py-3 text-left group focus-visible:outline-none focus-visible:bg-selah-orange/5 transition-colors ${
                isActive ? 'bg-selah-orange/[0.06]' : 'hover:bg-selah-dark/[0.03]'
              }`}
            >
              {/* Index column — small, muted; "▶" indicator on active row. */}
              <div className="w-5 sm:w-7 flex-shrink-0 flex items-center justify-center">
                {isActive ? (
                  <Play size={12} className="text-selah-orange" fill="currentColor" aria-hidden />
                ) : (
                  <span className="text-[12px] sm:text-[13px] font-semibold text-selah-muted/60 tabular-nums">
                    {i + 1}
                  </span>
                )}
              </div>

              {/* Thumbnail — 16:9, fixed width, duration chip. */}
              <div className="relative flex-shrink-0 w-[108px] sm:w-[140px] aspect-video rounded-lg overflow-hidden bg-black">
                <Image
                  src={ep.thumbnail}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 108px, 140px"
                />
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-white text-[10px] font-semibold tabular-nums">
                  {formatDuration(ep.durationSec)}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
                  <div className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center">
                    <Play size={14} className="text-selah-dark ml-[1.5px]" fill="currentColor" aria-hidden />
                  </div>
                </div>
              </div>

              {/* Meta column. */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div
                  className={`text-[13.5px] sm:text-[15px] font-semibold leading-[1.25] line-clamp-2 transition-colors ${
                    isActive ? 'text-selah-orange' : 'text-selah-dark group-hover:text-selah-orange'
                  }`}
                >
                  {title}
                </div>
                <div className="ui-label text-selah-muted/80 mt-1.5 truncate">
                  {categoryLabel(ep.category)} · {ep.language}
                  {ep.sensoryFriendly && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-[1px] rounded bg-[#93D35C]/15 text-[#5a7d62] text-[9px] font-bold tracking-wide uppercase">
                      {t('Sensory', 'Sensorial')}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );

  // Hero thumbnail — shared between mobile and desktop, just sized
  // differently by its parent column.
  const heroThumbnail = (
    <motion.button
      ref={buttonRef}
      initial={{ opacity: 0, y: 24, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 250, damping: 25, mass: 1 }}
      animate={controls}
      whileHover={isHandingOff ? undefined : { scale: 1.006 }}
      whileTap={isHandingOff ? undefined : { scale: 0.996 }}
      onClick={openPickAnimated}
      aria-label={t(`Play ${pickTitle}`, `Reproducir ${pickTitle}`)}
      aria-hidden={isHandingOff}
      style={{
        pointerEvents: isHandingOff ? 'none' : undefined,
        transformOrigin: 'center center',
        willChange: 'transform',
      }}
      className="group relative block w-full aspect-video rounded-2xl md:rounded-[28px] overflow-hidden cursor-pointer shadow-[0_30px_60px_-18px_rgba(20,10,0,0.32),0_8px_20px_-8px_rgba(20,10,0,0.16)] ring-1 ring-white/60 bg-black"
    >
      <Image
        src={pick.thumbnail}
        alt={pickTitle}
        fill
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
        priority
        sizes="(max-width: 1024px) 100vw, 800px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Duration chip bottom-right */}
      <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 px-2 py-1 rounded-md bg-black/80 text-white text-[11px] md:text-[12px] font-semibold tracking-wide">
        {pickDuration}
      </div>

      {/* Playlist count pill top-left */}
      <div className="absolute top-3 left-3 md:top-5 md:left-5 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/70 text-white text-[11px] md:text-[12px] font-semibold backdrop-blur-sm">
        <ListMusic size={12} aria-hidden />
        <span>{t(`${playlist.length} videos`, `${playlist.length} videos`)}</span>
      </div>

      {/* Title overlay */}
      <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 text-white text-left">
        <div className="text-[18px] md:text-[26px] lg:text-[32px] font-display font-bold leading-[1.1] tracking-[-0.01em] drop-shadow-lg mb-1 line-clamp-2">
          {pickTitle}
        </div>
        <div className="ui-label text-white/85">
          {categoryLabel(pick.category)} · {pick.language}
        </div>
      </div>

      {/* Center play button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={false}
          className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-[0_16px_32px_-8px_rgba(0,0,0,0.45)]"
          aria-hidden
        >
          <Play size={24} className="md:hidden text-selah-dark ml-[3px]" fill="currentColor" />
          <Play size={36} className="hidden md:block lg:hidden text-selah-dark ml-[3px]" fill="currentColor" />
          <Play size={44} className="hidden lg:block text-selah-dark ml-[4px]" fill="currentColor" />
        </motion.div>
      </div>
    </motion.button>
  );

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 md:py-24">
      {/* Header pill — same on every viewport. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 flex items-center gap-3 flex-wrap"
      >
        <span className="glass-thin inline-flex items-center gap-2 rounded-full px-4 py-2 ui-label text-selah-orange">
          <Sparkles size={14} aria-hidden className="text-selah-orange" />
          {label}
        </span>
        <span className="ui-label text-selah-muted/70 hidden sm:inline">
          {t('Hand-picked for your family', 'Elegido a mano para tu familia')}
        </span>
      </motion.div>

      {/*
        Layout switches at lg (1024px+):
          - Mobile / tablet: stacked. Hero → Play all/Shuffle → playlist.
          - Desktop: two-column. LEFT = hero + meta strip below.
                                 RIGHT = sticky-header playlist with
                                         scrollable body, bounded to the
                                         hero's vertical extent so the
                                         section reads as one block.
        The right column's max-height matches the hero's typical height
        at lg+ (aspect-video × ~640px col width ≈ 360px hero, plus the
        meta strip → ~480px total). The scroll lives entirely inside the
        playlist <div> so the rest of the page never bounces.
      */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_440px] gap-6 lg:gap-8 items-start">
        {/* LEFT — hero + (desktop-only) meta strip beneath. */}
        <div className="space-y-4 lg:space-y-5">
          {heroThumbnail}

          {/* Meta strip below the hero — desktop-only. On mobile the
              hero overlay already shows the title + category. Adding it
              again would be redundant; instead mobile gets the action
              row right below. */}
          <div className="hidden lg:flex items-start justify-between gap-4 px-1">
            <div className="min-w-0">
              <h3 className="content-h3 text-selah-dark tracking-tight leading-tight line-clamp-2">
                {pickTitle}
              </h3>
              <p className="ui-label text-selah-muted/80 mt-2">
                {categoryLabel(pick.category)} · {pick.language} · {pickDuration}
                {pick.sensoryFriendly && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-[1px] rounded bg-[#93D35C]/15 text-[#5a7d62] text-[9px] font-bold tracking-wide uppercase">
                    {t('Sensory', 'Sensorial')}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Mobile / tablet action row — desktop has these in the
              playlist column header instead so they read as "controls
              for the queue", not "controls for the hero". */}
          <div className="lg:hidden flex items-center gap-2">
            {actionButtons}
            <span className="ml-auto text-[12px] text-selah-muted/80 hidden sm:inline">
              {t('Updated daily', 'Actualizado a diario')}
            </span>
          </div>
        </div>

        {/* RIGHT — playlist column. */}
        <aside
          aria-label={t('Playlist', 'Lista de reproducción')}
          className="rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-white/70 shadow-[0_16px_40px_-20px_rgba(20,10,0,0.15)] flex flex-col lg:max-h-[680px]"
        >
          {/* Sticky header on desktop — title + actions + count. On
              mobile this header is hidden because the action row is up
              with the hero. */}
          <div className="hidden lg:flex flex-col gap-3 px-4 py-4 border-b border-selah-dark/5 bg-white/80 backdrop-blur-sm">
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <div className="ui-label text-selah-orange tracking-[0.2em]">
                  {t('Up next', 'A continuación')}
                </div>
                <div className="text-[13px] text-selah-muted/80 mt-0.5">
                  1 / {playlist.length} · {t('Updated daily', 'Actualizado a diario')}
                </div>
              </div>
            </div>
            {actionButtons}
          </div>

          <div className="lg:overflow-y-auto lg:flex-1">{playlistList}</div>
        </aside>
      </div>
    </section>
  );
}
