'use client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Maximize2, SkipForward } from 'lucide-react';
import { useMedia } from '../../contexts/MediaContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MiniPlayer() {
  const { mode, nowPlaying, state, setState, closeEpisode, expand, next } = useMedia();
  const { language } = useLanguage();

  const isPlaying = state === 'playing';
  const togglePlay = () => setState(isPlaying ? 'paused' : 'playing');
  const title = nowPlaying ? (language === 'ES' && nowPlaying.titleEs ? nowPlaying.titleEs : nowPlaying.title) : '';

  return (
    <AnimatePresence>
      {mode === 'minimized' && nowPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring' as const, damping: 25, stiffness: 300 }}
          whileHover={{ scale: 1.02 }}
          className="fixed bottom-safe right-4 sm:bottom-4 z-[90] w-[280px] sm:w-[320px] aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black flex flex-col group cursor-pointer"
          onClick={expand}
          role="button"
          tabIndex={0}
          aria-label="Expand mini player"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              expand();
            }
          }}
        >
          {nowPlaying.thumbnail && (
            <Image
              src={nowPlaying.thumbnail}
              alt={title || 'Video thumbnail'}
              fill
              className="object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeEpisode();
              }}
              className="p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close player"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                expand();
              }}
              className="p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Maximize player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-0 inset-x-0 p-3 flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm font-semibold truncate ui-label">
                {title}
              </h3>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              {next && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Skip to next"
                >
                  <SkipForward className="w-4 h-4" fill="currentColor" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5" fill="currentColor" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}