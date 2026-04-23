/**
 * Home page CMS seed — single source of truth for every editable string on
 * the home route.
 *
 * Consumers:
 *   - `src/app/admin/pages/home/page.tsx` — renders the editor from
 *     HOME_SECTIONS and persists edits keyed by `homeKeyFor(section, field)`.
 *   - `src/app/[locale]/page.tsx` — passes INITIAL_PAGE_HOME to
 *     `getPageContent('home', ...)` as the offline/fallback map.
 *   - `src/data/cms-fallbacks.ts` — stitches INITIAL_PAGE_HOME into the
 *     aggregated seed map consumed by `scripts/seed-cms.ts`.
 *
 * Key format mirrors the admin editor exactly: `<sectionId>.<fieldId>`. Any
 * drift between this file and the component fallbacks renders visibly on the
 * public site, so the `f('section.field', 'EN', 'ES')` call sites in the
 * section components keep the hardcoded literals verbatim as the resolver's
 * fallback arguments.
 */

import type { PageFieldMap } from '../lib/cms-server';

export interface PageEditorField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'image';
  valueEn: string;
  valueEs: string;
}

export interface PageEditorSection {
  id: string;
  title: string;
  icon: string;
  fields: PageEditorField[];
}

export const HOME_SECTIONS: PageEditorSection[] = [
  {
    id: 'hero', title: 'Hero Section', icon: '🌟',
    fields: [
      { id: 'hero_badge', label: 'Badge Text', type: 'text', valueEn: 'FAITH-FILLED MUSIC FOR LITTLE ONES', valueEs: 'MÚSICA DE FE PARA LOS PEQUEÑOS' },
      { id: 'hero_title_line1', label: 'Headline Words (Line 1)', type: 'text', valueEn: 'Christian Music for', valueEs: 'Música Cristiana para' },
      { id: 'hero_title_accent', label: 'Headline Accent Word', type: 'text', valueEn: 'Kids', valueEs: 'Niños' },
      { id: 'hero_description', label: 'Description', type: 'textarea', valueEn: 'Welcome to Selah Kids! We create original worship songs and Christian cartoons that the whole family will love. Get ready to sing, dance, and learn about God with our catchy music and exciting videos!', valueEs: '¡Bienvenidos a Selah Kids! Creamos canciones de adoración originales y dibujos animados cristianos que encantarán a toda la familia. ¡Prepárate para cantar, bailar y aprender sobre Dios con nuestra música pegajosa y videos emocionantes!' },
      { id: 'hero_cta_primary', label: 'Primary Button', type: 'text', valueEn: 'Watch Now', valueEs: 'Ver Ahora' },
      { id: 'hero_cta_secondary', label: 'Secondary Button', type: 'text', valueEn: 'Our Story', valueEs: 'Nuestra Historia' },
      { id: 'hero_platforms_label', label: 'Platforms Label', type: 'text', valueEn: 'AVAILABLE ON', valueEs: 'DISPONIBLE EN' },
    ]
  },
  {
    id: 'latest_videos', title: 'Latest Videos Section', icon: '🎬',
    fields: [
      { id: 'vid_badge', label: 'Badge', type: 'text', valueEn: 'FRESH CONTENT', valueEs: 'CONTENIDO NUEVO' },
      { id: 'vid_title', label: 'Title', type: 'text', valueEn: 'Our Latest Videos', valueEs: 'Nuestros Últimos Videos' },
      { id: 'vid_description', label: 'Description', type: 'textarea', valueEn: 'Check out our newest Christian kids music and engaging Christian cartoons! We have awesome worship videos in both English and Spanish. They are perfect for Sunday school songs or hanging out with your family!', valueEs: '¡Mira nuestra nueva música cristiana para niños y emocionantes dibujos animados cristianos! Tenemos increíbles videos de adoración en inglés y español. ¡Son perfectos para canciones de la escuela dominical o para pasar tiempo con tu familia!' },
      { id: 'vid_cta', label: 'CTA Button', type: 'text', valueEn: 'See All Videos', valueEs: 'Ver Todos Los Videos' },
    ]
  },
  {
    id: 'about', title: 'About Section', icon: '📖',
    fields: [
      { id: 'about_badge', label: 'Badge', type: 'text', valueEn: 'Our Mission', valueEs: 'Nuestra Misión' },
      { id: 'about_title', label: 'Title', type: 'text', valueEn: 'The Selah Kids Story', valueEs: 'La Historia de Selah Kids' },
      { id: 'about_description', label: 'Description', type: 'textarea', valueEn: "Selah Kids! was created by parents who wanted a safe place for kids to watch faith-based videos. We want to help families get up, move, and worship God together with our catchy Sunday school songs.", valueEs: '¡Selah Kids! fue creado por padres que querían un lugar seguro para que los niños vean videos basados en la fe. Queremos ayudar a las familias a levantarse, moverse y adorar a Dios juntos con nuestras pegajosas canciones de la escuela dominical.' },
      { id: 'about_feature1_title', label: 'Feature 1 Title', type: 'text', valueEn: 'Original Worship Songs', valueEs: 'Canciones de Adoración Originales' },
      { id: 'about_feature1_desc', label: 'Feature 1 Description', type: 'textarea', valueEn: 'Our worship songs teach important lessons from scripture in an engaging way that kids can easily understand.', valueEs: 'Nuestras canciones de adoración enseñan lecciones importantes de las escrituras de una manera atractiva que los niños pueden entender fácilmente.' },
      { id: 'about_feature2_title', label: 'Feature 2 Title', type: 'text', valueEn: 'Stunning Animation', valueEs: 'Animación Impresionante' },
      { id: 'about_feature2_desc', label: 'Feature 2 Description', type: 'textarea', valueEn: 'Our videos feature beautiful animation made by talented artists from around the world to bring Christian stories to life.', valueEs: 'Nuestros videos presentan hermosas animaciones hechas por artistas talentosos de todo el mundo para dar vida a las historias cristianas.' },
      { id: 'about_cta', label: 'CTA Button', type: 'text', valueEn: 'Read Our Full Story', valueEs: 'Lee Nuestra Historia Completa' },
      { id: 'about_floating_badge', label: 'Floating Badge Text', type: 'text', valueEn: 'Made by parents', valueEs: 'Hecho por padres' },
    ]
  },
  {
    id: 'youtube', title: 'Join YouTube Section', icon: '📺',
    fields: [
      { id: 'yt_badge', label: 'Badge', type: 'text', valueEn: 'SUBSCRIBE & WORSHIP', valueEs: 'SUSCRÍBETE Y ADORA' },
      { id: 'yt_title_line1', label: 'Title Line 1', type: 'text', valueEn: 'Join Our YouTube', valueEs: 'Únete a Nuestra' },
      { id: 'yt_title_line2', label: 'Title Line 2', type: 'text', valueEn: 'Family!', valueEs: 'Familia de YouTube!' },
      { id: 'yt_description', label: 'Description', type: 'textarea', valueEn: 'Get new worship songs, English and Spanish worship videos, and awesome Christian cartoons every single week! Subscribe to our channel so you never miss a release.', valueEs: '¡Obtén nuevas canciones de adoración, videos de adoración en inglés y español, y dibujos animados cristianos increíbles cada semana! ¡Suscríbete a nuestro canal para que nunca te pierdas un estreno!' },
      { id: 'yt_cta', label: 'CTA Button', type: 'text', valueEn: 'Subscribe Now', valueEs: 'Suscríbete Ahora' },
      { id: 'yt_community_label', label: 'Community Label', type: 'text', valueEn: 'JOIN THE COMMUNITY', valueEs: 'ÚNETE A LA COMUNIDAD' },
      { id: 'yt_floating_badge1', label: 'Floating Badge 1', type: 'text', valueEn: 'New Weekly!', valueEs: '¡Nuevo Cada Semana!' },
      { id: 'yt_floating_badge2', label: 'Floating Badge 2', type: 'text', valueEn: 'Bilingual', valueEs: 'Bilingüe' },
    ]
  },
  {
    id: 'why', title: 'Why Selah Kids Section', icon: '⭐',
    fields: [
      { id: 'why_badge', label: 'Badge', type: 'text', valueEn: 'OUR CORE VALUES', valueEs: 'NUESTROS VALORES' },
      { id: 'why_title', label: 'Title', type: 'text', valueEn: 'Why Selah Kids?', valueEs: '¿Por Qué Selah Kids?' },
      { id: 'why_description', label: 'Description', type: 'textarea', valueEn: "Created by parents who wanted better shows for their own kids, Selah Kids mixes awesome Christian cartoons with important lessons from the Bible.", valueEs: 'Creado por padres que querían mejores programas para sus propios hijos, Selah Kids mezcla increíbles dibujos animados cristianos con lecciones importantes de la Biblia.' },
    ]
  },
  {
    id: 'testimonials', title: 'Testimonials Section', icon: '💬',
    fields: [
      { id: 'test_badge', label: 'Badge', type: 'text', valueEn: 'LOVED BY FAMILIES', valueEs: 'AMADO POR LAS FAMILIAS' },
      { id: 'test_title', label: 'Title', type: 'text', valueEn: 'What Parents Are Saying', valueEs: 'Lo Que Dicen Los Padres' },
      { id: 'test_description', label: 'Description', type: 'textarea', valueEn: 'Real stories from families who have found joy and faith through Selah Kids.', valueEs: 'Historias reales de familias que han encontrado alegría y fe a través de Selah Kids.' },
    ]
  },
  {
    id: 'newsletter', title: 'Newsletter Section', icon: '📬',
    fields: [
      { id: 'nl_badge', label: 'Badge', type: 'text', valueEn: 'STAY IN THE LOOP', valueEs: 'MANTENTE INFORMADO' },
      { id: 'nl_title', label: 'Title', type: 'text', valueEn: 'Stay in the Loop!', valueEs: 'Mantente en el ¡Contacto!' },
      { id: 'nl_description', label: 'Description', type: 'textarea', valueEn: "Enter your email address to be the first to know about all things Selah Kids! Get updates on new Christian kids music and exciting videos straight to your inbox.", valueEs: '¡Ingresa tu correo electrónico para ser el primero en saber todo sobre Selah Kids! Recibe actualizaciones sobre nueva música cristiana para niños y videos emocionantes directamente en tu bandeja de entrada.' },
      { id: 'nl_cta', label: 'CTA Button', type: 'text', valueEn: 'Join Now', valueEs: 'Únete Ahora' },
      { id: 'nl_social_proof', label: 'Social Proof Text', type: 'text', valueEn: 'Join 100,000+ families', valueEs: 'Únete a 100,000+ familias' },
    ]
  },
];

export const homeKeyFor = (sectionId: string, fieldId: string) => `${sectionId}.${fieldId}`;

export function buildHomeFallback(): PageFieldMap {
  const map: PageFieldMap = {};
  for (const s of HOME_SECTIONS) {
    for (const fld of s.fields) {
      map[homeKeyFor(s.id, fld.id)] = { en: fld.valueEn, es: fld.valueEs };
    }
  }
  return map;
}

export const INITIAL_PAGE_HOME: PageFieldMap = buildHomeFallback();
