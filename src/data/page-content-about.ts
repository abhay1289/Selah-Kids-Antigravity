/**
 * About page CMS seed / fallback source.
 *
 * Single source of truth for the About editor (admin) and the public About
 * page's offline/empty-DB fallback. The admin editor imports ABOUT_SECTIONS
 * to render its form; the public server component imports INITIAL_PAGE_ABOUT
 * (a flat `section.field -> {en, es}` map) to seed getPageContent's fallback.
 *
 * Keep copy in sync with the hardcoded literals still living inside the
 * section components — those literals are the per-call fallback args that
 * keep rendering zero-visual-change before the CMS is seeded.
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

export const ABOUT_SECTIONS: PageEditorSection[] = [
  {
    id: 'hero', title: 'Hero Section', icon: '🌟',
    fields: [
      { id: 'badge', label: 'Badge Text', type: 'text', valueEn: 'OUR STORY', valueEs: 'NUESTRA HISTORIA' },
      { id: 'title_words', label: 'Title Words', type: 'text', valueEn: 'The Selah Kids Story', valueEs: 'La Historia de Selah Kids' },
      { id: 'description', label: 'Description', type: 'textarea', valueEn: "We are parents and creators on a mission to fill every home with faith-filled melodies that spark wonder in the hearts of children. Together, we worship, learn, and grow.", valueEs: 'Somos padres y creadores con la misión de llenar cada hogar con melodías llenas de fe que despiertan asombro en los corazones de los niños. Juntos, adoramos, aprendemos y crecemos.' },
      { id: 'tagline', label: 'Tagline (italic)', type: 'text', valueEn: 'Learning about God through worship and song', valueEs: 'Aprendiendo sobre Dios a través de la adoración y el canto' },
    ]
  },
  {
    id: 'values', title: 'Core Values', icon: '⭐',
    fields: [
      { id: 'v_badge', label: 'Badge', type: 'text', valueEn: 'OUR VALUES', valueEs: 'NUESTROS VALORES' },
      { id: 'v_title', label: 'Section Title', type: 'text', valueEn: 'What Guides Us', valueEs: 'Lo Que Nos Guía' },
      { id: 'v1_title', label: 'Value 1: Title', type: 'text', valueEn: 'All About Jesus', valueEs: 'Todo Sobre Jesús' },
      { id: 'v1_desc', label: 'Value 1: Description', type: 'textarea', valueEn: "Jesus is at the center of every story, teaching children about God's love and grace through engaging, faith-based videos.", valueEs: 'Jesús está en el centro de cada historia, enseñando a los niños sobre el amor y la gracia de Dios a través de videos atractivos y basados en la fe.' },
      { id: 'v2_title', label: 'Value 2: Title', type: 'text', valueEn: 'Made for Kids', valueEs: 'Hecho para Niños' },
      { id: 'v2_desc', label: 'Value 2: Description', type: 'textarea', valueEn: 'Our Christian cartoons are safe, wholesome, and crafted for children to watch, learn, and grow in faith.', valueEs: 'Nuestras caricaturas cristianas son seguras, sanas y hechas para que los niños vean, aprendan y crezcan en la fe.' },
      { id: 'v3_title', label: 'Value 3: Title', type: 'text', valueEn: 'True to the Bible', valueEs: 'Fiel a la Biblia' },
      { id: 'v3_desc', label: 'Value 3: Description', type: 'textarea', valueEn: 'Every song and story is carefully reviewed to make sure it teaches accurate and helpful biblical lessons.', valueEs: 'Cada canción e historia es cuidadosamente revisada para asegurar que enseñe lecciones bíblicas precisas y útiles.' },
      { id: 'v4_title', label: 'Value 4: Title', type: 'text', valueEn: 'For Everyone', valueEs: 'Para Todos' },
      { id: 'v4_desc', label: 'Value 4: Description', type: 'textarea', valueEn: "We celebrate the beautiful diversity of God's entire creation in all our kids worship videos — in English and Spanish.", valueEs: 'Celebramos la hermosa diversidad de toda la creación de Dios en todos nuestros videos de adoración para niños — en inglés y español.' },
      { id: 'v5_title', label: 'Value 5: Title', type: 'text', valueEn: 'Sensory Friendly', valueEs: 'Amigable Sensorial' },
      { id: 'v5_desc', label: 'Value 5: Description', type: 'textarea', valueEn: 'Our content is thoughtfully designed with gentle pacing, clear visuals, and calming music to support children of all sensory needs.', valueEs: 'Nuestro contenido está diseñado con ritmo gentil, visuales claros y música calmante para apoyar a niños con todas las necesidades sensoriales.' },
    ]
  },
  {
    id: 'team', title: 'Team Section', icon: '👥',
    fields: [
      { id: 't_badge', label: 'Badge', type: 'text', valueEn: 'The Team', valueEs: 'El Equipo' },
      { id: 't_title', label: 'Title', type: 'text', valueEn: 'Meet the Selah Kids Team!', valueEs: '¡Conoce al Equipo Selah Kids!' },
      { id: 't_description', label: 'Description', type: 'textarea', valueEn: 'The passionate people bringing these stories to life.', valueEs: 'Las personas apasionadas que dan vida a estas historias.' },
    ]
  },
  {
    id: 'bento', title: 'Bento Grid', icon: '🧩',
    fields: [
      { id: 'bento_1_title', label: 'Tile 1 Title', type: 'text', valueEn: 'Our Story', valueEs: 'Nuestra Historia' },
      { id: 'bento_1_body', label: 'Tile 1 Body', type: 'textarea', valueEn: 'Two bilingual families, one longing: songs our kids could sing without us skipping a track.', valueEs: 'Dos familias bilingües, un anhelo: canciones que nuestros hijos pudieran cantar sin que tuviéramos que saltar una pista.' },
      { id: 'bento_2_title', label: 'Tile 2 Title', type: 'text', valueEn: 'Our Mission', valueEs: 'Nuestra Misión' },
      { id: 'bento_2_body', label: 'Tile 2 Body', type: 'textarea', valueEn: 'Fill every home with faith-filled melodies that spark wonder in the hearts of children.', valueEs: 'Llenar cada hogar con melodías llenas de fe que despiertan asombro en los corazones de los niños.' },
      { id: 'bento_3_title', label: 'Tile 3 Title', type: 'text', valueEn: 'Our Heart', valueEs: 'Nuestro Corazón' },
      { id: 'bento_3_body', label: 'Tile 3 Body', type: 'textarea', valueEn: 'Worship that meets kids where they are — joyful, gentle, theologically honest, and fun enough to request on repeat.', valueEs: 'Adoración que encuentra a los niños donde están — alegre, gentil, teológicamente honesta y lo suficientemente divertida como para pedirla en repetición.' },
      { id: 'bento_4_title', label: 'Tile 4 Title', type: 'text', valueEn: 'Our Craft', valueEs: 'Nuestro Arte' },
      { id: 'bento_4_body', label: 'Tile 4 Body', type: 'textarea', valueEn: 'Studio-recorded songs. Hand-animated scenes. Bilingual by default — not as an afterthought.', valueEs: 'Canciones grabadas en estudio. Escenas animadas a mano. Bilingüe por defecto — no como una idea tardía.' },
      { id: 'bento_5_title', label: 'Tile 5 Title', type: 'text', valueEn: 'Our Ministry', valueEs: 'Nuestro Ministerio' },
      { id: 'bento_5_body', label: 'Tile 5 Body', type: 'textarea', valueEn: 'Free for every family. Supported by listeners, partners, and the occasional church who adopts a song for their VBS.', valueEs: 'Gratis para cada familia. Apoyado por oyentes, colaboradores y la iglesia ocasional que adopta una canción para su escuela bíblica de verano.' },
      { id: 'bento_6_title', label: 'Tile 6 Title', type: 'text', valueEn: 'Our Community', valueEs: 'Nuestra Comunidad' },
      { id: 'bento_6_body', label: 'Tile 6 Body', type: 'textarea', valueEn: '20,000+ parents across 40 countries raising worship-filled kids together.', valueEs: '20,000+ padres en 40 países criando juntos niños llenos de adoración.' },
    ]
  },
  {
    id: 'gallery', title: 'Gallery Captions', icon: '📸',
    fields: [
      { id: 'gallery_caption_1', label: 'Caption 1', type: 'text', valueEn: 'Recording day one.', valueEs: 'Primer día de grabación.' },
      { id: 'gallery_caption_2', label: 'Caption 2', type: 'text', valueEn: 'Storyboards on the kitchen table.', valueEs: 'Guiones gráficos en la mesa de la cocina.' },
      { id: 'gallery_caption_3', label: 'Caption 3', type: 'text', valueEn: 'Voice takes with a toddler audience.', valueEs: 'Tomas de voz con una audiencia de pequeños.' },
      { id: 'gallery_caption_4', label: 'Caption 4', type: 'text', valueEn: 'The songwriting room.', valueEs: 'La sala de composición.' },
      { id: 'gallery_caption_5', label: 'Caption 5', type: 'text', valueEn: 'Animation review, take twenty.', valueEs: 'Revisión de animación, toma veinte.' },
      { id: 'gallery_caption_6', label: 'Caption 6', type: 'text', valueEn: 'Spanish tracking with our bilingual vocalists.', valueEs: 'Grabación en español con nuestras voces bilingües.' },
      { id: 'gallery_caption_7', label: 'Caption 7', type: 'text', valueEn: 'Episode premiere night.', valueEs: 'Noche de estreno del episodio.' },
      { id: 'gallery_caption_8', label: 'Caption 8', type: 'text', valueEn: "A quiet moment after wrap.", valueEs: 'Un momento tranquilo al terminar.' },
    ]
  },
  {
    id: 'marquee', title: 'Marquee Words', icon: '🌀',
    fields: [
      { id: 'marquee_safe', label: 'Marquee Word: Safe', type: 'text', valueEn: 'Safe', valueEs: 'Seguro' },
      { id: 'marquee_original', label: 'Marquee Word: Original', type: 'text', valueEn: 'Original', valueEs: 'Original' },
    ]
  },
  {
    id: 'cta', title: 'About CTA', icon: '🎯',
    fields: [
      { id: 'cta_headline', label: 'CTA Headline', type: 'text', valueEn: 'Ready to sing along?', valueEs: '¿Listo para cantar con nosotros?' },
      { id: 'cta_primary', label: 'Primary CTA', type: 'text', valueEn: 'Watch now', valueEs: 'Míralo ahora' },
      { id: 'cta_secondary', label: 'Secondary CTA', type: 'text', valueEn: 'Subscribe on YouTube', valueEs: 'Suscríbete en YouTube' },
    ]
  },
];

export const aboutKeyFor = (sectionId: string, fieldId: string) => `${sectionId}.${fieldId}`;

export function buildAboutFallback(): PageFieldMap {
  const map: PageFieldMap = {};
  for (const s of ABOUT_SECTIONS) {
    for (const fld of s.fields) {
      map[aboutKeyFor(s.id, fld.id)] = { en: fld.valueEn, es: fld.valueEs };
    }
  }
  return map;
}

export const INITIAL_PAGE_ABOUT: PageFieldMap = buildAboutFallback();
