// app/api/stats/vote/route.ts
// POST /api/stats/vote
// Body: { contestant_id, stat_key, direction }  // direction: 1 or -1
// 쿠키의 sw_voter hash와 함께 RPC 호출. 같은 (contestant, stat)은 1회만.

import { NextRequest, NextResponse } from "next/server";
import { getOrCreateVoterHash } from "@/lib/server/voter";
import { createClient } from "@supabase/supabase-js";

const VALID_STATS = new Set([
  "overall_charm",
  "villain_power",
  "appearance",
  "inner_qualities",
  "career_score",
  "age_score",
  "conversation",
  "style_score",
  "intelligence_score",
  "appetite",
]);

export async function POST(req: NextRequest) {
  let body: { contestant_id?: string; stat_key?: string; direction?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "BAD_REQUEST", message: "JSON 파싱 실패" },
      { status: 400 }
    );
  }

  const { contestant_id, stat_key, direction } = body;

  // Input validation
  if (!contestant_id || typeof contestant_id !== "string") {
    return NextResponse.json(
      { ok: false, code: "BAD_REQUEST", message: "contestant_id 필요" },
      { status: 400 }
    );
  }
  if (!stat_key || !VALID_STATS.has(stat_key)) {
    return NextResponse.json(
      { ok: false, code: "BAD_REQUEST", message: "유효하지 않은 stat_key" },
      { status: 400 }
    );
  }
  if (direction !== 1 && direction !== -1) {
    return NextResponse.json(
      { ok: false, code: "BAD_REQUEST", message: "direction은 1 또는 -1" },
      { status: 400 }
    );
  }

  // voter hash (쿠키에서 가져오거나 새로 생성)
  const voterHash = getOrCreateVoterHash();
  if (!voterHash) {
    return NextResponse.json(
      { ok: false, code: "NO_VOTER", message: "쿠키 생성 실패" },
      { status: 500 }
    );
  }

  // Service role client (RPC는 SECURITY DEFINER로 실행되지만 클라이언트는 service_role이 안전)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.rpc("cast_stat_vote", {
    p_contestant_id: contestant_id,
    p_stat_key: stat_key,
    p_voter_hash: voterHash,
    p_direction: direction,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR", message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
