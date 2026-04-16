'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { AboutHeroSection } from '../../components/about/AboutHeroSection';

const AboutMarqueeSection = dynamic(() => import('../../components/about/AboutMarqueeSection').then(m => ({ default: m.AboutMarqueeSection })), { ssr: false });
const AboutBentoGrid = dynamic(() => import('../../components/about/AboutBentoGrid').then(m => ({ default: m.AboutBentoGrid })), { ssr: false });
const AboutCoreValues = dynamic(() => import('../../components/about/AboutCoreValues').then(m => ({ default: m.AboutCoreValues })), { ssr: false });
const AboutCTA = dynamic(() => import('../../components/about/AboutCTA').then(m => ({ default: m.AboutCTA })), { ssr: false });
const AboutPhotoCarousel = dynamic(() => import('../../components/about/AboutPhotoCarousel').then(m => ({ default: m.AboutPhotoCarousel })), { ssr: false });
const TeamSection = dynamic(() => import('../../components/about/TeamSection').then(m => ({ default: m.TeamSection })), { ssr: false });

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
