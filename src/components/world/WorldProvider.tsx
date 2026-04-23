'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { moodForHour, useWorld } from '../../stores/world';

/**
 * Master RAF + smooth scroll. Writes high-frequency values (scroll progress,
 * cursor position) directly to CSS custom properties on :root so downstream
 * components can consume them via CSS `var()` or canvas reads-from-ref —
 * never through React state.
 */
export function WorldProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const setMood = useWorld((s) => s.setMood);

  useEffect(() => {
    // Mood — sync zustand with the class the inline <head> script set on <html>.
    const root = document.documentElement;
    const initialClass = (['dawn', 'noon', 'golden', 'dusk'] as const).find((m) =>
      root.classList.contains(`mood-${m}`),
    );
    if (initialClass) {
      setMood(initialClass);
    } else {
      const m = moodForHour(new Date().getHours());
      root.classList.add(`mood-${m}`);
      setMood(m);
    }

    // Re-evaluate mood every 5 min in case the user leaves the tab open across a boundary.
    const moodTimer = window.setInterval(() => {
      const next = moodForHour(new Date().getHours());
      const current = (['dawn', 'noon', 'golden', 'dusk'] as const).find((m) =>
        root.classList.contains(`mood-${m}`),
      );
      if (current !== next) {
        if (current) root.classList.remove(`mood-${current}`);
        root.classList.add(`mood-${next}`);
        setMood(next);
      }
    }, 5 * 60_000);

    // Lenis smooth scroll.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({
      duration: prefersReduced ? 0 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReduced,
    });
    lenisRef.current = lenis;

    // Wire Lenis → GSAP ScrollTrigger. Lenis emits its own 'scroll' event
    // but ScrollTrigger listens to native window scroll, so without this
    // ScrollTrigger never updates under Lenis's virtual scroll.
    // Dynamic import so GSAP stays out of the first-paint bundle.
    let detachScroll: (() => void) | null = null;
    (async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const { default: gsap } = await import('gsap');
      gsap.registerPlugin(ScrollTrigger);
      const update = () => ScrollTrigger.update();
      lenis.on('scroll', update);
      // ScrollTrigger also needs to know a refresh happened when Lenis resizes.
      ScrollTrigger.refresh();
      detachScroll = () => lenis.off('scroll', update);
    })();

    // Master ticker. Writes scroll + cursor to CSS vars.
    let mouseX = 0.5;
    let mouseY = 0.5;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', onMouseMove, { passive: true });

    let rafId = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      const progress = lenis.progress; // 0..1 over entire page
      root.style.setProperty('--world-scroll', progress.toFixed(4));
      root.style.setProperty('--world-mouse-x', mouseX.toFixed(4));
      root.style.setProperty('--world-mouse-y', mouseY.toFixed(4));
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.clearInterval(moodTimer);
      window.removeEventListener('pointermove', onMouseMove);
      cancelAnimationFrame(rafId);
      if (detachScroll) detachScroll();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setMood]);

  return <>{children}</>;
}
