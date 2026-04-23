import { notFound } from 'next/navigation';
import { isLocale, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n';
import { getCollection } from '@/lib/cms-server';
import { LayoutShell } from '../../components/LayoutShell';
import {
  INITIAL_NAV_LINKS,
  INITIAL_NAV_SETTINGS,
  type NavLink,
  type NavSettings,
} from '../../data/chrome-navbar';
import {
  INITIAL_FOOTER_LINKS,
  INITIAL_FOOTER_SOCIAL,
  INITIAL_FOOTER_SETTINGS,
  type FooterLink,
  type SocialLink,
  type FooterSettings,
} from '../../data/chrome-footer';
import {
  INITIAL_ANNOUNCEMENT_BANNERS,
  type Banner,
} from '../../data/chrome-announcements';
import { INITIAL_THEME_COLORS, type ColorToken } from '../../data/chrome-theme';
import { ThemeVars } from '../../components/ThemeVars';

/**
 * Dynamic segment layout for /[locale]/.
 *
 * Responsibilities:
 *   1. Validate the locale param (404 for unknown locales).
 *   2. Pre-generate static params for each supported locale so SSG covers
 *      /en/... and /es/... without per-request rendering.
 *   3. Fetch chrome data (nav + footer) once per request and pass to the
 *      public LayoutShell. Fetching here — not the root layout — keeps
 *      /admin/* pages from paying for chrome reads they never render.
 *
 * Root layout (src/app/layout.tsx) still owns <html>, <head>, fonts, and
 * LanguageProvider so those survive locale navigations.
 */

export async function generateStaticParams(): Promise<Array<{ locale: Locale }>> {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Parallel reads — all tagged and cached, so Next can share the fetch
  // across every page under /[locale]/* until a revalidateTag fires.
  const [
    navLinksDb,
    navSettingsDb,
    footerLinksDb,
    footerSocialDb,
    footerSettingsDb,
    bannersDb,
    themeColorsDb,
  ] = await Promise.all([
    getCollection<NavLink>('nav_links', INITIAL_NAV_LINKS),
    getCollection<NavSettings>('nav_settings', INITIAL_NAV_SETTINGS),
    getCollection<FooterLink>('footer_links', INITIAL_FOOTER_LINKS),
    getCollection<SocialLink>('footer_social', INITIAL_FOOTER_SOCIAL),
    getCollection<FooterSettings>('footer_settings', INITIAL_FOOTER_SETTINGS),
    getCollection<Banner>('announcement_banners', INITIAL_ANNOUNCEMENT_BANNERS),
    getCollection<ColorToken>('theme_colors', INITIAL_THEME_COLORS),
  ]);

  // Chrome fallback: getCollection returns [] (not fallback) in public mode
  // with zero published rows. Chrome is required to navigate the site —
  // fall back to INITIAL_* whenever a DB answer is empty. Announcements
  // can legitimately be empty (no active promo) — no fallback there.
  const navLinks = navLinksDb.length > 0 ? navLinksDb : INITIAL_NAV_LINKS;
  const navSettings = navSettingsDb[0] ?? INITIAL_NAV_SETTINGS[0]!;
  const footerLinks = footerLinksDb.length > 0 ? footerLinksDb : INITIAL_FOOTER_LINKS;
  const footerSocial = footerSocialDb.length > 0 ? footerSocialDb : INITIAL_FOOTER_SOCIAL;
  const footerSettings = footerSettingsDb[0] ?? INITIAL_FOOTER_SETTINGS[0]!;
  // Theme palette: only partial overrides are valid (a single dropped row
  // shouldn't erase the rest), so we merge DB values onto the seed so
  // missing ids keep their baked-in defaults. Merge only the `value`
  // field — `cssVar` must stay locked to the seed so an accidental
  // admin edit of the variable name can't knock out the whole theme
  // override (Tailwind's @theme keys are load-bearing).
  const themeById = new Map(themeColorsDb.map((c) => [c.id, c]));
  const themeColors = INITIAL_THEME_COLORS.map((seed) => {
    const row = themeById.get(seed.id);
    return row ? { ...seed, value: row.value } : seed;
  });

  return (
    <>
      <ThemeVars colors={themeColors} />
      <LayoutShell
        navLinks={navLinks}
        navSettings={navSettings}
        footerLinks={footerLinks}
        footerSocial={footerSocial}
        footerSettings={footerSettings}
        banners={bannersDb}
      >
        {children}
      </LayoutShell>
    </>
  );
}
