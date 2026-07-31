import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
  },
  allowedDevOrigins: ['192.168.36.12'],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
