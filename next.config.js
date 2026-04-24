import path from 'node:path';

// Build-time env var guard.
//
// In production, the CMS is the source of truth — missing Supabase env vars
// would cause the public site to render offline-mode fallbacks (seed data).
// Fail the build before that silent regression can reach production.
//
// VERCEL_ENV distinguishes 'production' from 'preview' / 'development'. The
// guard only trips on real production promotions, so preview deploys can
// boot without a DB (useful for design review on a not-yet-seeded stack).
// Local `next build` still enforces the check via NODE_ENV when VERCEL_ENV
// is absent, so devs don't accidentally ship a DB-less prod build.
const isRealProdBuild =
  process.env.VERCEL_ENV === 'production' ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production');
if (isRealProdBuild) {
  const missing = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (missing.length) {
    throw new Error(
      `Production build aborted — missing Supabase env vars: ${missing.join(', ')}.\n` +
        `Set them in the deploy environment. For a preview deploy without a DB, ` +
        `Vercel sets VERCEL_ENV=preview which bypasses this guard.`,
    );
  }
}

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  outputFileTracingRoot: path.resolve('.'),
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 60, 72, 85],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [32, 64, 128, 256],
  },
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  /**
   * Defensive 301 redirects for the selahkids.com domain migration.
   *
   * There's no live old site to scrape a URL inventory from (Wayback has
   * only a single 2024 snapshot and current DNS is unpointed), so this
   * list targets the URL shapes legacy platforms (Squarespace, Wix,
   * WordPress, hand-rolled static sites) commonly expose. Better to
   * have these in place on day one than to discover broken inbound
   * links via Search Console a month later.
   *
   * These run BEFORE the locale middleware, so the destination is the
   * locale-less logical path — middleware will re-redirect to
   * /{en,es}/{path} using Accept-Language negotiation.
   */
  async redirects() {
    return [
      // Homepage synonyms
      { source: '/home', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/home.html', destination: '/', permanent: true },

      // About synonyms
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/our-story', destination: '/about', permanent: true },
      { source: '/story', destination: '/about', permanent: true },

      // Content verticals
      { source: '/videos', destination: '/watch', permanent: true },
      { source: '/video', destination: '/watch', permanent: true },
      { source: '/episodes', destination: '/watch', permanent: true },
      { source: '/songs', destination: '/music', permanent: true },
      { source: '/listen', destination: '/music', permanent: true },
      { source: '/album', destination: '/music', permanent: true },
      { source: '/albums', destination: '/music', permanent: true },
      { source: '/posts', destination: '/blog', permanent: true },
      { source: '/news', destination: '/blog', permanent: true },
      { source: '/articles', destination: '/blog', permanent: true },
      { source: '/shop', destination: '/resources', permanent: true },
      { source: '/store', destination: '/resources', permanent: true },
      { source: '/downloads', destination: '/resources', permanent: true },
      { source: '/printables', destination: '/resources', permanent: true },

      // Contact + donate synonyms
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/get-in-touch', destination: '/contact', permanent: true },
      { source: '/support', destination: '/donate', permanent: true },
      { source: '/give', destination: '/donate', permanent: true },
      { source: '/giving', destination: '/donate', permanent: true },

      // Privacy + terms synonyms
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-of-service', destination: '/terms', permanent: true },
      { source: '/terms-and-conditions', destination: '/terms', permanent: true },
      { source: '/tos', destination: '/terms', permanent: true },

      // Strip .html / .php suffixes so legacy static/WordPress URLs resolve
      { source: '/:path*.html', destination: '/:path*', permanent: true },
      { source: '/:path*.php', destination: '/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
