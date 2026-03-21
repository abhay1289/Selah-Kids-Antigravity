import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Smile, Heart } from 'lucide-react';

const TRUST_BADGES = [
  { icon: Shield, label: "Ad-Free Content", color: "text-[#00BFFF]", bg: "bg-[#00BFFF]/10" },
  { icon: BookOpen, label: "Scripture-Based", color: "text-[#FFD700]", bg: "bg-[#FFD700]/10" },
  { icon: Smile, label: "Ages 0-8", color: "text-[#98FF98]", bg: "bg-[#98FF98]/10" },
  { icon: Heart, label: "Parent Approved", color: "text-[#FF7F50]", bg: "bg-[#FF7F50]/10" }
];

export const ParentsTrustBadges = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-32 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {TRUST_BADGES.map((badge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 cursor-default group"
          >
            <div className={`w-20 h-20 rounded-full ${badge.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              <badge.icon size={36} className={badge.color} />
            </div>
            <h3 className="font-display text-2xl text-selah-dark">{badge.label}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
