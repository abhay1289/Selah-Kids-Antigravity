/**
 * Contact page — flat field seed source.
 *
 * Shared by:
 *   - Admin editor at src/app/admin/pages/contact/page.tsx (edits these values).
 *   - Public Server Component at src/app/[locale]/contact/page.tsx
 *     (hands INITIAL_PAGE_CONTACT to getPageContent as the fallback).
 *   - Any section component that renders via useFieldResolver(fields).
 *
 * Keys follow the `general.<fieldId>` convention used by flat pages so the
 * admin-saved row lands at the same key the public page reads from.
 */

import type { PageFieldMap } from '../lib/cms-server';

export interface PageEditorField {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  valueEn: string;
  valueEs: string;
}

export const CONTACT_FIELDS: PageEditorField[] = [
  { id: 'badge', label: 'Badge', type: 'text', valueEn: 'GET IN TOUCH', valueEs: 'CONTÁCTANOS' },
  { id: 'title1', label: 'Headline Part 1', type: 'text', valueEn: "Let's", valueEs: 'Vamos a' },
  { id: 'title_accent', label: 'Headline Accent (blue)', type: 'text', valueEn: 'Connect', valueEs: 'Conectar' },
  { id: 'desc', label: 'Description', type: 'textarea', valueEn: "We'd love to hear from you! Whether you have a question, want to partner, or just want to say hi.", valueEs: '¡Nos encantaría saber de ti! Ya sea que tengas una pregunta, quieras colaborar, o simplemente quieras saludar.' },
];

export const contactKeyFor = (fid: string) => `general.${fid}`;

export function buildContactFallback(): PageFieldMap {
  const map: PageFieldMap = {};
  for (const f of CONTACT_FIELDS) map[contactKeyFor(f.id)] = { en: f.valueEn, es: f.valueEs };
  return map;
}

export const INITIAL_PAGE_CONTACT: PageFieldMap = buildContactFallback();
