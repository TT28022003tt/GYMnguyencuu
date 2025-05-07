import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.pexels.com','app.cdn.chative.io'],
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
