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
    minimumCacheTTL: 31536000,
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
