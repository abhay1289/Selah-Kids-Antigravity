'use client';

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  DEFAULT_LOCALE,
  fromLanguageKey,
  getLocaleFromPathname,
  localeHref,
  stripLocale,
  toLanguageKey,
  type Locale,
} from '../lib/i18n';
import { trackLanguageSwitch } from '../lib/analytics';

/**
 * LanguageContext — Phase 2 URL-driven edition.
 *
 * Prior to Phase 2 this context owned language state via localStorage. Now
 * the URL is the single source of truth: `/en/...` → EN, `/es/...` → ES.
 * The middleware guarantees every rendered public page carries a locale
 * prefix, so `usePathname()` always has one by the time React hydrates.
 *
 * setLanguage(next) now navigates to the same-shape URL under the new
 * locale (e.g. /en/blog/foo → /es/blog/foo). The component tree re-renders
 * with the new pathname, this provider derives the new language, and every
 * `t()` consumer flips automatically — no effect, no ref, no flicker.
 *
 * localStorage is still written on setLanguage as a best-effort hint so a
 * future Phase 5 can read it from a cookie/middleware for first-visit UX,
 * but it is NOT read on render — that would fight the URL.
 */

type Language = 'EN' | 'ES';
const STORAGE_KEY = 'selah-lang';

interface LanguageContextType {
  language: Language;
  setLanguage: (next: Language | ((prev: Language) => Language)) => void;
  t: (en: string, es: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() ?? '/';
  const router = useRouter();

  // Derived state — no useState, no useEffect. If the pathname has a locale
  // prefix we use it; otherwise fall back to DEFAULT_LOCALE. The middleware
  // guarantees a prefix for every rendered public page, so the fallback only
  // fires on the transient server/offline render before middleware kicks in.
  const urlLocale: Locale = getLocaleFromPathname(pathname) ?? DEFAULT_LOCALE;
  const language: Language = toLanguageKey(urlLocale);

  const setLanguage = useCallback(
    (next: Language | ((prev: Language) => Language)) => {
      const resolved = typeof next === 'function' ? (next as (p: Language) => Language)(language) : next;
      if (resolved !== language) {
        trackLanguageSwitch(language, resolved);
      }
      const newLocale = fromLanguageKey(resolved);
      // Best-effort persistence for first-visit UX across sessions. Swallowed
      // on failure — quota errors / private-browsing restrictions aren't
      // user-actionable and shouldn't block the navigation below.
      try {
        window.localStorage.setItem(STORAGE_KEY, resolved);
      } catch {
        // ignore
      }
      // Rebuild the same path under the target locale and navigate.
      // stripLocale collapses the old prefix; localeHref prepends the new.
      const bare = stripLocale(pathname);
      router.push(localeHref(bare, newLocale));
    },
    [language, pathname, router],
  );

  const t = useCallback((en: string, es: string) => (language === 'EN' ? en : es), [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
