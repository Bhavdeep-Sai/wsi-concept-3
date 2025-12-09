import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // This is needed for Docker standalone output
  output: 'standalone',
};

export default nextConfig;
