'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type Density = 'tight' | 'normal' | 'loose';

const PY_CLASS: Record<Density, string> = {
  tight: 'py-10 md:py-14',
  normal: 'py-16 md:py-24',
  loose: 'py-24 md:py-36',
};

const SECTION_ENTRANCE = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
} as const;

export interface SectionShellProps {
  children: ReactNode;
  /** Anchor id for deep-linking (`#about`, `#faq`, etc.). */
  id?: string;
  /** Vertical rhythm preset. Default `normal`. */
  py?: Density;
  /** Extra classes on the outer `<section>`. */
  className?: string;
  /** Inner wrapper classes (max-width + padding). Default `max-w-7xl mx-auto px-6`. */
  innerClassName?: string;
  /** Override the viewport-triggered entrance. Set `false` to disable. */
  animate?: boolean;
}

/**
 * Canonical wrapper for every content section below a hero.
 *
 * - Consistent vertical rhythm via the `py` preset (tight / normal / loose).
 * - Inner container is `max-w-7xl mx-auto px-6` by default.
 * - Wraps children in a once-per-view entrance (opacity + y50 → 0), the
 *   same variant used across the homepage. Pass `animate={false}` for
 *   sections that need to stay visible from first paint (e.g. short
 *   hero-adjacent blocks where the fade feels delayed).
 *
 * Use this everywhere instead of re-writing the `<motion.div initial="hidden"
 * whileInView="visible" ...>` dance in each PageClient.
 */
export function SectionShell({
  children,
  id,
  py = 'normal',
  className = '',
  innerClassName = 'max-w-7xl mx-auto px-6',
  animate = true,
}: SectionShellProps) {
  const pyClass = PY_CLASS[py];

  if (!animate) {
    return (
      <section id={id} className={`${pyClass} relative ${className}`}>
        <div className={innerClassName}>{children}</div>
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={SECTION_ENTRANCE}
      className={`${pyClass} relative ${className}`}
    >
      <div className={innerClassName}>{children}</div>
    </motion.section>
  );
}
