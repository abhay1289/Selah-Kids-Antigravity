/**
 * Tests for src/lib/i18n.ts — pure URL helpers for the locale refactor.
 *
 * These helpers run in middleware (edge), server components, and the browser,
 * so the tests only exercise pure logic — no Next.js imports, no DOM.
 */

import { describe, test, expect } from 'bun:test';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isLocale,
  getLocaleFromPathname,
  stripLocale,
  localeHref,
  negotiateLocale,
  toLanguageKey,
  fromLanguageKey,
} from './i18n';

describe('i18n — constants', () => {
  test('DEFAULT_LOCALE is en', () => {
    expect(DEFAULT_LOCALE).toBe('en');
  });
  test('SUPPORTED_LOCALES contains en and es', () => {
    expect([...SUPPORTED_LOCALES].sort()).toEqual(['en', 'es']);
  });
});

describe('i18n — isLocale', () => {
  test('accepts valid locales', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('es')).toBe(true);
  });
  test('rejects anything else', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('EN')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale('about')).toBe(false);
  });
});

describe('i18n — getLocaleFromPathname', () => {
  test('extracts prefix when present', () => {
    expect(getLocaleFromPathname('/en/about')).toBe('en');
    expect(getLocaleFromPathname('/es/blog/slug')).toBe('es');
    expect(getLocaleFromPathname('/en')).toBe('en');
  });
  test('returns null when no locale prefix', () => {
    expect(getLocaleFromPathname('/about')).toBe(null);
    expect(getLocaleFromPathname('/')).toBe(null);
    expect(getLocaleFromPathname('')).toBe(null);
  });
  test('does not confuse non-locale first segments', () => {
    expect(getLocaleFromPathname('/enterprise')).toBe(null);
    expect(getLocaleFromPathname('/english-class')).toBe(null);
  });
});

describe('i18n — stripLocale', () => {
  test('removes locale prefix', () => {
    expect(stripLocale('/en/about')).toBe('/about');
    expect(stripLocale('/es/blog/slug')).toBe('/blog/slug');
  });
  test('bare locale root maps to /', () => {
    expect(stripLocale('/en')).toBe('/');
    expect(stripLocale('/es')).toBe('/');
  });
  test('passes through paths without locale', () => {
    expect(stripLocale('/about')).toBe('/about');
    expect(stripLocale('/')).toBe('/');
  });
});

describe('i18n — localeHref', () => {
  test('prefixes internal paths', () => {
    expect(localeHref('/about', 'en')).toBe('/en/about');
    expect(localeHref('/about', 'es')).toBe('/es/about');
    expect(localeHref('/', 'en')).toBe('/en');
    expect(localeHref('/blog/my-post', 'es')).toBe('/es/blog/my-post');
  });
  test('defaults to DEFAULT_LOCALE', () => {
    expect(localeHref('/about')).toBe('/en/about');
  });
  test('normalizes relative paths by prepending /', () => {
    expect(localeHref('about', 'en')).toBe('/en/about');
  });
  test('replaces existing locale prefix rather than double-prefixing', () => {
    expect(localeHref('/en/about', 'es')).toBe('/es/about');
    expect(localeHref('/es/blog', 'en')).toBe('/en/blog');
  });
  test('passes through external URLs', () => {
    expect(localeHref('https://example.com/x', 'es')).toBe('https://example.com/x');
    expect(localeHref('//cdn.example.com/a', 'es')).toBe('//cdn.example.com/a');
  });
  test('passes through hash / query / mailto / tel', () => {
    expect(localeHref('#top', 'es')).toBe('#top');
    expect(localeHref('?lang=es', 'en')).toBe('?lang=es');
    expect(localeHref('mailto:info@example.com', 'es')).toBe('mailto:info@example.com');
    expect(localeHref('tel:+15551234', 'es')).toBe('tel:+15551234');
  });
});

describe('i18n — negotiateLocale', () => {
  test('picks highest-q match', () => {
    expect(negotiateLocale('es-MX,es;q=0.9,en;q=0.8')).toBe('es');
    expect(negotiateLocale('en-US,en;q=0.9')).toBe('en');
  });
  test('handles spaces and case variance', () => {
    expect(negotiateLocale('ES-mx, ES;q=0.9')).toBe('es');
  });
  test('falls back to default when no match', () => {
    expect(negotiateLocale('fr-FR,de;q=0.9')).toBe('en');
  });
  test('null header → default', () => {
    expect(negotiateLocale(null)).toBe('en');
  });
  test('empty header → default', () => {
    expect(negotiateLocale('')).toBe('en');
  });
  test('prefers higher-q locale even if listed later', () => {
    expect(negotiateLocale('en;q=0.5,es;q=0.9')).toBe('es');
  });
});

describe('i18n — LanguageContext bridge', () => {
  test('toLanguageKey maps correctly', () => {
    expect(toLanguageKey('en')).toBe('EN');
    expect(toLanguageKey('es')).toBe('ES');
  });
  test('fromLanguageKey maps correctly', () => {
    expect(fromLanguageKey('EN')).toBe('en');
    expect(fromLanguageKey('ES')).toBe('es');
  });
});
