import path from 'node:path';

// Build-time env var check.
//
// In production, the CMS is the source of truth. Without Supabase env vars
// the public site falls back to bundled seed data (offline mode). For the
// pre-launch phase we accept that fallback so the domain can be wired up
// before the DB is provisioned — but we log a loud warning so it can't be
// missed in the build output. Once Supabase is set in the Vercel project,
// the warning disappears.
const isProdLike =
  process.env.VERCEL_ENV === 'production' ||
  (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production');
if (isProdLike) {
  const missing = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn(
      `\n⚠️  Production build proceeding WITHOUT Supabase env vars: ${missing.join(', ')}.\n` +
        `   The site will render offline-mode (seed) content until these are set.\n` +
        `   Add them in Vercel → Project → Settings → Environment Variables.\n`,
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

      // Contact synonyms
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/get-in-touch', destination: '/contact', permanent: true },

      // Donate page is paused (not permanently retired) — every donate-
      // shaped URL lands on /contact for now. Temporary (307) so that
      // browsers and search engines don't cache this forever; if
      // donations are restored later we just delete the rule and the
      // /donate page picks up its own canonical again. Locale-aware
      // variants cover /en/donate and /es/donate which would otherwise
      // skip the apex-only redirects above.
      { source: '/donate', destination: '/contact', permanent: false },
      { source: '/donate/:path*', destination: '/contact', permanent: false },
      { source: '/:locale(en|es)/donate', destination: '/:locale/contact', permanent: false },
      { source: '/:locale(en|es)/donate/:path*', destination: '/:locale/contact', permanent: false },
      { source: '/support', destination: '/contact', permanent: false },
      { source: '/give', destination: '/contact', permanent: false },
      { source: '/giving', destination: '/contact', permanent: false },

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
