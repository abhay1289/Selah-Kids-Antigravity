'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Episode } from '../data/catalog';

export type PlayerState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended';
export type PlayerMode = 'hidden' | 'expanded' | 'minimized';

/** Origin rect for the paper-card hand-off. Captured via getBoundingClientRect on the source button at click time. */
export interface SourceRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface MediaContextValue {
  mode: PlayerMode;
  nowPlaying: Episode | null;
  queue: Episode[];
  state: PlayerState;
  /** Optional rect captured from the clicked card — VideoOverlay animates the video frame from this rect to centered. */
  sourceRect: SourceRect | null;
  openEpisode: (episode: Episode, queue?: Episode[], sourceRect?: SourceRect) => void;
  closeEpisode: () => void;
  minimize: () => void;
  expand: () => void;
  next: () => void;
  previous: () => void;
  setState: (s: PlayerState) => void;
}

const MediaContext = createContext<MediaContextValue | undefined>(undefined);

export const MediaProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PlayerMode>('hidden');
  const [nowPlaying, setNowPlaying] = useState<Episode | null>(null);
  const [queue, setQueue] = useState<Episode[]>([]);
  const [state, setState] = useState<PlayerState>('idle');
  const [sourceRect, setSourceRect] = useState<SourceRect | null>(null);

  const openEpisode = useCallback((episode: Episode, newQueue?: Episode[], sourceRect?: SourceRect) => {
    setMode('expanded');
    setNowPlaying(episode);
    setQueue(newQueue || [episode]);
    setState('loading');
    setSourceRect(sourceRect ?? null);
  }, []);

  const closeEpisode = useCallback(() => {
    setMode('hidden');
    setNowPlaying(null);
    setState('idle');
    setSourceRect(null);
  }, []);

  const minimize = useCallback(() => {
    setMode('minimized');
  }, []);

  const expand = useCallback(() => {
    setMode('expanded');
  }, []);

  const next = useCallback(() => {
    if (!nowPlaying) return;
    const currentIndex = queue.findIndex(e => e.id === nowPlaying.id);
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      setNowPlaying(queue[currentIndex + 1]);
      setState('loading');
    } else {
      closeEpisode();
    }
  }, [nowPlaying, queue, closeEpisode]);

  const previous = useCallback(() => {
    if (!nowPlaying) return;
    const currentIndex = queue.findIndex(e => e.id === nowPlaying.id);
    if (currentIndex > 0) {
      setNowPlaying(queue[currentIndex - 1]);
      setState('loading');
    }
  }, [nowPlaying, queue]);

  const value = {
    mode,
    nowPlaying,
    queue,
    state,
    sourceRect,
    openEpisode,
    closeEpisode,
    minimize,
    expand,
    next,
    previous,
    setState
  };

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error('useMedia must be used within MediaProvider');
  return ctx;
};
