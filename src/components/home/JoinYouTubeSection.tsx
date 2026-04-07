"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Youtube, Play } from "lucide-react";
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

export function JoinYouTubeSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const videoY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);

  return (
    <motion.section 
      ref={containerRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-12 md:py-16 relative overflow-hidden bg-gradient-to-br from-selah-orange/90 via-[#FF7F50] to-selah-yellow shadow-[0_20px_80px_-20px_rgba(255,92,0,0.3)]"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              style={{ y: textY }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
              viewport={{ once: true }}
            >
              <div className="inline-block mb-8">
                <Badge color="yellow" className="!rotate-0 shadow-sm">{t("SUBSCRIBE & WORSHIP", "SUSCRÍBETE Y ADORA")}</Badge>
              </div>
              <h2 className="content-h2 text-white mb-8 leading-[1.05] tracking-[-0.02em] drop-shadow-sm">
                {t("Join Our YouTube", "Únete a Nuestra")} <br /> {t("Family!", "Familia de YouTube!")}
              </h2>
              <p className="text-xl text-white/70 mb-12 max-w-lg leading-relaxed text-balance">
                {t(
                  "Get new Bible songs, English and Spanish worship videos, and awesome Christian cartoons every single week! Subscribe to our channel so you never miss a release.",
                  "¡Obtén nuevas canciones bíblicas, videos de adoración en inglés y español, y dibujos animados cristianos increíbles cada semana! ¡Suscríbete a nuestro canal para que nunca te pierdas un estreno!"
                )}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  onClick={() => window.open("https://www.youtube.com/@selahkidsworship", "_blank")}
                  className="!bg-[#FF0000] !border-none !px-10 !py-4 ui-button shadow-[0_10px_30px_-10px_rgba(255,0,0,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(255,0,0,0.7)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group whitespace-nowrap w-full sm:w-auto"
                >
                  <Youtube size={28} className="group-hover:scale-110 transition-transform duration-300" /> {t("Subscribe Now", "Suscríbete Ahora")}
                </Button>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ y: -5, scale: 1.1, zIndex: 10 }}
                        className="w-10 h-10 rounded-full border-2 border-selah-dark overflow-hidden relative shadow-sm"
                      >
                        <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                  <motion.span whileHover={{ scale: 1.05, color: "#fff" }} className="ui-labelr cursor-default transition-colors">{t("JOIN THE COMMUNITY", "ÚNETE A LA COMUNIDAD")}</motion.span>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{ y: videoY }}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 12, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Mock Video Player UI */}
              <div className="aspect-video bg-black rounded-[40px] overflow-hidden border-8 border-white/10 relative group shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
                <img 
                  src="/rroque_ALA_Shot1190_v01.png" 
                  alt="YouTube Preview" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-24 h-24 bg-[#FF0000] rounded-full flex items-center justify-center text-white shadow-[0_10px_30px_-10px_rgba(255,0,0,0.6)] cursor-pointer"
                    onClick={() => window.open("https://www.youtube.com/@selahkidsworship", "_blank")}
                  >
                    <Play fill="currentColor" size={40} className="ml-2" />
                  </motion.div>
                </div>
                
                {/* YouTube UI elements */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="h-1.5 w-full bg-white/20 rounded-full mb-4 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "65%" }}
                      transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-[#FF0000]"
                    />
                  </div>
                  <div className="flex justify-between items-center text-white/60 ui-button tracking-widest">
                    <span>04:20 / 10:00</span>
                    <div className="flex gap-4">
                      <div className="w-4 h-4 rounded-sm border border-current" />
                      <div className="w-4 h-4 rounded-sm border border-current" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 z-20"
              >
                <Badge color="light" className="!px-8 !py-4 ui-button shadow-lg border border-white/20">{t("New Weekly!", "¡Nuevo Cada Semana!")}</Badge>
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 z-20"
              >
                <Badge color="yellow" className="!px-8 !py-4 ui-button shadow-lg border border-selah-yellow/20">{t("Bilingual", "Bilingüe")}</Badge>
              </motion.div>
            </motion.div>
          </div>
      </div>
    </motion.section>
  );
}
