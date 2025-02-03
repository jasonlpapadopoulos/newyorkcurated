/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true, // Ensures consistent URLs
  output: "standalone", // Forces SSR pages to be treated as standalone functions for Netlify
  webpack: (config, { dev }) => {
    if (!dev) config.devtool = false;
    config.optimization = { ...config.optimization, minimize: true };
    return config;
  },
};

module.exports = nextConfig;
