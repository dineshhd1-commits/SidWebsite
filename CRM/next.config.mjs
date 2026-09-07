/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uidgthafelsbxusyxffd.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*\\.(?:jpg|jpeg|png|webp|avif|gif|svg|ico|woff|woff2|ttf|eot))',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },
  async rewrites() {
    const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'http://localhost:3000';
    return [
      {
        source: '/decotion/:path*',
        destination: `${mainSiteUrl}/decotion/:path*`,
      },
      {
        source: '/packages/:path*',
        destination: `${mainSiteUrl}/packages/:path*`,
      },
      {
        source: '/catering/:path*',
        destination: `${mainSiteUrl}/catering/:path*`,
      },
      {
        source: '/services/:path*',
        destination: `${mainSiteUrl}/services/:path*`,
      },
      {
        source: '/candid-photography/:path*',
        destination: `${mainSiteUrl}/candid-photography/:path*`,
      },
      {
        source: '/pre-wedding shoot/:path*',
        destination: `${mainSiteUrl}/pre-wedding%20shoot/:path*`,
      },
      {
        source: '/wedding photography/:path*',
        destination: `${mainSiteUrl}/wedding%20photography/:path*`,
      },
      {
        source: '/forest-pre-wedding-shoot/:path*',
        destination: `${mainSiteUrl}/forest-pre-wedding-shoot/:path*`,
      },
    ];
  },
};

export default nextConfig;
