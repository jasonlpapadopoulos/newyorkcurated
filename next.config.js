/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = 'source-map'; // Avoids using eval() in production
    }
    return config;
  },
};

module.exports = nextConfig;
