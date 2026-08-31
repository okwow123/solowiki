// components/contestant/StatBar.tsx
import type { LucideIcon } from "lucide-react";
import { Heart, Smile, HandHeart, Brain, Crown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatKey = "charm" | "humor" | "warmth" | "intelligence" | "leadership" | "style";

const STAT_META: Record<StatKey, { label: string; icon: LucideIcon; color: string }> = {
  charm: { label: "매력", icon: Heart, color: "text-accent-rose" },
  humor: { label: "유머", icon: Smile, color: "text-accent-gold" },
  warmth: { label: "따뜻", icon: HandHeart, color: "text-accent-sage" },
  intelligence: { label: "지능", icon: Brain, color: "text-accent-navy" },
  leadership: { label: "리더", icon: Crown, color: "text-accent-plum" },
  style: { label: "스타일", icon: Sparkles, color: "text-ink-soft" },
};

interface StatBarProps {
  stat: StatKey;
  value: number; // 0-100
  size?: "sm" | "md";
}

export function StatBar({ stat, value, size = "md" }: StatBarProps) {
  const meta = STAT_META[stat];
  const Icon = meta.icon;
  const fillPct = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "flex items-center gap-2.5",
        size === "sm" ? "text-[12px]" : "text-[13px]"
      )}
    >
      <Icon
        className={cn(
          meta.color,
          "shrink-0",
          size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"
        )}
      />
      <span
        className={cn(
          "shrink-0 font-medium text-ink-soft",
          size === "sm" ? "w-9" : "w-11"
        )}
      >
        {meta.label}
      </span>
      <div
        className={cn(
          "flex-1 rounded-full bg-bg/60 border border-line overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2"
        )}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-rose to-accent-gold transition-all duration-700"
          style={{ width: `${fillPct}%` }}
        />
      </div>
      <span
        className={cn(
          "shrink-0 tabular-nums text-ink-soft font-medium",
          size === "sm" ? "w-6 text-[11px]" : "w-7 text-[12px]"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export { STAT_META };
