'use client';

import { motion, useScroll, useSpring, useMotionValue } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { HeroSection } from "./HeroSection";
import { LatestVideosSection } from "./LatestVideosSection";
import { AboutSection } from "./AboutSection";
import { CharactersSection } from "./CharactersSection";
import { WhyChooseSection } from "./WhyChooseSection";
import { JoinYouTubeSection } from "./JoinYouTubeSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { NewsletterSection } from "./NewsletterSection";

export default function HomeClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

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

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-selah-orange z-[100] origin-left"
        style={{ scaleX }}
      />
      <HeroSection scrollYProgress={scrollYProgress} handleMouseMove={handleMouseMove} />
      <LatestVideosSection />
      <AboutSection />
      <CharactersSection />
      <WhyChooseSection />
      <JoinYouTubeSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
