// lib/data/contestants.ts
// Server-side data fetching helpers (uses lib/supabase/server.ts)

import { createClient } from "@/lib/supabase/server";
import type { Contestant, ContestantStat, Highlight, Season, ContestantWithStats } from "@/lib/types";

export async function getContestantById(id: string): Promise<ContestantWithStats | null> {
  const supabase = createClient();

  const { data: contestant, error } = await supabase
    .from("contestants")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error || !contestant) return null;

  const [statsRes, seasonRes, highlightsRes, partnerRes] = await Promise.all([
    supabase.from("contestant_stats").select("*").eq("contestant_id", id).maybeSingle(),
    supabase.from("seasons").select("*").eq("id", contestant.season_id).maybeSingle(),
    supabase
      .from("highlights")
      .select("*")
      .eq("contestant_id", id)
      .order("sort_order", { ascending: true }),
    contestant.partner_id
      ? supabase
          .from("contestants")
          .select("id, name, name_initial, portrait_color")
          .eq("id", contestant.partner_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  return {
    ...(contestant as Contestant),
    stats: (statsRes.data as ContestantStat) ?? null,
    season: (seasonRes.data as Season) ?? null,
    highlights: (highlightsRes.data as Highlight[]) ?? [],
    partner: (partnerRes.data as Pick<Contestant, "id" | "name" | "name_initial" | "portrait_color">) ?? null,
  };
}

export async function getContestantsBySeason(seasonId: number): Promise<ContestantWithStats[]> {
  const supabase = createClient();

  const [contestantsRes, seasonRes] = await Promise.all([
    supabase
      .from("contestants")
      .select("*")
      .eq("season_id", seasonId)
      .eq("is_published", true)
      .order("appearance_order", { ascending: true }),
    supabase.from("seasons").select("*").eq("id", seasonId).maybeSingle(),
  ]);

  if (!contestantsRes.data) return [];

  const ids = contestantsRes.data.map((c) => c.id);
  const [statsRes, highlightsRes] = await Promise.all([
    supabase.from("contestant_stats").select("*").in("contestant_id", ids),
    supabase
      .from("highlights")
      .select("*")
      .in("contestant_id", ids)
      .order("sort_order", { ascending: true }),
  ]);

  const statsMap = new Map<string, ContestantStat>();
  for (const s of statsRes.data ?? []) statsMap.set(s.contestant_id, s as ContestantStat);

  const highlightsMap = new Map<string, Highlight[]>();
  for (const h of highlightsRes.data ?? []) {
    const list = highlightsMap.get(h.contestant_id) ?? [];
    list.push(h as Highlight);
    highlightsMap.set(h.contestant_id, list);
  }

  const partnerIds = contestantsRes.data
    .map((c) => c.partner_id)
    .filter((id): id is string => id != null);
  let partnerMap = new Map<string, Pick<Contestant, "id" | "name" | "name_initial" | "portrait_color">>();
  if (partnerIds.length > 0) {
    const { data: partners } = await supabase
      .from("contestants")
      .select("id, name, name_initial, portrait_color")
      .in("id", partnerIds);
    for (const p of partners ?? []) {
      partnerMap.set(p.id, p as Pick<Contestant, "id" | "name" | "name_initial" | "portrait_color">);
    }
  }

  return (contestantsRes.data as Contestant[]).map((c) => ({
    ...c,
    stats: statsMap.get(c.id) ?? null,
    season: (seasonRes.data as Season) ?? null,
    highlights: highlightsMap.get(c.id) ?? [],
    partner: c.partner_id ? partnerMap.get(c.partner_id) ?? null : null,
  }));
}

export async function getFeaturedContestants(limit = 8): Promise<ContestantWithStats[]> {
  // Latest published contestants with stats — used on home
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contestants")
    .select("*, contestant_stats(*), season:seasons(*)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as any[]).map((row) => ({
    ...(row as Contestant),
    stats: (row.contestant_stats as ContestantStat) ?? null,
    season: (row.season as Season) ?? null,
    highlights: [],
    partner: null,
  }));
}

export async function getRecentNews(limit = 6): Promise<ContestantWithStats[]> {
  // Contestants with recent_news filled — used for "최근 근황" widget on home
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contestants")
    .select("*, season:seasons(*)")
    .eq("is_published", true)
    .not("recent_news", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as any[]).map((row) => ({
    ...(row as Contestant),
    stats: null,
    season: (row.season as Season) ?? null,
    highlights: [],
    partner: null,
  }));
}
