// app/works/page.tsx
// 르헤메스 — 작품 도감 (영화/드라마/예능/애니 통합)
// searchParams.kind 로 카테고리 필터 (variety/movie/drama/anime/other)

import Link from "next/link";
import { getContestantCountBySeason } from "@/lib/data/seasons";
import { getFranchises, getStandaloneWorks } from "@/lib/data/franchises";
import { WorksView } from "@/components/works/WorksView";
import { cn } from "@/lib/utils";
import type { WorkKind } from "@/lib/types";

export const metadata = {
  title: "전체 작품",
  description: "영화·드라마·예능·애니의 모든 작품과 캐릭터 정보.",
};

const KINDS: { key: WorkKind | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "variety", label: "예능" },
  { key: "drama", label: "드라마" },
  { key: "movie", label: "영화" },
  { key: "anime", label: "애니" },
];

interface PageProps {
  searchParams: { kind?: string };
}

export default async function WorksIndexPage({ searchParams }: PageProps) {
  const kindParam = (searchParams.kind ?? "all") as WorkKind | "all";
  const validKinds: (WorkKind | "all")[] = ["all", "variety", "drama", "movie", "anime", "other"];
  const activeKind = validKinds.includes(kindParam) ? kindParam : "all";

  const [franchises, standalone, countMap] = await Promise.all([
    getFranchises(activeKind),
    getStandaloneWorks(activeKind),
    getContestantCountBySeason(),
  ]);

  return (
    <section className="py-16">
      <div className="max-w-site mx-auto px-6">
        <div className="mb-8">
          <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-semibold mb-3">
            작품 도감
          </h1>
          <p className="text-ink-soft text-[15px]">
            보고 있는 작품의 캐릭터를 찾아보세요. 시리즈는 펼쳐서 시즌별로 볼 수 있어요.
          </p>
        </div>

        {/* Category chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {KINDS.map((k) => {
            const href = k.key === "all" ? "/works" : `/works?kind=${k.key}`;
            const isActive = activeKind === k.key;
            return (
              <Link
                key={k.label}
                href={href}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13.5px] font-medium border transition-colors",
                  isActive
                    ? "bg-ink text-bg border-ink"
                    : "border-line-strong text-ink-soft hover:border-ink-soft hover:bg-bg-3"
                )}
              >
                {k.label}
              </Link>
            );
          })}
        </div>

        <WorksView franchises={franchises} standalone={standalone} countMap={countMap} />

        {franchises.length === 0 && standalone.length === 0 && (
          <p className="mt-8 text-[13px] text-muted text-center">
            {activeKind === "all"
              ? "⚙️ Supabase 연결 후 작품이 표시됩니다."
              : `아직 이 카테고리(${KINDS.find((k) => k.key === activeKind)?.label})에 등록된 작품이 없어요.`}
          </p>
        )}
      </div>
    </section>
  );
}
