/** @type {import('next').NextConfig} */
const isCapacitor = process.env.CAPACITOR_BUILD === 'true';

// Backend base URL (without /api/v1 suffix)
const BACKEND_HOST = process.env.BACKEND_URL || 'http://localhost:4000';

const nextConfig = {
  reactStrictMode: true,

  // Static export for Capacitor (iOS/Android)
  ...(isCapacitor && {
    output: 'export',
    images: { unoptimized: true },
  }),

  // Rewrites and headers only work in server mode (not static export)
  ...(!isCapacitor && {
    async rewrites() {
      return [
        {
          source: '/api/v1/:path*',
          destination: `${BACKEND_HOST}/api/v1/:path*`,
        },
      ];
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          ],
        },
      ];
    },
  }),
};

module.exports = nextConfig;
