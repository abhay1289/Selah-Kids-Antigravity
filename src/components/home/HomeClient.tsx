'use client';

import { motion, useScroll, useSpring, useMotionValue } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { HeroSection } from "../components/home/HeroSection";
import { LatestVideosSection } from "../components/home/LatestVideosSection";
import { AboutSection } from "../components/home/AboutSection";
import { CharactersSection } from "../components/home/CharactersSection";
import { WhyChooseSection } from "../components/home/WhyChooseSection";
import { JoinYouTubeSection } from "../components/home/JoinYouTubeSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { NewsletterSection } from "../components/home/NewsletterSection";

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
