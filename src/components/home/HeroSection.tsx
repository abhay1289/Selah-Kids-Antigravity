import { motion, useTransform, MotionValue } from "framer-motion";
import { Play, SparklesIcon, Cloud, Sun, Music } from "lucide-react";
import { Button } from "../UI";
import { useRouter } from "next/navigation";

interface HeroSectionProps {
  scrollYProgress: MotionValue<number>;
  handleMouseMove: (e: React.MouseEvent) => void;
}

export function HeroSection({ scrollYProgress, handleMouseMove }: HeroSectionProps) {
  const router = useRouter();
  
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const sunRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
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
          style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, -150]) }}
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[10%] text-selah-dark/5"
        >
          <Cloud size={140} fill="currentColor" />
        </motion.div>
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, -200]), rotate: sunRotate }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-48 right-[12%] text-selah-yellow/20"
        >
          <Sun size={180} fill="currentColor" />
        </motion.div>

        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, -250]) }}
          animate={{ y: [0, -40, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[35%] left-[20%] text-selah-dark/5"
        >
          <Music size={40} />
        </motion.div>
        
        {/* Cinematic Background Image */}
        <motion.img 
          initial={{ scale: 1.2, filter: "blur(20px)", opacity: 0 }}
          animate={{ scale: 1.05, filter: "blur(2px)", opacity: 0.3 }}
          transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            scale: useTransform(scrollYProgress, [0, 1], [1.05, 1.2]),
            filter: useTransform(scrollYProgress, [0, 0.5], ["blur(2px)", "blur(16px)"])
          }}
          src="/TGN_SingleFrames+(9).jpg" 
          alt="Hero" 
          className="w-full h-full object-cover object-[20%_90%]"
          referrerPolicy="no-referrer"
        />
        
        {/* Floating Characters - NEW! */}
        <motion.div 
          initial={{ opacity: 0, x: -100, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-[2%] w-[25%] md:w-[20%] z-20 pointer-events-none hidden md:block"
        >
          <motion.img 
            animate={{ y: [0, -20, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            src="/SK_Libni_Intro_Pose-removebg-preview.png" 
            alt="Libni"
            className="w-full h-auto drop-shadow-2xl"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 right-[2%] w-[25%] md:w-[22%] z-20 pointer-events-none hidden md:block"
        >
          <motion.img 
            animate={{ y: [0, -25, 0], rotate: [2, -2, 2] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            src="/SK_Andy_Intro_Pose-removebg-preview.png" 
            alt="Andy"
            className="w-full h-auto drop-shadow-2xl"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2, ease: "easeOut" }}
          className="absolute bottom-10 left-[45%] w-[12%] md:w-[8%] z-10 pointer-events-none hidden md:block"
        >
          <motion.img 
            animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            src="/SK_Shiloh_Intro_Pose-removebg-preview.png" 
            alt="Shiloh"
            className="w-full h-auto drop-shadow-xl"
          />
        </motion.div>
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-selah-dark/5 via-transparent to-selah-dark/10" />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center justify-center mt-32 md:mt-40">
        <motion.div
          style={{ opacity: heroOpacity, y: useTransform(scrollYProgress, [0, 0.5], [0, -50]) }}
          className="flex flex-col items-center"
        >
          {/* Premium Pill Badge */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-flex items-center gap-3 px-6 py-2.5 bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full mb-8 cursor-default overflow-hidden group hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-shadow duration-500"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent -skew-x-12"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            />
            <SparklesIcon size={16} className="text-selah-orange relative z-10" />
            <span className="text-xs font-accent font-bold tracking-[0.25em] text-selah-dark/90 uppercase relative z-10">FAITH-FILLED MUSIC FOR LITTLE ONES</span>
          </motion.div>
          
          {/* Cinematic Title Reveal */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-selah-dark mb-6 tracking-tight leading-[1.1] drop-shadow-sm flex flex-wrap justify-center gap-x-3 lg:gap-x-4">
            {["Christian", "Music", "for"].map((word, i) => (
              <span key={i} className="overflow-hidden inline-block pb-2">
                <motion.span
                  initial={{ y: "100%", opacity: 0, rotateZ: 5, scale: 0.9, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, rotateZ: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block origin-bottom-left tracking-tight"
                >
                  {word}
                </motion.span>
              </span>
            ))}
            <span className="overflow-hidden inline-block pb-2">
              <motion.span
                initial={{ y: "100%", opacity: 0, rotateZ: 5, scale: 0.9, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, rotateZ: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block origin-bottom-left tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-selah-orange to-rose-500 italic pr-4"
              >
                Kids
              </motion.span>
            </span>
          </h1>
          
          {/* Refined Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl lg:text-2xl text-selah-muted font-sans font-medium max-w-3xl mx-auto leading-relaxed tracking-normal mb-8"
          >
            Welcome to Selah Kids! We create fun, original Bible songs and Christian cartoons that the whole family will love. Get ready to sing, dance, and learn about God with our catchy music and exciting videos!
          </motion.p>
          
          {/* Premium Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: "blur(4px)", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 1.2, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
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
                Watch Now
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
                Our Story
              </Button>
            </motion.div>
          </motion.div>

          {/* Platform Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4 bg-white/40 backdrop-blur-md px-8 sm:px-12 py-4 rounded-[2.5rem] sm:rounded-[3rem] border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.02)]"
          >
            <span className="text-xs font-sans font-bold tracking-[0.3em] text-selah-dark/40 uppercase">AVAILABLE ON</span>
            <div className="flex items-center gap-6">
              <motion.a 
                whileHover={{ scale: 1.15, color: "#FF0000", y: -2 }} 
                whileTap={{ scale: 0.95 }}
                href="#" 
                className="text-selah-dark/40 transition-all duration-300 drop-shadow-sm hover:drop-shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.15, color: "#1DB954", y: -2 }} 
                whileTap={{ scale: 0.95 }}
                href="#" 
                className="text-selah-dark/40 transition-all duration-300 drop-shadow-sm hover:drop-shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.31c-.223.366-.703.482-1.069.259-2.841-1.737-6.417-2.13-10.631-1.168-.418.096-.838-.168-.934-.586-.096-.418.168-.838.586-.934 4.613-1.055 8.568-.604 11.789 1.365.366.223.482.703.259 1.064zm1.468-3.258c-.281.456-.881.604-1.337.323-3.251-1.998-8.208-2.578-12.053-1.411-.513.156-1.053-.134-1.209-.646-.156-.513.134-1.053.646-1.209 4.394-1.333 9.858-.684 13.623 1.631.456.281.604.881.33 1.312zm.129-3.41c-3.899-2.316-10.322-2.529-14.075-1.391-.598.181-1.234-.149-1.415-.747-.181-.598.149-1.234.747-1.415 4.3-1.304 11.41-1.051 15.897 1.613.538.319.714 1.011.395 1.549-.319.538-1.011.714-1.549.391z"/>
                </svg>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.15, color: "#FA243C", y: -2 }} 
                whileTap={{ scale: 0.95 }}
                href="#" 
                className="text-selah-dark/40 transition-all duration-300 drop-shadow-sm hover:drop-shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
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
