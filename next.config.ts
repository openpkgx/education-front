import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: false, // 关闭严格模式
  // basePath: '/education',
  // assetPrefix: '/education', // 设置静态资源的前缀路径
  eslint: {
    // 在生产环境中禁用 ESLint
    ignoreDuringBuilds: true,
  },
  // async headers() {
  //   return [
  //     {
  //       // 匹配所有 API 路由
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "*" }, // 允许所有域名访问
  //         { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
  //         { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;