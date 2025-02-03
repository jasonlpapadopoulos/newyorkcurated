/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  output: 'standalone',
  webpack: (config, { dev }) => {
    if (!dev) config.devtool = false;
    config.optimization = { ...config.optimization, minimize: true };
    return config;
  },
  // Add Leaflet CSS to allowed domains
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: *.unsplash.com *.basemaps.cartocdn.com *.cloudflare.com *.leafletjs.com; img-src 'self' data: blob: *.unsplash.com *.basemaps.cartocdn.com;"
          }
        ]
      }
    ];
  }
}

module.exports = nextConfig