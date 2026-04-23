/**
 * Donate page — flat field seed source.
 *
 * Shared by:
 *   - Admin editor at src/app/admin/pages/donate/page.tsx (edits these values).
 *   - Public Server Component at src/app/[locale]/donate/page.tsx
 *     (hands INITIAL_PAGE_DONATE to getPageContent as the fallback).
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

export const DONATE_FIELDS: PageEditorField[] = [
  { id: 'badge', label: 'Badge', type: 'text', valueEn: 'MAKE A DIFFERENCE', valueEs: 'HAZ LA DIFERENCIA' },
  { id: 'title1', label: 'Headline Part 1', type: 'text', valueEn: 'Support', valueEs: 'Apoya' },
  { id: 'title_accent', label: 'Headline Accent (orange)', type: 'text', valueEn: 'Selah Kids', valueEs: 'Selah Kids' },
  { id: 'desc', label: 'Description', type: 'textarea', valueEn: "Your generosity helps us create high-quality, faith-filled content that teaches children about God's love.", valueEs: 'Tu generosidad nos ayuda a crear contenido de alta calidad y lleno de fe que enseña a los niños sobre el amor de Dios.' },
];

export const donateKeyFor = (fid: string) => `general.${fid}`;

export function buildDonateFallback(): PageFieldMap {
  const map: PageFieldMap = {};
  for (const f of DONATE_FIELDS) map[donateKeyFor(f.id)] = { en: f.valueEn, es: f.valueEs };
  return map;
}

export const INITIAL_PAGE_DONATE: PageFieldMap = buildDonateFallback();
