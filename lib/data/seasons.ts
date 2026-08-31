// lib/data/seasons.ts
import { createClient } from "@/lib/supabase/server";
import type { Season } from "@/lib/types";

export async function getAllSeasons(): Promise<Season[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_published", true)
    .order("number", { ascending: true });

  if (error || !data) return [];
  return data as Season[];
}

export async function getSeasonByNumber(number: number): Promise<Season | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("number", number)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as Season;
}

export async function getContestantCountBySeason(): Promise<Map<number, number>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contestants")
    .select("season_id")
    .eq("is_published", true);

  if (error || !data) return new Map();

  const map = new Map<number, number>();
  for (const row of data) {
    map.set(row.season_id, (map.get(row.season_id) ?? 0) + 1);
  }
  return map;
}
