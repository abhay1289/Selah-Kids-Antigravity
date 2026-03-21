"use client";

import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";
import React, { ReactNode, useEffect, useState, useRef } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'white' | 'outline';
  icon?: LucideIcon;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ children, variant = 'primary', icon: Icon, className = "", onClick, type = 'button' }: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  
  // Magnetic effect values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const translateX = useSpring(mouseX, springConfig);
  const translateY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center (max 15px movement)
    const distanceX = (e.clientX - centerX) * 0.3;
    const distanceY = (e.clientY - centerY) * 0.3;
    
    mouseX.set(distanceX);
    mouseY.set(distanceY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    
    // Clean up ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  const variants = {
    primary: "bg-selah-orange text-white shadow-[0_10px_20px_-5px_rgba(255,92,0,0.3),0_4px_6px_-2px_rgba(255,92,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(255,92,0,0.4),0_10px_15px_-3px_rgba(255,92,0,0.2)] border border-selah-orange/20",
    white: "bg-white text-selah-dark shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15),0_10px_15px_-3px_rgba(0,0,0,0.1)] border border-white/80",
    outline: "border-2 border-selah-dark text-selah-dark bg-transparent hover:bg-selah-dark hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        x: translateX,
        y: translateY,
      }}
      whileHover={{ 
        scale: 1.05, 
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg 
        flex items-center justify-center gap-3 
        transition-all duration-300 cursor-pointer overflow-hidden group
        whitespace-nowrap flex-shrink-0
        ${variants[variant]} ${className}
      `}
    >
      {/* Ripple Effect */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ top: ripple.y, left: ripple.x, scale: 0, opacity: 0.3 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-24 h-24 bg-white/20 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0"
          />
        ))}
      </AnimatePresence>

      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: variant === 'primary' 
            ? 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)'
            : variant === 'white'
            ? 'radial-gradient(circle at center, rgba(0,0,0,0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)'
        }}
        animate={isHovered ? { scale: [1, 1.5, 1], opacity: [0, 0.5, 0] } : { scale: 1, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '250%' } : { x: '-100%' }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      <span className="relative z-10 flex items-center justify-center gap-3 pointer-events-none whitespace-nowrap w-full">
        <span className="relative flex items-center justify-center gap-3 whitespace-nowrap">
          {children}
        </span>
        
        {Icon && (
          <motion.div
            animate={isHovered ? { 
              x: [0, 5, 0],
              rotate: [0, 15, -15, 0]
            } : { x: 0, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut", repeat: isHovered ? Infinity : 0 }}
          >
            <Icon size={22} strokeWidth={2.5} />
          </motion.div>
        )}
      </span>
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
            ease: [0.34, 1.56, 0.64, 1]
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

export function Badge({ children, className = "", color = 'yellow' }: BadgeProps) {
  const colors = {
    yellow: "bg-selah-yellow text-selah-dark border-selah-yellow/30 shadow-[0_4px_12px_rgba(254,184,53,0.15)]",
    light: "bg-selah-light text-selah-dark border-selah-light/30 shadow-[0_4px_12px_rgba(147,211,92,0.15)]",
    orange: "bg-selah-orange text-white border-selah-orange/30 shadow-[0_4px_12px_rgba(255,92,0,0.15)]"
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      whileHover={{ 
        scale: 1.02,
        y: -1,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      className={`${colors[color]} px-5 py-2 rounded-xl inline-flex items-center justify-center transform border relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
      <span className="relative z-10 font-accent font-bold uppercase tracking-[0.2em] text-xs sm:text-sm select-none">
        {children}
      </span>
    </motion.div>
  );
}
