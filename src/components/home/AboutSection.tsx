"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import NextImage from "next/image";
import { Music, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "../UI";
import { SectionHeader } from "../SectionHeader";
import { useRouter } from "next/navigation";
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
} as const;

export function AboutSection() {
  const router = useRouter();
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <motion.section 
      ref={containerRef}
      id="about" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="py-10 md:py-16 bg-[#FFFDF7] relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-selah-light rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-selah-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231c4425' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <motion.div 
          style={{ y: imgY }}
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative group mt-10 md:mt-0"
        >
          <div className="aspect-[4/5] rounded-[40px] md:rounded-[80px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-1000 group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2),0_20px_40px_-10px_rgba(0,0,0,0.1)] group-hover:rotate-1">
            <NextImage 
              src="/TGN_SingleFrames+28329.jpg" 
              alt="Selah Kids" 
              fill
              className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-selah-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [12, 8, 12] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -right-8 z-20"
          >
            <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/50 flex items-center justify-center">
              <span className="content-h3 text-selah-dark tracking-widest uppercase">{t("Nature First", "Naturaleza Primero")}</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ y: textY }}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col"
        >
          <SectionHeader 
            badge={t("Our Mission", "Nuestra Misión")}
            title={t("Bible Songs & Christian Cartoons", "Canciones Bíblicas y Dibujos Cristianos")}
            description={t(
              "Selah Kids! was created by parents who wanted a safe place for kids to watch faith-based videos. We want to help families get up, move, and worship God together with our catchy Sunday school songs.",
              "¡Selah Kids! fue creado por padres que querían un lugar seguro para que los niños vean videos basados en la fe. Queremos ayudar a las familias a levantarse, moverse y adorar a Dios juntos con nuestras pegajosas canciones de la escuela dominical."
            )}
          />
          
          <div className="grid gap-2 mt-[-2.5rem]">
            {[
              { icon: Music, title: t("Original Bible Songs", "Canciones Bíblicas Originales"), desc: t("Our Bible songs teach important lessons from scripture in an engaging way that kids can easily understand.", "Nuestras canciones bíblicas enseñan lecciones importantes de las escrituras de una manera atractiva que los niños pueden entender fácilmente."), color: "bg-selah-light/20", iconColor: "text-selah-dark" },
              { icon: BookOpen, title: t("Stunning Animation", "Animación Impresionante"), desc: t("Our videos feature beautiful animation made by talented artists from around the world to bring Bible stories to life.", "Nuestros videos presentan hermosas animaciones hechas por artistas talentosos de todo el mundo para dar vida a las historias bíblicas."), color: "bg-selah-yellow/20", iconColor: "text-selah-orange" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.3 + i * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ x: 10, backgroundColor: "rgba(0,0,0,0.02)" }}
                className="flex gap-8 items-start group p-6 -mx-6 rounded-3xl transition-colors duration-500 cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-[24px] ${feature.color} flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <feature.icon className={`${feature.iconColor} group-hover:scale-110 transition-transform duration-300`} size={32} />
                </div>
                <div>
                  <h4 className="content-h3 text-selah-dark mb-3 group-hover:text-selah-orange transition-colors duration-300">{feature.title}</h4>
                  <p className="body-text text-balance">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Button 
              onClick={() => router.push("/about")}
              className="!px-10 !py-5 ui-button shadow-[0_10px_30px_-10px_rgba(255,92,0,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(255,92,0,0.7)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group whitespace-nowrap w-full sm:w-auto"
            >
              {t("Read Our Full Story", "Lee Nuestra Historia Completa")}
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
