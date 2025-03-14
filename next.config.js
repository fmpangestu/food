/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Resolve fs and other Node.js modules for client components
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
    };
    return config;
  },
};

module.exports = nextConfig;
