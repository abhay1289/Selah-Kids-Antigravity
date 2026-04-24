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
  // Hero
  { id: 'badge', label: 'Badge', type: 'text', valueEn: 'FREE RESOURCES FOR FAMILIES', valueEs: 'RECURSOS GRATUITOS PARA FAMILIAS' },
  { id: 'title', label: 'Headline', type: 'text', valueEn: 'Resources for Families', valueEs: 'Recursos para Familias' },
  { id: 'desc', label: 'Description', type: 'textarea', valueEn: 'Download printables, coloring pages, and lesson guides to help your kids learn and grow in faith.', valueEs: 'Descarga imprimibles, páginas para colorear y guías de lecciones para ayudar a tus hijos a aprender y crecer en la fe.' },
  // Empty state
  { id: 'empty_state_headline', label: 'Empty state: Headline', type: 'text', valueEn: "Nothing here yet — check back soon!", valueEs: 'Nada aquí todavía — ¡vuelve pronto!' },
  { id: 'empty_state_body', label: 'Empty state: Body', type: 'textarea', valueEn: "We're packing this shelf with colorable pages, lyric sheets, and lesson guides. Subscribe to the newsletter and we'll tell you the moment a new one lands.", valueEs: 'Estamos llenando este estante con páginas para colorear, hojas de letras y guías de lecciones. Suscríbete al boletín y te avisaremos apenas llegue una nueva.' },
  // Download modal
  { id: 'modal_headline', label: 'Modal: Headline', type: 'text', valueEn: 'One last thing before you download', valueEs: 'Una última cosa antes de descargar' },
  { id: 'modal_body', label: 'Modal: Body', type: 'textarea', valueEn: "Leave your email and we'll send you the file plus a quick note when a matching new resource drops. No ads. Unsubscribe any time.", valueEs: 'Déjanos tu correo y te enviaremos el archivo más una breve nota cuando aparezca un recurso nuevo similar. Sin anuncios. Cancela cuando quieras.' },
  { id: 'modal_cta', label: 'Modal: CTA Label', type: 'text', valueEn: 'Send me the file', valueEs: 'Envíame el archivo' },
  { id: 'modal_privacy', label: 'Modal: Privacy note', type: 'textarea', valueEn: "We only email about Selah Kids releases and resources. See our privacy policy for details.", valueEs: 'Solo enviamos correos sobre lanzamientos y recursos de Selah Kids. Consulta nuestra política de privacidad para más detalles.' },
  // Category labels — admins can add more with the `category_<slug>_label` convention
  { id: 'category_coloring_label', label: 'Category: Coloring', type: 'text', valueEn: 'Coloring pages', valueEs: 'Páginas para colorear' },
  { id: 'category_lyrics_label', label: 'Category: Lyrics', type: 'text', valueEn: 'Lyrics sheets', valueEs: 'Hojas de letras' },
  { id: 'category_lessons_label', label: 'Category: Lessons', type: 'text', valueEn: 'Lesson guides', valueEs: 'Guías de lecciones' },
  { id: 'category_activities_label', label: 'Category: Activities', type: 'text', valueEn: 'Activity packs', valueEs: 'Paquetes de actividades' },
];

export const resourcesKeyFor = (fid: string) => `general.${fid}`;

export function buildResourcesFallback(): PageFieldMap {
  const map: PageFieldMap = {};
  for (const f of RESOURCES_FIELDS) map[resourcesKeyFor(f.id)] = { en: f.valueEn, es: f.valueEs };
  return map;
}

export const INITIAL_PAGE_RESOURCES: PageFieldMap = buildResourcesFallback();
