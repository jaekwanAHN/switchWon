import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://exchange-example.switchflow.biz/:path*",
      },
    ];
  },
};

export default nextConfig;
