'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type AspectRatio = '4/5' | '3/4' | '1/1' | '16/9' | '16/10' | '3/2';

const ASPECT_CLASS: Record<AspectRatio, string> = {
  '4/5': 'aspect-[4/5]',
  '3/4': 'aspect-[3/4]',
  '1/1': 'aspect-square',
  '16/9': 'aspect-video',
  '16/10': 'aspect-[16/10]',
  '3/2': 'aspect-[3/2]',
};

export interface ScrapbookCardProps {
  children: ReactNode;
  /** Optional corner flourish — typically a `<FloatingBadge>`. */
  badge?: ReactNode;
  /**
   * Aspect ratio of the inner image well. Defaults to 4/5 (the homepage
   * About-section portrait). Use 16/9 for video thumbs, 1/1 for team
   * avatars.
   */
  ratio?: AspectRatio;
  /** Tilt of the main card, in degrees. Default 1.5. */
  tiltMain?: number;
  /** Tilt of the counter-rotated backing card, in degrees. Default -3. */
  tiltBacking?: number;
  /** Extra Tailwind classes on the outermost positioning wrapper. */
  className?: string;
  /**
   * When true, suppress the matte `p-3` padding on the main card so the
   * image bleeds edge-to-edge. Useful for video thumbnails where the
   * paper mat looks too formal.
   */
  noMatte?: boolean;
}

/**
 * Layered "scrapbook photo card" — two paper layers (counter-rotated
 * backing + slightly-tilted main card) with an inner image well. The
 * signature visual on About, Watch cards, Characters grid, and anywhere
 * else a photo needs to feel placed rather than pasted.
 *
 * - Backing layer: `--paper-warm` cardstock, rotated the opposite direction,
 *   absolutely positioned to sit just behind the main card. Purely
 *   decorative (aria-hidden).
 * - Main card: `--paper-cream` cardstock with a slight clockwise tilt
 *   and a `p-3` matte edge around the image (unless `noMatte`). The inner
 *   well is rounded and overflow-hidden so the child image clips correctly.
 * - Motion: both tilts collapse to 0 under `prefers-reduced-motion`; the
 *   hover-lift (`translate-y -4` on main) is also skipped.
 *
 * Pair with `<FloatingBadge>` via the `badge` prop for the full homepage
 * About-section look. The badge positions itself at `absolute -bottom-8
 * -right-8` relative to this card's outermost wrapper.
 */
export function ScrapbookCard({
  children,
  badge,
  ratio = '4/5',
  tiltMain = 1.5,
  tiltBacking = -3,
  className = '',
  noMatte = false,
}: ScrapbookCardProps) {
  const reduceMotion = usePrefersReducedMotion();
  const mainRotate = reduceMotion ? 0 : tiltMain;
  const backingRotate = reduceMotion ? 0 : tiltBacking;
  const wellClass = ASPECT_CLASS[ratio];

  return (
    <div className={`relative group ${className}`}>
      {/* Backing layer — absolute so it does not contribute to layout flow. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl bg-[var(--paper-warm)] bg-[image:var(--paper-grain)] bg-[length:96px_96px] shadow-[var(--paper-shadow-2)] pointer-events-none"
        style={{ transform: `rotate(${backingRotate}deg) scale(1.03)` }}
      />

      {/* Main card — the paper matte that holds the image. */}
      <motion.div
        className={`relative w-full rounded-2xl bg-[var(--paper-cream)] bg-[image:var(--paper-grain)] bg-[length:96px_96px] shadow-[var(--paper-shadow-3)] ${noMatte ? 'p-0' : 'p-3'} transition-shadow duration-500 group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2),0_20px_40px_-10px_rgba(0,0,0,0.1)]`}
        style={{ transform: `rotate(${mainRotate}deg)` }}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      >
        <div className={`relative w-full overflow-hidden ${noMatte ? 'rounded-2xl' : 'rounded-xl'} ${wellClass}`}>
          {children}
        </div>
      </motion.div>

      {badge}
    </div>
  );
}
