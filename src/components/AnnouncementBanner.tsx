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
  if (raw.startsWith('/') || raw.startsWith('#') || raw.startsWith('?') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return raw;
  try {
    const parsed = new URL(raw);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? raw : null;
  } catch {
    return null;
  }
}

/**
 * Banner ids flow into an inline <script> / <style> and into a CSS class
 * name, so any character that could close a quote or open a new JS/CSS
 * token is rejected. Admin-authored ids that fail this gate fall back to
 * a stable hash so the render still works — but we lose dismissal
 * persistence for that row, which surfaces the bad id to the editor.
 */
function safeId(raw: string): string {
  return /^[A-Za-z0-9_-]+$/.test(raw) ? raw : 'banner';
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

  // Dismissal lives in localStorage so it persists across tabs.
  // Read happens after mount to avoid a hydration mismatch. An inline
  // script hides the banner before hydration to avoid a visual flash.
  useEffect(() => {
    if (!banner) return;
    try {
      if (window.localStorage.getItem(STORAGE_PREFIX + banner.id) === '1') {
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
  const bid = safeId(banner.id);
  const storageKey = STORAGE_PREFIX + bid;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(storageKey, '1');
    } catch {
      /* storage disabled — dismiss still works for this view. */
    }
  };

  // Inline script + style hide the banner before React hydrates to avoid
  // a visible flash for returning visitors. `bid` is constrained to
  // `[A-Za-z0-9_-]+` so interpolation into the JS/CSS strings is safe —
  // no quoting or escaping is needed.
  const hideScript = `try{if(localStorage.getItem(${JSON.stringify(storageKey)})==='1')document.documentElement.classList.add('hide-banner-${bid}')}catch(e){}`;
  const hideStyle = `.hide-banner-${bid} #announcement-${bid} { display: none !important; }`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: hideScript }} />
      <style dangerouslySetInnerHTML={{ __html: hideStyle }} />
      <div
        id={`announcement-${bid}`}
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
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    </>
  );
}
