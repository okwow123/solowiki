"use client";
// components/contestant/VoteableStatBar.tsx
// 게임 스탯 +1/-1 투표 가능한 바. detail page에서만 사용.

import { useState, useTransition } from "react";
import { STAT_META, type StatKey } from "./StatBar";
import { cn } from "@/lib/utils";

interface VoteableStatBarProps {
  contestantId: string;
  stat: StatKey;
  value: number;
  /** 사용자가 이미 이 stat에 투표했으면 true */
  alreadyVoted: boolean;
  onVoteChange?: (newValue: number) => void;
}

export function VoteableStatBar({
  contestantId,
  stat,
  value,
  alreadyVoted: initialVoted,
  onVoteChange,
}: VoteableStatBarProps) {
  const meta = STAT_META[stat];
  const [currentValue, setCurrentValue] = useState(value);
  const [voted, setVoted] = useState(initialVoted);
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  const isAtMax = currentValue >= 100;
  const isAtMin = currentValue <= 0;

  const handleVote = (direction: 1 | -1) => {
    if (voted || pending) return;
    if (direction === 1 && isAtMax) {
      setToast("이미 최대치(100)입니다.");
      setTimeout(() => setToast(null), 2000);
      return;
    }
    if (direction === -1 && isAtMin) {
      setToast("이미 최소치(0)입니다.");
      setTimeout(() => setToast(null), 2000);
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/stats/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contestant_id: contestantId,
            stat_key: stat,
            direction,
          }),
        });
        const data = await res.json();
        if (!data.ok) {
          if (data.code === "ALREADY_VOTED") {
            setVoted(true);
            setToast("이미 투표하셨습니다. 쿠키를 지우면 다시 투표할 수 있어요.");
          } else {
            setToast(data.message || "투표 실패");
          }
          setTimeout(() => setToast(null), 2500);
          return;
        }
        // Optimistic update
        setCurrentValue(data.new_value);
        setVoted(true);
        onVoteChange?.(data.new_value);
      } catch (e) {
        setToast("네트워크 오류");
        setTimeout(() => setToast(null), 2500);
      }
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2.5">
        {/* emoji + label */}
        <span className="text-[16px] leading-none shrink-0" aria-hidden>
          {meta.emoji}
        </span>
        <span className="shrink-0 font-medium text-ink-soft w-16 text-[13px]">
          {meta.label}
        </span>

        {/* bar */}
        <div className="flex-1 rounded-full bg-bg/60 border border-line overflow-hidden h-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-rose to-accent-gold transition-all duration-500"
            style={{ width: `${currentValue}%` }}
          />
        </div>

        {/* value */}
        <span className="shrink-0 tabular-nums text-ink-soft font-medium w-7 text-[12px]">
          {currentValue}
        </span>

        {/* +1 / -1 buttons */}
        <div className="shrink-0 flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleVote(-1)}
            disabled={voted || pending || isAtMin}
            aria-label={`${meta.label} -1`}
            className={cn(
              "w-7 h-7 rounded-md border text-[12px] font-semibold transition-colors",
              voted
                ? "border-line text-muted cursor-not-allowed bg-bg/50"
                : isAtMin
                ? "border-line text-muted/50 cursor-not-allowed bg-bg/30"
                : "border-line-strong text-ink-soft hover:bg-bg-3 hover:border-accent-rose/40 hover:text-accent-rose"
            )}
          >
            −
          </button>
          <button
            type="button"
            onClick={() => handleVote(1)}
            disabled={voted || pending || isAtMax}
            aria-label={`${meta.label} +1`}
            className={cn(
              "w-7 h-7 rounded-md border text-[12px] font-semibold transition-colors",
              voted
                ? "border-line text-muted cursor-not-allowed bg-bg/50"
                : isAtMax
                ? "border-line text-muted/50 cursor-not-allowed bg-bg/30"
                : "border-accent-rose/30 text-accent-rose bg-accent-rose/5 hover:bg-accent-rose/15 hover:border-accent-rose/50"
            )}
          >
            +
          </button>
        </div>
      </div>

      {/* Voted indicator */}
      {voted && (
        <span className="absolute -top-1 right-0 text-[9.5px] text-muted/70 italic">
          ✓ 투표함
        </span>
      )}

      {/* Toast */}
      {toast && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-7 z-10 px-2.5 py-1 bg-bg border border-line-strong rounded text-[11px] text-ink-soft whitespace-nowrap shadow-md">
          {toast}
        </div>
      )}
    </div>
  );
}
