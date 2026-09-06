// lib/server/voter.ts
// 서버 측에서 voter_hash (쿠키 기반) 가져오기/생성.
// API 라우트와 Server Component에서 공통 사용.

import { cookies } from "next/headers";

const COOKIE_NAME = "sw_voter";
const COOKIE_DAYS = 365;

function generateHash(): string {
  // crypto.randomUUID() (Node 18+) 또는 fallback
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * 요청자의 sw_voter 쿠키를 읽거나 새로 생성.
 * - Server Component: read-only, 새 쿠키 set 불가 → 항상 기존 hash 또는 새로 만들어도 set 못 함 (anonymous).
 * - Route Handler: cookies().set() 가능 → 있으면 그대로, 없으면 생성 + set.
 *
 * @param autoCreate 새 쿠키 생성 여부. Server Component에서는 false 권장.
 */
export function getOrCreateVoterHash(autoCreate = true): string {
  const cookieStore = cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  if (!autoCreate) return "";
  const fresh = generateHash();
  try {
    cookieStore.set(COOKIE_NAME, fresh, {
      path: "/",
      maxAge: COOKIE_DAYS * 24 * 60 * 60,
      sameSite: "lax",
    });
  } catch {
    // Server Component — set 못 함. 그래도 hash는 반환해서 사용.
  }
  return fresh;
}

/**
 * 기존 voter_hash만 읽기. 없으면 빈 문자열.
 */
export function readVoterHash(): string {
  return cookies().get(COOKIE_NAME)?.value ?? "";
}
