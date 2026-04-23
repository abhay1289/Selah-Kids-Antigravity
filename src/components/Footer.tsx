'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import NextImage from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Facebook, Instagram, Youtube, Music, Star, Heart, Play, Users, Shield, BookOpen, Book, Mail } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { fromLanguageKey, localeHref, getLocaleFromPathname, DEFAULT_LOCALE } from "../lib/i18n";

export function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const locale = getLocaleFromPathname(pathname) ?? fromLanguageKey(language) ?? DEFAULT_LOCALE;
  const lh = (path: string) => localeHref(path, locale);

  return (
    <footer className="relative pt-20 pb-12 overflow-hidden">
      {/* Artistic Background Elements — top separator removed; footer now
          settles into atmos-spine via its inner blur glows only. */}
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-selah-orange/5 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-selah-yellow/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Brand Card - Bento Style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-[var(--paper-cream)] border border-selah-orange/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 group hover:border-selah-orange/20 transition-all duration-500 shadow-[0_8px_32px_rgba(255,92,0,0.06)]"
          >
            <Link href={lh("/")} className="flex items-center gap-4 mb-8 group/logo">
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
                "We’re on a mission to fill every home with faith-filled melodies and stories that spark wonder in the hearts of children.",
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
                  onClick={href === '/music' ? () => router.push(lh('/music')) : undefined}
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
            className="lg:col-span-3 bg-[var(--paper-cream)] border border-selah-orange/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 hover:border-selah-orange/20 transition-all duration-500 shadow-[0_8px_32px_rgba(255,92,0,0.06)]"
          >
            <h4 className="text-selah-dark content-h3 mb-8 tracking-tight">{t("Pages", "Páginas")}</h4>
            <ul className="space-y-5">
              {[
                { label: t("Home", "Inicio"), icon: Star, href: lh("/") },
                { label: t("About Us", "Sobre Nosotros"), icon: Heart, href: lh("/about") },
                { label: t("Watch", "Ver"), icon: Play, href: lh("/watch") },
                { label: t("Resources", "Recursos"), icon: BookOpen, href: lh("/resources") },
                { label: t("Contact Us", "Contáctanos"), icon: Mail, href: lh("/contact") }
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
            <div className="bg-[var(--paper-cream)] border border-selah-orange/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 hover:border-selah-orange/20 transition-all duration-500 flex-1 shadow-[0_8px_32px_rgba(255,92,0,0.06)]">
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

              {/* Follow for updates — honest CTA until we ship a real newsletter */}
              <div className="pt-6 border-t border-selah-border/30">
                <h5 className="text-selah-dark content-h3 mb-3 tracking-tight">{t("Follow for new releases", "Síguenos para nuevos lanzamientos")}</h5>
                <p className="text-selah-muted ui-button mb-4">
                  {t("We post every new song on YouTube, Spotify, and Apple Music.", "Publicamos cada nueva canción en YouTube, Spotify y Apple Music.")}
                </p>
                <a
                  href={language === 'ES' ? "https://www.youtube.com/@SelahKidsEspanol?sub_confirmation=1" : "https://www.youtube.com/@selahkidsworship?sub_confirmation=1"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF0000] text-white ui-button shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <Youtube size={18} />
                  {t("Subscribe on YouTube", "Suscríbete en YouTube")}
                </a>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-selah-muted/50 ui-caption">
              © {new Date().getFullYear()} Selah Kids. {t("All rights reserved.", "Todos los derechos reservados.")}
            </p>
            <div className="flex items-center gap-6">
              <Link href={lh("/privacy")} className="text-selah-muted/50 hover:text-selah-orange ui-button transition-colors relative group">
                {t("Privacy Policy", "Política de Privacidad")}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-selah-orange transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href={lh("/terms")} className="text-selah-muted/50 hover:text-selah-orange ui-button transition-colors relative group">
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
