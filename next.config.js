import path from 'node:path';

// Build-time env var guard.
//
// In production, the CMS is the source of truth — missing Supabase env vars
// would cause the public site to render offline-mode fallbacks (today: empty
// arrays, because fallbacks.ts is populated per-phase). Fail the build
// before that silent regression can reach production.
//
// We DO NOT connect to Supabase at build time. That would force CI to have a
// network path to the DB and would break preview deploys. Empty-DB cases are
// handled at runtime by cms-server.ts throwing EmptyCmsError, which trips
// the first server render after deploy so rollout fails loudly.
if (process.env.NODE_ENV === 'production') {
  const missing = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (missing.length) {
    throw new Error(
      `Production build aborted — missing Supabase env vars: ${missing.join(', ')}.\n` +
        `Set them in the deploy environment. For a dev-only build without a DB, run with NODE_ENV=development.`,
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
};

export default nextConfig;
