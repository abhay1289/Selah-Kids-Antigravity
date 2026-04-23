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

/**
 * Dynamic segment layout for /[locale]/.
 *
 * Responsibilities:
 *   1. Validate the locale param (404 for unknown locales — prevents arbitrary
 *      strings like /foo/about from resolving to a page).
 *   2. Pre-generate static params for each supported locale so SSG covers
 *      /en/... and /es/... without per-request rendering.
 *   3. Fetch chrome data (nav_links, nav_settings) once per request and pass
 *      to LayoutShell as props. Fetching here instead of the root layout
 *      keeps /admin/* pages from paying for chrome reads they never render.
 *
 * Root layout (src/app/layout.tsx) still owns <html>, <head>, fonts, and
 * LanguageProvider — moving those here would reset them on every locale
 * navigation and break hydration.
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

  // Parallel reads — both tagged and cached, so Next.js can share the fetch
  // across all pages under /[locale]/* until a revalidateTag fires.
  const [navLinks, navSettings] = await Promise.all([
    getCollection<NavLink>('nav_links', INITIAL_NAV_LINKS),
    getCollection<NavSettings>('nav_settings', INITIAL_NAV_SETTINGS),
  ]);

  return (
    <LayoutShell navLinks={navLinks} navSettings={navSettings[0] ?? INITIAL_NAV_SETTINGS[0]}>
      {children}
    </LayoutShell>
  );
}
