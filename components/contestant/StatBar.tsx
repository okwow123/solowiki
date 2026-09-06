// components/contestant/StatBar.tsx
// v3: 10개 게임 스탯 + 이모티콘

export type StatKey =
  | "overall_charm"
  | "villain_power"
  | "appearance"
  | "inner_qualities"
  | "career_score"
  | "age_score"
  | "conversation"
  | "style_score"
  | "intelligence_score"
  | "appetite";

export const STAT_META: Record<
  StatKey,
  { label: string; emoji: string; color: string }
> = {
  overall_charm:     { label: "종합매력", emoji: "💖", color: "text-accent-rose" },
  villain_power:     { label: "빌런력",   emoji: "😈", color: "text-accent-plum" },
  appearance:        { label: "외모점수", emoji: "👀", color: "text-accent-rose" },
  inner_qualities:   { label: "내면점수", emoji: "💝", color: "text-accent-gold" },
  career_score:      { label: "직업점수", emoji: "💼", color: "text-accent-navy" },
  age_score:         { label: "연령점수", emoji: "⏳", color: "text-accent-sage" },
  conversation:      { label: "대화점수", emoji: "💬", color: "text-accent-gold" },
  style_score:       { label: "스타일점수", emoji: "👗", color: "text-accent-rose" },
  intelligence_score:{ label: "지능점수", emoji: "🧠", color: "text-accent-navy" },
  appetite:          { label: "식욕점수", emoji: "🍽️", color: "text-accent-gold" },
};

interface StatBarProps {
  stat: StatKey;
  value: number; // 0-100
  size?: "sm" | "md";
}

export function StatBar({ stat, value, size = "md" }: StatBarProps) {
  const meta = STAT_META[stat];
  const fillPct = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "flex items-center gap-2.5",
        size === "sm" ? "text-[12px]" : "text-[13px]"
      )}
    >
      <span
        className={cn(
          "shrink-0 leading-none",
          size === "sm" ? "text-[14px]" : "text-[16px]"
        )}
        aria-hidden
      >
        {meta.emoji}
      </span>
      <span
        className={cn(
          "shrink-0 font-medium text-ink-soft",
          size === "sm" ? "w-12" : "w-16"
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

// cn utility inline (avoid extra import)
function cn(...args: (string | false | null | undefined)[]): string {
  return args.filter(Boolean).join(" ");
}
