'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import NextImage from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Facebook,
  Instagram,
  Youtube,
  Music,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { fromLanguageKey, localeHref, getLocaleFromPathname, DEFAULT_LOCALE } from "../lib/i18n";
import type { FooterLink, SocialLink, FooterSettings } from "../data/chrome-footer";
import { INITIAL_FOOTER_SOCIAL } from "../data/chrome-footer";

// Social-platform brand-icon map. Admins pick a platform name; we render
// the matching Lucide mark so the footer stays visually consistent.
// Unknown platforms fall back to the emoji the admin saved in the `icon`
// field.
const SOCIAL_ICON: Record<string, LucideIcon> = {
  Instagram,
  YouTube: Youtube,
  Facebook,
  Music,
};

const SOCIAL_HOVER: Record<string, { color: string; shadow: string }> = {
  Instagram: { color: 'hover:bg-[#E4405F]', shadow: 'hover:shadow-[0_10px_20px_-10px_rgba(228,64,95,0.6)]' },
  YouTube:   { color: 'hover:bg-[#FF0000]', shadow: 'hover:shadow-[0_10px_20px_-10px_rgba(255,0,0,0.6)]' },
  Facebook:  { color: 'hover:bg-[#1877F2]', shadow: 'hover:shadow-[0_10px_20px_-10px_rgba(24,119,242,0.6)]' },
  Music:     { color: 'hover:bg-[#1DB954]', shadow: 'hover:shadow-[0_10px_20px_-10px_rgba(29,185,84,0.6)]' },
};

/**
 * Admin content is authored free-form. `javascript:` / `data:` URLs rendered
 * into an `href` would execute on click, so we validate before rendering any
 * admin-supplied external URL. Internal paths (leading `/`) are allowed
 * through because they route via Next.js Link.
 */
function sanitizeUrl(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback;
  if (raw.startsWith('/')) return raw;
  try {
    const parsed = new URL(raw);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? raw : fallback;
  } catch {
    return fallback;
  }
}

interface FooterProps {
  footerLinks: FooterLink[];
  footerSocial: SocialLink[];
  footerSettings: FooterSettings;
}

export function Footer({ footerLinks, footerSocial, footerSettings }: FooterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLanguage();
  const locale = getLocaleFromPathname(pathname) ?? fromLanguageKey(language) ?? DEFAULT_LOCALE;
  const lh = (path: string) => localeHref(path, locale);
  const labelLang: 'en' | 'es' = locale;
  // Locale-authoritative inline translator — mirrors CMS field selection so
  // every string on the page comes from the same source of truth.
  const ll = (en: string, es: string) => (labelLang === 'en' ? en : es);

  const tagline = labelLang === 'en' ? footerSettings.taglineEn : footerSettings.taglineEs;
  const copyright = labelLang === 'en' ? footerSettings.copyrightEn : footerSettings.copyrightEs;
  const newsletterTitle = labelLang === 'en' ? footerSettings.newsletterTitleEn : footerSettings.newsletterTitleEs;
  const newsletterBlurb = labelLang === 'en' ? footerSettings.newsletterPlaceholderEn : footerSettings.newsletterPlaceholderEs;
  const newsletterBtn = labelLang === 'en' ? footerSettings.newsletterBtnEn : footerSettings.newsletterBtnEs;

  // YouTube subscribe CTA: prefer the CMS YouTube row for the active locale,
  // fall back to INITIAL_FOOTER_SOCIAL (per-locale), then discard anything
  // that isn't a valid http(s) URL before appending ?sub_confirmation=1.
  const youtubeSocial = footerSocial.find((s) => s.platform === 'YouTube');
  const seedYoutube = INITIAL_FOOTER_SOCIAL.find((s) => s.platform === 'YouTube');
  const rawYoutube =
    (labelLang === 'es' ? youtubeSocial?.urlEs : youtubeSocial?.urlEn) ??
    (labelLang === 'es' ? seedYoutube?.urlEs : seedYoutube?.urlEn) ??
    'https://www.youtube.com/@selahkidsworship';
  let youtubeSubscribeHref = 'https://www.youtube.com/@selahkidsworship?sub_confirmation=1';
  try {
    const parsed = new URL(rawYoutube);
    const isHttp = parsed.protocol === 'http:' || parsed.protocol === 'https:';
    const isYoutube = /(^|\.)youtube\.com$/i.test(parsed.hostname);
    if (isHttp && isYoutube) {
      parsed.searchParams.set('sub_confirmation', '1');
      youtubeSubscribeHref = parsed.toString();
    }
  } catch {
    /* use default */
  }

  const creditLink = sanitizeUrl(footerSettings.creditLink, 'https://www.engazedigital.com/');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-20 pb-12 overflow-hidden">
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-selah-orange/5 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-selah-yellow/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Brand card */}
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
            <p className="body-text max-w-md mb-10">{tagline}</p>
            <div className="flex gap-4">
              {footerSocial.map((s) => {
                const Icon = SOCIAL_ICON[s.platform];
                const hover = SOCIAL_HOVER[s.platform] ?? { color: 'hover:bg-selah-orange', shadow: '' };
                const rawHref = labelLang === 'es' ? s.urlEs : s.urlEn;
                const isInternal = rawHref.startsWith('/');
                const href = isInternal ? lh(rawHref) : sanitizeUrl(rawHref, '#');
                const common = {
                  'aria-label': s.platform,
                  className: `w-14 h-14 rounded-2xl bg-selah-bg border border-selah-border/50 flex items-center justify-center transition-all duration-500 group/icon ${hover.color} ${hover.shadow} hover:text-white hover:border-transparent`,
                  children: Icon ? (
                    <Icon size={24} className="text-selah-muted group-hover/icon:text-white transition-colors duration-300" />
                  ) : (
                    <span className="text-xl">{s.icon}</span>
                  ),
                };
                // Internal links route through Next.js — keep the real href
                // on the anchor so middle-click, keyboard nav, and SEO crawl
                // still work, and prevent the default to hand off to router.
                if (isInternal) {
                  return (
                    <motion.a
                      key={s.id}
                      href={href}
                      onClick={(e) => { e.preventDefault(); router.push(href); }}
                      whileHover={{ y: -8, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      {...common}
                    />
                  );
                }
                return (
                  <motion.a
                    key={s.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -8, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    {...common}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Quick links card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 bg-[var(--paper-cream)] border border-selah-orange/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 hover:border-selah-orange/20 transition-all duration-500 shadow-[0_8px_32px_rgba(255,92,0,0.06)]"
          >
            <h4 className="text-selah-dark content-h3 mb-8 tracking-tight">{ll("Pages", "Páginas")}</h4>
            <ul className="space-y-5">
              {footerLinks.map((link) => {
                const label = labelLang === 'en' ? link.labelEn : link.labelEs;
                return (
                  <li key={link.id}>
                    <Link
                      href={lh(link.href)}
                      className="text-selah-muted ui-button hover:text-selah-orange transition-all duration-300 flex items-center gap-3 group cursor-pointer"
                    >
                      <span className="w-8 h-8 rounded-xl bg-selah-bg flex items-center justify-center group-hover:bg-selah-orange/20 group-hover:text-selah-orange transition-colors shadow-sm text-[14px]">
                        {link.icon}
                      </span>
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Contact & newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            <div className="bg-[var(--paper-cream)] border border-selah-orange/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 hover:border-selah-orange/20 transition-all duration-500 flex-1 shadow-[0_8px_32px_rgba(255,92,0,0.06)]">
              <h4 className="text-selah-dark content-h3 mb-6 tracking-tight">{ll("Get in Touch", "Contáctanos")}</h4>
              <div className="space-y-4 mb-8">
                <a
                  href={`mailto:${footerSettings.contactEmail}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-selah-bg border border-selah-border/30 hover:bg-selah-orange/10 hover:border-selah-orange/20 transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-selah-orange/20 flex items-center justify-center text-selah-orange group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-selah-muted/60 ui-label mb-0.5">{ll("Email Us", "Escríbenos")}</p>
                    <span className="text-selah-dark ui-button">{footerSettings.contactEmail}</span>
                  </div>
                </a>
              </div>

              <div className="pt-6 border-t border-selah-border/30">
                <h5 className="text-selah-dark content-h3 mb-3 tracking-tight">{newsletterTitle}</h5>
                <p className="text-selah-muted ui-button mb-4">{newsletterBlurb}</p>
                <a
                  href={youtubeSubscribeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF0000] text-white ui-button shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <Youtube size={18} />
                  {newsletterBtn}
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-selah-muted/50 ui-caption" suppressHydrationWarning>
              © {currentYear} Selah Kids. {copyright}
            </p>
            <div className="flex items-center gap-6">
              <Link href={lh("/privacy")} className="text-selah-muted/50 hover:text-selah-orange ui-button transition-colors relative group">
                {ll("Privacy Policy", "Política de Privacidad")}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-selah-orange transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href={lh("/terms")} className="text-selah-muted/50 hover:text-selah-orange ui-button transition-colors relative group">
                {ll("Terms of Service", "Términos de Servicio")}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-selah-orange transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </div>

          <motion.a
            href={creditLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-selah-bg border border-selah-border/30 text-selah-muted/60 ui-button shadow-sm hover:border-selah-orange/30 hover:text-selah-dark transition-colors duration-300 cursor-pointer"
          >
            <span>{ll("Designed by", "Diseñado por")}</span>
            <span className="font-semibold text-selah-dark">{` ${footerSettings.creditText}`}</span>
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
