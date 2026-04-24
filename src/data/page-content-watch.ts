import type { PageFieldMap } from '../lib/cms-server';

/**
 * Seed content + editor schema for the /watch page.
 *
 * Single source of truth for:
 *   - Admin editor (src/app/admin/pages/watch/page.tsx) — reads PAGE_WATCH_SECTIONS
 *   - Public Server Component (src/app/[locale]/watch/page.tsx) — passes
 *     INITIAL_PAGE_WATCH to getPageContent() as offline/pre-seed fallback
 *
 * Each field's valueEn/valueEs must match the hardcoded t('EN', 'ES') literal
 * in the corresponding section component so the rendered output is identical
 * before any admin edit lands.
 */

export interface PageEditorField {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  valueEn: string;
  valueEs: string;
}

export interface PageEditorSection {
  id: string;
  title: string;
  icon: string;
  fields: PageEditorField[];
}

export const PAGE_WATCH_SECTIONS: PageEditorSection[] = [
  {
    id: 'hero',
    title: 'Hero Section',
    icon: '🎬',
    fields: [
      { id: 'badge', label: 'Badge', type: 'text', valueEn: 'WATCH & LISTEN', valueEs: 'VER Y ESCUCHAR' },
      { id: 'title', label: 'Title', type: 'text', valueEn: 'Discover Our Videos', valueEs: 'Descubre Nuestros Videos' },
      { id: 'desc', label: 'Description', type: 'textarea', valueEn: "Sing, dance, and learn about God's love with our collection of high-quality Christian kids videos.", valueEs: 'Canta, baila y aprende del amor de Dios con nuestra colección de videos cristianos de alta calidad para niños.' },
      { id: 'hero_featured_badge', label: 'Featured Badge', type: 'text', valueEn: 'New this week', valueEs: 'Nuevo esta semana' },
    ],
  },
  {
    id: 'cta',
    title: 'Watch CTA',
    icon: '▶️',
    fields: [
      { id: 'cta_headline', label: 'CTA Headline', type: 'text', valueEn: 'Never miss an episode', valueEs: 'No te pierdas ningún episodio' },
      { id: 'cta_body', label: 'CTA Body', type: 'textarea', valueEn: 'Subscribe on YouTube for new songs, full episodes, and bilingual sing-alongs every month.', valueEs: 'Suscríbete en YouTube para nuevas canciones, episodios completos y canto bilingüe cada mes.' },
      { id: 'cta_primary_label', label: 'Primary CTA label', type: 'text', valueEn: 'Subscribe on YouTube', valueEs: 'Suscríbete en YouTube' },
      { id: 'cta_secondary_label', label: 'Secondary CTA label', type: 'text', valueEn: 'Listen on Spotify', valueEs: 'Escucha en Spotify' },
      { id: 'cta_subscriber_stat', label: 'Subscriber stat', type: 'text', valueEn: '20,000+ families subscribed', valueEs: '20,000+ familias suscritas' },
    ],
  },
  {
    id: 'finder',
    title: 'Episode Finder',
    icon: '🔍',
    fields: [
      { id: 'finder_title', label: 'Finder Title', type: 'text', valueEn: 'Looking for something specific?', valueEs: '¿Buscas algo específico?' },
      { id: 'finder_placeholder', label: 'Finder Placeholder', type: 'text', valueEn: 'Search by title, character, or topic…', valueEs: 'Busca por título, personaje o tema…' },
      { id: 'finder_chip_1', label: 'Quick Pick 1', type: 'text', valueEn: 'Short (< 3 min)', valueEs: 'Cortos (< 3 min)' },
      { id: 'finder_chip_2', label: 'Quick Pick 2', type: 'text', valueEn: 'Christmas', valueEs: 'Navidad' },
      { id: 'finder_chip_3', label: 'Quick Pick 3', type: 'text', valueEn: 'Easter', valueEs: 'Pascua' },
    ],
  },
];

export const watchKeyFor = (sectionId: string, fieldId: string) => `${sectionId}.${fieldId}`;

export function buildWatchFallback(): PageFieldMap {
  const map: PageFieldMap = {};
  for (const s of PAGE_WATCH_SECTIONS) {
    for (const fld of s.fields) {
      map[watchKeyFor(s.id, fld.id)] = { en: fld.valueEn, es: fld.valueEs };
    }
  }
  return map;
}

export const INITIAL_PAGE_WATCH: PageFieldMap = buildWatchFallback();
