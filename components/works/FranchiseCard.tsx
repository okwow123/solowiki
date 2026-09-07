// components/works/FranchiseCard.tsx
// 프랜차이즈 카드 — 예: "나는솔로 (33기, 408명 캐릭터)"
// 클릭 시 시즌 그리드 펼침

"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Users, Clapperboard, Film, Tv2, BookOpen } from "lucide-react";
import type { Franchise, WorkKind } from "@/lib/types";

const KIND_ICON: Record<WorkKind, any> = {
  variety: Clapperboard,
  movie: Film,
  drama: Tv2,
  anime: BookOpen,
  other: BookOpen,
};

const KIND_LABEL: Record<WorkKind, string> = {
  variety: "예능",
  movie: "영화",
  drama: "드라마",
  anime: "애니",
  other: "기타",
};

interface FranchiseCardProps {
  franchise: Franchise;
}

export function FranchiseCard({ franchise }: FranchiseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = KIND_ICON[franchise.kind];

  return (
    <div className="bg-bg-2 border border-line rounded-[16px] overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-6 flex items-center gap-4 hover:bg-bg-3/40 transition-colors text-left"
      >
        <div className="w-12 h-12 grid place-items-center rounded-xl bg-gradient-to-br from-accent-rose/20 to-accent-gold/20 text-accent-rose shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-serif text-[20px] font-semibold text-ink">
              {franchise.name}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-ink/[0.06] text-ink-soft text-[10.5px] font-medium">
              {KIND_LABEL[franchise.kind]}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-accent-rose/10 text-accent-rose text-[10.5px] font-medium">
              프랜차이즈
            </span>
          </div>
          <p className="text-[13px] text-ink-soft">
            <Users className="w-3.5 h-3.5 inline-block -mt-0.5 mr-1" />
            {franchise.seasons.length}개 시즌 · {franchise.totalCharacters.toLocaleString()}명 캐릭터
          </p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded seasons grid */}
      {expanded && (
        <div className="border-t border-line p-5">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {franchise.seasons.map((s) => (
              <Link
                key={s.id}
                href={`/works/${s.number}`}
                className="group aspect-square grid place-items-center bg-bg-3 border border-line rounded-[10px] hover:border-accent-rose/40 hover:bg-bg-2 transition-all"
              >
                <div className="text-center">
                  <div className="font-serif text-lg font-semibold text-ink group-hover:text-accent-rose transition-colors">
                    {s.number}
                  </div>
                  <div className="text-[9.5px] text-muted mt-0.5">기</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
