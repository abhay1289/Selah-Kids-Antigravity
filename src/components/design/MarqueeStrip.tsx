'use client';

import type { ComponentType, SVGProps } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export type MarqueeIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

export interface MarqueeStripItem {
  text: string;
  icon: MarqueeIcon;
}

export interface MarqueeStripProps {
  items: MarqueeStripItem[];
  /** Background Tailwind color class, e.g. `bg-selah-orange`. Default `bg-selah-orange`. */
  bg?: string;
  /** Text color Tailwind class for the words. Default `text-white`. */
  textColor?: string;
  /** Icon color Tailwind class. Default `text-selah-yellow`. */
  iconColor?: string;
  /** Degrees of rotation on the strip. Default `-2`. */
  rotate?: number;
  /** Animation duration in seconds. Lower = faster marquee. Default `20`. */
  durationSec?: number;
  /** How many times to repeat the item list before the loop wraps. Default `6`. */
  repeats?: number;
  /** Icon size in px. Default `40`. */
  iconSize?: number;
}

/**
 * Horizontal marquee strip used on About, Parents, Donate, Blog landing.
 *
 * - Renders `repeats` copies of the item list so the CSS translation can
 *   loop seamlessly (the animate `x: ["0%", "-50%"]` relies on the list
 *   being wider than the viewport).
 * - Respects `prefers-reduced-motion`: the strip stops animating and the
 *   content sits statically centered.
 * - Rotated slightly for scrapbook personality; pair with paper-cream
 *   sections above and below so the orange slab feels like a cut-paper
 *   overlay rather than a full-bleed band.
 */
export function MarqueeStrip({
  items,
  bg = 'bg-selah-orange',
  textColor = 'text-white',
  iconColor = 'text-selah-yellow',
  rotate = -2,
  durationSec = 20,
  repeats = 6,
  iconSize = 40,
}: MarqueeStripProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div
      className={`w-full overflow-hidden ${bg} py-6 md:py-10 scale-105 my-8 md:my-12 shadow-xl relative z-20`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <motion.div
        className={`flex whitespace-nowrap gap-8 items-center ${reduceMotion ? 'justify-center' : ''}`}
        animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
        transition={reduceMotion ? undefined : { duration: durationSec, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: reduceMotion ? 1 : repeats }).map((_, repeatIdx) => (
          <div
            key={repeatIdx}
            className="flex items-center gap-8"
            aria-hidden={repeatIdx > 0 ? 'true' : undefined}
          >
            {items.map(({ text, icon: Icon }, i) => (
              <span key={`${repeatIdx}-${i}`} className="flex items-center gap-8">
                <span className={`content-h3 ${textColor} uppercase tracking-widest`}>{text}</span>
                <Icon className={iconColor} size={iconSize} />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
