// app/api/chat/post/route.ts
// POST /api/chat/post
// Body: { content, anonymous_name, is_system? }
// 익명 메시지 저장. 간단한 rate-limit (같은 IP hash 3초에 1번).

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const MAX_LEN = 500;
const RATE_LIMIT_MS = 3000; // 3초

function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip + (process.env.SUPABASE_SERVICE_ROLE_KEY || "salt")).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  let body: { content?: string; anonymous_name?: string; is_system?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "BAD_REQUEST", message: "JSON 파싱 실패" },
      { status: 400 }
    );
  }

  const content = (body.content ?? "").trim();
  const anonymous_name = (body.anonymous_name ?? "").trim();
  const is_system = body.is_system === true;

  // Validation
  if (!content || content.length > MAX_LEN) {
    return NextResponse.json(
      { ok: false, code: "BAD_REQUEST", message: `1~${MAX_LEN}자 필요` },
      { status: 400 }
    );
  }
  if (!anonymous_name || anonymous_name.length > 30) {
    return NextResponse.json(
      { ok: false, code: "BAD_REQUEST", message: "익명 이름 필요 (1~30자)" },
      { status: 400 }
    );
  }

  // IP hash for rate-limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
             req.headers.get("x-real-ip") ||
             "unknown";
  const ipHash = hashIP(ip);

  // Service role (RLS bypass)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Rate limit check (3초에 1번)
  if (!is_system) {
    const { data: recent } = await supabase
      .from("chat_messages")
      .select("created_at")
      .eq("ip_hash", ipHash)
      .eq("is_system", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recent) {
      const last = new Date(recent.created_at).getTime();
      if (Date.now() - last < RATE_LIMIT_MS) {
        return NextResponse.json(
          {
            ok: false,
            code: "RATE_LIMIT",
            message: `너무 빨라요. ${Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 1000)}초 후 다시 시도해주세요.`,
          },
          { status: 429 }
        );
      }
    }
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      anonymous_name,
      content,
      is_system,
      ip_hash: ipHash,
    })
    .select("id, anonymous_name, content, is_system, created_at")
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR", message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, message: data }, { status: 200 });
}
