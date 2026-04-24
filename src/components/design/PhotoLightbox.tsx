'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface LightboxPhoto {
  /** Absolute or root-relative image path. */
  src: string;
  /** Meaningful alt text (required). */
  alt: string;
  /** Optional caption shown beneath the image. */
  caption?: string;
  /** Width + height are required so Next/Image can preserve aspect ratio. */
  width: number;
  height: number;
}

export interface PhotoLightboxProps {
  photos: LightboxPhoto[];
  /** Index of the currently-open photo. Null means closed. */
  openIndex: number | null;
  /** Fires on ESC, backdrop click, or close button. */
  onClose: () => void;
  /** Fires when the user navigates to another photo. */
  onIndexChange: (nextIndex: number) => void;
  /** Optional element rendered above the caption (icons, tags, etc.). */
  header?: ReactNode;
}

/**
 * Accessible photo lightbox with keyboard controls, focus trap, and
 * arrow-key navigation.
 *
 * Interaction model:
 *   - ESC closes.
 *   - Left / Right arrow keys cycle through the photo array.
 *   - Clicking the dark backdrop closes; clicking the photo itself does
 *     not (so captions can be selected without an accidental dismiss).
 *   - Focus is trapped inside the dialog and returned to the trigger
 *     element on close (the caller is responsible for re-focusing — we
 *     signal via `onClose`).
 *   - Respects `prefers-reduced-motion` by swapping the spring fade-in
 *     for an instant transition.
 *
 * The component is self-contained; it does NOT own the open index,
 * because sharing state with the caller (which rendered the triggers)
 * is cleaner than syncing through a context.
 */
export function PhotoLightbox({
  photos,
  openIndex,
  onClose,
  onIndexChange,
  header,
}: PhotoLightboxProps) {
  const reduceMotion = usePrefersReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [announce, setAnnounce] = useState<string>('');

  // Keyboard controls — must not run when closed.
  useEffect(() => {
    if (openIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onIndexChange((openIndex + 1) % photos.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onIndexChange((openIndex - 1 + photos.length) % photos.length);
      } else if (e.key === 'Tab') {
        // Trap tab-focus inside the dialog. Shift+Tab from the close
        // button should jump to the last focusable; Tab from the last
        // focusable wraps to the close button.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openIndex, onClose, onIndexChange, photos.length]);

  // Move focus to the close button on open; announce the new photo to
  // screen readers each time the index changes.
  useEffect(() => {
    if (openIndex === null) return;
    closeBtnRef.current?.focus();
    const photo = photos[openIndex];
    if (photo) {
      setAnnounce(`${photo.alt} (${openIndex + 1} of ${photos.length})`);
    }
  }, [openIndex, photos]);

  // Lock body scroll while the lightbox is open so scroll-wheel does
  // not bleed through to the page underneath.
  useEffect(() => {
    if (openIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openIndex]);

  const current = openIndex !== null ? photos[openIndex] : null;
  const duration = reduceMotion ? 0 : 0.3;

  return (
    <AnimatePresence>
      {openIndex !== null && current && (
        <motion.div
          key="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          ref={dialogRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-8"
          onClick={onClose}
        >
          {/* Live region for screen reader announcements */}
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {announce}
          </span>

          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-[var(--paper-cream)] text-selah-dark flex items-center justify-center shadow-lg hover:scale-105 transition-transform focus-visible:outline-none"
          >
            <X size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  onIndexChange((openIndex - 1 + photos.length) % photos.length);
                }}
                className="absolute left-4 sm:left-8 z-10 w-12 h-12 rounded-full bg-[var(--paper-cream)] text-selah-dark flex items-center justify-center shadow-lg hover:scale-105 transition-transform focus-visible:outline-none"
              >
                <ChevronLeft size={22} strokeWidth={2.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  onIndexChange((openIndex + 1) % photos.length);
                }}
                className="absolute right-4 sm:right-8 z-10 w-12 h-12 rounded-full bg-[var(--paper-cream)] text-selah-dark flex items-center justify-center shadow-lg hover:scale-105 transition-transform focus-visible:outline-none"
              >
                <ChevronRight size={22} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </>
          )}

          <motion.div
            key={`lightbox-photo-${openIndex}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-[var(--paper-cream)] p-2 rounded-2xl shadow-2xl">
              <Image
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                className="rounded-xl object-contain max-h-[75vh] w-auto h-auto"
                sizes="90vw"
                priority
              />
            </div>
            {header}
            {current.caption && (
              <p className="text-white/90 text-base sm:text-lg body-text max-w-[760px] text-center">
                {current.caption}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
