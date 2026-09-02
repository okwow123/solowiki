// components/contestant/ContestantCard.tsx
import Link from "next/link";
import { YouTubeThumbnail } from "./YouTubeThumbnail";
import { StatBar } from "./StatBar";
import type { ContestantWithStats } from "@/lib/types";
import { currentAge, formatNumber } from "@/lib/utils";

interface ContestantCardProps {
  contestant: ContestantWithStats;
}

export function ContestantCard({ contestant }: ContestantCardProps) {
  const {
    id,
    name,
    name_initial,
    gender,
    age_at_appearance,
    job,
    location_city,
    location_district,
    mbti,
    portrait_color,
    current_status,
    instagram_handle,
    instagram_followers,
    stats,
    season,
    catchphrase,
    is_final_couple,
    highlights,
  } = contestant;

  const age = currentAge(contestant.birth_date, age_at_appearance);
  // 짧은 유행어 (40자 제한, 너무 길면 잘라 ...)
  const shortCatch = catchphrase && catchphrase.length > 40 ? catchphrase.slice(0, 40) + "…" : catchphrase;
  // 첫 번째 highlight의 youtube_id와 source_channel (썸네일/attribution용)
  const firstHighlight = highlights?.[0];
  const firstHighlightId = firstHighlight?.youtube_id ?? null;
  const sourceChannel = firstHighlight?.source_channel ?? null;

  return (
    <Link
      href={`/contestants/${id}`}
      className="group block bg-bg-3 border border-line rounded-[14px] overflow-hidden hover:border-line-strong hover:-translate-y-0.5 transition-all"
    >
      <YouTubeThumbnail
        youtubeId={firstHighlightId}
        nameInitial={name_initial ?? name}
        color={portrait_color}
        status={current_status}
        size="md"
        sourceChannel={sourceChannel}
      />

      <div className="p-4">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-[17px] font-semibold">
            {name}
            {age != null && (
              <span className="text-muted text-[13px] font-normal ml-1.5">
                · {age}세
              </span>
            )}
          </h3>
          <div className="flex items-center gap-1.5">
            {is_final_couple && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-rose/15 text-accent-rose border border-accent-rose/30 font-medium">
                ♥ 커플
              </span>
            )}
            {season && (
              <span className="text-[11px] text-muted tabular-nums">
                {season.number}기
              </span>
            )}
          </div>
        </div>

        <p className="text-muted text-[13px] mb-2">
          {job ?? "—"}
          {location_city && ` · ${location_city}${location_district ? ` ${location_district}` : ""}`}
        </p>

        {shortCatch && (
          <p className="text-ink-soft text-[12.5px] leading-snug mb-3 italic line-clamp-2">
            "{shortCatch}"
          </p>
        )}

        {/* Compact stats — top 4 only */}
        {stats && (
          <div className="space-y-1.5 mb-3.5">
            <StatBar stat="charm" value={stats.charm} size="sm" />
            <StatBar stat="warmth" value={stats.warmth} size="sm" />
            <StatBar stat="humor" value={stats.humor} size="sm" />
            <StatBar stat="style" value={stats.style} size="sm" />
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {mbti && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-ink/[0.06] text-ink-soft">
              {mbti}
            </span>
          )}
          {gender && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-ink/[0.06] text-ink-soft">
              {gender === "male" ? "남" : "여"}
            </span>
          )}
          {instagram_handle && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent-rose/10 text-accent-rose border border-accent-rose/20">
              IG {formatNumber(instagram_followers)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
