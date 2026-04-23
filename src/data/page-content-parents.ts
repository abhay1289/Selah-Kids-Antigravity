import type { PageFieldMap } from '../lib/cms-server';

/**
 * Seed content + editor schema for the /parents (Families) page.
 *
 * Single source of truth for:
 *   - Admin editor (src/app/admin/pages/parents/page.tsx) — reads PAGE_PARENTS_SECTIONS
 *   - Public Server Component (src/app/[locale]/parents/page.tsx) — passes
 *     INITIAL_PAGE_PARENTS to getPageContent() as offline/pre-seed fallback
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

export const PAGE_PARENTS_SECTIONS: PageEditorSection[] = [
  {
    id: 'hero',
    title: 'Hero Section',
    icon: '👨‍👩‍👧‍👦',
    fields: [
      { id: 'badge', label: 'Badge', type: 'text', valueEn: 'PEACE OF MIND', valueEs: 'TRANQUILIDAD' },
      { id: 'title1', label: 'Headline Part 1', type: 'text', valueEn: 'Built for Kids.', valueEs: 'Hecho para Niños.' },
      { id: 'title2', label: 'Headline Part 2 (muted)', type: 'text', valueEn: 'Trusted by Parents.', valueEs: 'Confiado por Padres.' },
      { id: 'desc', label: 'Description', type: 'textarea', valueEn: "We created Selah Kids because we're parents too. We know how hard it is to find high-quality, safe, and faith-filled media for little ones. Our content is designed to nurture children wholistically — spirit, mind, and heart — through music, stories, and worship.", valueEs: 'Creamos Selah Kids porque también somos padres. Sabemos lo difícil que es encontrar medios de alta calidad, seguros y llenos de fe para los pequeños. Nuestro contenido está diseñado para nutrir a los niños de manera integral — espíritu, mente y corazón — a través de música, historias y adoración.' },
    ],
  },
];

export const parentsKeyFor = (sectionId: string, fieldId: string) => `${sectionId}.${fieldId}`;

export function buildParentsFallback(): PageFieldMap {
  const map: PageFieldMap = {};
  for (const s of PAGE_PARENTS_SECTIONS) {
    for (const fld of s.fields) {
      map[parentsKeyFor(s.id, fld.id)] = { en: fld.valueEn, es: fld.valueEs };
    }
  }
  return map;
}

export const INITIAL_PAGE_PARENTS: PageFieldMap = buildParentsFallback();
