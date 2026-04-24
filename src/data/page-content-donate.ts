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
  // Hero
  { id: 'badge', label: 'Badge', type: 'text', valueEn: 'MAKE A DIFFERENCE', valueEs: 'HAZ LA DIFERENCIA' },
  { id: 'title1', label: 'Headline Part 1', type: 'text', valueEn: 'Support', valueEs: 'Apoya' },
  { id: 'title_accent', label: 'Headline Accent (orange)', type: 'text', valueEn: 'Selah Kids', valueEs: 'Selah Kids' },
  { id: 'desc', label: 'Description', type: 'textarea', valueEn: "Your generosity helps us create high-quality, faith-filled content that teaches children about God's love.", valueEs: 'Tu generosidad nos ayuda a crear contenido de alta calidad y lleno de fe que enseña a los niños sobre el amor de Dios.' },
  { id: 'hero_cta', label: 'Hero CTA Label', type: 'text', valueEn: 'Give a gift', valueEs: 'Dar una ofrenda' },
  // Impact tiers
  { id: 'impact_1_title', label: 'Impact 1 Title', type: 'text', valueEn: 'Every $10 records one new song', valueEs: 'Cada $10 graba una canción nueva' },
  { id: 'impact_1_body', label: 'Impact 1 Body', type: 'textarea', valueEn: 'Studio time, guest vocalists, and mastering. Ten dollars. One worship song a family will sing for years.', valueEs: 'Tiempo de estudio, vocalistas invitados y masterización. Diez dólares. Una canción de adoración que una familia cantará por años.' },
  { id: 'impact_2_title', label: 'Impact 2 Title', type: 'text', valueEn: 'Every $25 animates one scene', valueEs: 'Cada $25 anima una escena' },
  { id: 'impact_2_body', label: 'Impact 2 Body', type: 'textarea', valueEn: 'Character animation, background paint, and compositing — the ingredients of a single storyboard frame.', valueEs: 'Animación de personajes, pintura de fondo y composición — los ingredientes de un solo fotograma del guion gráfico.' },
  { id: 'impact_3_title', label: 'Impact 3 Title', type: 'text', valueEn: 'Every $50 translates an episode', valueEs: 'Cada $50 traduce un episodio' },
  { id: 'impact_3_body', label: 'Impact 3 Body', type: 'textarea', valueEn: 'Bilingual voice talent plus a translator review — so our Spanish-speaking kids hear the story the same day as everyone else.', valueEs: 'Talento de voz bilingüe más la revisión de un traductor — para que nuestros niños hispanohablantes escuchen la historia el mismo día que los demás.' },
  { id: 'impact_4_title', label: 'Impact 4 Title', type: 'text', valueEn: 'Every $100 ships a full episode', valueEs: 'Cada $100 publica un episodio completo' },
  { id: 'impact_4_body', label: 'Impact 4 Body', type: 'textarea', valueEn: 'From script to final mix — one complete Selah Kids episode from a family like yours.', valueEs: 'Desde el guion hasta la mezcla final — un episodio completo de Selah Kids de parte de una familia como la tuya.' },
  { id: 'impact_5_title', label: 'Impact 5 Title', type: 'text', valueEn: 'Every $250 launches a new character', valueEs: 'Cada $250 lanza un personaje nuevo' },
  { id: 'impact_5_body', label: 'Impact 5 Body', type: 'textarea', valueEn: 'Character design, voice casting, puppet build. A new friend to walk alongside kids for years of episodes.', valueEs: 'Diseño de personaje, selección de voz, construcción del títere. Un nuevo amigo para acompañar a los niños durante años de episodios.' },
  // FAQ
  { id: 'faq_1_q', label: 'FAQ 1 Question', type: 'text', valueEn: 'Are donations tax-deductible?', valueEs: '¿Las donaciones son deducibles de impuestos?' },
  { id: 'faq_1_a', label: 'FAQ 1 Answer', type: 'textarea', valueEn: 'Selah Kids operates under a 501(c)(3) fiscal sponsor. Your donation is tax-deductible to the extent allowed by law; a receipt is emailed automatically.', valueEs: 'Selah Kids opera bajo un patrocinador fiscal 501(c)(3). Tu donación es deducible de impuestos en la medida permitida por la ley; el recibo se envía automáticamente por correo.' },
  { id: 'faq_2_q', label: 'FAQ 2 Question', type: 'text', valueEn: 'How do I cancel a recurring gift?', valueEs: '¿Cómo cancelo una donación recurrente?' },
  { id: 'faq_2_a', label: 'FAQ 2 Answer', type: 'textarea', valueEn: 'Every receipt email has a one-click cancel link, or email info.selahkids@gmail.com any time and we will handle it within 24 hours.', valueEs: 'Cada correo de recibo tiene un enlace para cancelar con un clic, o escribe a info.selahkids@gmail.com en cualquier momento y lo gestionaremos dentro de 24 horas.' },
  { id: 'faq_3_q', label: 'FAQ 3 Question', type: 'text', valueEn: 'Does my employer match gifts?', valueEs: '¿Mi empleador iguala las donaciones?' },
  { id: 'faq_3_a', label: 'FAQ 3 Answer', type: 'textarea', valueEn: 'Many do. Forward your receipt to HR; the official name to use is on the receipt. Email us if you need paperwork signed.', valueEs: 'Muchos lo hacen. Reenvía tu recibo a recursos humanos; el nombre oficial a usar está en el recibo. Escríbenos si necesitas documentos firmados.' },
  { id: 'faq_4_q', label: 'FAQ 4 Question', type: 'text', valueEn: 'What percentage goes to content?', valueEs: '¿Qué porcentaje va al contenido?' },
  { id: 'faq_4_a', label: 'FAQ 4 Answer', type: 'textarea', valueEn: '100% of donations fund content — artists, animation, translation, hosting. Our core team is volunteer. Our annual report shows every dollar.', valueEs: 'El 100% de las donaciones financia el contenido — artistas, animación, traducción, alojamiento. Nuestro equipo principal es voluntario. Nuestro informe anual muestra cada dólar.' },
  // Trust strip
  { id: 'trust_strip_1', label: 'Trust 1', type: 'text', valueEn: '501(c)(3) eligible', valueEs: 'Elegible 501(c)(3)' },
  { id: 'trust_strip_2', label: 'Trust 2', type: 'text', valueEn: 'Secure via Stripe', valueEs: 'Seguro con Stripe' },
  { id: 'trust_strip_3', label: 'Trust 3', type: 'text', valueEn: 'All major cards accepted', valueEs: 'Se aceptan todas las tarjetas principales' },
  { id: 'trust_strip_4', label: 'Trust 4', type: 'text', valueEn: 'Annual impact report', valueEs: 'Informe anual de impacto' },
];

export const donateKeyFor = (fid: string) => `general.${fid}`;

export function buildDonateFallback(): PageFieldMap {
  const map: PageFieldMap = {};
  for (const f of DONATE_FIELDS) map[donateKeyFor(f.id)] = { en: f.valueEn, es: f.valueEs };
  return map;
}

export const INITIAL_PAGE_DONATE: PageFieldMap = buildDonateFallback();
