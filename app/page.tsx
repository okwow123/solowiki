// app/page.tsx
import Link from "next/link";
import { ArrowRight, Users, MessageCircle, Sparkles, Newspaper } from "lucide-react";
import { getAllSeasons, getContestantCountBySeason } from "@/lib/data/seasons";
import { getFeaturedContestants } from "@/lib/data/contestants";
import { getRecentPosts } from "@/lib/data/posts";
import { getRecentNews } from "@/lib/data/contestants";
import { SeasonGrid } from "@/components/season/SeasonGrid";
import { ContestantCard } from "@/components/contestant/ContestantCard";
import { PostCard } from "@/components/community/PostCard";
import { YouTubeThumbnail } from "@/components/contestant/YouTubeThumbnail";

export default async function HomePage() {
  const [seasons, countMap, featured, recentPosts, recentNews] = await Promise.all([
    getAllSeasons(),
    getContestantCountBySeason(),
    getFeaturedContestants(8),
    getRecentPosts(5),
    getRecentNews(6),
  ]);

  const totalContestants = Array.from(countMap.values()).reduce((a, b) => a + b, 0);

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
            SOLO DATING SHOW · FAN ARCHIVE
          </p>
          <h1 className="font-serif text-[clamp(40px,6vw,68px)] leading-[1.12] font-semibold tracking-tight mb-6">
            솔로 데이팅의 모든 순간,<br />
            <span className="bg-gradient-to-br from-accent-rose to-accent-gold bg-clip-text text-transparent">
              솔로위키
            </span>
            에 모이다.
          </h1>
          <p className="text-ink-soft text-[17px] max-w-2xl mx-auto mb-10">
            1기부터 33기까지 — 출연자 도감, 커플 현황, 게임 스탯, 하이라이트 영상, 익명 팬 커뮤니티.
            <br />
            로그인 없이, 편하게, 익명으로.
          </p>
          <div className="flex gap-3 justify-center flex-wrap mb-16">
            <Link
              href="/seasons"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-[15px] bg-gradient-to-br from-accent-rose to-accent-gold text-bg hover:brightness-110 transition-all"
            >
              <Users className="w-4 h-4" />
              출연자 도감
            </Link>
            <Link
              href="/community/1"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-[15px] border border-line-strong text-ink hover:bg-bg-3 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              커뮤니티 구경
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { n: seasons.length || 33, label: "전 기수" },
              { n: totalContestants || 200, label: "출연자 정보" },
              { n: 0, label: "로그인 필요" },
              { n: 100, label: "% 익명" },
            ].map((s) => (
              <div
                key={s.label}
                className="px-3 py-5 border border-line rounded-[14px] bg-ink/[0.02]"
              >
                <strong className="block font-serif text-3xl text-ink font-semibold">
                  {s.n === 100 ? "100%" : s.n}
                </strong>
                <span className="text-muted text-[13px]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasons Grid */}
      <section className="py-20">
        <div className="max-w-site mx-auto px-6">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
            <div>
              <h2 className="font-serif text-[clamp(28px,4vw,38px)] font-semibold mb-2">
                기수 도감
              </h2>
              <p className="text-ink-soft">기수를 클릭하면 출연자 카드를 볼 수 있어요.</p>
            </div>
            <Link
              href="/seasons"
              className="text-[14px] text-ink-soft hover:text-ink flex items-center gap-1 transition-colors"
            >
              전체 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <SeasonGrid seasons={seasons} countMap={countMap} />
        </div>
      </section>

      {/* Recent news — 결혼/이혼/근황 하이라이트 */}
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
                        <span className="text-muted text-[12px] font-normal ml-1.5">{c.season.number}기</span>
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
                  새로 추가된 출연자
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
            솔로위키가 다른 이유
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: "①",
                title: "팬이 정리한 출연자 도감",
                desc: "1기부터 33기까지, 인스타·유튜브·직업·나이·사는 곳·특이사항까지 한 페이지에.",
              },
              {
                n: "②",
                title: "나무위키보다 편한 UX",
                desc: "긴 텍스트 속에서 찾던 정보, 클릭 두세 번이면 끝. 시즌별·직업별·지역별 필터.",
              },
              {
                n: "③",
                title: "로그인 없는 익명 게시판",
                desc: "가입 없이 닉네임만 정하면 끝. 감정 부담 없이 출연자에 대한 이야기를 나눠요.",
              },
            ].map((f) => (
              <div
                key={f.n}
                className="p-7 bg-bg-3 border border-line rounded-[14px] hover:border-line-strong hover:-translate-y-0.5 transition-all"
              >
                <div className="w-11 h-11 grid place-items-center rounded-xl font-serif text-xl font-semibold text-bg bg-gradient-to-br from-accent-rose to-accent-gold mb-4">
                  {f.n}
                </div>
                <h3 className="text-[18px] font-semibold mb-2.5">{f.title}</h3>
                <p className="text-ink-soft text-[14px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
