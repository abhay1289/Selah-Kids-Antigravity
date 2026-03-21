'use client';

import React, { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { AboutHeroSection } from '../../components/about/AboutHeroSection';
import { AboutMarqueeSection } from '../../components/about/AboutMarqueeSection';
import { AboutBentoGrid } from '../../components/about/AboutBentoGrid';
import { AboutCharacters } from '../../components/about/AboutCharacters';
import { AboutCoreValues } from '../../components/about/AboutCoreValues';
import { AboutCTA } from '../../components/about/AboutCTA';

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="bg-selah-bg min-h-screen overflow-hidden selection:bg-selah-orange selection:text-white" ref={containerRef}>
      <AboutHeroSection scrollYProgress={scrollYProgress} />
      <AboutMarqueeSection />
      <AboutBentoGrid />
      <AboutCharacters />
      <AboutCoreValues />
      <AboutCTA />
    </div>
  );
}
