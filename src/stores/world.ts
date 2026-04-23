'use client';

import { create } from 'zustand';

/**
 * Time-of-day moods. Each string is also a CSS class on <html> that maps to
 * a palette of CSS custom properties (see globals.css).
 */
export type Mood = 'dawn' | 'noon' | 'golden' | 'dusk';

export interface WorldState {
  /** Current time-of-day mood. Initialised from an inline <head> script to avoid SSR hydration flip. */
  mood: Mood;
  /** Section the user is currently looking at. Used by the companion's path-finder (later PR). */
  activeSection: string | null;
  /** Master switch for the Shiloh sheep companion. Defaults on; can be disabled
   *  for per-route opt-out (e.g. checkout, video fullscreen) without unmounting
   *  the LayoutShell. Read-only from outside — flip via `setShilohEnabled`. */
  shilohEnabled: boolean;
  setMood: (m: Mood) => void;
  setActiveSection: (id: string | null) => void;
  setShilohEnabled: (v: boolean) => void;
}

/**
 * Read-only global state for the "living pop-up book" world.
 *
 * IMPORTANT: Do NOT subscribe to scroll or cursor in this store. High-frequency
 * values (scroll-y, mouse-x/y) are written directly to CSS custom properties on
 * :root by the Lenis RAF ticker — reading them through React would re-render the
 * whole tree 60× per second. See WorldProvider.
 */
export const useWorld = create<WorldState>((set) => ({
  mood: 'noon',
  activeSection: null,
  shilohEnabled: true,
  setMood: (mood) => set({ mood }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setShilohEnabled: (shilohEnabled) => set({ shilohEnabled }),
}));

/**
 * Map the user's local hour to a mood. Kept deliberately coarse — we don't want
 * the palette flipping at minute boundaries.
 */
export function moodForHour(hour: number): Mood {
  if (hour >= 5 && hour < 10) return 'dawn';
  if (hour >= 10 && hour < 16) return 'noon';
  if (hour >= 16 && hour < 19) return 'golden';
  return 'dusk';
}
