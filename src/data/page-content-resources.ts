/**
 * Resources page — flat field seed source.
 *
 * Shared by:
 *   - Admin editor at src/app/admin/pages/resources/page.tsx (edits these values).
 *   - Public Server Component at src/app/[locale]/resources/page.tsx
 *     (hands INITIAL_PAGE_RESOURCES to getPageContent as the fallback).
 *   - Any section component that renders via useFieldResolver(fields).
 */

import type { PageFieldMap } from '../lib/cms-server';

export interface PageEditorField {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  valueEn: string;
  valueEs: string;
}

export const RESOURCES_FIELDS: PageEditorField[] = [
  { id: 'badge', label: 'Badge', type: 'text', valueEn: 'FREE RESOURCES FOR FAMILIES', valueEs: 'RECURSOS GRATUITOS PARA FAMILIAS' },
  { id: 'title', label: 'Headline', type: 'text', valueEn: 'Resources for Families', valueEs: 'Recursos para Familias' },
  { id: 'desc', label: 'Description', type: 'textarea', valueEn: 'Download printables, coloring pages, and lesson guides to help your kids learn and grow in faith.', valueEs: 'Descarga imprimibles, páginas para colorear y guías de lecciones para ayudar a tus hijos a aprender y crecer en la fe.' },
];

export const resourcesKeyFor = (fid: string) => `general.${fid}`;

export function buildResourcesFallback(): PageFieldMap {
  const map: PageFieldMap = {};
  for (const f of RESOURCES_FIELDS) map[resourcesKeyFor(f.id)] = { en: f.valueEn, es: f.valueEs };
  return map;
}

export const INITIAL_PAGE_RESOURCES: PageFieldMap = buildResourcesFallback();
