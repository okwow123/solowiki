// app/seasons/[number]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Filter, Heart } from "lucide-react";
import { getSeasonByNumber } from "@/lib/data/seasons";
import { getContestantsBySeason } from "@/lib/data/contestants";
import { ContestantCard } from "@/components/contestant/ContestantCard";
import { YouTubeThumbnail } from "@/components/contestant/YouTubeThumbnail";
import { cn } from "@/lib/utils";

interface PageProps {
  params: { number: string };
}

export async function generateMetadata({ params }: PageProps) {
  const num = parseInt(params.number, 10);
  if (isNaN(num)) return { title: "기수" };
  return {
    title: `${num}기 출연자`,
    description: `솔로 데이팅 ${num}기 출연자 정보, 커플 현황, 게임 스탯.`,
  };
}

export default async function SeasonDetailPage({ params }: PageProps) {
  const num = parseInt(params.number, 10);
  if (isNaN(num)) notFound();

  const [season, contestants] = await Promise.all([
    getSeasonByNumber(num),
    // Get the season first to find its id, then contestants
    Promise.resolve(null).then(async () => {
      const s = await getSeasonByNumber(num);
      if (!s) return [];
      return getContestantsBySeason(s.id);
    }),
  ]);

  if (!season) {
    // Fallback for legacy seasons without data — show "데이터 준비 중"
    return (
      <section className="py-16">
        <div className="max-w-site mx-auto px-6">
          <div className="mb-10">
            <p className="text-muted text-[13px] tracking-widest mb-2">SEASON</p>
            <h1 className="font-serif text-[clamp(40px,6vw,64px)] font-semibold">
              {num}기
            </h1>
          </div>
          <div className="py-20 text-center border border-dashed border-line-strong rounded-[14px]">
            <p className="text-ink-soft text-[15px] mb-1">
              {num}기는 아직 데이터가 없어요.
            </p>
            <p className="text-muted text-[13px]">
              곧 채워질 예정! 다른 기수는 아래에서 골라보세요.
            </p>
            <Link
              href="/seasons"
              className="inline-block mt-6 text-[13px] text-accent-rose hover:underline"
            >
              전체 기수 보기 →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const males = contestants.filter((c) => c.gender === "male");
  const females = contestants.filter((c) => c.gender === "female");
  const finalCouples = contestants.filter((c) => c.is_final_couple);
  // Group into pairs: assume even number, take 0↔1, 2↔3, etc.
  const finalCouplePairs: Array<{ m: typeof contestants[0]; f: typeof contestants[0] }> = [];
  for (let i = 0; i < finalCouples.length; i += 2) {
    if (i + 1 < finalCouples.length) {
      const a = finalCouples[i];
      const b = finalCouples[i + 1];
      const m = a.gender === "male" ? a : b;
      const f = a.gender === "female" ? a : b;
      finalCouplePairs.push({ m, f });
    }
  }

  return (
    <section className="py-12">
      <div className="max-w-site mx-auto px-6">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-muted text-[13px] tracking-widest mb-2">SEASON</p>
            <h1 className="font-serif text-[clamp(40px,6vw,64px)] font-semibold">
              {num}기
            </h1>
            {season.description && (
              <p className="text-ink-soft text-[14.5px] mt-3 max-w-2xl">
                {season.description}
              </p>
            )}
            {season.air_date_start && (
              <p className="text-muted text-[12.5px] mt-2">
                {season.air_date_start} ~ {season.air_date_end ?? "방영 중"}
                {season.episode_count && ` · ${season.episode_count}부작`}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/community/${num}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-line-strong text-ink rounded-full hover:bg-bg-3 text-[14px]"
            >
              <MessageCircle className="w-4 h-4" />
              {num}기 커뮤니티
            </Link>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: "총 출연자", value: contestants.length },
            { label: "남성", value: males.length },
            { label: "여성", value: females.length },
            {
              label: "커플",
              value: contestants.filter(
                (c) => c.current_status === "married" || c.current_status === "dating"
              ).length,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="px-4 py-4 border border-line rounded-[14px] bg-ink/[0.02]"
            >
              <strong className="block font-serif text-2xl text-ink font-semibold">
                {s.value}
              </strong>
              <span className="text-muted text-[12.5px]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* 최종 커플 하이라이트 */}
        {finalCouplePairs.length > 0 && (
          <div className="mb-10 bg-gradient-to-br from-accent-rose/[0.07] to-accent-gold/[0.07] border border-accent-rose/25 rounded-[14px] p-6">
            <p className="text-[11px] uppercase tracking-widest text-accent-rose/80 font-medium mb-4 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" /> {num}기 최종 커플
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {finalCouplePairs.map(({ m, f }) => (
                <Link
                  key={m.id + f.id}
                  href={`/contestants/${m.id}`}
                  className="flex items-center gap-3 p-3 bg-bg-2 border border-line rounded-[12px] hover:border-accent-rose/40 transition-colors group"
                >
                  <div className="flex -space-x-2 shrink-0">
                    <YouTubeThumbnail
                      youtubeId={m.highlights?.[0]?.youtube_id ?? null}
                      nameInitial={m.name_initial ?? m.name}
                      color={m.portrait_color}
                      size="sm"
                      showAttribution={false}
                      className="!w-9 !h-9 !rounded-full ring-2 ring-bg-2"
                    />
                    <YouTubeThumbnail
                      youtubeId={f.highlights?.[0]?.youtube_id ?? null}
                      nameInitial={f.name_initial ?? f.name}
                      color={f.portrait_color}
                      size="sm"
                      showAttribution={false}
                      className="!w-9 !h-9 !rounded-full ring-2 ring-bg-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold group-hover:text-accent-rose transition-colors">
                      {m.name} <span className="text-muted font-normal">×</span> {f.name}
                    </p>
                    {f.recent_news && (
                      <p className="text-[11.5px] text-muted line-clamp-1 mt-0.5">
                        {f.recent_news}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filter (visual only for now — could be made interactive) */}
        <div className="bg-bg-2 border border-line rounded-[14px] p-5 mb-6 flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-muted" />
          <span className="text-[12px] text-muted uppercase tracking-widest">필터</span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "전체", active: true },
              { label: "남성", count: males.length },
              { label: "여성", count: females.length },
              { label: "결혼/연애", count: contestants.filter((c) => c.current_status === "married" || c.current_status === "dating").length },
            ].map((chip) => (
              <button
                key={chip.label}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors",
                  chip.active
                    ? "bg-ink text-bg border-ink"
                    : "border-line-strong text-ink-soft hover:border-ink-soft"
                )}
              >
                {chip.label}
                {"count" in chip && (
                  <span className="ml-1.5 text-muted">({chip.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cast grid */}
        {contestants.length > 0 ? (
          <div className="space-y-10">
            {males.length > 0 && (
              <div>
                <h2 className="text-[20px] font-semibold mb-4 flex items-center gap-2">
                  <span className="text-accent-navy">●</span> 남성 ({males.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {males.map((c) => (
                    <ContestantCard key={c.id} contestant={c} />
                  ))}
                </div>
              </div>
            )}
            {females.length > 0 && (
              <div>
                <h2 className="text-[20px] font-semibold mb-4 flex items-center gap-2">
                  <span className="text-accent-rose">●</span> 여성 ({females.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {females.map((c) => (
                    <ContestantCard key={c.id} contestant={c} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-line-strong rounded-[14px]">
            <p className="text-ink-soft">이 기수에는 아직 등록된 출연자가 없어요.</p>
          </div>
        )}
      </div>
    </section>
  );
}
