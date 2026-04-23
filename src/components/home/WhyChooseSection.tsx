"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Badge } from "../UI";
import { WHY_FEATURES } from "../../constants";
import { useLanguage } from "../../contexts/LanguageContext";
import { useFieldResolver } from "../../lib/page-fields";
import type { PageFieldMap } from "../../lib/cms-server";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

const CreativeIcon: React.FC<{ icon: React.ReactNode, color: string }> = ({ icon, color }) => {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 rounded-3xl blur-md opacity-20 transition-opacity duration-500 group-hover:opacity-40"
        style={{ backgroundColor: color }}
      />
      <div className="relative z-10">
        {icon}
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ feature: typeof WHY_FEATURES[0], index: number }> = ({ feature, index }) => {
  const { language } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 60, damping: 14, delay: index * 0.15 }}
      viewport={{ once: true, amount: 0.01, margin: "0px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-full"
    >
      <div className="bg-[var(--paper-cream)] p-8 sm:p-10 lg:p-12 h-full border border-white/60 overflow-hidden relative flex flex-col transition-all duration-500 rounded-[30px] sm:rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)]">

        {/* Shimmer sweep on hover */}
        <motion.div
          initial={{ x: "-120%", opacity: 0 }}
          animate={{ x: isHovered ? "120%" : "-120%", opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent z-[2] pointer-events-none skew-x-[-20deg]"
        />

        <div className="relative mb-10 self-start z-10">
          <motion.div 
            animate={{ rotate: isHovered ? 8 : 0, scale: isHovered ? 1.12 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={`w-24 h-24 ${feature.bgColor} rounded-3xl flex items-center justify-center text-5xl relative z-10 shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)] transition-shadow duration-500`}
          >
            <CreativeIcon icon={feature.icon} color={feature.color} />
          </motion.div>
        </div>

        <div 
          className="flex-grow relative z-10 cursor-default"
          tabIndex={0}
        >
          <h3 className="content-h3 text-selah-dark mb-4 group-hover:text-selah-orange transition-colors duration-300 tracking-tight">
            {language === 'ES' && feature.titleEs ? feature.titleEs : feature.title}
          </h3>
          
          <p className="body-text text-balance">
            {language === 'ES' && feature.descEs ? feature.descEs : feature.desc}
          </p>
        </div>

        {/* Subtle bottom accent line on hover */}
        <motion.div 
          className="absolute bottom-0 left-[10%] right-[10%] h-[3px] rounded-full z-10"
          style={{ backgroundColor: feature.color }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0, opacity: isHovered ? 0.5 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export function WhyChooseSection({ fields }: { fields?: PageFieldMap } = {}) {
  const { t } = useLanguage();
  const f = useFieldResolver(fields);

  return (
    <motion.section
      id="why-selah"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.01, margin: "0px" }}
      variants={sectionVariants}
      className="py-10 md:py-16 relative"
    >
      {/* Per-section blob glows removed — they were clipped by this section's
         overflow-hidden and read as hard bands at section edges. Atmosphere is
         now carried entirely by .atmos-spine (page-fixed continuous gradient). */}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="mb-10"
          >
            <Badge color="yellow" className="!rotate-0 !scale-125 px-8 py-3 shadow-sm border border-selah-yellow/20">{f("why.why_badge", "OUR CORE VALUES", "NUESTROS VALORES")}</Badge>
          </motion.div>
          
          <div className="relative">
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
              className="content-h2 mb-12 leading-[1.05] tracking-[-0.02em] drop-shadow-sm"
            >
              {t("Why", "¿Por Qué")} <span className="text-selah-orange italic relative inline-block">
                Selah
                <motion.svg 
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                  className="absolute -bottom-4 left-0 w-full h-4 text-selah-yellow/40 -z-10" 
                  viewBox="0 0 100 20" 
                  preserveAspectRatio="none"
                >
                  <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </motion.svg>
              </span> Kids{t("?", "?")}
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="body-text max-w-4xl mx-auto text-selah-muted text-balance"
          >
            {f(
              "why.why_description",
              "Created by parents who wanted better shows for their own kids, Selah Kids mixes awesome Christian cartoons with important lessons from the Bible.",
              "Creado por padres que querían mejores programas para sus propios hijos, Selah Kids mezcla increíbles dibujos animados cristianos con lecciones importantes de la Biblia."
            )}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {WHY_FEATURES.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>



      </div>
    </motion.section>
  );
}
