import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  productionBrowserSourceMaps: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudflare-image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "howtoaiworld.com",
      },
    ],
  },
};

export default nextConfig;