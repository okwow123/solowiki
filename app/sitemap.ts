// app/sitemap.ts
import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = createClient();

  const [seasonsRes, contestantsRes] = await Promise.all([
    supabase.from("seasons").select("number, updated_at").eq("is_published", true),
    supabase.from("contestants").select("id, updated_at").eq("is_published", true),
  ]);

  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/works`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/search`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const seasonPages = (seasonsRes.data ?? []).map((s) => ({
    url: `${base}/works/${s.number}`,
    lastModified: new Date(s.updated_at ?? now),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const communityPages = (seasonsRes.data ?? []).map((s) => ({
    url: `${base}/community/${s.number}`,
    lastModified: new Date(s.updated_at ?? now),
    changeFrequency: "hourly" as const,
    priority: 0.6,
  }));

  const contestantPages = (contestantsRes.data ?? []).map((c) => ({
    url: `${base}/contestants/${c.id}`,
    lastModified: new Date(c.updated_at ?? now),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...seasonPages, ...communityPages, ...contestantPages];
}
