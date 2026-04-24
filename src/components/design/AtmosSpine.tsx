'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

export interface AtmosSpineProps {
  /**
   * Page-level scroll progress (0 → 1) from a `useScroll` call. The spine
   * uses this to drift its two radial gradient centers so the atmospheric
   * colour-grade changes as the visitor scrolls.
   */
  scrollYProgress: MotionValue<number>;
  /** First radial center X stops, mapped across [0, 0.5, 1] scroll progress. */
  stopsCx1?: [string, string, string];
  stopsCy1?: [string, string, string];
  stopsCx2?: [string, string, string];
  stopsCy2?: [string, string, string];
}

const DEFAULT_CX_1: [string, string, string] = ['18%', '62%', '82%'];
const DEFAULT_CY_1: [string, string, string] = ['18%', '48%', '68%'];
const DEFAULT_CX_2: [string, string, string] = ['84%', '38%', '18%'];
const DEFAULT_CY_2: [string, string, string] = ['78%', '62%', '32%'];

/**
 * Fixed, mood-aware atmospheric background. Owns the page's colour-grade.
 *
 * - Mounts a single `.atmos-spine` element (styled in globals.css).
 * - Wires four CSS custom properties (--spine-cx-1/cy-1/cx-2/cy-2) to the
 *   passed scrollYProgress so the gradient centers drift as you scroll.
 * - Consumes mood vars (--mood-warm/cool/bg-top/mid/bot) set by the
 *   time-of-day script in `src/app/layout.tsx`, so the spine automatically
 *   picks up dawn / noon / golden / dusk palettes.
 *
 * Drop one of these inside a page shell component; it replaces the
 * hardcoded gradient backgrounds that previously lived on every page.
 */
export function AtmosSpine({
  scrollYProgress,
  stopsCx1 = DEFAULT_CX_1,
  stopsCy1 = DEFAULT_CY_1,
  stopsCx2 = DEFAULT_CX_2,
  stopsCy2 = DEFAULT_CY_2,
}: AtmosSpineProps) {
  const spineCx1 = useTransform(scrollYProgress, [0, 0.5, 1], stopsCx1);
  const spineCy1 = useTransform(scrollYProgress, [0, 0.5, 1], stopsCy1);
  const spineCx2 = useTransform(scrollYProgress, [0, 0.5, 1], stopsCx2);
  const spineCy2 = useTransform(scrollYProgress, [0, 0.5, 1], stopsCy2);

  return (
    <motion.div
      className="atmos-spine"
      aria-hidden="true"
      style={{
        ['--spine-cx-1' as unknown as string]: spineCx1,
        ['--spine-cy-1' as unknown as string]: spineCy1,
        ['--spine-cx-2' as unknown as string]: spineCx2,
        ['--spine-cy-2' as unknown as string]: spineCy2,
      }}
    />
  );
}
