import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  allowedDevOrigins: ['192.168.36.12', '192.168.1.16'],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
