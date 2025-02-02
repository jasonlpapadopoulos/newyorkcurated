/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false; // Fully disable eval() in production
    }

    // Ensure Webpack minimizes everything and avoids eval()
    config.optimization = {
      ...config.optimization,
      minimize: true, // Minify everything (but no usedExports)
    };

    return config;
  },
  experimental: {
    optimizeCss: false, // Prevents eval() from sneaking into styles
  },
};

module.exports = nextConfig;