'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useSpring, type MotionValue } from 'framer-motion';
import { AtmosSpine, type AtmosSpineProps } from './AtmosSpine';

export interface PageShellRenderContext {
  /** Page-level scroll progress (0 → 1). Share with hero parallax, etc. */
  scrollYProgress: MotionValue<number>;
}

export interface PageShellProps {
  /**
   * Children, or a render function that receives the page-level
   * `scrollYProgress`. Use the function form when a hero/section wants
   * to wire its own `useTransform` off the same scroll driver the spine
   * already consumes — that way the page only pays for one scroll
   * subscription.
   */
  children: ReactNode | ((ctx: PageShellRenderContext) => ReactNode);
  /** Render a 3px orange scroll progress bar pinned to the top. Default `true`. */
  showScrollBar?: boolean;
  /**
   * Overrides for the atmospheric spine's gradient stops. Pages with short
   * scroll extents (Contact, Privacy) can pass tighter ranges to avoid a
   * frozen-feeling atmosphere.
   */
  spineStops?: Pick<AtmosSpineProps, 'stopsCx1' | 'stopsCy1' | 'stopsCx2' | 'stopsCy2'>;
  /** Extra classes on the outermost wrapper. */
  className?: string;
  /** Additional classes on the inner `<main>` wrapper. */
  mainClassName?: string;
  /**
   * When true, skip rendering the paper-fibers texture overlay. Pages
   * with dark themes (Sensory) or their own fine-grain texture (Music)
   * should opt out.
   */
  noPaperTexture?: boolean;
}

/**
 * Canonical page root for every public route.
 *
 * Responsibilities:
 *   1. Holds the scroll container ref and wires `useScroll` once per page.
 *   2. Renders `<AtmosSpine>` with the page's scroll progress so the
 *      atmosphere drifts as the visitor scrolls.
 *   3. Lays down the paper-fibers texture overlay — previously duplicated
 *      on every PageClient — as a single absolutely-positioned layer.
 *   4. Optionally renders a 3px orange scroll progress bar at the top.
 *   5. Exposes children inside a `<main>` landmark so every page has the
 *      correct ARIA hierarchy without each PageClient remembering.
 *
 * The spine is `position: fixed`, so it is NOT a child of the container
 * ref — it is a sibling that consumes the scroll progress. This avoids
 * layering issues with `overflow-hidden` on the scroll container.
 */
export function PageShell({
  children,
  showScrollBar = true,
  spineStops,
  className = '',
  mainClassName = '',
  noPaperTexture = false,
}: PageShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const content =
    typeof children === 'function' ? children({ scrollYProgress }) : children;

  return (
    <>
      <AtmosSpine scrollYProgress={scrollYProgress} {...spineStops} />

      {showScrollBar && (
        <motion.div
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuemin={0}
          aria-valuemax={100}
          className="fixed top-0 left-0 right-0 h-[3px] bg-selah-orange origin-left z-[60] pointer-events-none"
          style={{ scaleX }}
        />
      )}

      <div
        ref={containerRef}
        className={`relative min-h-screen selection:bg-selah-orange selection:text-white overflow-x-hidden ${className}`}
      >
        {/* Paper-fibers texture — one overlay per page, not per section. */}
        {!noPaperTexture && (
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }}
          />
        )}

        <main className={`relative z-10 ${mainClassName}`}>{content}</main>
      </div>
    </>
  );
}
