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
