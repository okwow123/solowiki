// lib/data/franchises.ts
// 프랜차이즈 그룹화 헬퍼.
// 예: "나는솔로" 33개 시즌을 하나의 Franchise 객체로 묶어서 UI에 노출.

import { createClient } from "@/lib/supabase/server";
import { getContestantCountBySeason } from "@/lib/data/seasons";
import type { Franchise, Season, WorkKind } from "@/lib/types";

interface FranchiseRow {
  franchise: string;
  kind: WorkKind;
  count: number;
}

interface CharCountRow {
  season_id: number;
}

/**
 * 프랜차이즈 목록 (예능 카테고리에만 해당 — 영화/드라마는 단독 작품)
 * - kind 필터 가능 (기본: 전체)
 * - 각 프랜차이즈에 속한 시즌 + 총 캐릭터 수 포함
 */
export async function getFranchises(kind?: WorkKind | "all"): Promise<Franchise[]> {
  const supabase = createClient();

  let query = supabase
    .from("seasons")
    .select("franchise, kind")
    .not("franchise", "is", null)
    .eq("is_published", true);

  if (kind && kind !== "all") {
    query = query.eq("kind", kind);
  }

  const { data: rows, error } = await query;
  if (error || !rows) return [];

  // 프랜차이즈별 group (DB 측에서)
  const groups = new Map<string, { kind: WorkKind }>();
  for (const r of rows as FranchiseRow[]) {
    if (!r.franchise) continue;
    const existing = groups.get(r.franchise);
    if (existing) {
      // kind 섞여있으면 variety 우선 (I'm Solo 케이스)
      if (existing.kind !== "variety" && r.kind === "variety") {
        groups.set(r.franchise, { kind: r.kind });
      }
    } else {
      groups.set(r.franchise, { kind: r.kind });
    }
  }

  // 각 프랜차이즈의 시즌들 + 캐릭터 수 조회
  const result: Franchise[] = [];
  for (const [name, { kind: fkind }] of groups) {
    const { data: seasonRows } = await supabase
      .from("seasons")
      .select("*")
      .eq("franchise", name)
      .eq("is_published", true)
      .order("number", { ascending: true });

    if (!seasonRows || seasonRows.length === 0) continue;

    // 캐릭터 수 합산
    const seasonIds = (seasonRows as Season[]).map((s) => s.id);
    const { data: charRows } = await supabase
      .from("contestants")
      .select("season_id")
      .in("season_id", seasonIds)
      .eq("is_published", true);

    const totalCharacters = (charRows as CharCountRow[] | null)?.length ?? 0;

    result.push({
      name,
      kind: fkind,
      seasons: seasonRows as Season[],
      totalCharacters,
    });
  }

  // 시즌 많은 순으로 정렬
  result.sort((a, b) => b.seasons.length - a.seasons.length);
  return result;
}

/**
 * 단독 작품 (franchise IS NULL) — 영화/드라마/기타
 */
export async function getStandaloneWorks(kind?: WorkKind | "all"): Promise<Season[]> {
  const supabase = createClient();
  let query = supabase
    .from("seasons")
    .select("*")
    .is("franchise", null)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (kind && kind !== "all") {
    query = query.eq("kind", kind);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as Season[];
}
