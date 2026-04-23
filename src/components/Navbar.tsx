'use client';

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "./UI";
import { fromLanguageKey, localeHref, getLocaleFromPathname, DEFAULT_LOCALE } from "../lib/i18n";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 50);
        rafId = 0;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Derive locale from URL first, fall back to the client context's language
  // choice. URL is the source of truth once middleware redirects are wired;
  // the language-context fallback lets the navbar stay correct during
  // client-side language toggles that haven't hit the server yet.
  const locale = getLocaleFromPathname(pathname) ?? fromLanguageKey(language) ?? DEFAULT_LOCALE;
  const lh = (path: string) => localeHref(path, locale);

  const navLinks = [
    { name: t("Home", "Inicio"), href: lh("/") },
    { name: t("About", "Sobre Nosotros"), href: lh("/about") },
    { name: t("Watch", "Ver"), href: lh("/watch") },
    { name: t("Characters", "Personajes"), href: lh("/characters") },
    { name: t("Families", "Familias"), href: lh("/parents") },
    { name: t("Blog", "Blog"), href: lh("/blog") },
    { name: t("Resources", "Recursos"), href: lh("/resources") },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6 pointer-events-none">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto glass-chrome flex items-center justify-between w-full max-w-7xl px-6 py-2 rounded-[2rem] transition-shadow duration-500"
      >
        <div className="flex items-center gap-2">
          <Link href={lh("/")} aria-label="Selah Kids home" onClick={closeMenu}>
            <motion.img
              src="/SK_Logo_FN.png"
              alt="Selah Kids"
              className="h-10 md:h-12 cursor-pointer rounded-xl"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                prefetch
                className={`relative px-4 xl:px-5 py-2.5 ui-nav rounded-xl transition-colors duration-200 ${isActive ? "text-selah-orange" : "text-selah-dark hover:text-selah-orange"}`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 bg-selah-orange/10 rounded-xl z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Toggle — Flags */}
            <div 
              className={`flex items-center p-1 rounded-full cursor-pointer transition-colors duration-300 ${isScrolled || pathname !== '/' ? 'bg-black/5 hover:bg-black/10' : 'bg-selah-dark/5 hover:bg-selah-dark/10 backdrop-blur-md'}`}
              onClick={() => setLanguage(l => l === 'EN' ? 'ES' : 'EN')}
            >
              <div className={`relative px-3 py-2 rounded-full transition-all duration-300 z-10 text-lg leading-none`}>
                🇪🇸
                {language === 'ES' && (
                  <motion.div layoutId="lang-pill" className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
              </div>
              <div className={`relative px-3 py-2 rounded-full transition-all duration-300 z-10 text-lg leading-none`}>
                🇺🇸
                {language === 'EN' && (
                  <motion.div layoutId="lang-pill" className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
              </div>
            </div>

            <Button 
              variant="primary" 
              className="!py-3 !px-8 !rounded-2xl ui-button shadow-lg shadow-selah-orange/20 hover:shadow-xl hover:shadow-selah-orange/30 hover:-translate-y-0.5 transition-all whitespace-nowrap"
              icon={ArrowRight}
              onClick={() => router.push(lh("/donate"))}
            >
              {t("Donate", "Donar")}
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
            style={{ boxShadow: 'var(--paper-shadow-2)' }}
            className="fixed inset-x-4 top-24 z-40 lg:hidden bg-[var(--paper-cream)] rounded-[2.5rem] p-6 sm:p-8 border border-white/20 pointer-events-auto"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={`text-selah-dark content-h3 hover:text-selah-orange transition-colors ${pathname === link.href ? 'text-selah-orange' : ''}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="flex flex-col gap-4 pt-6 mt-2 border-t border-black/5">
                <div className="flex items-center justify-between px-2">
                  <span className="text-selah-dark ui-label">{t("Language", "Idioma")}</span>
                  <div 
                    className="flex items-center p-1 rounded-full cursor-pointer bg-black/5"
                    onClick={() => setLanguage(l => l === 'EN' ? 'ES' : 'EN')}
                  >
                    <div className={`px-3 py-2 rounded-full text-lg leading-none transition-all duration-300 ${language === 'ES' ? 'bg-white shadow-sm' : ''}`}>
                      🇪🇸
                    </div>
                    <div className={`px-3 py-2 rounded-full text-lg leading-none transition-all duration-300 ${language === 'EN' ? 'bg-white shadow-sm' : ''}`}>
                      🇺🇸
                    </div>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full ui-button whitespace-nowrap" 
                  icon={ArrowRight}
                  onClick={() => { setIsMenuOpen(false); router.push(lh("/donate")); }}
                >
                  {t("Donate Now", "Donar Ahora")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
