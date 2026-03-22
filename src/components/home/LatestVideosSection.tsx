"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Play, SparklesIcon, Music, ArrowRight } from "lucide-react";
import { Button } from "../UI";
import { SectionHeader } from "../SectionHeader";
import { useLanguage } from "../../contexts/LanguageContext";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.2
    }
  }
};

export function LatestVideosSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const float1Y = useTransform(scrollYProgress, [0, 1], ["50%", "-50%"]);
  const float2Y = useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]);
  const videoContY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  const LATEST_VIDEOS = [
    {
      id: 1,
      title: t("This Is How We Praise The Lord", "Así Es Como Alabamos Al Señor"),
      description: t(
        "A high-energy sing-along that gets kids moving and praising God with all their heart! Join Andy and Libni in this catchy worship song.",
        "¡Un canto lleno de energía que hace que los niños se muevan y alaben a Dios con todo su corazón! Únete a Andy y Libni en esta pegajosa canción de adoración."
      ),
      img: "/TGN_SingleFrames+28729.jpg",
      category: t("Sing-Along", "Canta Conmigo"),
      language: t("English", "Inglés"),
      gradient: "from-selah-orange to-rose-500",
      date: t("LATEST", "NUEVO")
    },
    {
      id: 2,
      title: t("The Good News | Jesus Loves Me", "Las Buenas Nuevas | Jesús Me Ama"),
      description: t(
        "Experience the timeless message of God's love through this beautiful, animated version of the beloved classic.",
        "Experimenta el mensaje eterno del amor de Dios a través de esta hermosa versión animada del clásico querido."
      ),
      img: "/TGN_SingleFrames+28329.jpg",
      category: t("Bible Song", "Canción Bíblica"),
      language: t("English / Spanish", "Inglés / Español"),
      gradient: "from-selah-yellow to-selah-orange",
      date: t("FEATURED", "DESTACADO")
    }
  ];
  return (
    <motion.section 
      ref={containerRef}
      id="videos" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-16 md:py-32 bg-white relative overflow-hidden"
    >
      {/* Artistic Background Elements - Playful & Creative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ y: float1Y }}
          className="absolute top-20 right-[5%] text-selah-orange/5"
        >
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          >
            <Music size={200} />
          </motion.div>
        </motion.div>
        <motion.div 
          style={{ y: float2Y }}
          className="absolute bottom-40 left-[2%] text-selah-light/10"
        >
          <motion.div
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <SparklesIcon size={150} />
          </motion.div>
        </motion.div>
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-45c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm54 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM10 0C8.895 0 8 .895 8 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm80 0c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zM40 0c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z' fill='%231c4425' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader 
          badge={t("FRESH CONTENT", "CONTENIDO NUEVO")}
          title={t("Our Latest Videos", "Nuestros Últimos Videos")}
          description={t(
            "Check out our newest Christian kids music and fun Bible stories! We have awesome worship videos in both English and Spanish. They are perfect for Sunday school songs or hanging out with your family!",
            "¡Mira nuestra nueva música cristiana para niños e historias bíblicas divertidas! Tenemos increíbles videos de adoración en inglés y español. ¡Son perfectos para canciones de la escuela dominical o para pasar tiempo con tu familia!"
          )}
          align="center"
        />

        <motion.div style={{ y: videoContY }} className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mt-24">
          {LATEST_VIDEOS.map((video, i) => (
            <motion.div
              key={video.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 100 },
                visible: { 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  transition: { 
                    type: "spring",
                    stiffness: 70,
                    damping: 14,
                    delay: i * 0.2
                  }
                }
              }}
              onClick={() => window.open("https://www.youtube.com/@selahkidsworship", "_blank")}
              className="group cursor-pointer relative"
            >
              {/* Thumbnail Area - Large & Prominent */}
              <div className="relative aspect-[16/10] rounded-[48px] overflow-hidden transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.05)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2),0_20px_30px_-5px_rgba(0,0,0,0.1)] group-hover:-translate-y-2">
                {/* Color-coded Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${video.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-700 z-10`} />
                
                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] ease-in-out" />
                </div>

                <img 
                  src={video.img} 
                  alt={video.title} 
                  className="w-full h-full object-cover mix-blend-overlay transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />

                {/* Play Button Overlay - Floating & Animated */}
                <div className="absolute inset-0 flex items-center justify-center z-30">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0px rgba(255,255,255,0)",
                        "0 0 40px rgba(255,255,255,0.4)",
                        "0 0 0px rgba(255,255,255,0)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-selah-dark transition-all duration-500 group-hover:bg-white group-hover:text-selah-orange shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_4px_10px_-2px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]"
                  >
                    <Play fill="currentColor" size={32} className="ml-1.5" />
                  </motion.div>
                </div>

                {/* Language Badge (Top Right) - Glassmorphism */}
                <div className="absolute top-6 right-6 z-30">
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-5 py-2 bg-white/30 backdrop-blur-xl rounded-full border border-white/40 ui-label text-white cursor-default shadow-sm"
                  >
                    {video.language}
                  </motion.div>
                </div>

                {/* Category Badge (Bottom Left) - Glassmorphism */}
                <div className="absolute bottom-6 left-6 z-30">
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-6 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl ui-label text-selah-dark cursor-default shadow-sm"
                  >
                    {video.category}
                  </motion.div>
                </div>
              </div>

              {/* Content Below - Refined Typography */}
              <div className="mt-6 md:mt-10 px-2 md:px-4">
                <div className="flex items-center gap-4 mb-4">
                  <span className="ui-label text-selah-orange">{video.date}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-selah-orange/20 to-transparent" />
                </div>
                <h3 className="content-h3 text-selah-dark mb-4 group-hover:text-selah-orange transition-colors duration-300 leading-tight tracking-tight tracking-hover">
                  {video.title}
                </h3>
                <p className="body-text line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity text-balance">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-24">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline"
              className="!px-16 !py-6 !text-xl !border-2 !border-selah-orange !text-selah-orange hover:!bg-selah-orange hover:!text-white transition-all group shadow-[0_10px_30px_-10px_rgba(255,107,0,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(255,107,0,0.5)] whitespace-nowrap"
              onClick={() => window.open("https://www.youtube.com/@selahkidsworship", "_blank")}
            >
              {t("See All Videos", "Ver Todos Los Videos")}
              <ArrowRight className="inline-block ml-3 transition-transform group-hover:translate-x-2" size={24} />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
