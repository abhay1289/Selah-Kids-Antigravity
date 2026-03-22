/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Compress all responses
  compress: true,

  // Disable X-Powered-By header
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24h
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [32, 64, 128, 256],
  },

  // Disable source maps in production (faster builds, smaller output)
  productionBrowserSourceMaps: false,

  // Experimental: optimise package imports (tree-shake lucide-react & framer-motion)
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Disable Next.js telemetry
  telemetry: false,
};

export default nextConfig;
