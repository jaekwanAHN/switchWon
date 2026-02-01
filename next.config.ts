import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // 프론트엔드에서 /api/... 로 요청하면
        destination: "https://exchange-example.switchflow.biz/:path*", // 백엔드 서버로 연결해줍니다.
      },
    ];
  },
};

export default nextConfig;
