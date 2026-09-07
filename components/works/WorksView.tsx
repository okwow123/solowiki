// components/works/WorksView.tsx
// 작품 도감 통합 뷰 — 프랜차이즈(예능 시리즈) + 단독작(영화/드라마)을 함께 표시

import Link from "next/link";
import { Users, Clapperboard, Film, Tv2, BookOpen } from "lucide-react";
import type { Franchise, Season, WorkKind } from "@/lib/types";
import { FranchiseCard } from "@/components/works/FranchiseCard";

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

interface WorksViewProps {
  franchises: Franchise[];
  standalone: Season[];
  countMap: Map<number, number>;
}

export function WorksView({ franchises, standalone, countMap }: WorksViewProps) {
  if (franchises.length === 0 && standalone.length === 0) {
    return (
      <div className="py-16 text-center text-muted border border-dashed border-line-strong rounded-[14px]">
        아직 공개된 작품이 없어요. 곧 채워질 예정!
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* 프랜차이즈 그룹 (예능 시리즈 등) */}
      {franchises.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-[16px] font-semibold text-ink">시리즈</h2>
            <span className="text-[12px] text-muted">— 같은 작품의 여러 시즌을 묶었어요</span>
          </div>
          <div className="space-y-3">
            {franchises.map((f) => (
              <FranchiseCard key={f.name} franchise={f} />
            ))}
          </div>
        </div>
      )}

      {/* 단독 작품 (영화, 드라마, 기타) */}
      {standalone.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-[16px] font-semibold text-ink">단독 작품</h2>
            <span className="text-[12px] text-muted">— {standalone.length}개</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {standalone.map((s) => {
              const Icon = KIND_ICON[s.kind];
              const count = countMap.get(s.id) ?? 0;
              return (
                <Link
                  key={s.id}
                  href={`/works/${s.number}`}
                  className="group p-4 bg-bg-2 border border-line rounded-[14px] hover:border-accent-rose/40 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-9 h-9 grid place-items-center rounded-lg bg-gradient-to-br from-accent-rose/15 to-accent-gold/15 text-accent-rose">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="px-1.5 py-0.5 rounded-full bg-ink/[0.06] text-ink-soft text-[9.5px] font-medium">
                      {KIND_LABEL[s.kind]}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-ink leading-tight mb-1 line-clamp-2 group-hover:text-accent-rose transition-colors">
                    {s.title ?? `작품 #${s.number}`}
                  </h3>
                  {count > 0 && (
                    <p className="text-[11px] text-muted flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {count}명
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
