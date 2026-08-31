// app/search/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ContestantCard } from "@/components/contestant/ContestantCard";
import type { ContestantWithStats } from "@/lib/types";

export const metadata = {
  title: "검색",
  description: "이름, 직업, 지역, MBTI로 출연자 검색.",
};

interface PageProps {
  searchParams: { q?: string; job?: string; city?: string; mbti?: string; gender?: string };
}

async function searchResults({ q, job, city, mbti, gender }: PageProps["searchParams"]) {
  const supabase = createClient();
  let query = supabase
    .from("contestants")
    .select("*, contestant_stats(*), season:seasons(*)")
    .eq("is_published", true)
    .limit(50);

  if (q) query = query.ilike("name", `%${q}%`);
  if (job) query = query.ilike("job", `%${job}%`);
  if (city) query = query.ilike("location_city", `%${city}%`);
  if (mbti) query = query.ilike("mbti", mbti.toUpperCase());
  if (gender && (gender === "male" || gender === "female")) {
    query = query.eq("gender", gender);
  }

  const { data } = await query;
  if (!data) return [];

  return (data as any[]).map((row) => ({
    ...(row as any),
    stats: row.contestant_stats ?? null,
    season: row.season ?? null,
    highlights: [],
    partner: null,
  })) as ContestantWithStats[];
}

export default async function SearchPage({ searchParams }: PageProps) {
  const hasQuery = Object.values(searchParams).some((v) => v);
  const results = hasQuery ? await searchResults(searchParams) : [];

  return (
    <section className="py-12">
      <div className="max-w-site mx-auto px-6">
        <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-semibold mb-8">
          출연자 검색
        </h1>

        {/* Search form */}
        <form className="bg-bg-2 border border-line rounded-[14px] p-5 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              name="q"
              defaultValue={searchParams.q ?? ""}
              placeholder="이름 (예: 김○)"
              className="bg-bg border border-line rounded-lg px-3.5 py-2.5 text-[14px] placeholder:text-muted focus:border-accent-rose/50 focus:outline-none"
            />
            <input
              name="job"
              defaultValue={searchParams.job ?? ""}
              placeholder="직업"
              className="bg-bg border border-line rounded-lg px-3.5 py-2.5 text-[14px] placeholder:text-muted focus:border-accent-rose/50 focus:outline-none"
            />
            <input
              name="city"
              defaultValue={searchParams.city ?? ""}
              placeholder="지역 (예: 서울)"
              className="bg-bg border border-line rounded-lg px-3.5 py-2.5 text-[14px] placeholder:text-muted focus:border-accent-rose/50 focus:outline-none"
            />
            <input
              name="mbti"
              defaultValue={searchParams.mbti ?? ""}
              placeholder="MBTI (예: INFP)"
              maxLength={4}
              className="bg-bg border border-line rounded-lg px-3.5 py-2.5 text-[14px] placeholder:text-muted focus:border-accent-rose/50 focus:outline-none uppercase"
            />
            <select
              name="gender"
              defaultValue={searchParams.gender ?? ""}
              className="bg-bg border border-line rounded-lg px-3.5 py-2.5 text-[14px] focus:border-accent-rose/50 focus:outline-none"
            >
              <option value="">전체 성별</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-accent-rose to-accent-gold text-bg font-semibold text-[13.5px] rounded-full hover:brightness-110"
            >
              <SearchIcon className="w-4 h-4" />
              검색
            </button>
          </div>
        </form>

        {/* Results */}
        {hasQuery ? (
          <>
            <p className="text-muted text-[13px] mb-4">
              검색 결과 <strong className="text-ink">{results.length}</strong>명
            </p>
            {results.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-line-strong rounded-[14px]">
                <p className="text-ink-soft">조건에 맞는 출연자가 없어요.</p>
                <p className="text-muted text-[13px] mt-1">필터를 다시 풀어볼까요?</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((c) => (
                  <ContestantCard key={c.id} contestant={c} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center border border-dashed border-line-strong rounded-[14px]">
            <SearchIcon className="w-10 h-10 text-muted mx-auto mb-3" />
            <p className="text-ink-soft">이름, 직업, 지역, MBTI로 검색해보세요.</p>
            <p className="text-muted text-[13px] mt-1">복수 조건 조합 가능</p>
          </div>
        )}
      </div>
    </section>
  );
}
