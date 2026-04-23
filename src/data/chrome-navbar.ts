/**
 * Navbar data — single source of truth for the `nav_links` and `nav_settings`
 * CMS collections.
 *
 * Admin editor (`src/app/admin/navbar/page.tsx`) and the public server layout
 * (`src/app/[locale]/layout.tsx`) both import the INITIAL_* constants from
 * here so seed + offline-mode + fallback all agree.
 *
 * Shape contract mirrors what the admin writes into `collections.data`:
 *   - nav_links   — array of visible links, sorted by sort_order
 *   - nav_settings — single-row collection holding logo + CTA config
 */

export interface NavLink {
  id: string;
  labelEn: string;
  labelEs: string;
  href: string;
  isVisible: boolean;
}

export interface NavSettings {
  id: string;
  logoPath: string;
  ctaLabelEn: string;
  ctaLabelEs: string;
  ctaHref: string;
  ctaStyle: 'primary' | 'secondary';
  stickyOnScroll: boolean;
  showLanguageToggle: boolean;
}

export const INITIAL_NAV_LINKS: NavLink[] = [
  { id: '1', labelEn: 'Home', labelEs: 'Inicio', href: '/', isVisible: true },
  { id: '2', labelEn: 'About', labelEs: 'Sobre Nosotros', href: '/about', isVisible: true },
  { id: '3', labelEn: 'Watch', labelEs: 'Ver', href: '/watch', isVisible: true },
  { id: '4', labelEn: 'Characters', labelEs: 'Personajes', href: '/characters', isVisible: true },
  { id: '5', labelEn: 'Families', labelEs: 'Familias', href: '/parents', isVisible: true },
  { id: '6', labelEn: 'Blog', labelEs: 'Blog', href: '/blog', isVisible: true },
  { id: '7', labelEn: 'Resources', labelEs: 'Recursos', href: '/resources', isVisible: true },
];

export const INITIAL_NAV_SETTINGS: NavSettings[] = [
  {
    id: 'nav',
    logoPath: '/SK_Logo_FN.png',
    ctaLabelEn: 'Donate',
    ctaLabelEs: 'Donar',
    ctaHref: '/donate',
    ctaStyle: 'primary',
    stickyOnScroll: true,
    showLanguageToggle: true,
  },
];
