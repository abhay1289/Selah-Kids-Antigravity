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
  {
    id: 'trust',
    title: 'Trust Badges',
    icon: '🛡️',
    fields: [
      { id: 'badge_1_title', label: 'Badge 1 Title', type: 'text', valueEn: 'Ad-Free', valueEs: 'Sin Anuncios' },
      { id: 'badge_2_title', label: 'Badge 2 Title', type: 'text', valueEn: 'Faith-Based', valueEs: 'Basado en la Fe' },
      { id: 'badge_3_title', label: 'Badge 3 Title', type: 'text', valueEn: 'Bilingual', valueEs: 'Bilingüe' },
      { id: 'badge_4_title', label: 'Badge 4 Title', type: 'text', valueEn: 'Screen-Safe', valueEs: 'Pantalla Segura' },
    ],
  },
  {
    id: 'features',
    title: 'Feature Blocks',
    icon: '✨',
    fields: [
      { id: 'feature_1_title', label: 'Feature 1 Title', type: 'text', valueEn: 'Curated for Little Hearts', valueEs: 'Curado para Pequeños Corazones' },
      { id: 'feature_1_body', label: 'Feature 1 Body', type: 'textarea', valueEn: 'Every song and episode is reviewed by parents and pastors before it ships — so what your kids watch reflects the values you teach at home.', valueEs: 'Cada canción y episodio es revisado por padres y pastores antes de publicarse — para que lo que ven tus hijos refleje los valores que enseñas en casa.' },
      { id: 'feature_2_title', label: 'Feature 2 Title', type: 'text', valueEn: 'Calm by Design', valueEs: 'Calma por Diseño' },
      { id: 'feature_2_body', label: 'Feature 2 Body', type: 'textarea', valueEn: 'Gentle pacing, soft colors, predictable stories. No jump cuts, no jarring sound effects — the kind of screen time a child can wind down with.', valueEs: 'Ritmo gentil, colores suaves, historias predecibles. Sin cortes bruscos ni efectos sonoros estridentes — el tipo de tiempo frente a la pantalla con el que un niño puede relajarse.' },
      { id: 'feature_3_title', label: 'Feature 3 Title', type: 'text', valueEn: 'Spanish & English, Equally', valueEs: 'Español e Inglés, por Igual' },
      { id: 'feature_3_body', label: 'Feature 3 Body', type: 'textarea', valueEn: 'Not translated — originally recorded in both languages by bilingual artists, so no one is the afterthought.', valueEs: 'No traducido — grabado originalmente en ambos idiomas por artistas bilingües, para que nadie quede en segundo plano.' },
    ],
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: '❓',
    fields: [
      { id: 'faq_1_q', label: 'FAQ 1 Question', type: 'text', valueEn: 'What ages is Selah Kids for?', valueEs: '¿Para qué edades es Selah Kids?' },
      { id: 'faq_1_a', label: 'FAQ 1 Answer', type: 'textarea', valueEn: 'Our content works best for ages 2–8, but many of our songs are enjoyed by the whole family.', valueEs: 'Nuestro contenido funciona mejor para edades de 2 a 8, pero muchas de nuestras canciones las disfruta toda la familia.' },
      { id: 'faq_2_q', label: 'FAQ 2 Question', type: 'text', valueEn: 'Is Selah Kids really ad-free?', valueEs: '¿Selah Kids realmente no tiene anuncios?' },
      { id: 'faq_2_a', label: 'FAQ 2 Answer', type: 'textarea', valueEn: 'Yes. Our content on our own platforms has no advertising. YouTube may still show ads on their platform; you can watch ad-free there with a YouTube Premium subscription.', valueEs: 'Sí. Nuestro contenido en nuestras propias plataformas no tiene publicidad. YouTube aún puede mostrar anuncios en su plataforma; puedes verlos sin anuncios con una suscripción a YouTube Premium.' },
      { id: 'faq_3_q', label: 'FAQ 3 Question', type: 'text', valueEn: 'What theological tradition do you teach from?', valueEs: '¿Desde qué tradición teológica enseñan?' },
      { id: 'faq_3_a', label: 'FAQ 3 Answer', type: 'textarea', valueEn: "We teach the historic Christian faith — the shared core of the gospel that every Bible-believing tradition affirms — with special care around children's developmental understanding.", valueEs: 'Enseñamos la fe cristiana histórica — el núcleo compartido del evangelio que toda tradición que cree en la Biblia afirma — con especial cuidado por la comprensión según el desarrollo del niño.' },
      { id: 'faq_4_q', label: 'FAQ 4 Question', type: 'text', valueEn: 'Can I download episodes for the car?', valueEs: '¿Puedo descargar episodios para el auto?' },
      { id: 'faq_4_a', label: 'FAQ 4 Answer', type: 'textarea', valueEn: 'Downloads are available for supporters — head to our resources page or become a supporter to unlock offline access.', valueEs: 'Las descargas están disponibles para colaboradores — visita nuestra página de recursos o conviértete en colaborador para acceder sin conexión.' },
      { id: 'faq_5_q', label: 'FAQ 5 Question', type: 'text', valueEn: 'Is there a sensory-friendly option?', valueEs: '¿Hay una opción amigable con lo sensorial?' },
      { id: 'faq_5_a', label: 'FAQ 5 Answer', type: 'textarea', valueEn: 'Yes — visit /sensory for a dedicated low-stim space with dimmer visuals, softer audio, and slower pacing.', valueEs: 'Sí — visita /sensory para un espacio dedicado de baja estimulación con visuales más tenues, audio más suave y ritmo más lento.' },
      { id: 'faq_6_q', label: 'FAQ 6 Question', type: 'text', valueEn: 'How often do you release new content?', valueEs: '¿Con qué frecuencia publican contenido nuevo?' },
      { id: 'faq_6_a', label: 'FAQ 6 Answer', type: 'textarea', valueEn: 'New songs drop monthly; new episodes roughly every six weeks. Subscribe to the newsletter for release dates.', valueEs: 'Nuevas canciones cada mes; episodios nuevos aproximadamente cada seis semanas. Suscríbete al boletín para conocer las fechas de lanzamiento.' },
      { id: 'faq_7_q', label: 'FAQ 7 Question', type: 'text', valueEn: 'Do you offer curriculum for homeschools?', valueEs: '¿Ofrecen currículo para educación en casa?' },
      { id: 'faq_7_a', label: 'FAQ 7 Answer', type: 'textarea', valueEn: "Printable lesson guides, lyrics sheets, and coloring pages are available in the Resources section — all free.", valueEs: 'Guías de lecciones imprimibles, hojas de letras y páginas para colorear están disponibles en la sección Recursos — todo gratis.' },
      { id: 'faq_8_q', label: 'FAQ 8 Question', type: 'text', valueEn: 'Where are your songs streamable?', valueEs: '¿Dónde se pueden escuchar sus canciones?' },
      { id: 'faq_8_a', label: 'FAQ 8 Answer', type: 'textarea', valueEn: 'Spotify, Apple Music, YouTube Music, and Amazon Music — see the /music page for direct links.', valueEs: 'Spotify, Apple Music, YouTube Music y Amazon Music — visita la página /music para enlaces directos.' },
      { id: 'faq_9_q', label: 'FAQ 9 Question', type: 'text', valueEn: 'How can I contact the team?', valueEs: '¿Cómo puedo contactar al equipo?' },
      { id: 'faq_9_a', label: 'FAQ 9 Answer', type: 'textarea', valueEn: 'Use the form on /contact or email info.selahkids@gmail.com — we reply within 48 hours.', valueEs: 'Usa el formulario en /contact o escribe a info.selahkids@gmail.com — respondemos en 48 horas.' },
      { id: 'faq_10_q', label: 'FAQ 10 Question', type: 'text', valueEn: 'How can I support Selah Kids?', valueEs: '¿Cómo puedo apoyar a Selah Kids?' },
      { id: 'faq_10_a', label: 'FAQ 10 Answer', type: 'textarea', valueEn: 'Share us with another family, subscribe on YouTube, or consider giving on /donate — every bit helps a song reach a new heart.', valueEs: 'Comparte Selah Kids con otra familia, suscríbete en YouTube o considera dar en /donate — cada gesto ayuda a que una canción llegue a un nuevo corazón.' },
    ],
  },
  {
    id: 'community',
    title: 'Community CTA',
    icon: '💌',
    fields: [
      { id: 'community_headline', label: 'Headline', type: 'text', valueEn: 'Join 20,000+ parents raising worship-filled kids', valueEs: 'Únete a 20,000+ padres que crían niños llenos de adoración' },
      { id: 'community_body', label: 'Body', type: 'textarea', valueEn: 'One email a month with a new song, a free printable, and a letter from the team. No noise — just the stuff you actually want.', valueEs: 'Un correo al mes con una canción nueva, un imprimible gratis y una carta del equipo. Sin ruido — solo lo que realmente quieres.' },
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
