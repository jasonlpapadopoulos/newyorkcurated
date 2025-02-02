/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false;
    }

    config.optimization = {
      ...config.optimization,
      minimize: true,
    };

    return config;
  },
  // Ensure CSS modules are handled correctly
  cssModules: true,
  // Enable CSS optimization
  optimizeCss: true,
  // Configure output directory for Netlify
  distDir: '.next',
  // Configure asset prefix for static files
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  // Configure rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;