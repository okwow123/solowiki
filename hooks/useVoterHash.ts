// hooks/useVoterHash.ts
"use client";

import { useEffect, useState } from "react";

const COOKIE_NAME = "sw_voter";
const COOKIE_DAYS = 365;

/**
 * Generate or read a stable anonymous voter hash.
 * Stored in a long-lived cookie. Used to dedup votes/reports.
 */
export function useVoterHash(): string | null {
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    const existing = readCookie(COOKIE_NAME);
    if (existing) {
      setHash(existing);
      return;
    }
    const fresh = generateHash();
    writeCookie(COOKIE_NAME, fresh, COOKIE_DAYS);
    setHash(fresh);
  }, []);

  return hash;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
  return match ? match[2] : null;
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}

function generateHash(): string {
  // simple random hash; not cryptographic but sufficient for dedup
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
