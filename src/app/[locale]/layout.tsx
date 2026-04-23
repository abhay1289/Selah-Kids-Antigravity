import { notFound } from 'next/navigation';
import { isLocale, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n';

/**
 * Dynamic segment layout for /[locale]/.
 *
 * Responsibilities:
 *   1. Validate the locale param (404 for unknown locales — prevents arbitrary
 *      strings like /foo/about from resolving to a page).
 *   2. Pre-generate static params for each supported locale so SSG covers
 *      /en/... and /es/... without per-request rendering.
 *   3. Provide the resolved Locale to the subtree (future: wire into a
 *      Locale context / LanguageProvider so client components read from URL
 *      instead of localStorage).
 *
 * This is intentionally a pass-through render — the root layout in
 * src/app/layout.tsx still owns <html>, <head>, fonts, and LanguageProvider.
 * Nesting providers here would break hydration.
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
  return children;
}
