/** @type {import('next').NextConfig} */
const nextConfig = {
  // Trims barrel-file resolution for these libraries so dev/build compiles
  // and the client bundle only include the specific icons/exports actually
  // imported, instead of pulling in the whole package.
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // NOT a long value on purpose: this project regularly swaps catering/
    // gallery photos under the *same* filename (e.g. public/catering/paan__
    // sweet-paan.jpg), and Next's image optimizer caches by URL rather than
    // file content - a long TTL here means both Vercel's CDN and visitors'
    // browsers would keep serving the old bytes for that whole duration
    // after a same-name replacement. A day is still a solid cache win
    // without that staleness trap.
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
  // Fonts are self-hosted via next/font/google (built at compile time, no
  // runtime request to fonts.googleapis.com), so the CSP below doesn't need
  // a font-src exception. The only external network target the app actually
  // talks to is Supabase (REST + Storage, both over HTTPS) - everything
  // else (WhatsApp) is a plain <a>/window.open() navigation, which CSP's
  // connect-src doesn't govern.
  async headers() {
    const csp = [
      "default-src 'self'",
      // Next.js needs 'unsafe-inline' for its own hydration/RSC bootstrap
      // scripts and 'unsafe-eval' in dev; no external script hosts are used
      // anywhere in this app (no Google Maps JS SDK, no analytics tag), so
      // both remain scoped to 'self' otherwise.
      "script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV !== 'production' ? " 'unsafe-eval'" : ''),
      "worker-src 'self' blob:",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://plus.unsplash.com",
      "font-src 'self' data:",
      "connect-src 'self' blob: data: https://*.supabase.co",
      "frame-src 'self' https://maps.google.com https://www.google.com https://maps.googleapis.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
};

export default nextConfig;
