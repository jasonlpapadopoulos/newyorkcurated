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
  }
};

module.exports = nextConfig;