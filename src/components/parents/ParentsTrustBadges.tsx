"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Smile, Heart } from 'lucide-react';
import { useFieldResolver } from '../../lib/page-fields';
import type { PageFieldMap } from '../../lib/cms-server';

export const ParentsTrustBadges = ({ fields }: { fields?: PageFieldMap } = {}) => {
  const f = useFieldResolver(fields);
  const TRUST_BADGES = [
    { icon: Shield, label: f('trust.badge_1_title', 'Safe Content', 'Contenido Seguro'), color: "text-[#00BFFF]", bg: "bg-[#00BFFF]/10" },
    { icon: BookOpen, label: f('trust.badge_2_title', 'Scripture-Based', 'Basado en la Biblia'), color: "text-[#FFD700]", bg: "bg-[#FFD700]/10" },
    { icon: Smile, label: f('trust.badge_3_title', 'Wholistic Growth', 'Crecimiento Integral'), color: "text-[#98FF98]", bg: "bg-[#98FF98]/10" },
    { icon: Heart, label: f('trust.badge_4_title', 'Parent Approved', 'Aprobado por Padres'), color: "text-[#FF7F50]", bg: "bg-[#FF7F50]/10" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {TRUST_BADGES.map((badge, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }} whileHover={{ y: -8, scale: 1.02 }} className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 cursor-default group">
            <div className={`w-20 h-20 rounded-full ${badge.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              <badge.icon size={36} className={badge.color} />
            </div>
            <h3 className="content-h3 text-selah-orange">{badge.label}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
