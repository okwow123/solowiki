// lib/data/posts.ts
import { createClient } from "@/lib/supabase/server";
import type { Post, PostWithRefs } from "@/lib/types";

export async function getPostsBySeason(seasonId: number, limit = 50): Promise<PostWithRefs[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, season:seasons(id, number, title), contestant:contestants(id, name, name_initial, portrait_color)")
    .eq("season_id", seasonId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as PostWithRefs[];
}

export async function getRecentPosts(limit = 10): Promise<PostWithRefs[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, season:seasons(id, number, title), contestant:contestants(id, name, name_initial, portrait_color)")
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as PostWithRefs[];
}
