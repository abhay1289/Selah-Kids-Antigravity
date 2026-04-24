/**
 * SEO data — single source of truth for the `seo_pages` CMS collection.
 *
 * Admin editor (`src/app/admin/seo/page.tsx`) and per-route
 * `generateMetadata()` functions both read from here so seed + offline +
 * fallback + public metadata agree.
 *
 * Lookup contract: `path` matches the route's logical path (no locale
 * prefix — `/about`, not `/en/about`). `getSeoMetadata()` in
 * cms-server.ts handles the locale-aware canonical URL + image resolution.
 */

export type RobotsDirective =
  | 'index,follow'
  | 'noindex,follow'
  | 'index,nofollow'
  | 'noindex,nofollow';

export type SchemaType =
  | 'WebPage'
  | 'Article'
  | 'VideoObject'
  | 'FAQPage'
  | 'Organization';

export interface PageSEO {
  id: string;
  page: string;
  path: string;
  icon: string;

  // Locale-aware fields. `getSeoMetadata(path, locale)` picks the matching
  // pair at read time. When the admin editor or an older seed row only
  // populates the legacy single-locale fields, the EN variant is filled
  // from the legacy value and ES falls back to EN — so nothing regresses
  // while content gets translated incrementally.
  metaTitleEn: string;
  metaTitleEs: string;
  metaDescriptionEn: string;
  metaDescriptionEs: string;
  ogTitleEn: string;
  ogTitleEs: string;
  ogDescriptionEn: string;
  ogDescriptionEs: string;

  ogImage: string;
  canonical: string;
  robots: RobotsDirective;
  focusKeyword: string;
  schemaType: SchemaType;

  /**
   * Legacy single-locale fields. Kept required and populated with the EN
   * value so the current admin editor (which reads/writes these) keeps
   * working until it's migrated to per-locale inputs. The public-site
   * reader `selectSeoField()` in cms-server.ts prefers the `_en`/`_es`
   * variants above and falls back through these for any DB row that
   * pre-dates the migration.
   *
   * Treat as EN-only: always set from `metaTitleEn` etc. when seeding.
   */
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
}

export const INITIAL_SEO_PAGES: PageSEO[] = [
  {
    id: '1',
    page: 'Homepage',
    path: '/',
    icon: '🏠',
    metaTitleEn: 'Selah Kids — Christian Music & Cartoons for Kids',
    metaTitleEs: 'Selah Kids — Música Cristiana y Caricaturas para Niños',
    metaDescriptionEn:
      'Welcome to Selah Kids! We create original worship songs and Christian cartoons that the whole family will love. Faith-filled music in English & Spanish.',
    metaDescriptionEs:
      '¡Bienvenidos a Selah Kids! Creamos canciones de adoración originales y caricaturas cristianas que toda la familia amará. Música llena de fe en inglés y español.',
    ogTitleEn: 'Selah Kids — Faith-Filled Music for Little Ones',
    ogTitleEs: 'Selah Kids — Música Llena de Fe para los Más Pequeños',
    ogDescriptionEn: 'Original worship songs and Christian cartoons for the whole family!',
    ogDescriptionEs: '¡Canciones de adoración originales y caricaturas cristianas para toda la familia!',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/',
    robots: 'index,follow',
    focusKeyword: 'christian kids music',
    schemaType: 'Organization',
    metaTitle: 'Selah Kids — Christian Music & Cartoons for Kids',
    metaDescription:
      'Welcome to Selah Kids! We create original worship songs and Christian cartoons that the whole family will love. Faith-filled music in English & Spanish.',
    ogTitle: 'Selah Kids — Faith-Filled Music for Little Ones',
    ogDescription: 'Original worship songs and Christian cartoons for the whole family!',
  },
  {
    id: '2',
    page: 'About',
    path: '/about',
    icon: '📖',
    metaTitleEn: 'Our Story — Selah Kids',
    metaTitleEs: 'Nuestra Historia — Selah Kids',
    metaDescriptionEn:
      'We are parents and creators on a mission to fill every home with faith-filled melodies that spark wonder in the hearts of children.',
    metaDescriptionEs:
      'Somos padres y creadores con la misión de llenar cada hogar con melodías llenas de fe que despiertan asombro en los corazones de los niños.',
    ogTitleEn: 'The Selah Kids Story',
    ogTitleEs: 'La Historia de Selah Kids',
    ogDescriptionEn: 'Parents and creators on a mission to fill every home with faith-filled melodies.',
    ogDescriptionEs: 'Padres y creadores con la misión de llenar cada hogar con melodías llenas de fe.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/about',
    robots: 'index,follow',
    focusKeyword: 'selah kids story',
    schemaType: 'WebPage',
    metaTitle: 'Our Story — Selah Kids',
    metaDescription:
      'We are parents and creators on a mission to fill every home with faith-filled melodies that spark wonder in the hearts of children.',
    ogTitle: 'The Selah Kids Story',
    ogDescription: 'Parents and creators on a mission to fill every home with faith-filled melodies.',
  },
  {
    id: '3',
    page: 'Watch',
    path: '/watch',
    icon: '🎬',
    metaTitleEn: 'Watch — Christian Kids Videos | Selah Kids',
    metaTitleEs: 'Ver — Videos Cristianos para Niños | Selah Kids',
    metaDescriptionEn:
      "Sing, dance, and learn about God's love with our collection of high-quality Christian kids videos in English and Spanish.",
    metaDescriptionEs:
      'Canta, baila y aprende sobre el amor de Dios con nuestra colección de videos cristianos para niños en inglés y español.',
    ogTitleEn: 'Watch Selah Kids Videos',
    ogTitleEs: 'Mira Videos de Selah Kids',
    ogDescriptionEn: "High-quality Christian kids videos — sing, dance, and learn about God's love!",
    ogDescriptionEs: 'Videos cristianos para niños de alta calidad — ¡canta, baila y aprende sobre el amor de Dios!',
    ogImage: '/thumb-i-am-blessed-en.jpg',
    canonical: 'https://selahkids.com/watch',
    robots: 'index,follow',
    focusKeyword: 'christian kids videos',
    schemaType: 'VideoObject',
    metaTitle: 'Watch — Christian Kids Videos | Selah Kids',
    metaDescription:
      "Sing, dance, and learn about God's love with our collection of high-quality Christian kids videos in English and Spanish.",
    ogTitle: 'Watch Selah Kids Videos',
    ogDescription: "High-quality Christian kids videos — sing, dance, and learn about God's love!",
  },
  {
    id: '4',
    page: 'Families',
    path: '/parents',
    icon: '👨‍👩‍👧‍👦',
    metaTitleEn: 'For Families — Selah Kids',
    metaTitleEs: 'Para Familias — Selah Kids',
    metaDescriptionEn:
      "We created Selah Kids because we're parents too. Safe, faith-filled media designed to nurture children wholistically.",
    metaDescriptionEs:
      'Creamos Selah Kids porque también somos padres. Contenido seguro y lleno de fe diseñado para nutrir a los niños de forma integral.',
    ogTitleEn: 'Built for Kids. Trusted by Parents.',
    ogTitleEs: 'Hecho para Niños. Confiado por los Padres.',
    ogDescriptionEn: 'Safe, faith-filled media designed to nurture children — spirit, mind, and heart.',
    ogDescriptionEs: 'Contenido seguro y lleno de fe diseñado para nutrir a los niños — espíritu, mente y corazón.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/parents',
    robots: 'index,follow',
    focusKeyword: 'safe christian content kids',
    schemaType: 'WebPage',
    metaTitle: 'For Families — Selah Kids',
    metaDescription:
      "We created Selah Kids because we're parents too. Safe, faith-filled media designed to nurture children wholistically.",
    ogTitle: 'Built for Kids. Trusted by Parents.',
    ogDescription: 'Safe, faith-filled media designed to nurture children — spirit, mind, and heart.',
  },
  {
    id: '5',
    page: 'Donate',
    path: '/donate',
    icon: '💝',
    metaTitleEn: 'Support Selah Kids — Donate',
    metaTitleEs: 'Apoya a Selah Kids — Dona',
    metaDescriptionEn:
      "Your generosity helps us create high-quality, faith-filled content that teaches children about God's love.",
    metaDescriptionEs:
      'Tu generosidad nos ayuda a crear contenido de alta calidad y lleno de fe que enseña a los niños sobre el amor de Dios.',
    ogTitleEn: 'Support Selah Kids',
    ogTitleEs: 'Apoya a Selah Kids',
    ogDescriptionEn: "Help us create faith-filled content that teaches children about God's love.",
    ogDescriptionEs: 'Ayúdanos a crear contenido lleno de fe que enseña a los niños sobre el amor de Dios.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/donate',
    robots: 'index,follow',
    focusKeyword: 'support selah kids',
    schemaType: 'WebPage',
    metaTitle: 'Support Selah Kids — Donate',
    metaDescription:
      "Your generosity helps us create high-quality, faith-filled content that teaches children about God's love.",
    ogTitle: 'Support Selah Kids',
    ogDescription: "Help us create faith-filled content that teaches children about God's love.",
  },
  {
    id: '6',
    page: 'Contact',
    path: '/contact',
    icon: '📬',
    metaTitleEn: "Let's Connect — Selah Kids",
    metaTitleEs: 'Conectemos — Selah Kids',
    metaDescriptionEn:
      "We'd love to hear from you! Whether you have a question, want to partner, or just want to say hi.",
    metaDescriptionEs:
      '¡Nos encantaría saber de ti! Ya sea que tengas una pregunta, quieras colaborar, o simplemente quieras saludar.',
    ogTitleEn: "Let's Connect — Selah Kids",
    ogTitleEs: 'Conectemos — Selah Kids',
    ogDescriptionEn: "We'd love to hear from you! Questions, partnerships, or just saying hi.",
    ogDescriptionEs: '¡Nos encantaría saber de ti! Preguntas, colaboraciones, o solo para saludar.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/contact',
    robots: 'index,follow',
    focusKeyword: 'contact selah kids',
    schemaType: 'WebPage',
    metaTitle: "Let's Connect — Selah Kids",
    metaDescription:
      "We'd love to hear from you! Whether you have a question, want to partner, or just want to say hi.",
    ogTitle: "Let's Connect — Selah Kids",
    ogDescription: "We'd love to hear from you! Questions, partnerships, or just saying hi.",
  },
  {
    id: '7',
    page: 'Blog',
    path: '/blog',
    icon: '📝',
    metaTitleEn: 'Blog — Selah Kids',
    metaTitleEs: 'Blog — Selah Kids',
    metaDescriptionEn:
      "Faith-building articles and devotionals for families. Read stories of hope, growth, and God's love.",
    metaDescriptionEs:
      'Artículos y devocionales para construir la fe de las familias. Lee historias de esperanza, crecimiento y el amor de Dios.',
    ogTitleEn: 'Selah Kids Blog',
    ogTitleEs: 'Blog de Selah Kids',
    ogDescriptionEn: 'Faith-building articles and devotionals for the whole family.',
    ogDescriptionEs: 'Artículos y devocionales para construir la fe de toda la familia.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/blog',
    robots: 'index,follow',
    focusKeyword: 'christian family blog',
    schemaType: 'Article',
    metaTitle: 'Blog — Selah Kids',
    metaDescription:
      "Faith-building articles and devotionals for families. Read stories of hope, growth, and God's love.",
    ogTitle: 'Selah Kids Blog',
    ogDescription: 'Faith-building articles and devotionals for the whole family.',
  },
  {
    id: '8',
    page: 'Resources',
    path: '/resources',
    icon: '📚',
    metaTitleEn: 'Free Resources for Families — Selah Kids',
    metaTitleEs: 'Recursos Gratuitos para Familias — Selah Kids',
    metaDescriptionEn:
      'Download printables, coloring pages, and lesson guides to help your kids learn and grow in faith.',
    metaDescriptionEs:
      'Descarga imprimibles, páginas para colorear y guías de lecciones para ayudar a tus hijos a aprender y crecer en la fe.',
    ogTitleEn: 'Free Resources for Families',
    ogTitleEs: 'Recursos Gratuitos para Familias',
    ogDescriptionEn: 'Printables, coloring pages, and lesson guides for kids to learn and grow in faith.',
    ogDescriptionEs: 'Imprimibles, páginas para colorear y guías de lecciones para que los niños aprendan y crezcan en la fe.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/resources',
    robots: 'index,follow',
    focusKeyword: 'christian kids resources',
    schemaType: 'WebPage',
    metaTitle: 'Free Resources for Families — Selah Kids',
    metaDescription:
      'Download printables, coloring pages, and lesson guides to help your kids learn and grow in faith.',
    ogTitle: 'Free Resources for Families',
    ogDescription: 'Printables, coloring pages, and lesson guides for kids to learn and grow in faith.',
  },
  {
    id: '9',
    page: 'Music',
    path: '/music',
    icon: '🎵',
    metaTitleEn: 'Listen to Selah Kids — Christian Kids Music on Spotify & Apple Music',
    metaTitleEs: 'Escucha a Selah Kids — Música Cristiana para Niños en Spotify y Apple Music',
    metaDescriptionEn:
      'Stream original worship songs and Christian kids music from Selah Kids. Perfect for worship, playtime, and bedtime on Spotify, Apple Music, and YouTube.',
    metaDescriptionEs:
      'Escucha canciones de adoración originales y música cristiana para niños de Selah Kids en Spotify, Apple Music y YouTube — para adoración, juego y hora de dormir.',
    ogTitleEn: 'Listen to Selah Kids',
    ogTitleEs: 'Escucha a Selah Kids',
    ogDescriptionEn: 'Worship songs and Christian kids music for the whole family.',
    ogDescriptionEs: 'Canciones de adoración y música cristiana para toda la familia.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/music',
    robots: 'index,follow',
    focusKeyword: 'christian kids music streaming',
    schemaType: 'WebPage',
    metaTitle: 'Listen to Selah Kids — Christian Kids Music on Spotify & Apple Music',
    metaDescription:
      'Stream original worship songs and Christian kids music from Selah Kids. Perfect for worship, playtime, and bedtime on Spotify, Apple Music, and YouTube.',
    ogTitle: 'Listen to Selah Kids',
    ogDescription: 'Worship songs and Christian kids music for the whole family.',
  },
  {
    id: '10',
    page: 'Sensory',
    path: '/sensory',
    icon: '✨',
    metaTitleEn: 'Sensory-Friendly Worship for Kids — Selah Kids',
    metaTitleEs: 'Adoración Sensorial para Niños — Selah Kids',
    metaDescriptionEn:
      'Calm, low-stimulation worship videos made for sensory-sensitive kids. Gentle visuals, soft sound, and scripture-based songs the whole family can share.',
    metaDescriptionEs:
      'Videos de adoración calmados y de baja estimulación para niños con sensibilidad sensorial. Imágenes suaves, sonido delicado y canciones bíblicas para toda la familia.',
    ogTitleEn: 'Sensory-Friendly Worship for Kids',
    ogTitleEs: 'Adoración Sensorial para Niños',
    ogDescriptionEn: 'Calm worship videos designed for sensory-sensitive kids.',
    ogDescriptionEs: 'Videos de adoración calmados para niños con sensibilidad sensorial.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/sensory',
    robots: 'index,follow',
    focusKeyword: 'sensory worship kids',
    schemaType: 'WebPage',
    metaTitle: 'Sensory-Friendly Worship for Kids — Selah Kids',
    metaDescription:
      'Calm, low-stimulation worship videos made for sensory-sensitive kids. Gentle visuals, soft sound, and scripture-based songs the whole family can share.',
    ogTitle: 'Sensory-Friendly Worship for Kids',
    ogDescription: 'Calm worship videos designed for sensory-sensitive kids.',
  },
  {
    id: '11',
    page: 'Characters',
    path: '/characters',
    icon: '🧑‍🤝‍🧑',
    metaTitleEn: 'Meet the Selah Kids Characters — Libni, Andy & Shiloh',
    metaTitleEs: 'Conoce a los Personajes de Selah Kids — Libni, Andy y Shiloh',
    metaDescriptionEn:
      'Meet Libni, Andy, Shiloh, and the friends who bring every Selah Kids song and story to life. Read each character’s story, favorite verse, and episodes.',
    metaDescriptionEs:
      'Conoce a Libni, Andy, Shiloh y a los amigos que dan vida a cada canción e historia de Selah Kids. Lee la historia, versículo favorito y episodios de cada personaje.',
    ogTitleEn: 'Meet the Selah Kids Characters',
    ogTitleEs: 'Conoce a los Personajes de Selah Kids',
    ogDescriptionEn: 'Meet the crew who bring our songs to life.',
    ogDescriptionEs: 'Conoce al equipo que da vida a nuestras canciones.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/characters',
    robots: 'index,follow',
    focusKeyword: 'christian kids cartoon characters',
    schemaType: 'WebPage',
    metaTitle: 'Meet the Selah Kids Characters — Libni, Andy & Shiloh',
    metaDescription:
      'Meet Libni, Andy, Shiloh, and the friends who bring every Selah Kids song and story to life. Read each character’s story, favorite verse, and episodes.',
    ogTitle: 'Meet the Selah Kids Characters',
    ogDescription: 'Meet the crew who bring our songs to life.',
  },
  {
    id: '12',
    page: 'Privacy',
    path: '/privacy',
    icon: '🛡️',
    metaTitleEn: 'Privacy Policy — Selah Kids',
    metaTitleEs: 'Política de Privacidad — Selah Kids',
    metaDescriptionEn:
      "How Selah Kids collects, uses, and protects information from children and families. Read our full privacy policy.",
    metaDescriptionEs:
      'Cómo Selah Kids recopila, usa y protege la información de niños y familias. Lee nuestra política de privacidad completa.',
    ogTitleEn: 'Privacy Policy — Selah Kids',
    ogTitleEs: 'Política de Privacidad — Selah Kids',
    ogDescriptionEn: 'How we protect your family’s privacy on Selah Kids.',
    ogDescriptionEs: 'Cómo protegemos la privacidad de tu familia en Selah Kids.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/privacy',
    robots: 'index,follow',
    focusKeyword: 'privacy policy',
    schemaType: 'WebPage',
    metaTitle: 'Privacy Policy — Selah Kids',
    metaDescription:
      "How Selah Kids collects, uses, and protects information from children and families. Read our full privacy policy.",
    ogTitle: 'Privacy Policy — Selah Kids',
    ogDescription: 'How we protect your family’s privacy on Selah Kids.',
  },
  {
    id: '13',
    page: 'Terms',
    path: '/terms',
    icon: '📄',
    metaTitleEn: 'Terms of Service — Selah Kids',
    metaTitleEs: 'Términos de Servicio — Selah Kids',
    metaDescriptionEn:
      'The terms that govern your use of the Selah Kids website, videos, music, and resources.',
    metaDescriptionEs:
      'Los términos que rigen el uso del sitio web, videos, música y recursos de Selah Kids.',
    ogTitleEn: 'Terms of Service — Selah Kids',
    ogTitleEs: 'Términos de Servicio — Selah Kids',
    ogDescriptionEn: 'Terms of service for using Selah Kids.',
    ogDescriptionEs: 'Términos de servicio para usar Selah Kids.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/terms',
    robots: 'index,follow',
    focusKeyword: 'terms of service',
    schemaType: 'WebPage',
    metaTitle: 'Terms of Service — Selah Kids',
    metaDescription:
      'The terms that govern your use of the Selah Kids website, videos, music, and resources.',
    ogTitle: 'Terms of Service — Selah Kids',
    ogDescription: 'Terms of service for using Selah Kids.',
  },
];

export const SITE_ORIGIN = 'https://selahkids.com';
