"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import NextImage from "next/image";
import { Music, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "../UI";
import { SectionHeader } from "../SectionHeader";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useLocalePath } from "../../hooks/useLocalePath";

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
  const { lh } = useLocalePath();
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
      className="py-10 md:py-16 relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-selah-light rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-selah-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

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
              src="/TGN_SingleFrames+(9).jpg" 
              alt="Selah Kids" 
              fill
              className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-selah-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0, rotate: 6 }}
            whileInView={{ y: 0, opacity: 1, rotate: 10 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.4 }}
            whileHover={{ y: -4, rotate: 6 }}
            className="absolute -bottom-8 -right-8 z-20"
          >
            <div className="bg-[var(--paper-cream)] bg-[image:var(--paper-grain)] bg-[length:96px_96px] px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/50 flex items-center justify-center">
              <span className="ui-label text-selah-dark tracking-widest">{t("Made by parents", "Hecho por padres")}</span>
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
            title={t("The Selah Kids Story", "La Historia de Selah Kids")}
            description={t(
              "Selah Kids! was created by parents who wanted a safe place for kids to watch faith-based videos. We want to help families get up, move, and worship God together with our catchy Sunday school songs.",
              "¡Selah Kids! fue creado por padres que querían un lugar seguro para que los niños vean videos basados en la fe. Queremos ayudar a las familias a levantarse, moverse y adorar a Dios juntos con nuestras pegajosas canciones de la escuela dominical."
            )}
          />
          
          <div className="grid gap-2 mt-[-2.5rem]">
            {[
              { icon: Music, title: t("Original Worship Songs", "Canciones de Adoración Originales"), desc: t("Our worship songs teach important lessons from scripture in an engaging way that kids can easily understand.", "Nuestras canciones de adoración enseñan lecciones importantes de las escrituras de una manera atractiva que los niños pueden entender fácilmente."), color: "bg-selah-light/20", iconColor: "text-selah-dark" },
              { icon: BookOpen, title: t("Stunning Animation", "Animación Impresionante"), desc: t("Our videos feature beautiful animation made by talented artists from around the world to bring Christian stories to life.", "Nuestros videos presentan hermosas animaciones hechas por artistas talentosos de todo el mundo para dar vida a las historias cristianas."), color: "bg-selah-yellow/20", iconColor: "text-selah-orange" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.3 + i * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ x: 10, backgroundColor: "rgba(0,0,0,0.02)" }}
                className="flex gap-8 items-start group p-6 -mx-6 rounded-3xl transition-colors duration-500 cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={feature.title}
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
              onClick={() => router.push(lh("/about"))}
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
