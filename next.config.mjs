/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  experimental: {
    typedRoutes: false,
  },
  // 르헤메스 리브랜드: /seasons → /works 영구 리다이렉트
  async redirects() {
    return [
      { source: "/seasons", destination: "/works", permanent: true },
      { source: "/seasons/:number", destination: "/works/:number", permanent: true },
    ];
  },
};

export default nextConfig;
