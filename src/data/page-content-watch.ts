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
