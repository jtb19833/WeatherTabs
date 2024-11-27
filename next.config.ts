import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ]
  },
  output:"export",
  reactStrictMode: true,
  basePath: "/WeatherTabs",

};



export default nextConfig;
