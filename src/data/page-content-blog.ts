/**
 * Blog list page — flat field seed source.
 *
 * Shared by:
 *   - Admin editor at src/app/admin/pages/blog/page.tsx (edits these values).
 *   - Public Server Component at src/app/[locale]/blog/page.tsx
 *     (hands INITIAL_PAGE_BLOG to getPageContent as the fallback).
 *
 * Keys follow the `general.<fieldId>` convention used by flat pages so the
 * admin-saved row lands at the same key the public page reads from.
 *
 * Per-post copy (title, body, cover) lives on the `blog_posts` collection,
 * not here — this file only holds hero / category / empty-state chrome.
 */

import type { PageFieldMap } from '../lib/cms-server';

export interface PageEditorField {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  valueEn: string;
  valueEs: string;
}

export const BLOG_FIELDS: PageEditorField[] = [
  // Hero
  { id: 'hero_badge', label: 'Hero Badge', type: 'text', valueEn: 'THE BLOG', valueEs: 'EL BLOG' },
  { id: 'hero_headline', label: 'Hero Headline', type: 'text', valueEn: 'Letters from the studio', valueEs: 'Cartas desde el estudio' },
  { id: 'hero_body', label: 'Hero Body', type: 'textarea', valueEn: 'Behind-the-scenes stories, parenting notes, and the occasional song breakdown from the team behind Selah Kids.', valueEs: 'Historias detrás de cámaras, notas de crianza y ocasionalmente el análisis de una canción por parte del equipo de Selah Kids.' },
  { id: 'hero_cta_label', label: 'Hero CTA Label', type: 'text', valueEn: 'Subscribe for new posts', valueEs: 'Suscríbete para nuevas publicaciones' },
  // Categories
  { id: 'categories_faith_label', label: 'Category: Faith', type: 'text', valueEn: 'Faith', valueEs: 'Fe' },
  { id: 'categories_family_label', label: 'Category: Family', type: 'text', valueEn: 'Family', valueEs: 'Familia' },
  { id: 'categories_worship_label', label: 'Category: Worship', type: 'text', valueEn: 'Worship', valueEs: 'Adoración' },
  // Empty state
  { id: 'empty_state_headline', label: 'Empty state: Headline', type: 'text', valueEn: 'No posts in this category yet', valueEs: 'Aún no hay publicaciones en esta categoría' },
  { id: 'empty_state_body', label: 'Empty state: Body', type: 'textarea', valueEn: "We haven't published here yet. Try another category, or subscribe and we'll email you the moment we do.", valueEs: 'Aún no hemos publicado aquí. Prueba otra categoría o suscríbete y te enviaremos un correo apenas lo hagamos.' },
];

export const blogKeyFor = (fid: string) => `general.${fid}`;

export function buildBlogFallback(): PageFieldMap {
  const map: PageFieldMap = {};
  for (const f of BLOG_FIELDS) map[blogKeyFor(f.id)] = { en: f.valueEn, es: f.valueEs };
  return map;
}

export const INITIAL_PAGE_BLOG: PageFieldMap = buildBlogFallback();
