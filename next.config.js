// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Jika bukan di server (yaitu di browser), tambahkan fallback
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }

    // Tambahkan transpilePackages untuk jsPDF
    config.module = {
      ...config.module,
      exprContextCritical: false, // Mematikan warning ekspor konteks
    };

    return config;
  },
  transpilePackages: ["jspdf"],
};

module.exports = nextConfig;
