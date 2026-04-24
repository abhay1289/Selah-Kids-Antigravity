'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface FloatingBadgeProps {
  children: ReactNode;
  /**
   * Resting tilt in degrees. Defaults to 10 (matches the homepage "Made by
   * parents" badge). The badge is scripted to bounce back to `rotate - 4`
   * on hover, so pick a value slightly above your intended center.
   */
  rotate?: number;
  /** Extra Tailwind classes (e.g. `absolute -bottom-8 -right-8`). */
  className?: string;
}

/**
 * The warm paper pill used as a corner flourish on scrapbook photo cards.
 *
 * - Background: `--paper-cream` cardstock with `--paper-grain` fractal noise
 *   so it reads as printed paper, not glass.
 * - Type: `ui-label` (Fredoka 11px UPPERCASE, letter-spacing 0.12em).
 * - Motion: mounts with a subtle spring rotate-in, lifts + tilts back on
 *   hover. Both fades are skipped when the user prefers reduced motion.
 *
 * Position the badge with Tailwind utilities on the parent (`absolute
 * -bottom-8 -right-8` etc.) — this component owns look, not placement.
 */
export function FloatingBadge({
  children,
  rotate = 10,
  className = '',
}: FloatingBadgeProps) {
  const reduceMotion = usePrefersReducedMotion();

  const initial = reduceMotion
    ? { opacity: 1, y: 0, rotate }
    : { opacity: 0, y: 20, rotate: rotate - 4 };
  const whileInView = { opacity: 1, y: 0, rotate };
  const whileHover = reduceMotion ? undefined : { y: -4, rotate: rotate - 4 };

  return (
    <motion.div
      initial={initial}
      whileInView={whileInView}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={whileHover}
      transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.4 }}
      className={className}
    >
      <div className="bg-[var(--paper-cream)] bg-[image:var(--paper-grain)] bg-[length:96px_96px] px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/50 flex items-center justify-center">
        <span className="ui-label text-selah-dark tracking-widest">{children}</span>
      </div>
    </motion.div>
  );
}
