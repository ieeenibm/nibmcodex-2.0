import type { NextConfig } from "next";
import os from "os";

function getLocalDevOrigins(): string[] {
  const defaults = ["localhost", "127.0.0.1", "192.168.137.87", "192.168.36.12"];
  try {
    const interfaces = os.networkInterfaces();
    const dynamicIps = Object.values(interfaces)
      .flat()
      .filter((i): i is os.NetworkInterfaceInfo => Boolean(i && i.family === "IPv4" && !i.internal))
      .map((i) => i.address);
    return Array.from(new Set([...defaults, ...dynamicIps]));
  } catch {
    return defaults;
  }
}

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
  async redirects() {
    return [
      {
        source: '/rules',
        destination: '/rulebook',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/rulebook.pdf',
        destination: '/NIBMCodex2.0_Rulebook_VF.pdf',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'jwuioa0d',
  },
  allowedDevOrigins: getLocalDevOrigins(),
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
