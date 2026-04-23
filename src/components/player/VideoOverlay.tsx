'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useAnimationControls } from 'framer-motion';
import { X, SkipBack, SkipForward, ChevronDown, Minimize2, Gauge } from 'lucide-react';
import { useMedia } from '../../contexts/MediaContext';
import { Episode } from '../../data/catalog';

declare global { interface Window { YT: any; onYouTubeIframeAPIReady: () => void; } }

export default function VideoOverlay() {
  const {
    nowPlaying,
    queue,
    mode,
    sourceRect,
    openEpisode,
    closeEpisode,
    minimize,
    next,
    previous,
  } = useMedia();

  const currentIndex = nowPlaying ? queue.findIndex(ep => ep.id === nowPlaying.id) : -1;
  const hasNext = currentIndex >= 0 && currentIndex < queue.length - 1;
  const hasPrevious = currentIndex > 0;

  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [ccEnabled, setCcEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }, []);

  const initPlayer = useCallback(() => {
    if (!window.YT || !window.YT.Player || !nowPlaying || !videoContainerRef.current) return;

    if (player) {
      player.loadVideoById(nowPlaying.youtubeId);
      return;
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const newPlayer = new window.YT.Player(videoContainerRef.current, {
      videoId: nowPlaying.youtubeId,
      playerVars: {
        origin,
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
        cc_load_policy: 1,
        autoplay: 1,
      },
      events: {
        onReady: (event: any) => {
          setPlayer(event.target);
          event.target.playVideo();
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
          else setIsPlaying(false);

          if (event.data === window.YT.PlayerState.ENDED) {
            next();
          }
        },
      },
    });
  }, [nowPlaying, player, next]);

  useEffect(() => {
    if (mode === 'expanded' && nowPlaying) {
      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        window.onYouTubeIframeAPIReady = () => {
          initPlayer();
        };
      }
    }
  }, [mode, nowPlaying, initPlayer]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (timerMinutes !== null && timerMinutes > 0 && mode === 'expanded') {
      timeoutId = setTimeout(() => {
        closeEpisode();
        setTimerMinutes(null);
      }, timerMinutes * 60 * 1000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timerMinutes, mode, closeEpisode]);

  // Focus trap and escape key
  useEffect(() => {
    if (mode !== 'expanded') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEpisode();
      if (e.key === 'Tab' && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mode, closeEpisode]);

  const toggleSpeed = () => {
    if (!player) return;
    const speeds = [0.5, 1, 1.5, 2];
    const nextSpeed = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    player.setPlaybackRate(nextSpeed);
    setSpeed(nextSpeed);
  };

  const toggleCC = () => {
    if (!player) return;
    if (ccEnabled) {
      player.unloadModule('captions');
      player.unloadModule('cc');
    } else {
      player.loadModule('captions');
      player.loadModule('cc');
    }
    setCcEnabled(!ccEnabled);
  };

  const useHandoff = !!sourceRect && !shouldReduceMotion;

  // Outer modal container: when handing off from a source rect, we let the inner video frame
  // carry the motion (scripted FLIP from source rect → centered). When not handing off, keep
  // the cinematic spring-from-below entrance.
  const animationProps = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : useHandoff
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 0, transition: { duration: 0.24, ease: [0.4, 0, 0.6, 1] as const } } }
    : {
        initial: { opacity: 0, y: 60, scale: 0.94 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 120, damping: 22, mass: 0.8 } },
        exit: { opacity: 0, y: 40, scale: 0.96, transition: { duration: 0.28, ease: [0.4, 0, 0.6, 1] as const } },
      };

  // Paper-card hand-off via imperative Framer controls:
  //   1. Video frame mounts at its natural centered layout position.
  //   2. The callback ref measures the frame's target rect synchronously (before paint), computes
  //      the FLIP delta from sourceRect, and calls controls.set(...) so Framer instantly holds the
  //      frame at the source card's position — no flash.
  //   3. On the next rAF, we call controls.start({identity, spring}) to animate the frame from
  //      sourceRect into the centered ambilight — the "picture-card caught" motion.
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const handoffControls = useAnimationControls();
  const handoffAppliedRef = useRef(false);

  // Reset FLIP state when the overlay closes so a subsequent open re-runs the hand-off.
  if (mode !== 'expanded' && handoffAppliedRef.current) {
    handoffAppliedRef.current = false;
  }

  const videoFrameCallbackRef = useCallback((node: HTMLDivElement | null) => {
    videoFrameRef.current = node;
    if (!node) return;
    if (!useHandoff || !sourceRect || handoffAppliedRef.current) return;
    const target = node.getBoundingClientRect();
    if (target.width === 0 || target.height === 0) return;
    const dx = sourceRect.x - target.left;
    const dy = sourceRect.y - target.top;
    const sx = sourceRect.width / target.width;
    const sy = sourceRect.height / target.height;
    handoffAppliedRef.current = true;
    // Synchronously park the frame at the source rect (before paint).
    handoffControls.set({ x: dx, y: dy, scaleX: sx, scaleY: sy, rotate: 2 });
    // Next frame: spring to identity (centered, square, upright).
    requestAnimationFrame(() => {
      handoffControls.start({
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        transition: { type: 'spring', stiffness: 180, damping: 22, mass: 1 },
      });
    });
  }, [useHandoff, sourceRect, handoffControls]);

  // E-AMB — Category-driven ambilight. Replaces black backdrop with a bloom of the episode's emotional colour.
  const ambilight: Record<Episode['category'], string> = {
    'music-video': 'radial-gradient(90vw 80vh at 50% 36%, rgba(255,140,60,0.62), rgba(120,40,0,0.35) 42%, transparent 68%), linear-gradient(180deg, rgba(24,10,0,0.96), rgba(10,4,0,0.98))',
    'sing-along': 'radial-gradient(90vw 80vh at 50% 36%, rgba(255,110,160,0.58), rgba(120,20,60,0.32) 42%, transparent 68%), linear-gradient(180deg, rgba(24,6,16,0.96), rgba(10,2,8,0.98))',
    'sensory': 'radial-gradient(90vw 80vh at 50% 36%, rgba(110,140,255,0.56), rgba(30,50,140,0.32) 42%, transparent 68%), linear-gradient(180deg, rgba(6,8,22,0.96), rgba(2,3,14,0.98))',
  };
  const ambBg = nowPlaying ? ambilight[nowPlaying.category] : undefined;

  return (
    <AnimatePresence>
      {mode === 'expanded' && nowPlaying && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] backdrop-blur-2xl flex justify-center items-center p-4 xl:p-8 overflow-y-auto"
          style={{ background: ambBg }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeEpisode();
          }}
        >
          <motion.div
            {...animationProps}
            className="relative w-full max-w-[1200px] flex flex-col xl:flex-row gap-6 items-start my-auto"
          >
            {/* Main Video Area — scripted paper-card hand-off: FLIPs from the source card's rect to the
                centered layout position via imperative animation controls. When not handing off, renders
                statically (the outer container carries the spring-from-below entrance). */}
            <motion.div
              ref={videoFrameCallbackRef}
              animate={useHandoff ? handoffControls : undefined}
              style={useHandoff ? { transformOrigin: 'top left' } : undefined}
              className="flex-1 w-full bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="relative w-full pt-[56.25%]">
                <div
                  ref={videoContainerRef}
                  className="absolute inset-0 w-full h-full"
                />
                {/* Poster frame — holds the thumbnail visible underneath while YT iframe boots, so the morph doesn't land on a black frame.
                    Fade it out as soon as the YT player is ready (or playing), not only on actual playback, so the user can click play if autoplay is blocked. */}
                {nowPlaying && (
                  <motion.img
                    src={nowPlaying.thumbnail}
                    alt=""
                    aria-hidden
                    initial={false}
                    animate={{ opacity: player || isPlaying ? 0 : 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut', delay: player && !isPlaying ? 0.25 : 0 }}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                )}
              </div>

              {/* Controls */}
              <div className="p-4 bg-zinc-900 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <button
                    onClick={previous}
                    disabled={!hasPrevious}
                    className="p-2 text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                    aria-label="Previous episode"
                  >
                    <SkipBack className="w-6 h-6" />
                  </button>
                  <button
                    onClick={next}
                    disabled={!hasNext}
                    className="p-2 text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                    aria-label="Next episode"
                  >
                    <SkipForward className="w-6 h-6" />
                  </button>
                  <button
                    onClick={toggleSpeed}
                    className="p-2 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full flex items-center gap-2"
                    aria-label="Toggle playback speed"
                  >
                    <Gauge className="w-5 h-5" />
                    <span className="text-sm font-medium">{speed}x</span>
                  </button>
                  <button
                    onClick={toggleCC}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                      ccEnabled ? 'bg-white text-black' : 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20'
                    }`}
                    aria-label="Toggle closed captions"
                  >
                    CC
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <button
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white flex items-center gap-2"
                      aria-label="Set bedtime timer"
                    >
                      {timerMinutes ? `${timerMinutes}m` : 'Timer'}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-full right-0 mb-2 w-32 bg-zinc-800 rounded-lg shadow-xl border border-white/10 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      {[5, 10, 15, 30].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => setTimerMinutes(mins)}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        >
                          {mins} minutes
                        </button>
                      ))}
                      {timerMinutes && (
                        <button
                          onClick={() => setTimerMinutes(null)}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors border-t border-white/10"
                        >
                          Clear timer
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={minimize}
                    className="p-2 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                    aria-label="Minimize player"
                  >
                    <Minimize2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right Rail / Queue */}
            <div className="w-full xl:w-80 flex-shrink-0 bg-zinc-900 rounded-2xl p-4 shadow-2xl border border-white/10 max-h-[600px] overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-4">Up Next</h3>
              <div className="flex flex-col gap-3">
                {queue.map((episode) => (
                  <button
                    key={episode.id}
                    onClick={() => openEpisode(episode)}
                    className={`flex items-start gap-3 p-2 rounded-xl transition-colors text-left ${
                      nowPlaying.id === episode.id ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-24 aspect-video bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <img
                        src={episode.thumbnail}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white line-clamp-2">
                        {episode.title}
                      </p>
                      <p className="text-xs text-white/60 mt-1 line-clamp-1">
                        {episode.dateLabel}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={closeEpisode}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full"
              aria-label="Close player"
              autoFocus
            >
              <X className="w-8 h-8" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}