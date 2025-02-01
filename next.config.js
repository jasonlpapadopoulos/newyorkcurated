/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
              "script-src * 'unsafe-inline' 'unsafe-eval'",
              "style-src * 'unsafe-inline'",
              "img-src * data: blob:",
              "font-src * data:",
              "connect-src *",
              "media-src *"
            ].join('; ')
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   webpack: (config, { dev }) => {
//     if (!dev) {
//       config.devtool = 'source-map'; // Avoids using eval() in production
//     }
//     return config;
//   },
// };

// module.exports = nextConfig;
