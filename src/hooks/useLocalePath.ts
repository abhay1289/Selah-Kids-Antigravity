'use client';

/**
 * Client hook: returns the resolved Locale + a bound localeHref helper.
 *
 * Reads the locale from usePathname() first (source of truth once the URL
 * contains /en or /es), falls back to LanguageContext (covers transitional
 * states and any page the middleware hasn't redirected yet), and finally
 * to DEFAULT_LOCALE.
 *
 * Usage:
 *   const { lh } = useLocalePath();
 *   router.push(lh('/watch'));
 *   <Link href={lh('/about')}>...
 */

import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import {
  DEFAULT_LOCALE,
  fromLanguageKey,
  getLocaleFromPathname,
  localeHref,
  type Locale,
} from '../lib/i18n';

export function useLocalePath(): { locale: Locale; lh: (path: string) => string } {
  const pathname = usePathname();
  const { language } = useLanguage();
  const locale =
    getLocaleFromPathname(pathname ?? '/') ?? fromLanguageKey(language) ?? DEFAULT_LOCALE;
  return {
    locale,
    lh: (path: string) => localeHref(path, locale),
  };
}
