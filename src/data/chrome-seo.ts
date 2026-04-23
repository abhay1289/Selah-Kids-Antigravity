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
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonical: string;
  robots: RobotsDirective;
  focusKeyword: string;
  schemaType: SchemaType;
}

export const INITIAL_SEO_PAGES: PageSEO[] = [
  {
    id: '1',
    page: 'Homepage',
    path: '/',
    icon: '🏠',
    metaTitle: 'Selah Kids — Christian Music & Cartoons for Kids',
    metaDescription:
      'Welcome to Selah Kids! We create original worship songs and Christian cartoons that the whole family will love. Faith-filled music in English & Spanish.',
    ogTitle: 'Selah Kids — Faith-Filled Music for Little Ones',
    ogDescription: 'Original worship songs and Christian cartoons for the whole family!',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/',
    robots: 'index,follow',
    focusKeyword: 'christian kids music',
    schemaType: 'Organization',
  },
  {
    id: '2',
    page: 'About',
    path: '/about',
    icon: '📖',
    metaTitle: 'Our Story — Selah Kids',
    metaDescription:
      'We are parents and creators on a mission to fill every home with faith-filled melodies that spark wonder in the hearts of children.',
    ogTitle: 'The Selah Kids Story',
    ogDescription: 'Parents and creators on a mission to fill every home with faith-filled melodies.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/about',
    robots: 'index,follow',
    focusKeyword: 'selah kids story',
    schemaType: 'WebPage',
  },
  {
    id: '3',
    page: 'Watch',
    path: '/watch',
    icon: '🎬',
    metaTitle: 'Watch — Christian Kids Videos | Selah Kids',
    metaDescription:
      "Sing, dance, and learn about God's love with our collection of high-quality Christian kids videos in English and Spanish.",
    ogTitle: 'Watch Selah Kids Videos',
    ogDescription: "High-quality Christian kids videos — sing, dance, and learn about God's love!",
    ogImage: '/thumb-i-am-blessed-en.jpg',
    canonical: 'https://selahkids.com/watch',
    robots: 'index,follow',
    focusKeyword: 'christian kids videos',
    schemaType: 'VideoObject',
  },
  {
    id: '4',
    page: 'Families',
    path: '/parents',
    icon: '👨‍👩‍👧‍👦',
    metaTitle: 'For Families — Selah Kids',
    metaDescription:
      "We created Selah Kids because we're parents too. Safe, faith-filled media designed to nurture children wholistically.",
    ogTitle: 'Built for Kids. Trusted by Parents.',
    ogDescription: 'Safe, faith-filled media designed to nurture children — spirit, mind, and heart.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/parents',
    robots: 'index,follow',
    focusKeyword: 'safe christian content kids',
    schemaType: 'WebPage',
  },
  {
    id: '5',
    page: 'Donate',
    path: '/donate',
    icon: '💝',
    metaTitle: 'Support Selah Kids — Donate',
    metaDescription:
      "Your generosity helps us create high-quality, faith-filled content that teaches children about God's love.",
    ogTitle: 'Support Selah Kids',
    ogDescription: "Help us create faith-filled content that teaches children about God's love.",
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/donate',
    robots: 'index,follow',
    focusKeyword: 'support selah kids',
    schemaType: 'WebPage',
  },
  {
    id: '6',
    page: 'Contact',
    path: '/contact',
    icon: '📬',
    metaTitle: "Let's Connect — Selah Kids",
    metaDescription:
      "We'd love to hear from you! Whether you have a question, want to partner, or just want to say hi.",
    ogTitle: "Let's Connect — Selah Kids",
    ogDescription: "We'd love to hear from you! Questions, partnerships, or just saying hi.",
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/contact',
    robots: 'index,follow',
    focusKeyword: 'contact selah kids',
    schemaType: 'WebPage',
  },
  {
    id: '7',
    page: 'Blog',
    path: '/blog',
    icon: '📝',
    metaTitle: 'Blog — Selah Kids',
    metaDescription:
      "Faith-building articles and devotionals for families. Read stories of hope, growth, and God's love.",
    ogTitle: 'Selah Kids Blog',
    ogDescription: 'Faith-building articles and devotionals for the whole family.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/blog',
    robots: 'index,follow',
    focusKeyword: 'christian family blog',
    schemaType: 'Article',
  },
  {
    id: '8',
    page: 'Resources',
    path: '/resources',
    icon: '📚',
    metaTitle: 'Free Resources for Families — Selah Kids',
    metaDescription:
      'Download printables, coloring pages, and lesson guides to help your kids learn and grow in faith.',
    ogTitle: 'Free Resources for Families',
    ogDescription: 'Printables, coloring pages, and lesson guides for kids to learn and grow in faith.',
    ogImage: '/SK_Logo_FN.png',
    canonical: 'https://selahkids.com/resources',
    robots: 'index,follow',
    focusKeyword: 'christian kids resources',
    schemaType: 'WebPage',
  },
];

export const SITE_ORIGIN = 'https://selahkids.com';
