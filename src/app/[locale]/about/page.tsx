'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { AboutHeroSection } from '@/components/about/AboutHeroSection';

const AboutMarqueeSection = dynamic(() => import('@/components/about/AboutMarqueeSection').then(m => ({ default: m.AboutMarqueeSection })), { ssr: false });
const AboutBentoGrid = dynamic(() => import('@/components/about/AboutBentoGrid').then(m => ({ default: m.AboutBentoGrid })), { ssr: false });
const AboutCoreValues = dynamic(() => import('@/components/about/AboutCoreValues').then(m => ({ default: m.AboutCoreValues })), { ssr: false });
const AboutCTA = dynamic(() => import('@/components/about/AboutCTA').then(m => ({ default: m.AboutCTA })), { ssr: false });
const AboutPhotoCarousel = dynamic(() => import('@/components/about/AboutPhotoCarousel').then(m => ({ default: m.AboutPhotoCarousel })), { ssr: false });
const TeamSection = dynamic(() => import('@/components/about/TeamSection').then(m => ({ default: m.TeamSection })), { ssr: false });

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
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F0FAE6] min-h-screen overflow-hidden selection:bg-selah-orange selection:text-white relative" ref={containerRef}>
      {/* Vivid Color Washes */}
      <div className="absolute top-0 right-0 w-[60vw] h-[50vh] bg-gradient-to-bl from-[#FF7F50]/12 via-[#FF5C00]/6 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[55vw] h-[50vh] bg-gradient-to-tr from-[#93D35C]/12 via-[#98FF98]/6 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] left-[5%] w-[40vw] h-[40vh] bg-[#FEB835]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vh] bg-[#00BFFF]/6 rounded-full blur-[100px] pointer-events-none" />
      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />
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
