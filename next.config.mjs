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
};

export default nextConfig;
