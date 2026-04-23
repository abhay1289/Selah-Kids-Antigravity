/**
 * Locale primitives for the Phase 2 URL-segmented bilingual routing.
 *
 * URL shape:
 *   /en/...  — English (default)
 *   /es/...  — Spanish
 *   /        — redirected to /en (by middleware)
 *   /about   — redirected to /en/about (by middleware)
 *
 * This module is pure: no React, no Next.js imports, no side effects.
 * Safe to import from server, client, middleware, tests, and scripts.
 */

export const SUPPORTED_LOCALES = ['en', 'es'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(x: string): x is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(x);
}

/**
 * Extract the locale prefix from a pathname, or null if none.
 *
 *   /en/about   → 'en'
 *   /es         → 'es'
 *   /about      → null
 *   /           → null
 */
export function getLocaleFromPathname(pathname: string): Locale | null {
  const first = pathname.split('/').filter(Boolean)[0];
  if (first && isLocale(first)) return first;
  return null;
}

/**
 * Remove the locale prefix from a pathname.
 *
 *   /en/about   → '/about'
 *   /es         → '/'
 *   /about      → '/about'   (idempotent — no locale to strip)
 */
export function stripLocale(pathname: string): string {
  const loc = getLocaleFromPathname(pathname);
  if (!loc) return pathname;
  const stripped = pathname.slice(`/${loc}`.length);
  return stripped === '' ? '/' : stripped;
}

/**
 * Build a locale-prefixed href from a route path. External URLs and hash-
 * only / query-only paths pass through unchanged — we only rewrite paths
 * that look like internal routes.
 *
 *   localeHref('/about', 'en')         → '/en/about'
 *   localeHref('/about', 'es')         → '/es/about'
 *   localeHref('/', 'en')              → '/en'
 *   localeHref('/en/about', 'es')      → '/es/about'   (replaces existing prefix)
 *   localeHref('https://x.com', 'en')  → 'https://x.com'
 *   localeHref('#top', 'en')           → '#top'
 *   localeHref('?lang=es', 'en')       → '?lang=es'
 */
export function localeHref(path: string, locale: Locale = DEFAULT_LOCALE): string {
  if (/^(https?:)?\/\//.test(path)) return path;
  if (path.startsWith('#') || path.startsWith('?')) return path;
  if (path.startsWith('mailto:') || path.startsWith('tel:')) return path;

  // Split off query and hash so they don't leak into getLocaleFromPathname
  // (which treats the first segment as-is). Without this split,
  // localeHref('/en?x=1', 'es') would see 'en?x=1' as the first segment,
  // fail to recognise the existing 'en' prefix, and double-prefix the URL.
  const hashIdx = path.indexOf('#');
  const queryIdx = path.indexOf('?');
  // Pick whichever delimiter comes first; they may appear in either order
  // depending on how the caller built the href.
  const splitIdx =
    hashIdx === -1 ? queryIdx : queryIdx === -1 ? hashIdx : Math.min(hashIdx, queryIdx);
  const pathOnly = splitIdx === -1 ? path : path.slice(0, splitIdx);
  const suffix = splitIdx === -1 ? '' : path.slice(splitIdx);

  const normalized = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  const stripped = stripLocale(normalized);
  const prefixed = stripped === '/' ? `/${locale}` : `/${locale}${stripped}`;
  return prefixed + suffix;
}

/**
 * Negotiate the best locale from an Accept-Language header. Returns the
 * highest-quality match found in SUPPORTED_LOCALES, or DEFAULT_LOCALE.
 *
 *   'es-MX,es;q=0.9,en;q=0.8'  → 'es'
 *   'en-US,en;q=0.9'           → 'en'
 *   'fr-FR'                     → 'en'  (DEFAULT_LOCALE)
 *   null                        → 'en'
 */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const entries = acceptLanguage
    .split(',')
    .map((raw) => {
      const [langPart, qPart] = raw.trim().split(';');
      const q = qPart ? parseFloat(qPart.replace(/\s*q\s*=\s*/i, '')) || 1 : 1;
      return { lang: (langPart ?? '').toLowerCase(), q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of entries) {
    for (const loc of SUPPORTED_LOCALES) {
      if (lang === loc || lang.startsWith(`${loc}-`)) return loc;
    }
  }
  return DEFAULT_LOCALE;
}

/**
 * Map a Locale to the corresponding LanguageContext key. The context uses
 * 'EN' / 'ES' because that shape was locked in before the URL refactor;
 * this helper is the one place the two worlds meet.
 */
export function toLanguageKey(locale: Locale): 'EN' | 'ES' {
  return locale === 'es' ? 'ES' : 'EN';
}

export function fromLanguageKey(key: 'EN' | 'ES'): Locale {
  return key === 'ES' ? 'es' : 'en';
}
