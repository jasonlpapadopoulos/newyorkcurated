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
}

module.exports = nextConfig