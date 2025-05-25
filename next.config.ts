import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/color-harmony-checker',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
