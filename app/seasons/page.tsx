// app/seasons/page.tsx
import { getAllSeasons, getContestantCountBySeason } from "@/lib/data/seasons";
import { SeasonGrid } from "@/components/season/SeasonGrid";

export const metadata = {
  title: "전체 기수",
  description: "1기부터 33기까지 모든 기수와 출연자 정보.",
};

export default async function SeasonsIndexPage() {
  const [seasons, countMap] = await Promise.all([
    getAllSeasons(),
    getContestantCountBySeason(),
  ]);

  return (
    <section className="py-16">
      <div className="max-w-site mx-auto px-6">
        <div className="mb-10">
          <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-semibold mb-3">
            전체 기수
          </h1>
          <p className="text-ink-soft text-[15px]">
            기수를 클릭하면 해당 기수 출연자 도감으로 이동해요.
          </p>
        </div>

        <SeasonGrid seasons={seasons} countMap={countMap} />

        {seasons.length === 0 && (
          <p className="mt-8 text-[13px] text-muted text-center">
            ⚙️ Supabase 연결 후 기수가 표시됩니다. .env.local에 키를 넣고 0001_initial.sql +
            0002_seed_1gi.sql을 Supabase SQL 에디터에서 실행해주세요.
          </p>
        )}
      </div>
    </section>
  );
}
