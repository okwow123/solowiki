// app/page.tsx
// 르헤메스 (Lexemes) — 캐릭터 백과사전
// 영화 / 드라마 / 예능 / 애니 통합.

import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  Newspaper,
  Film,
  Tv2,
  Clapperboard,
  BookOpen,
} from "lucide-react";
import { getAllSeasons, getContestantCountBySeason } from "@/lib/data/seasons";
import { getFranchises, getStandaloneWorks } from "@/lib/data/franchises";
import { getFeaturedContestants } from "@/lib/data/contestants";
import { getRecentPosts } from "@/lib/data/posts";
import { getRecentNews } from "@/lib/data/contestants";
import { ContestantCard } from "@/components/contestant/ContestantCard";
import { PostCard } from "@/components/community/PostCard";
import { YouTubeThumbnail } from "@/components/contestant/YouTubeThumbnail";
import { FranchiseCard } from "@/components/works/FranchiseCard";
import type { WorkKind } from "@/lib/types";

const CATEGORY_TILES: { kind: WorkKind | "all"; label: string; icon: any; desc: string; href: string }[] = [
  {
    kind: "movie",
    label: "영화",
    icon: Film,
    desc: "기생충, 범죄도시 등 한국 영화의 캐릭터",
    href: "/works?kind=movie",
  },
  {
    kind: "drama",
    label: "드라마",
    icon: Tv2,
    desc: "오징어 게임, 더 글로리 등 시리즈",
    href: "/works?kind=drama",
  },
  {
    kind: "variety",
    label: "예능",
    icon: Clapperboard,
    desc: "나는 솔로 시리즈 · 33기 408명",
    href: "/works?kind=variety",
  },
  {
    kind: "anime",
    label: "애니",
    icon: BookOpen,
    desc: "곧 채워질 예정",
    href: "/works?kind=anime",
  },
];

export default async function HomePage() {
  const [seasons, countMap, featured, recentPosts, recentNews, franchises, standaloneWorks] = await Promise.all([
    getAllSeasons(),
    getContestantCountBySeason(),
    getFeaturedContestants(8),
    getRecentPosts(5),
    getRecentNews(6),
    getFranchises(),
    getStandaloneWorks(),
  ]);

  // 카테고리별 작품 수 (단독 + 프랜차이즈 합산)
  const kindCounts: Record<string, number> = { variety: 0, movie: 0, drama: 0, anime: 0, other: 0 };
  seasons.forEach((s) => {
    kindCounts[s.kind] = (kindCounts[s.kind] || 0) + 1;
  });
  const totalContestants = Array.from(countMap.values()).reduce((a, b) => a + b, 0);
  // 작품 수: 프랜차이즈(예능 시리즈) + 단독작(영화/드라마 등)
  const totalWorks = franchises.length + standaloneWorks.length;

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(900px 500px at 12% 8%, rgba(217,107,124,0.18), transparent 60%),
              radial-gradient(700px 500px at 88% 16%, rgba(200,169,106,0.14), transparent 60%),
              radial-gradient(800px 600px at 50% 100%, rgba(75,90,138,0.18), transparent 65%)
            `,
          }}
        />
        <div className="relative max-w-site mx-auto px-6 text-center">
          <p className="tracking-[0.32em] text-[12px] text-accent-gold font-medium mb-5">
            CHARACTER ENCYCLOPEDIA · FAN ARCHIVE
          </p>
          <h1 className="font-serif text-[clamp(40px,6vw,68px)] leading-[1.12] font-semibold tracking-tight mb-6">
            영화 · 드라마 · 예능의 모든 캐릭터,<br />
            <span className="bg-gradient-to-br from-accent-rose to-accent-gold bg-clip-text text-transparent">
              르헤메스
            </span>
            에 모이다.
          </h1>
          <p className="text-ink-soft text-[17px] max-w-2xl mx-auto mb-10">
            출연자 도감, 게임 스탯, 하이라이트 영상, 익명 팬 커뮤니티까지 —<br />
            로그인 없이, 편하게, 익명으로.
          </p>
          <div className="flex gap-3 justify-center flex-wrap mb-16">
            <Link
              href="/works"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-[15px] bg-gradient-to-br from-accent-rose to-accent-gold text-bg hover:brightness-110 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              전체 캐릭터 보기
            </Link>
            <Link
              href="/community/1"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-[15px] border border-line-strong text-ink hover:bg-bg-3 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              커뮤니티 구경
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="px-3 py-5 border border-line rounded-[14px] bg-ink/[0.02]">
              <strong className="block font-serif text-3xl text-ink font-semibold">
                {totalWorks || 5}
              </strong>
              <span className="text-muted text-[13px]">전체 작품</span>
            </div>
            <div className="px-3 py-5 border border-line rounded-[14px] bg-ink/[0.02]">
              <strong className="block font-serif text-3xl text-ink font-semibold">
                {totalContestants || 420}
              </strong>
              <span className="text-muted text-[13px]">캐릭터 정보</span>
            </div>
            <div className="px-3 py-5 border border-line rounded-[14px] bg-ink/[0.02]">
              <strong className="block font-serif text-3xl text-ink font-semibold">0</strong>
              <span className="text-muted text-[13px]">로그인 필요</span>
            </div>
            <div className="px-3 py-5 border border-line rounded-[14px] bg-ink/[0.02]">
              <strong className="block font-serif text-3xl text-ink font-semibold">100%</strong>
              <span className="text-muted text-[13px]">익명 커뮤니티</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="py-16">
        <div className="max-w-site mx-auto px-6">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
            <div>
              <h2 className="font-serif text-[clamp(28px,4vw,38px)] font-semibold mb-2">
                카테고리
              </h2>
              <p className="text-ink-soft">영화, 드라마, 예능, 애니 — 보고 싶은 작품의 캐릭터를 찾아보세요.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORY_TILES.map((c) => {
              const Icon = c.icon;
              const count = c.kind === "all" ? totalWorks : kindCounts[c.kind] || 0;
              return (
                <Link
                  key={c.label}
                  href={c.href}
                  className="group p-7 bg-bg-2 border border-line rounded-[14px] hover:border-accent-rose/40 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 grid place-items-center rounded-xl bg-gradient-to-br from-accent-rose/15 to-accent-gold/15 text-accent-rose group-hover:from-accent-rose group-hover:to-accent-gold group-hover:text-bg transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-semibold">{c.label}</h3>
                      <p className="text-muted text-[12px]">{count}개 작품</p>
                    </div>
                  </div>
                  <p className="text-ink-soft text-[13.5px] leading-relaxed">{c.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Works view: Franchise + Standalone */}
      <section className="py-20">
        <div className="max-w-site mx-auto px-6">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
            <div>
              <h2 className="font-serif text-[clamp(28px,4vw,38px)] font-semibold mb-2">
                작품 도감
              </h2>
              <p className="text-ink-soft">시리즈는 펼쳐서 시즌별로, 단독 작품은 바로 캐릭터 카드를 볼 수 있어요.</p>
            </div>
            <Link
              href="/works"
              className="text-[14px] text-ink-soft hover:text-ink flex items-center gap-1 transition-colors"
            >
              전체 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {franchises.length > 0 && (
            <div className="mb-8">
              <div className="space-y-3">
                {franchises.map((f) => (
                  <FranchiseCard key={f.name} franchise={f} />
                ))}
              </div>
            </div>
          )}

          {standaloneWorks.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-[16px] font-semibold text-ink">단독 작품</h3>
                <span className="text-[12px] text-muted">— {standaloneWorks.length}개</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {standaloneWorks.map((s) => (
                  <Link
                    key={s.id}
                    href={`/works/${s.number}`}
                    className="group p-4 bg-bg-2 border border-line rounded-[14px] hover:border-accent-rose/40 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-9 h-9 grid place-items-center rounded-lg bg-gradient-to-br from-accent-rose/15 to-accent-gold/15 text-accent-rose">
                        {s.kind === "movie" ? <Film className="w-4 h-4" /> : <Tv2 className="w-4 h-4" />}
                      </div>
                      <span className="px-1.5 py-0.5 rounded-full bg-ink/[0.06] text-ink-soft text-[9.5px] font-medium">
                        {s.kind === "movie" ? "영화" : s.kind === "drama" ? "드라마" : "기타"}
                      </span>
                    </div>
                    <h4 className="text-[14px] font-semibold text-ink leading-tight line-clamp-2 group-hover:text-accent-rose transition-colors">
                      {s.title ?? `작품 #${s.number}`}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recent news */}
      {recentNews.length > 0 && (
        <section className="py-20">
          <div className="max-w-site mx-auto px-6">
            <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
              <div>
                <h2 className="font-serif text-[clamp(28px,4vw,38px)] font-semibold mb-2">
                  최근 근황 · 후일담
                </h2>
                <p className="text-ink-soft">
                  <Newspaper className="w-4 h-4 inline-block -mt-0.5 mr-1.5 text-accent-rose" />
                  결혼 · 이혼 · 최신 근황을 모았어요
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentNews.map((c) => (
                <Link
                  key={c.id}
                  href={`/contestants/${c.id}`}
                  className="block bg-bg-2 border border-line rounded-[14px] overflow-hidden hover:border-accent-rose/40 hover:-translate-y-0.5 transition-all"
                >
                  <YouTubeThumbnail
                    youtubeId={c.highlights?.[0]?.youtube_id ?? null}
                    nameInitial={c.name_initial ?? c.name}
                    color={c.portrait_color}
                    status={c.current_status}
                    size="md"
                    sourceChannel={c.highlights?.[0]?.source_channel ?? null}
                  />
                  <div className="p-5 pt-3">
                    <p className="text-[15px] font-semibold mb-1">
                      {c.name}
                      {c.season && (
                        <span className="text-muted text-[12px] font-normal ml-1.5">
                          {c.season.title}
                        </span>
                      )}
                    </p>
                    <p className="text-[12px] text-muted mb-3">{c.job ?? "—"}</p>
                    {c.recent_news && (
                      <p className="text-[13px] text-ink-soft leading-relaxed line-clamp-3">
                        {c.recent_news}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured contestants */}
      {featured.length > 0 && (
        <section className="py-20 bg-bg-2 border-y border-line">
          <div className="max-w-site mx-auto px-6">
            <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
              <div>
                <h2 className="font-serif text-[clamp(28px,4vw,38px)] font-semibold mb-2">
                  새로 추가된 캐릭터
                </h2>
                <p className="text-ink-soft">
                  <Sparkles className="w-4 h-4 inline-block -mt-0.5 mr-1.5 text-accent-rose" />
                  최근 등록된 카드부터
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((c) => (
                <ContestantCard key={c.id} contestant={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <section className="py-20">
          <div className="max-w-site mx-auto px-6">
            <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
              <div>
                <h2 className="font-serif text-[clamp(28px,4vw,38px)] font-semibold mb-2">
                  최신 커뮤니티 글
                </h2>
                <p className="text-ink-soft">방금 올라온 이야기</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {recentPosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      <section className="py-20 bg-bg-2 border-t border-line">
        <div className="max-w-site mx-auto px-6">
          <h2 className="font-serif text-[clamp(28px,4vw,38px)] font-semibold mb-8">
            르헤메스가 다른 이유
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="p-7 bg-bg-3 border border-line rounded-[14px] hover:border-line-strong hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 grid place-items-center rounded-xl font-serif text-xl font-semibold text-bg bg-gradient-to-br from-accent-rose to-accent-gold mb-4">
                ①
              </div>
              <h3 className="text-[18px] font-semibold mb-2.5">모든 작품의 캐릭터 사전</h3>
              <p className="text-ink-soft text-[14px] leading-relaxed">
                영화·드라마·예능을 가리지 않고, 보고 있는 작품의 캐릭터가 여기 한 곳에 모입니다.
                배우, 직업, 특징, 매력 포인트, 후일담까지.
              </p>
            </div>
            <div className="p-7 bg-bg-3 border border-line rounded-[14px] hover:border-line-strong hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 grid place-items-center rounded-xl font-serif text-xl font-semibold text-bg bg-gradient-to-br from-accent-rose to-accent-gold mb-4">
                ②
              </div>
              <h3 className="text-[18px] font-semibold mb-2.5">나무위키보다 편한 UX</h3>
              <p className="text-ink-soft text-[14px] leading-relaxed">
                긴 텍스트 속에서 찾던 정보, 클릭 두세 번이면 끝.
                작품별·배우별·유형별 필터, 그리고 게임 스탯 — 팬이 직접 평가하는 캐릭터 점수.
              </p>
            </div>
            <div className="p-7 bg-bg-3 border border-line rounded-[14px] hover:border-line-strong hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 grid place-items-center rounded-xl font-serif text-xl font-semibold text-bg bg-gradient-to-br from-accent-rose to-accent-gold mb-4">
                ③
              </div>
              <h3 className="text-[18px] font-semibold mb-2.5">실시간 채팅 + 익명 커뮤니티</h3>
              <p className="text-ink-soft text-[14px] leading-relaxed">
                가입 없이 닉네임만 정하면 끝. 다른 팬들과 실시간으로 이야기하고, 캐릭터에 대한 생각을 나눠요.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
