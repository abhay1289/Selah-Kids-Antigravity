"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { Play, SparklesIcon, Cloud, Sun, Music } from "lucide-react";
import Image from "next/image";
import { Button } from "../UI";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";

interface HeroSectionProps {
  scrollYProgress: MotionValue<number>;
  handleMouseMove: (e: React.MouseEvent) => void;
  isLoading?: boolean;
}

export function HeroSection({ scrollYProgress, handleMouseMove, isLoading }: HeroSectionProps) {
  const router = useRouter();
  const { t } = useLanguage();
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const sunRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  
  // New Character Parallax
  const charLeftY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const charRightY = useTransform(scrollYProgress, [0, 1], [0, -250]);

  // Extract all useTransform hooks so they run on every render (Rules of Hooks)
  const cloudY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const sunY = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
  const musicY = useTransform(scrollYProgress, [0, 0.5], [0, -250]);
  const bgImgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  if (isLoading) {
    return <section className="relative min-h-[100svh] md:min-h-[900px] bg-selah-bg" />;
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] md:min-h-[900px] flex items-center justify-center overflow-hidden bg-selah-bg"
    >
      {/* Storytelling Background - Paper Texture & Soft Elements */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 mix-blend-multiply" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }} />
      
      <motion.div 
        style={{ y: heroY, opacity: heroOpacity }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        {/* Floating Background Elements */}
        <motion.div 
          style={{ y: cloudY }}
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[10%] text-selah-dark/5"
        >
          <Cloud size={140} fill="currentColor" />
        </motion.div>
        <motion.div 
          style={{ y: sunY, rotate: sunRotate }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-48 right-[12%] text-selah-yellow/20"
        >
          <Sun size={180} fill="currentColor" />
        </motion.div>

        <motion.div
          style={{ y: musicY }}
          animate={{ y: [0, -40, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[35%] left-[20%] text-selah-dark/5"
        >
          <Music size={40} />
        </motion.div>
        
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 0.18 }}
            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ scale: bgImgScale }}
            className="absolute inset-0"
          >
            <Image
              src="/TGN_SingleFrames+(9).jpg"
              alt="Hero background"
              fill
              className="object-cover object-[20%_90%] blur-[2px]"
              priority
              quality={75}
              sizes="100vw"
            />
          </motion.div>
        </div>
        
        {/* Floating Characters - NEW! */}
        <motion.div 
          style={{ y: charLeftY }}
          initial={{ opacity: 0, x: "35vw", scale: 0.2, rotate: 30, filter: "blur(20px)" }}
          animate={{ opacity: 1, x: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.1, mass: 1.2 }}
          className="absolute top-[45%] md:top-[50%] -translate-y-1/2 left-0 ml-4 md:ml-12 w-[25%] md:w-[22%] z-20 pointer-events-none hidden md:block"
        >
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/SK_Libni_Intro_Pose-removebg-preview.png" 
              alt="Libni"
              width={320}
              height={480}
              className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ y: charRightY }}
          initial={{ opacity: 0, x: "-35vw", scale: 0.2, rotate: -30, filter: "blur(20px)" }}
          animate={{ opacity: 1, x: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.15, mass: 1.2 }}
          className="absolute top-[45%] md:top-[50%] -translate-y-1/2 right-0 mr-4 md:mr-12 w-[25%] md:w-[22%] z-20 pointer-events-none hidden md:block"
        >
          <motion.div
            animate={{ y: [0, -25, 0], rotate: [2, -2, 2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Image
              src="/SK_Andy_Intro_Pose-removebg-preview.png" 
              alt="Andy"
              width={320}
              height={480}
              className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        {/* Shiloh removed to balance the left/right composition */}
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-selah-bg/60 via-selah-bg/20 to-selah-bg/40" />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center justify-center mt-24 md:mt-32">
        <motion.div
          style={{ opacity: heroOpacity, y: contentY }}
          className="flex flex-col items-center"
        >
          {/* Premium Pill Badge */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 70, damping: 15, delay: 0.3 }}
            className="relative inline-flex items-center gap-3 px-6 py-2.5 bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full mb-8 cursor-default overflow-hidden group hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-shadow duration-500"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent -skew-x-12"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            />
            <SparklesIcon size={16} className="text-selah-orange relative z-10" />
            <span className="ui-label text-selah-dark/90 relative z-10">{t("FAITH-FILLED MUSIC FOR LITTLE ONES", "MÚSICA DE FE PARA LOS PEQUEÑOS")}</span>
          </motion.div>
          
          {/* Cinematic Title Reveal */}
          <h1 className="hero-headline flex flex-wrap justify-center gap-x-3 lg:gap-x-4 mb-6 drop-shadow-sm">
            {t("Christian", "Música").split(" ").concat(t("Music for", "Cristiana para").split(" ")).map((word, i) => (
              <span key={i} className="overflow-hidden inline-block pb-4 px-1">
                <motion.span
                  initial={{ y: "150%", opacity: 0, rotateZ: 15, scale: 0.8, filter: "blur(8px)" }}
                  animate={{ y: 0, opacity: 1, rotateZ: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{ type: "spring", bounce: 0.4, duration: 1.2, delay: i * 0.1 + 0.4 }}
                  className="inline-block origin-bottom-left"
                >
                  {word}
                </motion.span>
              </span>
            ))}
            <span className="overflow-hidden inline-block pb-4">
              <motion.span
                initial={{ y: "150%", opacity: 0, rotateZ: -10, scale: 0.5, filter: "blur(12px)" }}
                animate={{ y: 0, opacity: 1, rotateZ: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ type: "spring", bounce: 0.5, duration: 1.5, delay: 0.7 }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                className="inline-block origin-bottom-left pr-4 drop-shadow-[0_10px_20px_rgba(255,107,0,0.4)]"
              >
                {t("Kids", "Niños")}
              </motion.span>
            </span>
          </h1>
          
          {/* Refined Description */}
          <motion.p 
            initial={{ opacity: 0, y: 30, filter: "blur(10px)", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.9 }}
            className="body-text mx-auto mb-8 text-center text-balance"
          >
            {t(
              "Welcome to Selah Kids! We create fun, original Bible songs and Christian cartoons that the whole family will love. Get ready to sing, dance, and learn about God with our catchy music and exciting videos!",
              "¡Bienvenidos a Selah Kids! Creamos canciones bíblicas originales y divertidas y dibujos animados cristianos que encantarán a toda la familia. ¡Prepárate para cantar, bailar y aprender sobre Dios con nuestra música pegajosa y videos emocionantes!"
            )}
          </motion.p>
          
          {/* Premium Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 40, filter: "blur(10px)", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 1.1 }}
            className="flex flex-col sm:flex-row justify-center gap-4 relative z-20 w-full sm:w-auto px-6 mb-10"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button 
                onClick={() => window.open("https://www.youtube.com/@selahkidsworship", "_blank")}
                className="!px-12 !py-6 !text-xl flex items-center justify-center gap-3 whitespace-nowrap shadow-[0_20px_40px_-15px_rgba(255,92,0,0.5)] hover:shadow-[0_30px_60px_-15px_rgba(255,92,0,0.7)] hover:scale-105 transition-all w-full sm:w-auto"
              >
                <Play size={22} className="fill-white" />
                {t("Watch Now", "Ver Ahora")}
              </Button>
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Button 
                onClick={() => router.push("/about")}
                variant="white" 
                className="!px-12 !py-6 !text-xl flex items-center justify-center whitespace-nowrap shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:scale-105 transition-all w-full sm:w-auto"
              >
                {t("Our Story", "Nuestra Historia")}
              </Button>
            </motion.div>
          </motion.div>

          {/* Platform Links - Playful Morphing Liquid Blobs */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 15, delay: 1.2 }}
            className="mt-8 md:mt-12 flex flex-col items-center relative z-20"
          >
            {/* Playful Floating Badge */}
            <motion.div 
              animate={{ y: [0, -5, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 sm:-top-16"
            >
              <span className="ui-label text-selah-dark/70 tracking-[0.2em] sm:tracking-[0.3em] flex items-center gap-3 bg-white/70 backdrop-blur-xl px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border-2 border-white shadow-[0_8px_20px_-5px_rgba(0,0,0,0.1)]">
                <Music size={14} className="text-selah-orange animate-bounce" />
                {t("AVAILABLE ON", "DISPONIBLE EN")}
              </span>
            </motion.div>
            
            <div className="flex items-center gap-4 sm:gap-8 mt-4 sm:mt-6">
              {/* YouTube Jelly Blob */}
              <motion.a 
                href="#" 
                animate={{ 
                  y: [0, -15, 0], 
                  borderRadius: [
                    "60% 40% 30% 70% / 60% 30% 70% 40%", 
                    "30% 70% 70% 30% / 30% 30% 70% 70%", 
                    "60% 40% 30% 70% / 60% 30% 70% 40%"
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                whileHover={{ scale: 1.2, borderRadius: "30%", rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 sm:w-20 sm:h-20 bg-white/80 backdrop-blur-xl border-[3px] border-white flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(255,0,0,0.2)] hover:shadow-[0_20px_50px_0_rgba(255,0,0,0.4)] transition-all duration-300 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FF0000]/10 to-[#FF0000]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF0000] relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </motion.a>
              
              {/* Spotify Jelly Blob */}
              <motion.a 
                href="#" 
                animate={{ 
                  y: [0, -20, 0], 
                  borderRadius: [
                    "40% 60% 70% 30% / 40% 50% 60% 50%", 
                    "70% 30% 50% 50% / 30% 70% 30% 70%", 
                    "40% 60% 70% 30% / 40% 50% 60% 50%"
                  ],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                whileHover={{ scale: 1.2, borderRadius: "30%", rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 sm:w-20 sm:h-20 bg-white/80 backdrop-blur-xl border-[3px] border-white flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(29,185,84,0.2)] hover:shadow-[0_20px_50px_0_rgba(29,185,84,0.4)] transition-all duration-300 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-bl from-white via-[#1DB954]/10 to-[#1DB954]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8 text-[#1DB954] relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.31c-.223.366-.703.482-1.069.259-2.841-1.737-6.417-2.13-10.631-1.168-.418.096-.838-.168-.934-.586-.096-.418.168-.838.586-.934 4.613-1.055 8.568-.604 11.789 1.365.366.223.482.703.259 1.064zm1.468-3.258c-.281.456-.881.604-1.337.323-3.251-1.998-8.208-2.578-12.053-1.411-.513.156-1.053-.134-1.209-.646-.156-.513.134-1.053.646-1.209 4.394-1.333 9.858-.684 13.623 1.631.456.281.604.881.33 1.312zm.129-3.41c-3.899-2.316-10.322-2.529-14.075-1.391-.598.181-1.234-.149-1.415-.747-.181-.598.149-1.234.747-1.415 4.3-1.304 11.41-1.051 15.897 1.613.538.319.714 1.011.395 1.549-.319.538-1.011.714-1.549.391z"/>
                </svg>
              </motion.a>
              
              {/* Apple Music Jelly Blob */}
              <motion.a 
                href="#" 
                animate={{ 
                  y: [0, -18, 0], 
                  borderRadius: [
                    "50% 50% 20% 80% / 25% 80% 20% 75%", 
                    "30% 70% 50% 50% / 60% 40% 60% 40%", 
                    "50% 50% 20% 80% / 25% 80% 20% 75%"
                  ],
                }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                whileHover={{ scale: 1.2, borderRadius: "30%", rotate: -8 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 sm:w-20 sm:h-20 bg-white/80 backdrop-blur-xl border-[3px] border-white flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(250,36,60,0.2)] hover:shadow-[0_20px_50px_0_rgba(250,36,60,0.4)] transition-all duration-300 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white via-[#FA243C]/10 to-[#FA243C]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8 text-[#FA243C] relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  <path d="M17.05 20.28c-.98.95-2.05 1.61-3.22 1.61-1.14 0-1.53-.67-2.82-.67-1.3 0-1.75.66-2.82.66-1.14 0-2.18-.64-3.22-1.61C2.73 18.11 1.04 14.19 1.04 10.6c0-3.59 1.83-5.5 3.61-5.5 1.14 0 2.05.66 2.82.66.75 0 1.56-.66 2.82-.66 1.63 0 3.1 1.3 3.75 2.82-3.32 1.61-2.77 6.13.55 7.42-.64 1.61-1.61 3.54-2.54 4.94zM12.03 4.45c-.02-2.13 1.53-3.95 3.42-4.05.18 2.13-1.53 4.15-3.42 4.05z"/>
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
