"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Star, Shield, Users } from "lucide-react";
import { SectionHeader } from "../SectionHeader";
import { TESTIMONIALS } from "../../constants";
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

export function TestimonialsSection({ fields }: { fields?: PageFieldMap } = {}) {
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  const f = useFieldResolver(fields);
  
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
      className="py-8 md:py-12 relative"
    >
      {/* Per-section blobs removed — atmos-spine carries atmosphere continuously. */}

      <motion.div style={{ y: contY }} className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <SectionHeader
            badge={f("testimonials.test_badge", "LOVED BY FAMILIES", "AMADO POR LAS FAMILIAS")}
            title={f("testimonials.test_title", "What Parents Are Saying", "Lo Que Dicen Los Padres")}
            description={f(
              "testimonials.test_description",
              "Real stories from families who have found joy and faith through Selah Kids.",
              "Historias reales de familias que han encontrado alegría y fe a través de Selah Kids."
            )}
            align="center"
          />
        </div>
        
        {/* Infinite Carousel Container — pauses on hover/focus so parents can actually read */}
        <div className="relative flex overflow-hidden py-4 group/marquee">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 px-4 whitespace-nowrap [animation-play-state:running] group-hover/marquee:[animation-play-state:paused]"
            style={{ width: "fit-content" }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ 
                  y: -15, 
                  scale: 1.02,
                  boxShadow: "0_40px_80px_-20px_rgba(0,0,0,0.15),0_20px_40px_-10px_rgba(0,0,0,0.05)"
                }}
                className="w-[280px] sm:w-[360px] md:w-[400px] shrink-0 glass-regular p-8 rounded-[2.5rem] flex flex-col gap-6 group transition-shadow duration-500 relative overflow-hidden"
                tabIndex={0}
                aria-hidden={i >= TESTIMONIALS.length ? "true" : undefined}
              >
                {/* Subtle hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex justify-between items-start relative z-10">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-500`}>
                    {item.icon}
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
                  &ldquo;{language === 'ES' && item.quoteEs ? item.quoteEs : item.quote}&rdquo;
                </p>
                
                <div className="mt-auto pt-6 border-t border-selah-bg flex items-center gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center ${item.iconColor} ui-button border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <h5 className="ui-button text-selah-dark group-hover:text-selah-orange transition-colors duration-300">{item.author}</h5>
                    <p className="text-selah-muted ui-caption mt-0.5">{language === 'ES' && item.roleEs ? item.roleEs : item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>



      </motion.div>
    </motion.section>
  );
}
