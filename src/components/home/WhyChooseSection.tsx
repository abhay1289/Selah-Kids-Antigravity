"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Cloud, Sun, SparklesIcon } from "lucide-react";
import { Badge } from "../UI";
import { WHY_FEATURES } from "../../constants";
import { useLanguage } from "../../contexts/LanguageContext";

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
    <motion.div
      animate={{ 
        y: [0, -6, 0],
        rotate: [0, 3, -3, 0],
      }}
      transition={{ 
        duration: 4, 
        ease: "easeInOut", 
        repeat: Infinity 
      }}
      className="relative"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-3xl blur-md"
        style={{ backgroundColor: color }}
      />
      <div className="relative z-10">
        {icon}
      </div>
    </motion.div>
  );
};

const FeatureCard: React.FC<{ feature: typeof WHY_FEATURES[0], index: number }> = ({ feature, index }) => {
  const { language } = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 60, damping: 14, delay: index * 0.15 }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative h-full"
    >
      <div className="bg-white p-8 sm:p-10 lg:p-12 h-full border border-selah-dark/5 overflow-hidden relative flex flex-col transition-all duration-500 rounded-[30px] sm:rounded-[40px] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03),0_4px_6px_-2px_rgba(0,0,0,0.01)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1),0_10px_20px_-5px_rgba(0,0,0,0.05)]">
        {/* Subtle background glow on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(circle at top right, ${feature.color}15, transparent 70%)` }}
        />

        <div className="relative mb-10 self-start">
          <div className={`w-24 h-24 ${feature.bgColor} rounded-3xl flex items-center justify-center text-5xl relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]`}>
            <CreativeIcon icon={feature.icon} color={feature.color} />
          </div>
        </div>

        <div className="flex-grow relative z-10">
          <h3 className="content-h3 text-selah-dark mb-4 group-hover:text-selah-orange transition-colors duration-300 tracking-tight">
            {language === 'ES' && feature.titleEs ? feature.titleEs : feature.title}
          </h3>
          
          <p className="body-text text-balance">
            {language === 'ES' && feature.descEs ? feature.descEs : feature.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export function WhyChooseSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const { t } = useLanguage();

  return (
    <motion.section 
      ref={containerRef}
      id="why-selah" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-10 md:py-16 bg-[#FFFBF0] relative overflow-hidden"
    >
      {/* Naturalistic Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-50 mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* Soft Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
          className="absolute -top-[15%] -left-[10%] w-[60%] h-[60%] bg-selah-yellow/10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-[120px]"
        />
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
          className="absolute -bottom-[15%] -right-[10%] w-[70%] h-[70%] bg-selah-orange/5 rounded-[60%_40%_30%_70%/50%_60%_40%_50%] blur-[140px]"
        />
      </div>


      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="mb-10"
          >
            <Badge color="yellow" className="!rotate-0 !scale-125 px-8 py-3 shadow-sm border border-selah-yellow/20">{t("OUR CORE VALUES", "NUESTROS VALORES")}</Badge>
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
            {t(
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
