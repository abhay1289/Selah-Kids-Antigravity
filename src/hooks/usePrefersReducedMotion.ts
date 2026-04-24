'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  // Server-side render assumes motion is allowed; the hook re-reads the real
  // preference on hydration via the subscription.
  return false;
}

/**
 * Returns `true` when the user has asked the OS for reduced motion.
 *
 * Usage:
 *   const reduceMotion = usePrefersReducedMotion();
 *   const anim = reduceMotion ? {} : { y: [-10, 10, -10] };
 *
 * Implementation uses `useSyncExternalStore` so it stays correct across
 * concurrent renders and avoids the effect-based race conditions the
 * matchMedia polling pattern is prone to.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
