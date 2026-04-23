'use client';

import { motion, useScroll, useSpring, useMotionValue, AnimatePresence, useTransform } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { CHARACTERS } from "../../constants";
import { BouncingDots } from "../UI";
import { HeroSection } from "./HeroSection";
import type { PageFieldMap } from "@/lib/cms-server";

// Lazy-load all below-the-fold sections to minimise initial bundle
const TodaysEpisode        = dynamic(() => import("./TodaysEpisode"), { ssr: false });
const AboutSection         = dynamic(() => import("./AboutSection").then(m => ({ default: m.AboutSection })), { ssr: false });
const CharactersSection    = dynamic(() => import("./CharactersSection").then(m => ({ default: m.CharactersSection })), { ssr: false });
const WhyChooseSection     = dynamic(() => import("./WhyChooseSection").then(m => ({ default: m.WhyChooseSection })), { ssr: false });
const JoinYouTubeSection   = dynamic(() => import("./JoinYouTubeSection").then(m => ({ default: m.JoinYouTubeSection })), { ssr: false });
const TestimonialsSection  = dynamic(() => import("./TestimonialsSection").then(m => ({ default: m.TestimonialsSection })), { ssr: false });

export default function HomeClient({ fields }: { fields?: PageFieldMap }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"floating" | "converging" | "burst">("floating");

  // 1. Progress counting effect
  useEffect(() => {
    if (phase !== "floating") return;
    
    // Slow down start, speed up middle, slow down end for an enterprise "real" loading curve
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 99) {
          clearInterval(interval);
          return 99;
        }
        const delta = prev > 80 ? 1 : prev > 20 ? Math.floor(Math.random() * 5) + 2 : Math.floor(Math.random() * 3) + 1;
        return Math.min(99, prev + delta);
      });
    }, 35);

    return () => clearInterval(interval);
  }, [phase]);

  // 2. Phase transitions when 99% reached.
  // Timeout IDs tracked so unmount mid-intro can't fire stale state updates.
  useEffect(() => {
    if (progress < 99 || phase !== "floating") return;
    setPhase("converging");

    const convergingTimer = setTimeout(() => {
      setPhase("burst");
    }, 700);
    const burstTimer = setTimeout(() => {
      setIsLoading(false);
    }, 700 + 500);

    return () => {
      clearTimeout(convergingTimer);
      clearTimeout(burstTimer);
    };
  }, [progress, phase]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax offsets for the characters to make them highly interactive
  const parallaxX = useTransform(mouseX, [-800, 800], [50, -50]);
  const parallaxY = useTransform(mouseY, [-400, 400], [30, -30]);

  // E5 — Wire atmospheric-spine gradient stops to scroll so the page's atmosphere drifts like a film colour-grade.
  const spineCx1 = useTransform(scrollYProgress, [0, 0.5, 1], ["18%", "62%", "82%"]);
  const spineCy1 = useTransform(scrollYProgress, [0, 0.5, 1], ["18%", "48%", "68%"]);
  const spineCx2 = useTransform(scrollYProgress, [0, 0.5, 1], ["84%", "38%", "18%"]);
  const spineCy2 = useTransform(scrollYProgress, [0, 0.5, 1], ["78%", "62%", "32%"]);

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove}>
      {/* D1.4 — Single atmospheric spine. Gradient stops drift with scroll → continuous colour-grade */}
      <motion.div
        className="atmos-spine"
        aria-hidden="true"
        style={{
          ['--spine-cx-1' as any]: spineCx1,
          ['--spine-cy-1' as any]: spineCy1,
          ['--spine-cx-2' as any]: spineCx2,
          ['--spine-cy-2' as any]: spineCy2,
        }}
      />
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed inset-0 z-[9999] bg-selah-bg flex flex-col items-center justify-center overflow-hidden"
            aria-hidden={!isLoading}
          >
            {/* Enterprise Circular Progress & Number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
               <AnimatePresence>
                 {phase === "floating" && (
                   <motion.div 
                     className="relative flex items-center justify-center"
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.5, filter: "blur(5px)" }}
                     transition={{ duration: 0.4, ease: "backIn" }}
                   >
                     {/* Background Track */}
                   <svg className="absolute w-44 h-44 md:w-56 md:h-56 -rotate-90 opacity-20" viewBox="0 0 100 100" aria-hidden="true">
                     <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" className="text-selah-dark" />
                   </svg>
                   {/* Dynamic Progress Ring */}
                   <svg className="absolute w-44 h-44 md:w-56 md:h-56 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                     <motion.circle 
                       cx="50" cy="50" r="46" 
                       fill="none" 
                       stroke="currentColor" 
                       strokeWidth="2.5" 
                       strokeLinecap="round"
                       className="text-selah-orange drop-shadow-[0_0_8px_rgba(255,92,0,0.4)]"
                       initial={{ pathLength: 0 }}
                       animate={{ pathLength: progress / 100 }}
                       transition={{ duration: 0.1, ease: "easeOut" }}
                     />
                   </svg>
                   
                   {/* Refined, smaller percentage number */}
                   <motion.h1 
                     className="text-3xl md:text-4xl font-black text-selah-dark drop-shadow-sm z-20 font-display tracking-widest relative"
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     aria-live="polite"
                     aria-atomic="true"
                   >
                     {Math.min(99, Math.max(0, progress))}
                      <span className="text-base md:text-lg text-selah-orange absolute -right-6 top-0">%</span>
                   </motion.h1>
                 </motion.div>
               )}
               </AnimatePresence>
            </div>

            {/* The Floating Characters w/ Mouse Parallax */}
            <motion.div 
              className="relative w-full h-full flex items-center justify-center z-10 pointer-events-none"
              style={{ x: parallaxX, y: parallaxY }} // Entire layer subtly shifts with mouse
            >
              {CHARACTERS.filter(char => char.name !== "Shiloh").map((char, index) => {
                const isFirst = index === 0;
                const isSecond = index === 1;

                // Unique floating paths for each to look highly organic
                let floatX = isFirst ? [-180, -280, -120, -180] : isSecond ? [180, 240, 80, 180] : [0, -140, 180, 0];
                let floatY = isFirst ? [-120, 120, -180, -120] : isSecond ? [160, -120, 120, 160] : [220, 60, -240, 220];

                let currentAnimate = {};
                let currentTransition = {};

                if (phase === "floating") {
                  currentAnimate = { 
                    x: floatX, 
                    y: floatY, 
                    rotate: [-12, 12, -12],
                    scale: [1, 1.05, 1],
                  };
                  currentTransition = { 
                    duration: 6 + index, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  };
                } else if (phase === "converging") {
                  currentAnimate = { 
                    x: 0, 
                    y: 0,
                    rotate: index === 0 ? -10 : index === 1 ? 10 : 0, 
                    scale: 0.95
                  };
                  currentTransition = { 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 120,
                    damping: 14,
                    mass: 1.2
                  };
                } else if (phase === "burst") {
                  currentAnimate = { 
                    x: floatX[0] * 1.5,
                    y: floatY[0] * 1.5,
                    scale: 3,
                    opacity: 0,
                    filter: "blur(15px)"
                  };
                  currentTransition = { 
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1] // Apple-like explosive easing
                  };
                }

                return (
                  <motion.div
                    key={char.name}
                    animate={currentAnimate}
                    transition={currentTransition as any}
                    className="absolute w-36 h-36 md:w-52 md:h-52"
                    style={{
                       x: floatX[0],
                       y: floatY[0],
                    }}
                  >
                    {/* E4 — Warm cream glow matching atmos-spine (replaces per-character pink/blue halo) */}
                    <div className="absolute inset-x-[12%] bottom-[8%] h-[22%] rounded-full bg-white/55 blur-[32px]" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={char.img}
                      alt={char.name}
                      className="relative w-full h-full object-contain [filter:drop-shadow(0_20px_22px_rgba(82,52,16,0.18))_drop-shadow(0_4px_8px_rgba(82,52,16,0.12))]"
                    />
                  </motion.div>
                );
              })}
            </motion.div>
            
            {/* Elegant Flare Effect */}
            <AnimatePresence>
                {phase === "burst" && (
                    <motion.div 
                        initial={{ scale: 0, opacity: 1, filter: "blur(0px)" }}
                        animate={{ scale: 20, opacity: 0, filter: "blur(30px)" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="absolute w-40 h-40 bg-selah-orange/40 rounded-full z-30 pointer-events-none mix-blend-screen"
                    />
                )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <HeroSection scrollYProgress={scrollYProgress} handleMouseMove={handleMouseMove} isLoading={isLoading} fields={fields} />
      <TodaysEpisode />
      <AboutSection fields={fields} />
      <CharactersSection />
      <WhyChooseSection fields={fields} />
      <JoinYouTubeSection fields={fields} />
      <TestimonialsSection fields={fields} />
    </div>
  );
}
