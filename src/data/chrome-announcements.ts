/**
 * Announcement banner data — single source of truth for the
 * `announcement_banners` CMS collection.
 *
 * Admin editor (`src/app/admin/announcements/page.tsx`) and the public
 * `<AnnouncementBanner>` component both import from here so seed + offline
 * + fallback agree.
 *
 * Rendering contract:
 *   - Only one row with `isActive: true` is shown at a time (admin toggles
 *     exclusively — see the admin page's setBanners call).
 *   - `showOnPages: 'all'` → shown everywhere in /[locale]/*.
 *   - `showOnPages: 'home'` → shown only on /, /en, /es.
 *   - `showOnPages: 'custom'` → not rendered yet (no page-allowlist schema).
 */

export interface Banner {
  id: string;
  textEn: string;
  textEs: string;
  linkText: string;
  linkHref: string;
  bgColor: string;
  textColor: string;
  isActive: boolean;
  dismissible: boolean;
  showOnPages: 'all' | 'home' | 'custom';
}

export const INITIAL_ANNOUNCEMENT_BANNERS: Banner[] = [
  {
    id: '1',
    textEn: '🎉 New Song "I Am Blessed" is out now!',
    textEs: '🎉 ¡Nueva canción "Soy Bendecido" ya disponible!',
    linkText: 'Watch Now',
    linkHref: '/watch',
    bgColor: '#FF5C00',
    textColor: '#FFFFFF',
    isActive: false,
    dismissible: true,
    showOnPages: 'all',
  },
  {
    id: '2',
    textEn: '📖 New blog post: "The Call to Be a Blessing"',
    textEs: '📖 Nuevo artículo: "El Llamado a Ser de Bendición"',
    linkText: 'Read',
    linkHref: '/blog/the-call-to-be-a-blessing',
    bgColor: '#3A6B44',
    textColor: '#FFFFFF',
    isActive: false,
    dismissible: true,
    showOnPages: 'home',
  },
];
