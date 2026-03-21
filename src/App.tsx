import { motion, useScroll, useSpring, AnimatePresence, useTransform, useMotionValue } from "motion/react";
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { BouncingDots } from "./components/UI";
import { CHARACTERS } from "./constants";

import { HeroSection } from "./components/home/HeroSection";
import { LatestVideosSection } from "./components/home/LatestVideosSection";
import { AboutSection } from "./components/home/AboutSection";
import { CharactersSection } from "./components/home/CharactersSection";
import { WhyChooseSection } from "./components/home/WhyChooseSection";
import { JoinYouTubeSection } from "./components/home/JoinYouTubeSection";
import { TestimonialsSection } from "./components/home/TestimonialsSection";
import { NewsletterSection } from "./components/home/NewsletterSection";
import { Footer } from "./components/Footer";

import { AboutPage } from "./pages/AboutPage";
import { CharactersPage } from "./pages/CharactersPage";
import { WatchPage } from "./pages/WatchPage";
import { ParentsPage } from "./pages/ParentsPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { BlogPage } from "./pages/BlogPage";
import { DonatePage } from "./pages/DonatePage";
import { ContactPage } from "./pages/ContactPage";

export default function App() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };

  // Listen for navigation events to trigger transition overlay
  useEffect(() => {
    const handleNav = () => {
      setIsTransitioning(true);
      // We keep it true long enough for the scroll to happen behind it
      setTimeout(() => setIsTransitioning(false), 1200);
    };

    window.addEventListener('hashchange', handleNav);
    window.addEventListener('nav-transition', handleNav);
    return () => {
      window.removeEventListener('hashchange', handleNav);
      window.removeEventListener('nav-transition', handleNav);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden selection:bg-selah-orange selection:text-white bg-selah-bg">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-selah-bg flex flex-col items-center justify-center gap-12"
          >
            <div className="flex items-end justify-center gap-4 md:gap-8 h-40">
              {CHARACTERS.map((char, index) => (
                <motion.div
                  key={char.name}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ 
                    y: [50, -20, 0, -10, 0], 
                    opacity: 1 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    delay: index * 0.2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                  className="relative w-24 h-24 md:w-32 md:h-32"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${char.color} rounded-full blur-xl opacity-50`} />
                  <img 
                    src={char.img} 
                    alt={char.name} 
                    className="relative w-full h-full object-contain "
                  />
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <motion.img 
                src="/SK_Logo_FN.jpg" 
                alt="Selah Kids" 
                className="h-12 md:h-16 object-contain"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <BouncingDots />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Transition Overlay - Staggered Strips */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="transition-overlay"
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[9999] pointer-events-none flex"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                variants={{
                  initial: { scaleY: 0 },
                  animate: { scaleY: 1 },
                  exit: { scaleY: 0 }
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: i * 0.08, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className={`flex-1 origin-top ${i % 2 === 0 ? 'bg-selah-orange' : 'bg-selah-dark'}`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Wrapper with Transition Effects */}
      <motion.div
        animate={{ 
          scale: isTransitioning ? 0.95 : 1,
          filter: isTransitioning ? "blur(10px)" : "blur(0px)",
          opacity: isTransitioning ? 0.5 : 1
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Scroll Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1.5 bg-selah-orange z-[100] origin-left"
          style={{ scaleX }}
        />

        <Navbar />

        <Routes>
          <Route path="/" element={
            <>
              <HeroSection scrollYProgress={scrollYProgress} handleMouseMove={handleMouseMove} />
              <LatestVideosSection />
              <AboutSection />
              <CharactersSection />
              <WhyChooseSection />
              <JoinYouTubeSection />
              <TestimonialsSection />
              <NewsletterSection />
            </>
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="/parents" element={<ParentsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>

        <div className="h-px w-full bg-selah-dark/5" />

        <Footer />
      </motion.div>
    </div>
  );
}
