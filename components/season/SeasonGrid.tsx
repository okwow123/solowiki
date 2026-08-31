// components/season/SeasonGrid.tsx
import Link from "next/link";
import type { Season } from "@/lib/types";
import { Users } from "lucide-react";

interface SeasonGridProps {
  seasons: Season[];
  countMap: Map<number, number>;
}

export function SeasonGrid({ seasons, countMap }: SeasonGridProps) {
  if (seasons.length === 0) {
    return (
      <div className="py-16 text-center text-muted border border-dashed border-line-strong rounded-[14px]">
        아직 공개된 기수가 없어요. 곧 채워질 예정!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {seasons.map((s) => {
        const count = countMap.get(s.id) ?? 0;
        return (
          <Link
            key={s.id}
            href={`/seasons/${s.number}`}
            className="group relative aspect-square grid place-items-center bg-bg-3 border border-line rounded-[12px] hover:border-accent-rose/40 hover:bg-bg-2 transition-all"
          >
            <div className="text-center">
              <div className="font-serif text-2xl font-semibold text-ink group-hover:text-accent-rose transition-colors">
                {s.number}
              </div>
              <div className="text-[11px] text-muted mt-0.5">기</div>
            </div>
            {count > 0 && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-muted">
                <Users className="w-3 h-3" />
                {count}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
