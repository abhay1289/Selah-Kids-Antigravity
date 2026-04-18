'use client';

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ParentsHero } from '../../components/parents/ParentsHero';

const ParentsTrustBadges = dynamic(() => import('../../components/parents/ParentsTrustBadges').then(m => ({ default: m.ParentsTrustBadges })), { ssr: false });
const ParentsAccordion = dynamic(() => import('../../components/parents/ParentsAccordion').then(m => ({ default: m.ParentsAccordion })), { ssr: false });
const ParentsCommunity = dynamic(() => import('../../components/parents/ParentsCommunity').then(m => ({ default: m.ParentsCommunity })), { ssr: false });

const sectionEntrance = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  }
};

export default function ParentsPage() {
  return (
    <div className="bg-gradient-to-b from-[#FFF5EE] via-[#FDFBF7] to-[#F0FAE6] min-h-screen pt-36 md:pt-44 pb-16 relative overflow-hidden selection:bg-selah-orange selection:text-white">
      {/* Vivid Color Washes */}
      <div className="absolute top-0 left-0 w-[50vw] h-[45vh] bg-gradient-to-br from-[#FEB835]/12 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[55vw] h-[50vh] bg-gradient-to-tl from-[#00BFFF]/8 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-[40vw] h-[40vh] bg-[#FF69B4]/6 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[30%] left-[5%] w-[35vw] h-[35vh] bg-[#93D35C]/8 rounded-full blur-[100px] pointer-events-none" />
      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionEntrance}>
        <ParentsHero />
      </motion.div>
      

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <ParentsAccordion />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={sectionEntrance}>
        <ParentsCommunity />
      </motion.div>
    </div>
  );
}
