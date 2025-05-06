import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.pexels.com'],
  },
  typescript: {
    ignoreBuildErrors: true, // Bỏ qua lỗi TypeScript khi build
  },
  eslint: {
    ignoreDuringBuilds: true, // Bỏ qua lỗi ESLint khi build
  },
};

export default nextConfig;
