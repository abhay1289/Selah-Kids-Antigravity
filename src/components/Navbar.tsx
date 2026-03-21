'use client';

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "./UI";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("Home", "Inicio"), href: "/" },
    { name: t("About", "Acerca de"), href: "/about" },
    { name: t("Watch", "Ver"), href: "/watch" },
    { name: t("Characters", "Personajes"), href: "/characters" },
    { name: t("For Parents", "Para Padres"), href: "/parents" },
    { name: t("Resources", "Recursos"), href: "/resources" },
    { name: t("Blog", "Blog"), href: "/blog" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, external?: boolean) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (external) {
      window.open(href, "_blank");
      return;
    }
    
    window.dispatchEvent(new CustomEvent('nav-transition', { detail: { href } }));

    if (href.startsWith("#")) {
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 600);
        return;
      }
    }

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.push(href);
    }, 600);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6 pointer-events-none">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          pointer-events-auto
          flex items-center justify-between w-full max-w-7xl px-6 py-2
          rounded-[2rem] transition-all duration-700
          ${isScrolled || pathname !== '/'
            ? "bg-white/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/40" 
            : "bg-white/10 backdrop-blur-md border border-white/10"
          }
        `}
      >
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <motion.img 
            src="/SK_Logo_FN.jpg" 
            alt="Selah Kids" 
            className="h-10 md:h-12 cursor-pointer rounded-xl shadow-sm"
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ rotate: 0, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => handleNavClick(e as any, "/")}
          />
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.href)}
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`
                  group relative px-3 xl:px-4 py-2 font-accent font-bold uppercase tracking-wider transition-all duration-500 rounded-xl
                  ${isActive 
                    ? "text-selah-orange bg-selah-orange/5" 
                    : isScrolled || location.pathname !== '/' ? "text-selah-dark hover:text-selah-orange" : "text-selah-dark hover:text-selah-orange"
                  }
                `}
              >
                <span className="relative z-10 text-sm xl:text-base">{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 bg-selah-orange/10 rounded-xl -z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.div 
                  className="absolute bottom-1 left-4 right-4 h-0.5 bg-selah-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  animate={{ scaleX: hoveredLink === link.name ? 1 : 0 }}
                />
              </a>
            );
          })}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Toggle */}
            <div 
              className={`flex items-center p-1 rounded-full cursor-pointer transition-colors duration-300 ${isScrolled || pathname !== '/' ? 'bg-black/5 hover:bg-black/10' : 'bg-selah-dark/5 hover:bg-selah-dark/10 backdrop-blur-md'}`}
              onClick={() => setLanguage(l => l === 'EN' ? 'ES' : 'EN')}
            >
              <div className={`relative px-4 py-2 rounded-full text-sm font-accent font-bold uppercase tracking-wider transition-all duration-300 z-10 ${language === 'EN' ? 'text-selah-dark' : 'text-selah-dark/60 hover:text-selah-dark/80'}`}>
                EN
                {language === 'EN' && (
                  <motion.div layoutId="lang-pill" className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
              </div>
              <div className={`relative px-4 py-2 rounded-full text-sm font-accent font-bold uppercase tracking-wider transition-all duration-300 z-10 ${language === 'ES' ? 'text-selah-dark' : 'text-selah-dark/60 hover:text-selah-dark/80'}`}>
                ES
                {language === 'ES' && (
                  <motion.div layoutId="lang-pill" className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
              </div>
            </div>

            <Button 
              variant="primary" 
              className="!py-3 !px-8 !text-base !rounded-2xl font-accent font-bold uppercase tracking-wider shadow-lg shadow-selah-orange/20 hover:shadow-xl hover:shadow-selah-orange/30 hover:-translate-y-0.5 transition-all whitespace-nowrap"
              icon={ArrowRight}
              onClick={() => router.push("/donate")}
            >
              Donate
            </Button>
          </div>

          {/* Mobile Toggle */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className={`lg:hidden p-3 rounded-2xl transition-all duration-300 ${isScrolled || pathname !== '/' ? "bg-selah-dark/5 text-selah-dark" : "bg-selah-dark/5 text-selah-dark backdrop-blur-md"}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed inset-x-4 top-24 z-40 lg:hidden bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-white/20 pointer-events-auto"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              {navLinks.map((link, i) => (
                <motion.a 
                  key={link.name} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={link.href} 
                  onClick={(e) => handleNavClick(e as any, link.href)}
                  className={`text-selah-dark font-display text-2xl sm:text-3xl tracking-tight hover:text-selah-orange transition-colors ${pathname === link.href ? 'text-selah-orange' : ''}`} 
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="flex flex-col gap-4 pt-6 mt-2 border-t border-black/5">
                <div className="flex items-center justify-between px-2">
                  <span className="text-selah-dark font-accent font-bold uppercase tracking-widest text-sm">Language</span>
                  <div 
                    className="flex items-center p-1 rounded-full cursor-pointer bg-black/5"
                    onClick={() => setLanguage(l => l === 'EN' ? 'ES' : 'EN')}
                  >
                    <div className={`px-4 py-2 rounded-full text-xs font-accent font-bold uppercase tracking-widest transition-all duration-300 ${language === 'EN' ? 'bg-white text-selah-dark shadow-sm' : 'text-selah-dark/60'}`}>
                      EN
                    </div>
                    <div className={`px-4 py-2 rounded-full text-xs font-accent font-bold uppercase tracking-widest transition-all duration-300 ${language === 'ES' ? 'bg-white text-selah-dark shadow-sm' : 'text-selah-dark/60'}`}>
                      ES
                    </div>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full font-accent font-bold uppercase tracking-wider whitespace-nowrap" 
                  icon={ArrowRight}
                  onClick={() => { setIsMenuOpen(false); router.push("/donate"); }}
                >
                  Donate Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
