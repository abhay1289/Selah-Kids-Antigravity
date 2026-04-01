"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useLanguage } from "../../contexts/LanguageContext";

// Replace this with the exact number of frames you have in public/assets/frames/
const FRAME_COUNT = 148; 

// Declare global types
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    Lenis: any;
  }
}


export function ScrollHeroSection() {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [scriptsLoaded, setScriptsLoaded] = useState({ gsap: false, scrollTrigger: false, lenis: false });

  // 1. Initialize Lenis for Smooth Scrolling once scripts are loaded
  useEffect(() => {
    if (!scriptsLoaded.gsap || !scriptsLoaded.scrollTrigger || !scriptsLoaded.lenis || typeof window === 'undefined') return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    const lenis = new window.Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on("scroll", window.ScrollTrigger.update);

    window.gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000);
    });

    window.gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      window.gsap.ticker.remove((time: number) => lenis.raf(time * 1000));
    };
  }, [scriptsLoaded]);

  // 2. Preload frames
  useEffect(() => {
    let imagesLoaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        // Pads 1 to "001" to match ezgif-frame-001.jpg format
        const paddedIndex = i.toString().padStart(3, "0");
        
        // Assuming images are stored in public/assets/frames/
        img.src = `/assets/frames/ezgif-frame-${paddedIndex}.jpg`;
        
        img.onload = () => {
            imagesLoaded++;
            setProgress(Math.round((imagesLoaded / FRAME_COUNT) * 100));
            
            // Wait for all to load
            if (imagesLoaded === FRAME_COUNT) {
                setLoaded(true);
                imagesRef.current = images;
                drawFrame(0);
            }
        };

        // Fallback so it doesn't get stuck if frames are missing 404
        img.onerror = () => {
            imagesLoaded++;
            setProgress(Math.round((imagesLoaded / FRAME_COUNT) * 100));
            
            if (imagesLoaded === FRAME_COUNT) {
                setLoaded(true);
                imagesRef.current = images;
                drawFrame(0);
            }
        };
        images.push(img);
    }
  }, []);

  // 3. Draw image covering the full screen bounds
  const drawFrame = (index: number) => {
    if (!canvasRef.current || !imagesRef.current[index]) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const img = imagesRef.current[index];
    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    // Cover logic
    if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
    } else {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // 4. Connect canvas to GSAP ScrollTrigger
  useEffect(() => {
    if (!loaded || !containerRef.current || !scriptsLoaded.gsap || !scriptsLoaded.scrollTrigger) return;

    const frameObj = { frame: 0 };
    
    // Draw initial frame if window is resized
    const handleResize = () => drawFrame(Math.round(frameObj.frame));
    window.addEventListener('resize', handleResize);

    // Frame sequence animation timeline
    const tl = window.gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${FRAME_COUNT * 25}`, // Dictates scroll length vs speed
        scrub: 0.5, // slightly smooth the scrubbing
        pin: true,  // Pin the canvas in place until animation is done
      }
    });

    tl.to(frameObj, {
      frame: FRAME_COUNT - 1,
      snap: "frame",
      ease: "none",
      onUpdate: () => drawFrame(Math.round(frameObj.frame)),
    });

    // 5. Text fade-in partway through the sequence
    if (textRef.current) {
      window.gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: `top+=${(FRAME_COUNT * 25) * 0.4} top`, 
            end: `+=${(FRAME_COUNT * 25) * 0.2}`,
            scrub: true,
          }
        }
      );
    }

    return () => {
        window.removeEventListener('resize', handleResize);
        window.ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  }, [loaded, scriptsLoaded]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Dynamic CDN Scripts since NPM is failing */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" strategy="afterInteractive" onLoad={() => setScriptsLoaded(s => ({ ...s, gsap: true }))} />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" strategy="afterInteractive" onLoad={() => setScriptsLoaded(s => ({ ...s, scrollTrigger: true }))} />
      <Script src="https://unpkg.com/lenis@1.1.9/dist/lenis.min.js" strategy="afterInteractive" onLoad={() => setScriptsLoaded(s => ({ ...s, lenis: true }))} />

      {/* Smooth Loading Screen */}
      {!loaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-selah-dark text-white">
            <h2 className="text-2xl md:text-3xl font-black mb-4 font-display text-selah-orange tracking-widest uppercase">
                {t("Loading Experience", "Cargando Experiencia")}
            </h2>
            <div className="text-3xl md:text-5xl font-light mb-8">{progress}%</div>
            <div className="w-64 md:w-96 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-selah-orange transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
      )}

      {/* Hero Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full object-cover z-0" 
      />

      {/* Decorative Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />

      {/* Dynamic Text Mid-way - Nike Premium Style */}
      <div 
        ref={textRef} 
        className="absolute bottom-20 md:bottom-32 z-20 flex flex-col items-center justify-end text-center pointer-events-none px-6 w-full"
      >
        <h1 className="text-4xl md:text-6xl lg:text-[80px] font-black text-white uppercase tracking-tighter drop-shadow-2xl leading-none italic opacity-90">
          {t("Faith In Motion.", "Fe En Movimiento.")}
        </h1>
        <p className="mt-4 text-base md:text-xl text-white/90 font-light max-w-4xl drop-shadow-md">
          {t(
            "Catchy Sunday school songs bringing Bible stories to life.", 
            "Pegadizas canciones de la escuela dominical que dan vida a las historias bíblicas."
          )}
        </p>
      </div>
    </section>
  );
}
