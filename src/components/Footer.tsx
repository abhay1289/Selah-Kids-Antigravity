'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { Facebook, Instagram, Youtube, Music, Star, Heart, Play, Users, Shield, BookOpen, Book, Mail } from "lucide-react";
import { Button } from "./UI";
import { useLanguage } from "../contexts/LanguageContext";

export function Footer() {
  const router = useRouter();
  const { t, language } = useLanguage();

  return (
    <footer className="relative bg-gradient-to-b from-selah-light/20 via-selah-bg to-white pt-20 pb-12 overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-selah-orange/30 to-transparent" />
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-selah-orange/5 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-selah-yellow/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Brand Card - Bento Style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-white/60 border border-selah-orange/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 backdrop-blur-xl group hover:border-selah-orange/20 transition-all duration-500 shadow-[0_8px_32px_rgba(255,92,0,0.06)]"
          >
            <Link href="/" className="flex items-center gap-4 mb-8 group/logo">
              <motion.div
                whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
                className="relative w-32 h-16 shrink-0"
              >
                <NextImage
                  src="/SK_Logo_FN.png"
                  alt="Selah Kids"
                  fill
                  className="object-contain rounded-xl"
                  sizes="128px"
                  priority={false}
                />
              </motion.div>
            </Link>
            <p className="body-text max-w-md mb-10">
              {t(
                "We're on a mission to fill every home with faith-filled melodies and stories that spark wonder in the hearts of children.",
                "Nuestra misión es llenar cada hogar con melodías llenas de fe e historias que despierten asombro en los corazones de los niños."
              )}
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, href: language === 'ES' ? "https://www.instagram.com/selahkids_spn/" : "https://www.instagram.com/selah.kids", color: "hover:bg-[#E4405F]", shadow: "hover:shadow-[0_10px_20px_-10px_rgba(228,64,95,0.6)]" },
                { Icon: Youtube, href: language === 'ES' ? "https://www.youtube.com/@SelahKidsEspanol" : "https://www.youtube.com/@selahkidsworship", color: "hover:bg-[#FF0000]", shadow: "hover:shadow-[0_10px_20px_-10px_rgba(255,0,0,0.6)]" },
                { Icon: Music, href: "/music", color: "hover:bg-[#1DB954]", shadow: "hover:shadow-[0_10px_20px_-10px_rgba(29,185,84,0.6)]" }
              ].map(({ Icon, color, href, shadow }, i) => (
                <motion.a 
                  key={i} 
                  href={href === '/music' ? undefined : href}
                  onClick={href === '/music' ? () => router.push('/music') : undefined}
                  target={href !== "#" && href !== '/music' ? "_blank" : undefined}
                  rel={href !== "#" && href !== '/music' ? "noopener noreferrer" : undefined}
                  whileHover={{ y: -8, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-14 h-14 rounded-2xl bg-selah-bg border border-selah-border/50 flex items-center justify-center transition-all duration-500 group/icon ${color} ${shadow} hover:text-white hover:border-transparent`}
                >
                  <Icon size={24} className="text-selah-muted group-hover/icon:text-white transition-colors duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 bg-white/60 border border-selah-orange/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 backdrop-blur-xl hover:border-selah-orange/20 transition-all duration-500 shadow-[0_8px_32px_rgba(255,92,0,0.06)]"
          >
            <h4 className="text-selah-dark content-h3 mb-8 tracking-tight">{t("Pages", "Páginas")}</h4>
            <ul className="space-y-5">
              {[
                { label: t("Home", "Inicio"), icon: Star, href: "/" },
                { label: t("About Us", "Sobre Nosotros"), icon: Heart, href: "/about" },
                { label: t("Watch", "Ver"), icon: Play, href: "/watch" },
                { label: t("Resources", "Recursos"), icon: BookOpen, href: "/resources" },
                { label: t("Contact Us", "Contáctanos"), icon: Mail, href: "/contact" }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="text-selah-muted ui-button hover:text-selah-orange transition-all duration-300 flex items-center gap-3 group cursor-pointer"
                  >
                    <span className="w-8 h-8 rounded-xl bg-selah-bg flex items-center justify-center group-hover:bg-selah-orange/20 group-hover:text-selah-orange transition-colors shadow-sm">
                      <link.icon size={14} />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter Card — Combined */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            <div className="bg-white/60 border border-selah-orange/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl hover:border-selah-orange/20 transition-all duration-500 flex-1 shadow-[0_8px_32px_rgba(255,92,0,0.06)]">
              <h4 className="text-selah-dark content-h3 mb-6 tracking-tight">{t("Get in Touch", "Contáctanos")}</h4>
              <div className="space-y-4 mb-8">
                <a href="mailto:info.selahkids@gmail.com" className="flex items-center gap-4 p-4 rounded-2xl bg-selah-bg border border-selah-border/30 hover:bg-selah-orange/10 hover:border-selah-orange/20 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-selah-orange/20 flex items-center justify-center text-selah-orange group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-selah-muted/60 ui-label mb-0.5">{t("Email Us", "Escríbenos")}</p>
                    <span className="text-selah-dark ui-button">info.selahkids@gmail.com</span>
                  </div>
                </a>
              </div>

              {/* Newsletter — now inside Get in Touch */}
              <div className="pt-6 border-t border-selah-border/30">
                <h5 className="text-selah-dark content-h3 mb-3 tracking-tight">{t("Join the Family", "Únete a la Familia")}</h5>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder={t("Your email", "Tu correo")}
                    className="flex-1 bg-selah-bg border border-selah-border/30 rounded-xl px-4 py-3 text-selah-dark placeholder:text-selah-muted/50 focus:outline-none focus:border-selah-orange/40 transition-all duration-300 text-sm shadow-inner"
                  />
                  <Button 
                    className="!px-6 !py-3 !rounded-xl ui-button shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
                  >
                    {t("JOIN", "UNIRSE")}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-selah-border/30 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-selah-muted/50 ui-caption">
              © {new Date().getFullYear()} Selah Kids. {t("All rights reserved.", "Todos los derechos reservados.")}
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-selah-muted/50 hover:text-selah-orange ui-button transition-colors relative group">
                {t("Privacy Policy", "Política de Privacidad")}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-selah-orange transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/terms" className="text-selah-muted/50 hover:text-selah-orange ui-button transition-colors relative group">
                {t("Terms of Service", "Términos de Servicio")}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-selah-orange transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </div>
          
          <motion.a 
            href="https://www.engazedigital.com/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-selah-bg border border-selah-border/30 text-selah-muted/60 ui-button shadow-sm hover:border-selah-orange/30 hover:text-selah-dark transition-colors duration-300 cursor-pointer"
          >
            <span>{t("Designed by", "Diseñado por")}</span>
            <span className="font-semibold text-selah-dark">{" Engaze Digital"}</span>
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
