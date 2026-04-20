'use client';

import { motion, useScroll, useSpring } from "framer-motion";
import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "./HeroSection";

// Lazy-load all below-the-fold sections to minimise initial bundle
const LatestVideosSection  = dynamic(() => import("./LatestVideosSection").then(m => ({ default: m.LatestVideosSection })), { ssr: false });
const AboutSection         = dynamic(() => import("./AboutSection").then(m => ({ default: m.AboutSection })), { ssr: false });
const WhyChooseSection     = dynamic(() => import("./WhyChooseSection").then(m => ({ default: m.WhyChooseSection })), { ssr: false });
const JoinYouTubeSection   = dynamic(() => import("./JoinYouTubeSection").then(m => ({ default: m.JoinYouTubeSection })), { ssr: false });
const TestimonialsSection  = dynamic(() => import("./TestimonialsSection").then(m => ({ default: m.TestimonialsSection })), { ssr: false });
const NewsletterSection    = dynamic(() => import("./NewsletterSection").then(m => ({ default: m.NewsletterSection })), { ssr: false });

export default function HomeClient() {
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef}>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-selah-orange z-[100] origin-left rounded-r-full shadow-[0_1px_8px_rgba(255,92,0,0.4)]"
        style={{ scaleX }}
      />
      <HeroSection scrollYProgress={scrollYProgress} />
      <LatestVideosSection />
      <AboutSection />
      <JoinYouTubeSection />
      <WhyChooseSection />
      <NewsletterSection />
      <TestimonialsSection />
    </div>
  );
}
