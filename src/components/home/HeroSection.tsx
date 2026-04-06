"use client";

import { motion, useTransform, MotionValue, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
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
  
  // Static parallax arrays to satisfy React Rules of Hooks
  const bokehTransforms = [
    useTransform(scrollYProgress, [0, 1], [0, -300]),
    useTransform(scrollYProgress, [0, 1], [0, -400]),
    useTransform(scrollYProgress, [0, 1], [0, -500]),
    useTransform(scrollYProgress, [0, 1], [0, -600]),
    useTransform(scrollYProgress, [0, 1], [0, -700]),
    useTransform(scrollYProgress, [0, 1], [0, -800])
  ];

  /* ------------------------------------------------------------- 
     ULTRA-PREMIUM 3D TRACKING & CINEMATIC PHYSICS 
  ------------------------------------------------------------- */
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D Tilts for Libni (Left)
  const libniRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const libniRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-15, 10]);
  const charTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30]);
  
  // 3D Tilts for Andy (Right) - Opposite Y rotation for depth
  const andyRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const andyRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 15]);
  const charRightTranslateX = useTransform(charTranslateX, (val) => -val);

  // Spotlight coordinates in percentages
  const spotX = useTransform(smoothMouseX, [-0.5, 0.5], ["0%", "100%"]);
  const spotY = useTransform(smoothMouseY, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightBackground = useMotionTemplate`radial-gradient(1200px circle at ${spotX} ${spotY}, rgba(255,255,255,0.08), transparent 40%)`;

  const onHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    handleMouseMove(e); // Maintain the global original parallax if any
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Normalize to [-0.5, 0.5]
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  if (isLoading) {
    return <section className="relative min-h-[90svh] md:min-h-[750px] bg-[#FFF5EE]" />;
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
      onMouseMove={onHeroMouseMove}
      className="relative min-h-[90svh] md:min-h-[750px] pb-10 md:pb-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFE0C0] via-[#FFD4A8] to-[#D4EDC0] perspective-1000"
    >
      {/* Vivid color washes — enterprise-grade vibrancy */}
      <div className="absolute top-0 right-0 w-[70vw] h-[65vh] bg-gradient-to-bl from-[#FF7F50]/30 via-[#FF5C00]/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[65vw] h-[60vh] bg-gradient-to-tr from-[#93D35C]/30 via-[#98FF98]/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[10%] left-[5%] w-[45vw] h-[45vh] bg-[#FEB835]/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[40vw] h-[40vh] bg-[#FF69B4]/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-[30%] right-[15%] w-[35vw] h-[35vh] bg-[#00BFFF]/18 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[5%] left-[35%] w-[30vw] h-[30vh] bg-[#9B59B6]/14 rounded-full blur-[90px] pointer-events-none" />
      
      <motion.div 
        style={{ y: heroY, opacity: heroOpacity }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >

        
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 0.10 }}
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
        
        {/* Floating Characters - True 3D Interactive Parallax */}
        <motion.div 
          style={{ 
            y: charLeftY, 
            x: charTranslateX,
            rotateX: libniRotateX, 
            rotateY: libniRotateY,
            perspective: 800
          }}
          initial={{ opacity: 0, x: "35vw", scale: 0.2, rotate: 30, filter: "blur(20px)" }}
          animate={{ opacity: 1, x: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.1, mass: 1.2 }}
          className="absolute top-[35%] sm:top-[60%] md:top-[50%] -translate-y-1/2 left-0 -ml-[5%] sm:ml-4 md:ml-12 w-[40%] sm:w-[30%] md:w-[22%] z-0 md:z-20 opacity-30 sm:opacity-50 md:opacity-100 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/SK_Libni_Intro_Pose-removebg-preview.png" 
              alt="Libni"
              width={320}
              height={480}
              className="w-full h-auto drop-shadow-[0_15px_40px_rgba(255,100,150,0.5)]"
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ 
            y: charRightY, 
            x: charRightTranslateX, // Opposite pan
            rotateX: andyRotateX, 
            rotateY: andyRotateY,
            perspective: 800
          }}
          initial={{ opacity: 0, x: "-35vw", scale: 0.2, rotate: -30, filter: "blur(20px)" }}
          animate={{ opacity: 1, x: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 50, damping: 14, delay: 0.15, mass: 1.2 }}
          className="absolute top-[35%] sm:top-[60%] md:top-[50%] -translate-y-1/2 right-0 -mr-[5%] sm:mr-4 md:mr-12 w-[40%] sm:w-[30%] md:w-[22%] z-0 md:z-20 opacity-30 sm:opacity-50 md:opacity-100 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [1, -1, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Image
              src="/SK_Andy_Intro_Pose-removebg-preview.png" 
              alt="Andy"
              width={320}
              height={480}
              className="w-full h-auto drop-shadow-[0_15px_40px_rgba(0,180,255,0.4)]"
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        {/* Shiloh removed to balance the left/right composition */}
        
        {/* Dynamic Cursor Spotlight (Interactive Lighting) */}
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen z-20 hidden md:block"
          style={{ background: spotlightBackground }}
        />

        {/* Cinematic Lighting: Magical Ambient Sun Rays */}
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 inset-x-0 h-[120%] pointer-events-none mix-blend-overlay z-10 hidden md:block" 
          style={{ background: "radial-gradient(circle at 50% -10%, rgba(255,255,255,0.9) 0%, rgba(255,220,150,0.3) 35%, transparent 60%)" }} 
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8EE]/50 via-transparent to-[#FFFDF5]/40 z-10 pointer-events-none" />


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
          
          {/* Cinematic Title Reveal with Magical Aura */}
          <div className="relative mt-2">

            
            <h1 className="hero-headline flex flex-wrap justify-center gap-x-3 lg:gap-x-4 mb-6 drop-shadow-lg relative z-10">
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
          </div>
          
          {/* Refined Description */}
          <motion.p 
            initial={{ opacity: 0, y: 30, filter: "blur(10px)", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.9 }}
            className="body-text mx-auto mb-8 text-center text-balance"
          >
            {t(
              "Welcome to Selah Kids! We create original Bible songs and Christian cartoons that the whole family will love. Get ready to sing, dance, and learn about God with our catchy music and exciting videos!",
              "¡Bienvenidos a Selah Kids! Creamos canciones bíblicas originales y dibujos animados cristianos que encantarán a toda la familia. ¡Prepárate para cantar, bailar y aprender sobre Dios con nuestra música pegajosa y videos emocionantes!"
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
                onClick={() => router.push("/watch")}
                className="group overflow-hidden relative !px-10 !py-4 ui-button flex items-center justify-center gap-3 whitespace-nowrap shadow-[0_20px_40px_-15px_rgba(255,92,0,0.5)] hover:shadow-[0_30px_60px_-15px_rgba(255,92,0,0.7)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
              >
                {/* Shine Sweep Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 transition-transform duration-[800ms] ease-out" />
                
                <Play size={22} className="fill-white relative z-10 transition-transform duration-300 group-hover:rotate-12" />
                <span className="relative z-10">{t("Watch Now", "Ver Ahora")}</span>
              </Button>
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Button 
                onClick={() => router.push("/about")}
                variant="white" 
                className="group overflow-hidden relative !px-10 !py-4 ui-button flex items-center justify-center whitespace-nowrap shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
              >
                {/* Shine Sweep Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-selah-pink/20 to-transparent skew-x-12 transition-transform duration-[800ms] ease-out" />
                
                <span className="relative z-10">{t("Our Story", "Nuestra Historia")}</span>
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
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white/80 backdrop-blur-xl border-[3px] border-white flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(255,0,0,0.2)] hover:shadow-[0_20px_50px_0_rgba(255,0,0,0.4)] transition-all duration-300 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FF0000]/10 to-[#FF0000]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF0000] relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </motion.a>
              
              {/* Keep design minimal and clean */}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
