import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Workspace packages ship compiled ESM; Next still needs to process them
  // because they are resolved through node_modules symlinks.
  transpilePackages: ['@dolmir/ai-core', '@dolmir/rfq-engine', '@dolmir/workflows'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // www → apex. Vercel handles this at the domain layer once www.dolmir.com is
  // added to the project (see docs/DA-COMPLETARE.md §6); this keeps a single
  // canonical host even if the domain is added without the redirect option.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.dolmir.com' }],
        destination: 'https://dolmir.com/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
