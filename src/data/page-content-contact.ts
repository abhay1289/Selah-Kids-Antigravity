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
  // Hero
  { id: 'badge', label: 'Badge', type: 'text', valueEn: 'GET IN TOUCH', valueEs: 'CONTÁCTANOS' },
  { id: 'title1', label: 'Headline Part 1', type: 'text', valueEn: "Let's", valueEs: 'Vamos a' },
  { id: 'title_accent', label: 'Headline Accent (blue)', type: 'text', valueEn: 'Connect', valueEs: 'Conectar' },
  { id: 'desc', label: 'Description', type: 'textarea', valueEn: "We'd love to hear from you! Whether you have a question, want to partner, or just want to say hi.", valueEs: '¡Nos encantaría saber de ti! Ya sea que tengas una pregunta, quieras colaborar, o simplemente quieras saludar.' },
  // Form labels
  { id: 'form_labels_name', label: 'Form: Name label', type: 'text', valueEn: 'Name', valueEs: 'Nombre' },
  { id: 'form_labels_email', label: 'Form: Email label', type: 'text', valueEn: 'Email', valueEs: 'Correo' },
  { id: 'form_labels_subject', label: 'Form: Subject label', type: 'text', valueEn: 'Subject', valueEs: 'Asunto' },
  { id: 'form_labels_message', label: 'Form: Message label', type: 'text', valueEn: 'Message', valueEs: 'Mensaje' },
  // States
  { id: 'success_message', label: 'Success message', type: 'textarea', valueEn: "Thanks — we'll reply within 48 hours. Check your inbox (and spam folder) for our response.", valueEs: 'Gracias — responderemos en 48 horas. Revisa tu bandeja de entrada (y la carpeta de spam) para nuestra respuesta.' },
  { id: 'error_message', label: 'Error message', type: 'textarea', valueEn: 'Something went wrong. Please check the fields above and try again.', valueEs: 'Algo salió mal. Revisa los campos de arriba e inténtalo de nuevo.' },
  // Sidebar
  { id: 'sidebar_hours_label', label: 'Sidebar: Hours label', type: 'text', valueEn: 'Office Hours', valueEs: 'Horario de Oficina' },
  { id: 'sidebar_hours_body', label: 'Sidebar: Hours body', type: 'text', valueEn: 'Monday–Friday · 9am–5pm ET', valueEs: 'Lunes a viernes · 9am–5pm ET' },
  { id: 'sidebar_email_label', label: 'Sidebar: Email label', type: 'text', valueEn: 'Email Us', valueEs: 'Escríbenos' },
  { id: 'sidebar_social_label', label: 'Sidebar: Social label', type: 'text', valueEn: 'Follow Along', valueEs: 'Síguenos' },
  { id: 'sidebar_response_promise', label: 'Sidebar: Response promise', type: 'text', valueEn: "We reply within 48 hours — usually sooner.", valueEs: 'Respondemos en 48 horas — usualmente antes.' },
];

export const contactKeyFor = (fid: string) => `general.${fid}`;

export function buildContactFallback(): PageFieldMap {
  const map: PageFieldMap = {};
  for (const f of CONTACT_FIELDS) map[contactKeyFor(f.id)] = { en: f.valueEn, es: f.valueEs };
  return map;
}

export const INITIAL_PAGE_CONTACT: PageFieldMap = buildContactFallback();
