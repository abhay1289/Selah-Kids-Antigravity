/**
 * Footer data — single source of truth for the `footer_links`,
 * `footer_social`, and `footer_settings` CMS collections.
 *
 * Admin editor (`src/app/admin/footer/page.tsx`) and the public server layout
 * (`src/app/[locale]/layout.tsx`) both import from here so seed + offline +
 * fallback agree.
 *
 * Icon strategy: `footer_links[].icon` is an emoji and renders as a text
 * glyph in the public footer (no Lucide lookup required). Social icons are
 * keyed on `platform` — Footer.tsx holds a platform→Lucide map so brand
 * marks stay recognisable even when admins add new platforms (unknown
 * platforms render the emoji instead).
 */

export interface FooterLink {
  id: string;
  labelEn: string;
  labelEs: string;
  href: string;
  icon: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  urlEn: string;
  urlEs: string;
  icon: string;
}

export interface FooterSettings {
  id: string;
  taglineEn: string;
  taglineEs: string;
  contactEmail: string;
  newsletterTitleEn: string;
  newsletterTitleEs: string;
  newsletterPlaceholderEn: string;
  newsletterPlaceholderEs: string;
  newsletterBtnEn: string;
  newsletterBtnEs: string;
  copyrightEn: string;
  copyrightEs: string;
  creditText: string;
  creditLink: string;
}

export const INITIAL_FOOTER_LINKS: FooterLink[] = [
  { id: '1', labelEn: 'Home', labelEs: 'Inicio', href: '/', icon: '⭐' },
  { id: '2', labelEn: 'About Us', labelEs: 'Sobre Nosotros', href: '/about', icon: '❤️' },
  { id: '3', labelEn: 'Watch', labelEs: 'Ver', href: '/watch', icon: '▶️' },
  { id: '4', labelEn: 'Resources', labelEs: 'Recursos', href: '/resources', icon: '📚' },
  { id: '5', labelEn: 'Contact Us', labelEs: 'Contáctanos', href: '/contact', icon: '✉️' },
];

export const INITIAL_FOOTER_SOCIAL: SocialLink[] = [
  { id: '1', platform: 'Instagram', urlEn: 'https://www.instagram.com/selah.kids', urlEs: 'https://www.instagram.com/selahkids_spn/', icon: '📸' },
  { id: '2', platform: 'YouTube', urlEn: 'https://www.youtube.com/@selahkidsworship', urlEs: 'https://www.youtube.com/@SelahKidsEspanol', icon: '🎬' },
  { id: '3', platform: 'Music', urlEn: '/music', urlEs: '/music', icon: '🎵' },
];

export const INITIAL_FOOTER_SETTINGS: FooterSettings[] = [
  {
    id: 'footer',
    taglineEn:
      "We're on a mission to fill every home with faith-filled melodies and stories that spark wonder in the hearts of children.",
    taglineEs:
      'Nuestra misión es llenar cada hogar con melodías llenas de fe e historias que despierten asombro en los corazones de los niños.',
    contactEmail: 'info.selahkids@gmail.com',
    newsletterTitleEn: 'Follow for new releases',
    newsletterTitleEs: 'Síguenos para nuevos lanzamientos',
    newsletterPlaceholderEn: 'We post every new song on YouTube, Spotify, and Apple Music.',
    newsletterPlaceholderEs: 'Publicamos cada nueva canción en YouTube, Spotify y Apple Music.',
    newsletterBtnEn: 'Subscribe on YouTube',
    newsletterBtnEs: 'Suscríbete en YouTube',
    copyrightEn: 'All rights reserved.',
    copyrightEs: 'Todos los derechos reservados.',
    creditText: 'Engaze Digital',
    creditLink: 'https://www.engazedigital.com/',
  },
];
