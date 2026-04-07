'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AboutHeroSection } from '../../components/about/AboutHeroSection';
import { AboutMarqueeSection } from '../../components/about/AboutMarqueeSection';
import { AboutBentoGrid } from '../../components/about/AboutBentoGrid';

import { AboutCoreValues } from '../../components/about/AboutCoreValues';
import { AboutCTA } from '../../components/about/AboutCTA';
import { AboutPhotoCarousel } from '../../components/about/AboutPhotoCarousel';
import { TeamSection } from '../../components/about/TeamSection';

const sectionEntrance = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }
  }
};

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="bg-gradient-to-b from-selah-bg via-[#FFF8EE] to-[#F0FAE6] min-h-screen overflow-hidden selection:bg-selah-orange selection:text-white" ref={containerRef}>
      <AboutHeroSection scrollYProgress={scrollYProgress} />
      
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <AboutMarqueeSection />
      </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <AboutBentoGrid />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <TeamSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <AboutPhotoCarousel />
      </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <AboutCoreValues />
      </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <AboutCTA />
      </motion.div>
    </div>
  );
}
