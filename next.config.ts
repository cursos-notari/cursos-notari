import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sandbox.api.pagseguro.com',
        port: '',
        pathname: '/qrcode/**',
      },
    ],
  },
  cacheComponents: true,
};

export default nextConfig;