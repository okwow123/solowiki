// app/sitemap.ts
// Google Search Console / Naver Search Advisor 등 검색엔진이 사용하는 sitemap.
// 자동 생성: next build 시 /sitemap.xml 으로 노출.

import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

const PRODUCTION_URL = "https://lehemes.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 운영 도메인 사용. Vercel env에 NEXT_PUBLIC_SITE_URL 세팅 시 그 값 우선.
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_URL).replace(/\/$/, "");
  const supabase = createClient();

  // 작품(시리즈) + 출연자 + 커뮤니티 + 검색 데이터 병렬 조회
  const [seasonsRes, contestantsRes] = await Promise.all([
    supabase
      .from("seasons")
      .select("number, kind, updated_at, created_at")
      .eq("is_published", true)
      .order("number", { ascending: true }),
    supabase
      .from("contestants")
      .select("id, updated_at, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(5000),
  ]);

  const now = new Date();

  // === 정적 페이지 ===
  const staticPages: MetadataRoute.Sitemap = [
    // 홈 (최우선)
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    // 작품 도감 (전체)
    {
      url: `${base}/works`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    // 카테고리별 작품 도감
    {
      url: `${base}/works?kind=variety`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/works?kind=movie`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/works?kind=drama`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/works?kind=anime`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // 검색
    {
      url: `${base}/search`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // 운영 원칙 / 저작권
    {
      url: `${base}/legal`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // === 작품(시리즈) 상세 — 33기 + 영화/드라마 ===
  const seasonPages: MetadataRoute.Sitemap = (seasonsRes.data ?? []).map((s) => {
    // 마지막 수정일: updated_at > created_at
    const lastMod = new Date(s.updated_at ?? s.created_at ?? now);
    // 예능(33기)은 자주 갱신, 영화/드라마는 덜
    const freq: MetadataRoute.Sitemap[number]["changeFrequency"] =
      s.kind === "variety" ? "weekly" : "monthly";
    return {
      url: `${base}/works/${s.number}`,
      lastModified: lastMod,
      changeFrequency: freq,
      priority: 0.7,
    };
  });

  // === 작품별 커뮤니티 (예능 한정, 33기) ===
  const varietySeasons = (seasonsRes.data ?? []).filter((s) => s.kind === "variety");
  const communityPages: MetadataRoute.Sitemap = varietySeasons.map((s) => {
    // 커뮤니티는 실시간 활동이 많으므로 짧은 주기
    const lastMod = new Date(s.updated_at ?? s.created_at ?? now);
    return {
      url: `${base}/community/${s.number}`,
      lastModified: lastMod,
      changeFrequency: "hourly",
      priority: 0.6,
    };
  });

  // === 캐릭터 상세 ===
  const contestantPages: MetadataRoute.Sitemap = (contestantsRes.data ?? []).map((c) => {
    const lastMod = new Date(c.updated_at ?? c.created_at ?? now);
    return {
      url: `${base}/contestants/${c.id}`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.6,
    };
  });

  return [
    ...staticPages,
    ...seasonPages,
    ...communityPages,
    ...contestantPages,
  ];
}
