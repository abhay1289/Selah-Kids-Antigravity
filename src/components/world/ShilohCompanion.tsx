'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, type MotionValue, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';

/**
 * Shiloh — the sheep companion that trots along the bottom-left of the viewport,
 * spring-chasing the user's cursor. Awwwards-signature living-world flourish.
 *
 * Performance contract:
 *  - We never subscribe to cursor/scroll through React state. Position is driven
 *    by Framer `useMotionValue` + `useSpring` (which update a MotionValue in a
 *    RAF ticker outside React). The single `useEffect` runs a RAF loop that
 *    reads `--world-mouse-x` from :root (written by WorldProvider) and pokes
 *    the motion value. Re-render budget: zero for position updates.
 *  - Idle/sleep state IS React state because it toggles rarely (once per 8s
 *    of inactivity at most). A single re-render on wake/sleep is acceptable.
 *  - Hidden entirely under `prefers-reduced-motion: reduce` or viewport < 640px.
 */

const IDLE_MS = 8000;
const MOBILE_BREAKPOINT = 640;
const DESKTOP_SIZE = 96;
const MOBILE_SIZE = 64;
const BOTTOM_OFFSET = 80; // px from bottom viewport edge
const LEFT_ANCHOR = 40; // px from left (resting position)

export default function ShilohCompanion() {
  // Visibility gate — checked on mount. We render nothing server-side / pre-gate
  // to avoid any layout flicker or asset fetch for users who shouldn't see him.
  const [enabled, setEnabled] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);

  // Raw cursor-x (viewport pixels). Updated by RAF reading CSS var.
  // Default to the anchor so spring doesn't jump on mount.
  const cursorX = useMotionValue(LEFT_ANCHOR);

  // Spring-damped x — this is what we apply to transform. Trotting-sheep feel.
  const springX = useSpring(cursorX, { stiffness: 120, damping: 18, mass: 1 });

  // Signed horizontal velocity of the spring (px/s). Negative = moving left.
  // This is the single source of truth for "is Shiloh running?" — everything
  // else (trot amplitude, lean tilt, stretch) is derived from this.
  const velocityX = useVelocity(springX);

  // Trot phase — advances every frame at a rate proportional to |velocity|.
  // When Shiloh is still, phase freezes and the bounce sits at zero. When
  // he's chasing at full speed, phase ticks ~4× per sec → legs trot visibly.
  // This replaces the old scroll-driven bob which was a dead placeholder.
  const trotPhase = useMotionValue(0);

  // Body bounce. Amplitude scales from 0 (idle) → 5px (full chase).
  const bobY = useTransform([trotPhase, velocityX], ([p, v]: number[]) => {
    const intensity = Math.min(Math.abs(v) / 600, 1);
    return Math.sin(p) * 5 * intensity;
  });

  // Forward lean in the direction of motion. Clamped so he never over-rotates.
  // Positive v (moving right) → lean right (positive degrees, then flipped
  // back by scaleX when facing left so lean always reads "forward").
  const leanDeg = useTransform(velocityX, (v) => {
    const raw = v * 0.012;
    return Math.max(-7, Math.min(7, raw));
  });

  // Vertical stretch-and-squash on the bounce. Scales up 1→1.04 on the down
  // beat, back to 1 on the up beat. Sells the "pushing off the ground" read.
  const trotScaleY = useTransform([trotPhase, velocityX], ([p, v]: number[]) => {
    const intensity = Math.min(Math.abs(v) / 600, 1);
    return 1 + Math.max(0, -Math.sin(p)) * 0.04 * intensity;
  });

  // Contact-shadow flattens as the bounce lifts him off the ground.
  const shadowScale = useTransform(bobY, (y) => 1 - Math.min(Math.abs(y) / 20, 0.35));

  // Facing direction. Positive when cursor is to the right of Shiloh (he looks right),
  // negative when cursor is to his left (flip horizontally).
  // Sourced from the DIFFERENCE between the spring-smoothed x and cursor x so that
  // the flip follows his chase target, not a jittery pointer.
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    if (window.innerWidth < MOBILE_BREAKPOINT) return;

    setEnabled(true);

    const root = document.documentElement;
    let rafId = 0;
    let lastTs = performance.now();
    let lastPointerMove = performance.now();
    let phase = 0;

    const onPointerMove = () => {
      lastPointerMove = performance.now();
      if (isSleepingRef.current) {
        isSleepingRef.current = false;
        setIsSleeping(false);
      }
    };
    // Avoid reading the state value in RAF closure — keep a ref.
    const isSleepingRef = { current: false };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTs) / 1000, 0.05); // clamp at 50ms so a tab-blur doesn't jump the phase
      lastTs = now;

      // Read cursor target off the CSS var written by WorldProvider.
      const cs = getComputedStyle(root);
      const mx = parseFloat(cs.getPropertyValue('--world-mouse-x')) || 0.5;
      const targetX = mx * window.innerWidth;
      cursorX.set(targetX);

      // Advance trot phase at a rate proportional to |velocity|. Units: phase
      // is in radians. Full chase (~800px/s) → ~12 rad/s → ~1.9 gait cycles/s
      // which reads as a brisk trot. Idle → phase freezes in place.
      const vMag = Math.abs(velocityX.get());
      const gaitSpeed = Math.min(vMag / 60, 12); // rad/s, saturates at full chase
      phase += gaitSpeed * dt;
      trotPhase.set(phase);

      // Idle detection — React state updates only on transitions, so this is
      // cheap. setState on an already-true value is a no-op in React.
      if (!isSleepingRef.current && now - lastPointerMove > IDLE_MS) {
        isSleepingRef.current = true;
        setIsSleeping(true);
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [cursorX, trotPhase, velocityX]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        bottom: BOTTOM_OFFSET,
        width: '100vw',
        height: 0,
        pointerEvents: 'none',
        zIndex: 40,
      }}
    >
      {/* Shiloh + his shadow share the same horizontal motion value so they
          move as one. We center the sprite on `springX` by offsetting the
          wrapper by half the sprite width in CSS (translateX: -50% + x).
          Framer reads the `x` motion value every frame via its own RAF. */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          x: springX,
          y: bobY,
          willChange: 'transform',
        }}
        // Prepend a -50% translate so `x` centers the sheep on the cursor column.
        transformTemplate={(_, generated) => `translate(-50%, 0) ${generated}`}
      >
        {/* Contact shadow — sits just beneath the sheep, flatter and softer
            than the sprite silhouette so Shiloh feels grounded. The shadow
            width shrinks inversely with bounce height so the sheep reads as
            lifting off the ground on the up beat. */}
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: -6,
            width: 72,
            height: 14,
            translateX: '-50%',
            scaleX: shadowScale,
            background:
              'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(40,28,14,0.55), rgba(40,28,14,0) 70%)',
            filter: 'blur(3px)',
            opacity: isSleeping ? 0.22 : 0.35,
            transition: 'opacity 600ms ease',
          }}
        />

        <ShilohSprite
          cursorX={cursorX}
          springX={springX}
          leanDeg={leanDeg}
          trotScaleY={trotScaleY}
          isSleeping={isSleeping}
        />
      </motion.div>

      {/* Scoped keyframes for sleep Z particle. Kept inline so this file is
          self-contained and no extra CSS import is needed in LayoutShell. */}
      <style>{`
        @keyframes shiloh-z-float {
          0%   { transform: translate(-50%, 0) scale(0.6); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translate(-50%, -42px) scale(1); opacity: 0; }
        }
        @keyframes shiloh-breathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}

/**
 * Inner sprite — split out so the facing flip can subscribe to motion values
 * without forcing the parent wrapper to re-render.
 */
function ShilohSprite({
  cursorX,
  springX,
  leanDeg,
  trotScaleY,
  isSleeping,
}: {
  cursorX: MotionValue<number>;
  springX: MotionValue<number>;
  leanDeg: MotionValue<number>;
  trotScaleY: MotionValue<number>;
  isSleeping: boolean;
}) {
  // Flip when cursor is to the LEFT of Shiloh's spring-smoothed position.
  // Small deadband (-4px) prevents jitter when cursor sits right on top of him.
  const scaleX = useTransform([cursorX, springX], ([c, s]: number[]) =>
    c < s - 4 ? -1 : 1,
  );
  const size = typeof window !== 'undefined' && window.innerWidth < 768 ? MOBILE_SIZE : DESKTOP_SIZE;

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        position: 'relative',
        scaleX,
        transformOrigin: '50% 100%',
      }}
    >
      {/* Inner rig — lean + stretch live INSIDE the scaleX flip so a
          "forward" lean always reads forward in the facing direction.
          If we applied rotate alongside scaleX on the outer wrapper, a
          leftward-moving Shiloh would visually tilt backward (the flip
          mirrors the rotation). Rotating on the inner wrapper pre-mirrors
          the lean for free. */}
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          rotate: leanDeg,
          scaleY: trotScaleY,
          transformOrigin: '50% 100%',
          willChange: 'transform',
        }}
      >
      <motion.img
        src="/SK_Shiloh_Intro_Pose.png"
        alt=""
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          WebkitMaskImage:
            'radial-gradient(ellipse 55% 58% at 50% 48%, #000 58%, rgba(0,0,0,0.8) 72%, transparent 88%)',
          maskImage:
            'radial-gradient(ellipse 55% 58% at 50% 48%, #000 58%, rgba(0,0,0,0.8) 72%, transparent 88%)',
          filter:
            'drop-shadow(0 10px 12px rgba(40,28,14,0.22)) drop-shadow(0 2px 4px rgba(40,28,14,0.16))',
          opacity: isSleeping ? 0.9 : 1,
          animation: isSleeping
            ? 'shiloh-breathe 3s ease-in-out infinite'
            : undefined,
          transform: isSleeping ? 'scale(0.9)' : 'scale(1)',
          transition: 'opacity 600ms ease, transform 600ms ease',
        }}
      />

      {isSleeping && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '60%',
            top: 4,
            fontFamily: "'Fredoka', -apple-system, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: '#f8ead1',
            textShadow: '0 1px 2px rgba(40,28,14,0.35)',
            animation: 'shiloh-z-float 2.4s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        >
          z
        </span>
      )}
      </motion.div>
    </motion.div>
  );
}
