"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Star, Shield, Users } from "lucide-react";
import { SectionHeader } from "../SectionHeader";
import { TESTIMONIALS } from "../../constants";
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

export function TestimonialsSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgY1 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const contY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <motion.section 
      ref={containerRef}
      id="testimonials"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-10 md:py-16 bg-white relative overflow-hidden"
    >
      {/* Creative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          style={{ y: bgY1 }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-selah-orange rounded-full blur-[150px]"
        />
        <motion.div 
          style={{ y: bgY2 }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-selah-light rounded-full blur-[150px]"
        />
      </div>
      
      <motion.div style={{ y: contY }} className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <SectionHeader 
            badge={t("LOVED BY FAMILIES", "AMADO POR LAS FAMILIAS")}
            title={t("What Parents Are Saying", "Lo Que Dicen Los Padres")}
            description={t(
              "Real stories from families who have found joy and faith through Selah Kids.",
              "Historias reales de familias que han encontrado alegría y fe a través de Selah Kids."
            )}
            align="center"
          />
        </div>
        
        {/* Infinite Carousel Container */}
        <div className="relative flex overflow-hidden py-10">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex gap-8 px-4 whitespace-nowrap"
            style={{ width: "fit-content" }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ 
                  y: -15, 
                  scale: 1.02,
                  boxShadow: "0_40px_80px_-20px_rgba(0,0,0,0.15),0_20px_40px_-10px_rgba(0,0,0,0.05)"
                }}
                className="w-[300px] sm:w-[400px] md:w-[450px] shrink-0 bg-white p-12 rounded-[48px] border border-selah-bg shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03),0_4px_6px_-2px_rgba(0,0,0,0.01)] flex flex-col gap-8 group transition-all duration-500 relative overflow-hidden"
              >
                {/* Subtle hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex justify-between items-start relative z-10">
                  <div className={`w-16 h-16 ${t.color} rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-500`}>
                    {t.icon}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, star) => (
                      <motion.div 
                        key={star}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        <Star size={18} fill="#feb835" className="text-[#feb835]" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <p className="body-quote whitespace-normal relative z-10 tracking-tight">
                  "{t.quote}"
                </p>
                
                <div className="mt-auto pt-8 border-t border-selah-bg flex items-center gap-5 relative z-10">
                  <div className={`w-16 h-16 rounded-full ${t.color} flex items-center justify-center ${t.iconColor} content-h3 border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h5 className="content-h3 text-selah-dark group-hover:text-selah-orange transition-colors duration-300 tracking-tight">{t.author}</h5>
                    <p className="text-selah-muted ui-label mt-1">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Second Row - Moving Opposite Direction */}
        <div className="relative flex overflow-hidden py-10 mt-4">
          <motion.div 
            animate={{ x: ["-50%", "0%"] }}
            transition={{ 
              duration: 50, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex gap-8 px-4 whitespace-nowrap"
            style={{ width: "fit-content" }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].reverse().map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ 
                  y: -15, 
                  scale: 1.02,
                  boxShadow: "0_40px_80px_-20px_rgba(0,0,0,0.15),0_20px_40px_-10px_rgba(0,0,0,0.05)"
                }}
                className="w-[300px] sm:w-[400px] md:w-[450px] shrink-0 bg-white p-12 rounded-[48px] border border-selah-bg shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03),0_4px_6px_-2px_rgba(0,0,0,0.01)] flex flex-col gap-8 group transition-all duration-500 relative overflow-hidden"
              >
                {/* Subtle hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex justify-between items-start relative z-10">
                  <div className={`w-16 h-16 ${t.color} rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-500`}>
                    {t.icon}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, star) => (
                      <motion.div 
                        key={star}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        <Star size={18} fill="#feb835" className="text-[#feb835]" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <p className="body-quote whitespace-normal relative z-10 tracking-tight">
                  "{t.quote}"
                </p>
                
                <div className="mt-auto pt-8 border-t border-selah-bg flex items-center gap-5 relative z-10">
                  <div className={`w-16 h-16 rounded-full ${t.color} flex items-center justify-center ${t.iconColor} content-h3 border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h5 className="content-h3 text-selah-dark group-hover:text-selah-orange transition-colors duration-300 tracking-tight">{t.author}</h5>
                    <p className="text-selah-muted ui-label mt-1">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trust Badges */}
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-16 mt-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
          >
            <motion.div whileHover={{ scale: 1.1, y: -5 }} className="flex items-center gap-3 ui-label cursor-pointer">
              <Shield size={24} className="text-selah-orange" /> {t("Safe Content", "Contenido Seguro")}
            </motion.div>
            <motion.div whileHover={{ scale: 1.1, y: -5 }} className="flex items-center gap-3 ui-label cursor-pointer">
              <Star size={24} className="text-selah-yellow" /> {t("4.9/5 Rating", "4.9/5 Calificación")}
            </motion.div>
            <motion.div whileHover={{ scale: 1.1, y: -5 }} className="flex items-center gap-3 ui-label cursor-pointer">
              <Users size={24} className="text-[#3fc0df]" /> {t("Loved by Kids", "Amado por Niños")}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}
