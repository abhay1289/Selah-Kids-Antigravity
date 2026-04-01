'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ParentsHero } from '../../components/parents/ParentsHero';
import { ParentsTrustBadges } from '../../components/parents/ParentsTrustBadges';
import { ParentsAccordion } from '../../components/parents/ParentsAccordion';

const sectionEntrance = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  }
};

export default function ParentsPage() {
  return (
    <div className="bg-gradient-to-b from-[#FFFDF5] via-[#FFF8EE] to-[#F5FBF0] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden">
      {/* Soft Background Washes */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-selah-yellow/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00BFFF]/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionEntrance}>
        <ParentsHero />
      </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <ParentsTrustBadges />
      </motion.div>
      
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <ParentsAccordion />
      </motion.div>
    </div>
  );
}
