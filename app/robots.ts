// app/robots.ts
// Googlebot/Naverbot 등 검색엔진 크롤러가 읽는 robots.txt.
// next build 시 /robots.txt 로 노출.

import type { MetadataRoute } from "next";

const PRODUCTION_URL = "https://lehemes.app";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_URL).replace(/\/$/, "");

  return {
    rules: [
      {
        // 일반 봇: 사이트 전체 허용
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/preview/", "/_next/"],
      },
      {
        // Google: 광고/이미지 봇도 명시적으로 허용 (이미지 검색 노출 도움)
        userAgent: "Googlebot-Image",
        allow: "/",
      },
    ],
    sitemap: [
      `${base}/sitemap.xml`,
      // (선택) 네이버 신디케이션용 별도 sitemap이 있으면 여기 추가
    ],
    host: base,
  };
}
