"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "../UI";
import { SectionHeader } from "../SectionHeader";
import { CHARACTERS } from "../../constants";
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

export function CharactersSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const cardsY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <motion.section 
      ref={containerRef}
      id="characters" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-10 md:py-16 bg-gradient-to-b from-[#FFF5E6] to-[#FFF0DB] relative overflow-hidden"
    >
      {/* Playful Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-selah-orange/5 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-selah-light/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader 
          badge={t("Meet the Characters", "Conoce a los Personajes")}
          title={t("Andy, Libni, and Shiloh", "Andy, Libni y Shiloh")}
          description={t(
            "Say hello to Andy, Libni, and Shiloh! These amazing friends go on exciting adventures to help kids learn about God, friendship, and faith in a way that's easy to understand.",
            "¡Saluda a Andy, Libni y Shiloh! Estos increíbles amigos van en emocionantes aventuras para ayudar a los niños a aprender sobre Dios, la amistad y la fe de una manera fácil de entender."
          )}
          align="center"
        />

        <motion.div style={{ y: cardsY }} className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 mt-10">
          {CHARACTERS.map((char, i) => (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 60, damping: 14, delay: i * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -20,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 15 }
              }}
              className="group relative"
            >
              <a href="#characters-full" className="block h-full">
                <div className={`relative h-full rounded-[36px] sm:rounded-[48px] overflow-hidden bg-gradient-to-br ${char.color} p-6 sm:p-8 pt-8 sm:pt-12 flex flex-col items-center text-center transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.05)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2),0_20px_30px_-5px_rgba(0,0,0,0.1)]`}>
                  {/* Character Image Container */}
                  <div className="relative w-[65%] sm:w-full max-w-[200px] sm:max-w-none aspect-[4/5] mb-5 sm:mb-8 flex items-center justify-center">
                    {/* Glow effect behind character */}
                    <div className="absolute inset-0 bg-white/20 blur-[40px] sm:blur-[60px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
                    
                    <motion.img 
                      src={char.img} 
                      alt={char.name}
                      className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                      animate={{ 
                        y: [0, -15, 0],
                        rotate: [0, 2, 0]
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.5 }
                      }}
                      transition={{ 
                        duration: 4 + i, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: char.delay 
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Personality Badge */}
                  <div className="mb-6">
                    <Badge color="light" className="!rotate-0 !px-6 !py-2.5 ui-label border-white/40 shadow-sm backdrop-blur-sm">
                      {char.trait}
                    </Badge>
                  </div>

                  <h3 className="content-h3 text-white mb-4 drop-shadow-sm tracking-tight">{char.name}</h3>
                  <p className="body-text mb-8 max-w-[240px] mx-auto text-white/90 text-balance">
                    {char.description}
                  </p>

                  <div className="mt-auto">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2 text-white ui-label bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 group-hover:bg-white group-hover:text-selah-dark transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                    >
                      {t("Who's that?", "¿Quién es?")} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </motion.div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
