"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Music, Star, Heart, SparklesIcon, Mail, ArrowRight } from "lucide-react";
import { Button, Badge } from "../UI";
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

export function NewsletterSection() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const floatY1 = useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const formY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <motion.section 
      ref={containerRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-12 md:py-20 bg-selah-orange relative overflow-hidden"
    >
      {/* Playful Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sunburst effect using CSS */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] opacity-10"
             style={{
               background: 'repeating-conic-gradient(from 0deg, transparent 0deg 15deg, white 15deg 30deg)',
               animation: 'spin 120s linear infinite'
             }}
        />
        
        {/* Floating Elements */}
        <motion.div style={{ y: floatY1 }} className="absolute top-20 left-[10%] text-white/40">
          <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <Music size={64} />
          </motion.div>
        </motion.div>
        
        <motion.div style={{ y: floatY2 }} className="absolute bottom-32 left-[20%] text-white/30">
          <motion.div animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
            <Star size={48} fill="currentColor" />
          </motion.div>
        </motion.div>

        <motion.div style={{ y: floatY1 }} className="absolute top-40 right-[15%] text-white/40">
          <motion.div animate={{ y: [0, -25, 0], rotate: [0, 20, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
            <Heart size={56} fill="currentColor" />
          </motion.div>
        </motion.div>

        <motion.div style={{ y: floatY2 }} className="absolute bottom-20 right-[25%] text-white/30">
          <motion.div animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
            <Music size={40} />
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div style={{ y: formY }} className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <AnimatePresence mode="wait">
          {!isSubscribed ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50, rotate: 2 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white p-6 sm:p-10 md:p-16 rounded-[30px] sm:rounded-[40px] md:rounded-[60px] relative shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2),0_20px_40px_-10px_rgba(0,0,0,0.1)]"
            >
              {/* Decorative tape */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/60 backdrop-blur-sm rotate-[-3deg] z-20 shadow-sm" style={{ clipPath: 'polygon(2% 0, 98% 5%, 100% 95%, 0 100%)' }} />
              
              {/* Decorative overlapping elements */}
              <motion.div 
                animate={{ rotate: [0, 10, 0], scale: [1, 1.05, 1] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -right-12 text-selah-yellow z-20 hidden md:block drop-shadow-xl"
              >
                <Star size={100} fill="currentColor" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 text-selah-light z-20 hidden md:block drop-shadow-xl"
              >
                <Music size={80} fill="currentColor" />
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -2 }} className="inline-block mb-6">
                <Badge color="orange" className="!text-sm !px-6 !py-2 shadow-sm">
                  <SparklesIcon size={16} className="inline mr-2" />
                  {t("STAY IN THE LOOP", "MANTENTE INFORMADO")}
                </Badge>
              </motion.div>
              
              <h2 className="content-h2 mb-6 leading-[1.05] tracking-[-0.02em] drop-shadow-sm">
                {t("Stay in", "Mantente en")} <br /> {t("the", "el")} <span className="text-selah-orange relative inline-block">
                  {t("Loop!", "¡Contacto!")}
                  <motion.svg 
                    className="absolute -bottom-2 left-0 w-full h-4 text-selah-yellow -z-10" 
                    viewBox="0 0 100 20" 
                    preserveAspectRatio="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                  >
                    <path d="M0 10 Q 50 20 100 10" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                  </motion.svg>
                </span>
              </h2>
              
              <p className="text-selah-muted mb-12 max-w-2xl mx-auto body-text text-balance">
                {t(
                  "Enter your email address to be the first to know about all things Selah Kids! Get updates on new Christian kids music and fun videos straight to your inbox.",
                  "¡Ingresa tu correo electrónico para ser el primero en saber todo sobre Selah Kids! Recibe actualizaciones sobre nueva música cristiana para niños y videos divertidos directamente en tu bandeja de entrada."
                )}
              </p>
              
              <form 
                className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto relative" 
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSubscribed(true);
                }}
              >
                <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-selah-orange">
                    <Mail className="text-selah-muted/50 group-focus-within:text-selah-orange transition-colors duration-300" size={24} />
                  </div>
                  <input 
                    type="email" 
                    required
                    placeholder={t("Your email address", "Tu correo electrónico")} 
                    className="w-full pl-16 pr-8 py-6 rounded-full bg-selah-bg text-selah-dark content-h3 focus:outline-none focus:ring-[6px] focus:ring-selah-orange/30 transition-all border-2 border-transparent focus:border-selah-orange shadow-inner"
                  />
                </div>
                <Button 
                  type="submit"
                  className="!bg-selah-orange hover:!bg-[#e65300] !text-white !border-none !px-12 !py-6 !text-xl hover:-translate-y-1 active:translate-y-0 transition-all group shadow-[0_10px_30px_-10px_rgba(255,107,0,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(255,107,0,0.7)] hover:scale-105 whitespace-nowrap"
                >
                  {t("Join Now", "Únete Ahora")}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
              
              <div className="mt-12 flex items-center justify-center gap-4 bg-selah-bg/50 inline-flex px-6 py-3 rounded-full border border-selah-border/50 shadow-sm">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -5, scale: 1.1, zIndex: 10 }}
                      className="w-10 h-10 rounded-full border-2 border-white bg-selah-light overflow-hidden relative shadow-sm"
                    >
                      <img src={`https://picsum.photos/seed/sub${i}/50/50`} alt="Subscriber" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-selah-dark content-h3">
                  <SparklesIcon className="inline-block w-5 h-5 text-selah-yellow mr-2 animate-pulse" />{t("Join", "Únete a")} <span className="text-selah-orange">100,000+</span> {t("families", "familias")}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8, y: 60, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white p-8 sm:p-16 md:p-24 rounded-[30px] sm:rounded-[40px] md:rounded-[60px] relative overflow-hidden group shadow-[0_30px_100px_-20px_rgba(0,0,0,0.4)]"
            >
              {/* Success Confetti Effect - Enhanced */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ 
                      y: [-20, -250], 
                      x: [0, (i - 15) * 40],
                      opacity: [1, 1, 0],
                      scale: [1, 1.5, 0],
                      rotate: [0, 360]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.05, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2"
                    style={{ color: i % 3 === 0 ? '#ff5c00' : i % 3 === 1 ? '#feb835' : '#93d35c' }}
                  >
                    {i % 2 === 0 ? <Star size={20} fill="currentColor" /> : <div className="w-3 h-3 rounded-full bg-current" />}
                  </motion.div>
                ))}
              </div>

              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [-10, 10, -10],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-[8rem] md:text-[10rem] leading-none mb-8 inline-block drop-shadow-2xl"
              >
                <SparklesIcon className="inline-block w-8 h-8 text-selah-yellow" />
              </motion.div>
              <h3 className="content-h2 mb-6 leading-[1.05] tracking-[-0.02em] drop-shadow-sm">
                {t("Welcome to the", "Bienvenidos a la")} <br /> <span className="text-selah-orange relative inline-block">
                  Selah Kids
                  <motion.svg 
                    className="absolute -bottom-2 left-0 w-full h-4 text-selah-yellow -z-10" 
                    viewBox="0 0 100 20" 
                    preserveAspectRatio="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                  >
                    <path d="M0 10 Q 50 20 100 10" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                  </motion.svg>
                </span> {t("family!", "¡familia!")}
              </h3>
              <p className="body-text mb-12 max-w-lg mx-auto leading-relaxed text-balance">
                {t(
                  "Check your inbox for a special welcome gift from Andy and the gang. We're so glad you're here!",
                  "¡Revisa tu bandeja de entrada para un regalo especial de bienvenida de Andy y el grupo. ¡Estamos muy contentos de que estés aquí!"
                )}
              </p>
              <Button 
                onClick={() => setIsSubscribed(false)}
                className="!bg-selah-light hover:!bg-[#7ebd4e] !text-white !border-none !px-12 !py-5 !text-xl hover:-translate-y-1 transition-all shadow-[0_10px_30px_-10px_rgba(147,211,92,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(147,211,92,0.7)] hover:scale-105 whitespace-nowrap"
              >
                {t("Back to Website", "Volver al Sitio")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
