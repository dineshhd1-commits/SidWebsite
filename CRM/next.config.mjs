/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
    ];
  },
};

export default nextConfig;
