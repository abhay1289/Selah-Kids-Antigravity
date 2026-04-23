"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'white' | 'outline';
  icon?: LucideIcon;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  disabled?: boolean;
}

/* D2.5 — Premium restraint. One hover lift, one press, one focus ring.
   No magnetic drift, no ripple, no glow loop, no shimmer, no icon wiggle.
   Physical weight comes from tuned elevation + soft transform on a static bounding box. */
export function Button({ children, variant = 'primary', icon: Icon, className = "", onClick, type = 'button', style, disabled }: ButtonProps) {
  const variants = {
    primary:
      "bg-selah-orange text-white border border-selah-orange/40 " +
      "[box-shadow:var(--elevation-warm-3)] hover:[box-shadow:var(--elevation-warm-4)]",
    white:
      "bg-white text-selah-dark border border-white/80 " +
      "[box-shadow:var(--elevation-2)] hover:[box-shadow:var(--elevation-4)]",
    outline:
      "border-2 border-selah-dark text-selah-dark bg-transparent " +
      "hover:bg-selah-dark hover:text-white " +
      "[box-shadow:var(--elevation-1)] hover:[box-shadow:var(--elevation-3)]",
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={style}
      whileHover={disabled ? undefined : { y: -2, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`relative px-6 py-3 sm:px-8 sm:py-4 rounded-full ui-button flex items-center justify-center gap-3 transition-[box-shadow,background-color,color] duration-200 whitespace-nowrap flex-shrink-0 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${variants[variant]} ${className}`}
    >
      <span className="flex items-center justify-center gap-3 whitespace-nowrap">
        {children}
      </span>
      {Icon && <Icon size={22} strokeWidth={2.5} aria-hidden />}
    </motion.button>
  );
}

export function BouncingDots() {
  return (
    <div className="flex gap-2 items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-selah-orange rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ 
            duration: 0.6, 
            repeat: Infinity, 
            delay: i * 0.15,
            ease: [0.34, 1.56, 0.64, 1] as const
          }}
        />
      ))}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  className?: string;
  color?: 'yellow' | 'light' | 'orange';
}

/* D2.4 — Badge with specular inner edge-light so the pill reads as a pressed gem, not flat ink. */
export function Badge({ children, className = "", color = 'yellow' }: BadgeProps) {
  const colors = {
    yellow: "bg-selah-yellow text-selah-dark border border-selah-yellow/40",
    light: "bg-selah-light text-selah-dark border border-selah-light/40",
    orange: "bg-selah-orange text-white border border-selah-orange/50",
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -1, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
      className={`${colors[color]} px-5 py-2 rounded-xl inline-flex items-center justify-center [box-shadow:inset_0_1px_1px_rgba(255,255,255,0.75),var(--elevation-2)] ${className}`}
    >
      <span className="ui-label select-none">{children}</span>
    </motion.div>
  );
}
