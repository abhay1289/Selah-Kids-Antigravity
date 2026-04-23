"use client";

import { motion, useTransform, MotionValue, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Play, SparklesIcon, Cloud, Sun, Music } from "lucide-react";
import Image from "next/image";
import { Button } from "../UI";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useLocalePath } from "../../hooks/useLocalePath";

interface HeroSectionProps {
  scrollYProgress: MotionValue<number>;
  handleMouseMove: (e: React.MouseEvent) => void;
  isLoading?: boolean;
}

export function HeroSection({ scrollYProgress, handleMouseMove, isLoading }: HeroSectionProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { lh } = useLocalePath();

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
    return <section className="relative min-h-[90svh] md:min-h-[750px]" />;
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
      onMouseMove={onHeroMouseMove}
      className="relative min-h-[90svh] md:min-h-[750px] pb-10 md:pb-0 flex items-center justify-center overflow-hidden perspective-1000"
    >
      {/* D2.1 — Single warm key-light. The cool haze blob was deleted (its hard-clipped
         lower edge at `bottom-0` sat exactly at the hero/section boundary and read as a
         visible horizontal band). The page-fixed atmos-spine already carries cool tones. */}
      <div className="absolute top-0 right-[10%] w-[55vw] h-[45vh] bg-gradient-to-bl from-[#FF7F50]/18 via-[#FF5C00]/8 to-transparent rounded-full blur-[110px] pointer-events-none" />

      <motion.div
        style={{
          y: heroY,
          opacity: heroOpacity,
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
        }}
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
              src="/rroque_ALA_Shot1260_v01.png"
              alt="Hero background"
              fill
              className="object-cover object-[20%_90%] blur-[2px]"
              priority
              quality={50}
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
          className="absolute top-[24%] sm:top-[45%] md:top-[50%] -translate-y-1/2 left-0 -ml-[2%] sm:ml-4 md:ml-12 w-[32%] sm:w-[25%] md:w-[18%] z-0 md:z-20 opacity-30 sm:opacity-50 md:opacity-100 pointer-events-none"
        >
          <motion.div>
            <Image
              src="/SK_Libni_Intro_Pose-removebg-preview.png"
              alt="Libni"
              width={320}
              height={480}
              data-fold-char
              className="w-full h-auto [filter:drop-shadow(0_20px_22px_rgba(82,52,16,0.18))_drop-shadow(0_4px_8px_rgba(82,52,16,0.12))]"
              priority
              quality={60}
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
          className="absolute top-[24%] sm:top-[45%] md:top-[50%] -translate-y-1/2 right-0 -mr-[2%] sm:mr-4 md:mr-12 w-[32%] sm:w-[25%] md:w-[18%] z-0 md:z-20 opacity-30 sm:opacity-50 md:opacity-100 pointer-events-none"
        >
          <motion.div>
            <Image
              src="/SK_Andy_Intro_Pose-removebg-preview.png"
              alt="Andy"
              width={320}
              height={480}
              data-fold-char
              className="w-full h-auto [filter:drop-shadow(0_20px_22px_rgba(82,52,16,0.18))_drop-shadow(0_4px_8px_rgba(82,52,16,0.12))]"
              priority
              quality={60}
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
          className="absolute top-0 inset-x-0 h-[120%] pointer-events-none mix-blend-overlay z-10 hidden md:block opacity-35"
          style={{ background: "radial-gradient(circle at 50% -10%, rgba(255,255,255,0.9) 0%, rgba(255,220,150,0.3) 35%, transparent 60%)" }}
        />
        {/* Gradient Overlay for Text Readability */}
        {/* Hero top-down readability vignette — tinted only at the TOP so the
            hero's bottom edge is fully transparent and flows into the next
            section's atmos-spine without a tone step. */}
        <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-[var(--mood-bg-top,#FFF8EE)]/45 to-transparent z-10 pointer-events-none" />


      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center justify-center mt-24 md:mt-32">
        <motion.div
          style={{ opacity: heroOpacity, y: contentY }}
          className="flex flex-col items-center"
        >
          {/* E3 — Premium pill badge as true thin glass, single entrance, no shimmer loop */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 70, damping: 18, delay: 0.25 }}
            className="glass-thin relative inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-8"
          >
            <SparklesIcon size={14} className="text-selah-orange" aria-hidden />
            <span className="ui-label text-selah-dark/80">{t("FAITH-FILLED MUSIC FOR LITTLE ONES", "MÚSICA DE FE PARA LOS PEQUEÑOS")}</span>
          </motion.div>
          
          {/* E1 — One-piece cinematic reveal. No per-word bounce theatre. */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: 0.35 }}
            className="hero-headline relative z-10 mx-auto mb-6 max-w-[14ch] tracking-[-0.035em] leading-[1.08] text-balance"
          >
            {t('Christian Music for Kids', 'Música Cristiana para Niños')}
          </motion.h1>
          
          {/* Refined Description */}
          <motion.p 
            initial={{ opacity: 0, y: 30, filter: "blur(10px)", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 0.9 }}
            className="body-text mx-auto mb-8 text-center text-balance"
          >
            {t(
              "Welcome to Selah Kids! We create original worship songs and Christian cartoons that the whole family will love. Get ready to sing, dance, and learn about God with our catchy music and exciting videos!",
              "¡Bienvenidos a Selah Kids! Creamos canciones de adoración originales y dibujos animados cristianos que encantarán a toda la familia. ¡Prepárate para cantar, bailar y aprender sobre Dios con nuestra música pegajosa y videos emocionantes!"
            )}
          </motion.p>
          
          {/* Premium Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 40, filter: "blur(10px)", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            transition={{ type: "spring", stiffness: 60, damping: 20, delay: 1.1 }}
            className="flex flex-col sm:flex-row justify-center gap-4 relative z-20 w-full sm:w-auto px-6 mb-10"
          >
            <Button onClick={() => router.push(lh("/watch"))} className="!px-10 !py-4 w-full sm:w-auto">
              <Play size={22} fill="currentColor" aria-hidden />
              <span>{t("Watch Now", "Ver Ahora")}</span>
            </Button>
            <Button onClick={() => router.push(lh("/about"))} variant="white" className="!px-10 !py-4 w-full sm:w-auto">
              <span>{t("Our Story", "Nuestra Historia")}</span>
            </Button>
          </motion.div>

          {/* Platform Links - Playful Morphing Liquid Blobs */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 15, delay: 1.2 }}
            className="mt-8 md:mt-12 flex flex-col items-center relative z-20"
          >
            {/* Playful Floating Badge removed - kept static */}
            <motion.div 
              className="absolute -top-12 sm:-top-16"
            >
              <span className="ui-label text-selah-dark/70 tracking-[0.2em] sm:tracking-[0.3em] flex items-center gap-3 bg-white/70 backdrop-blur-xl px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border-2 border-white shadow-[0_8px_20px_-5px_rgba(0,0,0,0.1)]">
                <Music size={14} className="text-selah-orange" />
                {t("AVAILABLE ON", "DISPONIBLE EN")}
              </span>
            </motion.div>
            
            <div className="flex items-center gap-4 sm:gap-8 mt-4 sm:mt-6">
              <motion.a 
                href={language === 'ES' ? "https://www.youtube.com/@SelahKidsEspanol" : "https://www.youtube.com/@selahkidsworship"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white/80 backdrop-blur-xl border-[3px] border-white rounded-full flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(255,0,0,0.2)] hover:shadow-[0_20px_50px_0_rgba(255,0,0,0.4)] transition-all duration-300 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FF0000]/10 to-[#FF0000]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF0000] relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </motion.a>
              
              <motion.a 
                href="https://open.spotify.com/artist/6lShgHNhA1vXSZ6f4UXMa4" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white/80 backdrop-blur-xl border-[3px] border-white rounded-full flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(29,185,84,0.2)] hover:shadow-[0_20px_50px_0_rgba(29,185,84,0.4)] transition-all duration-300 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-bl from-white via-[#1DB954]/10 to-[#1DB954]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-[#1DB954] relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.31c-.223.366-.703.482-1.069.259-2.841-1.737-6.417-2.13-10.631-1.168-.418.096-.838-.168-.934-.586-.096-.418.168-.838.586-.934 4.613-1.055 8.568-.604 11.789 1.365.366.223.482.703.259 1.064zm1.468-3.258c-.281.456-.881.604-1.337.323-3.251-1.998-8.208-2.578-12.053-1.411-.513.156-1.053-.134-1.209-.646-.156-.513.134-1.053.646-1.209 4.394-1.333 9.858-.684 13.623 1.631.456.281.604.881.33 1.312zm.129-3.41c-3.899-2.316-10.322-2.529-14.075-1.391-.598.181-1.234-.149-1.415-.747-.181-.598.149-1.234.747-1.415 4.3-1.304 11.41-1.051 15.897 1.613.538.319.714 1.011.395 1.549-.319.538-1.011.714-1.549.391z"/>
                </svg>
              </motion.a>
              
              <motion.a 
                href="https://music.apple.com/us/artist/selah-kids/1823099991" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: -8 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-white/80 backdrop-blur-xl border-[3px] border-white rounded-full flex items-center justify-center shadow-[0_15px_35px_-5px_rgba(250,36,60,0.2)] hover:shadow-[0_20px_50px_0_rgba(250,36,60,0.4)] transition-all duration-300 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white via-[#FA243C]/10 to-[#FA243C]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-[#FA243C] relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
