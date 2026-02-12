/** @type {import('next').NextConfig} */
const isCapacitor = process.env.CAPACITOR_BUILD === 'true';

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
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/:path*`,
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
