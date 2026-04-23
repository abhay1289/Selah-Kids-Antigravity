'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { fromLanguageKey, localeHref, getLocaleFromPathname, DEFAULT_LOCALE } from '../lib/i18n';
import type { Banner } from '../data/chrome-announcements';

const STORAGE_PREFIX = 'selahkids:banner-dismissed:';

/**
 * Only http(s) and root-relative paths are rendered into an `href` — admin
 * free-text could otherwise pass `javascript:` and execute on click.
 */
function sanitizeHref(raw: string | undefined): string | null {
  if (!raw) return null;
  if (raw.startsWith('/')) return raw;
  try {
    const parsed = new URL(raw);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? raw : null;
  } catch {
    return null;
  }
}

function matchesPage(banner: Banner, locale: 'en' | 'es', pathname: string | null): boolean {
  if (banner.showOnPages === 'all') return true;
  if (banner.showOnPages === 'home') {
    return pathname === '/' || pathname === `/${locale}` || pathname === `/${locale}/`;
  }
  // 'custom' has no schema for an allowlist yet — hide until we add one.
  return false;
}

export function AnnouncementBanner({ banners }: { banners: Banner[] }) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const locale = getLocaleFromPathname(pathname) ?? fromLanguageKey(language) ?? DEFAULT_LOCALE;
  const banner = banners.find((b) => b.isActive);

  const [dismissed, setDismissed] = useState(false);

  // Dismissal lives in sessionStorage so it clears when the tab closes but
  // persists through internal navigations. Read happens after mount to
  // avoid a hydration mismatch (server has no sessionStorage).
  useEffect(() => {
    if (!banner) return;
    try {
      if (window.sessionStorage.getItem(STORAGE_PREFIX + banner.id) === '1') {
        setDismissed(true);
      }
    } catch {
      /* Safari private mode / storage disabled — leave the banner visible. */
    }
  }, [banner]);

  if (!banner) return null;
  if (!matchesPage(banner, locale, pathname)) return null;
  if (dismissed) return null;

  const text = locale === 'en' ? banner.textEn : banner.textEs;
  const safeHref = sanitizeHref(banner.linkHref);
  const href = safeHref?.startsWith('/') ? localeHref(safeHref, locale) : safeHref;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(STORAGE_PREFIX + banner.id, '1');
    } catch {
      /* storage disabled — dismiss still works for this view. */
    }
  };

  return (
    <div
      role="region"
      aria-label="Site announcement"
      className="w-full flex items-center justify-center gap-3 px-4 py-2 text-[13px] font-semibold"
      style={{ backgroundColor: banner.bgColor, color: banner.textColor }}
    >
      <span>{text}</span>
      {href && banner.linkText && (
        <Link href={href} className="underline underline-offset-2 hover:opacity-80 transition-opacity">
          {banner.linkText} →
        </Link>
      )}
      {banner.dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="ml-2 rounded-full p-1 hover:bg-white/15 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
