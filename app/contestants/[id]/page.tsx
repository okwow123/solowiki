// app/contestants/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Instagram, Youtube, Music2, MapPin, Briefcase, GraduationCap, Cake, Heart, Users, Quote, Sparkles, Ruler, Activity, HeartHandshake, Newspaper } from "lucide-react";
import { getContestantById } from "@/lib/data/contestants";
import { getPostsBySeason } from "@/lib/data/posts";
import { YouTubeThumbnail } from "@/components/contestant/YouTubeThumbnail";
import { type StatKey } from "@/components/contestant/StatBar";
import { VoteableStatBar } from "@/components/contestant/VoteableStatBar";
import { HighlightVideo } from "@/components/contestant/HighlightVideo";
import { PostForm } from "@/components/community/PostForm";
import { PostCard } from "@/components/community/PostCard";
import { currentAge, formatNumber } from "@/lib/utils";
import { GENDER_LABELS, STATUS_LABELS, MARITAL_LABELS } from "@/lib/types";
import { getOrCreateVoterHash } from "@/lib/server/voter";
import { createClient } from "@supabase/supabase-js";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  const c = await getContestantById(params.id);
  if (!c) return { title: "출연자" };
  return {
    title: `${c.name}${c.season ? ` (${c.season.number}기)` : ""}`,
    description: `${c.name} · ${c.job ?? ""} · ${c.location_city ?? ""} ${c.location_district ?? ""}`.trim(),
  };
}

export default async function ContestantDetailPage({ params }: PageProps) {
  const contestant = await getContestantById(params.id);
  if (!contestant) notFound();

  const age = currentAge(contestant.birth_date, contestant.age_at_appearance);
  const voterHash = getOrCreateVoterHash();

  const [posts, allStats, myVotesRes] = await Promise.all([
    contestant.season ? getPostsBySeason(contestant.season.id, 20) : Promise.resolve([]),
    Promise.resolve(
      contestant.stats
        ? ([
            ["overall_charm", contestant.stats.overall_charm],
            ["villain_power", contestant.stats.villain_power],
            ["appearance", contestant.stats.appearance],
            ["inner_qualities", contestant.stats.inner_qualities],
            ["career_score", contestant.stats.career_score],
            ["age_score", contestant.stats.age_score],
            ["conversation", contestant.stats.conversation],
            ["style_score", contestant.stats.style_score],
            ["intelligence_score", contestant.stats.intelligence_score],
            ["appetite", contestant.stats.appetite],
          ] as [StatKey, number][])
        : []
    ),
    // 사용자가 이 출연자의 어떤 스탯에 투표했는지
    voterHash
      ? createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
          .from("stat_votes")
          .select("stat_key")
          .eq("contestant_id", params.id)
          .eq("voter_hash", voterHash)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const myVotedStats = new Set((myVotesRes.data || []).map((v) => v.stat_key));

  const filteredPosts = posts.filter(
    (p) => p.contestant?.id === contestant.id || !p.contestant_id
  );

  return (
    <section className="py-12">
      <div className="max-w-site mx-auto px-6">
        {/* Hero card — image on top (16:9, no crop) + info below */}
        <div className="bg-bg-2 border border-line rounded-[14px] overflow-hidden mb-8">
          <YouTubeThumbnail
            youtubeId={contestant.highlights?.[0]?.youtube_id ?? null}
            nameInitial={contestant.name_initial ?? contestant.name}
            color={contestant.portrait_color}
            status={contestant.current_status}
            size="video"
            sourceChannel={contestant.highlights?.[0]?.source_channel ?? null}
            href={
              contestant.highlights?.[0]?.youtube_id
                ? `https://www.youtube.com/watch?v=${contestant.highlights[0].youtube_id}`
                : undefined
            }
            className="rounded-none border-b border-line"
          />
          <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3 text-[12px] text-muted">
                {contestant.season && (
                  <Link
                    href={`/works/${contestant.season.number}`}
                    className="px-2.5 py-1 rounded-md bg-ink/[0.06] text-ink-soft hover:text-ink transition-colors"
                  >
                    {contestant.season.number}기
                  </Link>
                )}
                <span className="px-2.5 py-1 rounded-md bg-ink/[0.06] text-ink-soft">
                  {GENDER_LABELS[contestant.gender]}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-ink/[0.06] text-ink-soft">
                  {STATUS_LABELS[contestant.current_status]}
                </span>
                {contestant.marital_history && contestant.marital_history !== "unknown" && (
                  <span className="px-2.5 py-1 rounded-md bg-ink/[0.06] text-ink-soft">
                    {MARITAL_LABELS[contestant.marital_history]}
                  </span>
                )}
                {contestant.is_final_couple && (
                  <span className="px-2.5 py-1 rounded-md bg-accent-rose/15 text-accent-rose border border-accent-rose/30 font-medium">
                    <Sparkles className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                    최종 커플
                  </span>
                )}
                {contestant.eliminated_episode != null && (
                  <span className="px-2.5 py-1 rounded-md bg-ink/[0.04] text-muted">
                    {contestant.eliminated_episode}회차 하차
                  </span>
                )}
              </div>

              <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-semibold leading-tight mb-3">
                {contestant.name}
                {age != null && (
                  <span className="text-muted text-[18px] font-normal ml-3">
                    · {age}세
                  </span>
                )}
              </h1>

              {contestant.intro && (
                <p className="text-ink-soft text-[15px] leading-relaxed mb-3 italic">
                  "{contestant.intro}"
                </p>
              )}

              {contestant.catchphrase && (
                <div className="mb-5 px-4 py-3 bg-gradient-to-br from-accent-rose/8 to-accent-gold/8 border-l-2 border-accent-rose rounded-r-[10px]">
                  <p className="text-[11px] uppercase tracking-widest text-accent-rose/80 font-medium mb-1 flex items-center gap-1.5">
                    <Quote className="w-3 h-3" /> 시그니처 / 유행어
                  </p>
                  <p className="text-ink text-[14.5px] leading-relaxed font-medium">
                    {contestant.catchphrase}
                  </p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-[14px]">
                {contestant.job && (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Briefcase className="w-4 h-4 text-muted shrink-0" />
                    <span>{contestant.job}</span>
                    {contestant.job_category && (
                      <span className="text-[11px] text-muted">({contestant.job_category})</span>
                    )}
                  </div>
                )}
                {(contestant.location_city || contestant.location_district) && (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <MapPin className="w-4 h-4 text-muted shrink-0" />
                    <span>
                      {contestant.location_city} {contestant.location_district}
                    </span>
                  </div>
                )}
                {age != null && (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Cake className="w-4 h-4 text-muted shrink-0" />
                    <span>출연 당시 {contestant.age_at_appearance}세 · 현재 {age}세</span>
                  </div>
                )}
                {contestant.education && (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <GraduationCap className="w-4 h-4 text-muted shrink-0" />
                    <span>{contestant.education}</span>
                  </div>
                )}
                {contestant.height_cm != null && (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Ruler className="w-4 h-4 text-muted shrink-0" />
                    <span>{contestant.height_cm}cm</span>
                    {contestant.body_type && (
                      <span className="text-[11px] text-muted">· {contestant.body_type}</span>
                    )}
                  </div>
                )}
                {contestant.body_type && contestant.height_cm == null && (
                  <div className="flex items-center gap-2 text-ink-soft">
                    <Activity className="w-4 h-4 text-muted shrink-0" />
                    <span>{contestant.body_type}</span>
                  </div>
                )}
              </div>

              {/* Social */}
              <div className="flex flex-wrap gap-2 mt-5">
                {contestant.instagram_handle && (
                  <a
                    href={`https://instagram.com/${contestant.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-rose/10 text-accent-rose border border-accent-rose/25 text-[12.5px] hover:bg-accent-rose/20 transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    {formatNumber(contestant.instagram_followers)}
                  </a>
                )}
                {contestant.youtube_handle && (
                  <a
                    href={`https://youtube.com/@${contestant.youtube_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-rose/10 text-accent-rose border border-accent-rose/25 text-[12.5px] hover:bg-accent-rose/20 transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    YouTube
                  </a>
                )}
                {contestant.tiktok_handle && (
                  <a
                    href={`https://tiktok.com/@${contestant.tiktok_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-rose/10 text-accent-rose border border-accent-rose/25 text-[12.5px] hover:bg-accent-rose/20 transition-colors"
                  >
                    <Music2 className="w-3.5 h-3.5" />
                    {formatNumber(contestant.tiktok_followers)}
                  </a>
                )}
              </div>

              {/* YouTube 출처 배지 — fan archive 정당성 */}
              {contestant.highlights?.[0]?.youtube_id && (
                <a
                  href={`https://www.youtube.com/watch?v=${contestant.highlights[0].youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center gap-2.5 px-3.5 py-2.5 bg-red-50/50 border border-red-200/60 rounded-[10px] text-[12.5px] text-ink-soft hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                  <Youtube className="w-4 h-4 text-red-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-ink font-semibold text-[12.5px]">
                      원본 영상 보러가기 — YouTube
                    </p>
                    {contestant.highlights[0].source_channel && (
                      <p className="text-muted text-[11px]">
                        © {contestant.highlights[0].source_channel} · 클릭 시 YouTube에서 재생
                      </p>
                    )}
                  </div>
                  <span className="text-muted text-[14px]">→</span>
                </a>
              )}

              {/* Partner link */}
              {contestant.partner && (
                <div className="mt-5 p-3.5 bg-bg-3 border border-line rounded-[10px]">
                  <div className="flex items-center gap-2 text-[12px] text-muted mb-2">
                    <Heart className="w-3.5 h-3.5 text-accent-rose" />
                    현재 파트너
                  </div>
                  <Link
                    href={`/contestants/${contestant.partner.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <div
                      className="w-10 h-10 rounded-lg grid place-items-center font-serif font-semibold text-ink/90 text-sm"
                      style={{
                        background: `linear-gradient(135deg, var(--accent-${contestant.partner.portrait_color}))`,
                      }}
                    >
                      {contestant.partner.name_initial ?? contestant.partner.name}
                    </div>
                    <span className="font-semibold group-hover:text-accent-rose transition-colors">
                      {contestant.partner.name}
                    </span>
                  </Link>
                </div>
              )}
            </div>
        </div>

        {/* v2 field cards: 이상형 / 취미 / 결혼이력 */}
        {(contestant.ideal_type || (contestant.hobbies && contestant.hobbies.length > 0)) && (
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {contestant.ideal_type && (
              <div className="bg-bg-2 border border-line rounded-[14px] p-5">
                <p className="text-[11px] uppercase tracking-widest text-muted font-medium mb-2.5 flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-accent-rose" /> 이상형
                </p>
                <p className="text-ink text-[14.5px] leading-relaxed">
                  {contestant.ideal_type}
                </p>
              </div>
            )}
            {contestant.hobbies && contestant.hobbies.length > 0 && (
              <div className="bg-bg-2 border border-line rounded-[14px] p-5">
                <p className="text-[11px] uppercase tracking-widest text-muted font-medium mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent-gold" /> 취미
                </p>
                <div className="flex flex-wrap gap-2">
                  {contestant.hobbies.map((h) => (
                    <span
                      key={h}
                      className="text-[12.5px] px-3 py-1 rounded-full bg-ink/[0.05] text-ink-soft"
                    >
                      # {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 최근 근황 (recent_news) — 가장 눈에 띄는 신규 필드 */}
        {contestant.recent_news && (
          <div className="mb-6 bg-gradient-to-br from-accent-rose/[0.06] to-accent-gold/[0.06] border border-accent-rose/20 rounded-[14px] p-6">
            <p className="text-[11px] uppercase tracking-widest text-accent-rose/80 font-medium mb-2.5 flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5" /> 최근 근황 · 후일담
            </p>
            <p className="text-ink text-[15px] leading-relaxed whitespace-pre-line">
              {contestant.recent_news}
            </p>
            {contestant.data_source && (
              <p className="text-[11px] text-muted mt-3">
                출처:{" "}
                <a
                  href={contestant.data_source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-rose underline underline-offset-2"
                >
                  {(() => {
                    try {
                      return new URL(contestant.data_source).hostname.replace("www.", "");
                    } catch {
                      return contestant.data_source;
                    }
                  })()}
                </a>
              </p>
            )}
          </div>
        )}

        {/* 최종 커플 — 방송 내 매칭 결과 */}
        {contestant.is_final_couple && contestant.final_choice && (
          <div className="mb-6 px-5 py-4 bg-bg-2 border border-accent-rose/30 rounded-[14px] flex items-center gap-3">
            <Heart className="w-5 h-5 text-accent-rose shrink-0" />
            <div>
              <p className="text-[11px] uppercase tracking-widest text-accent-rose/80 font-medium mb-0.5">
                최종 선택
              </p>
              <p className="text-ink text-[15px]">
                <span className="font-semibold">{contestant.final_choice}</span>님과 최종 매칭
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Main column */}
          <div className="space-y-6">
            {/* Game stats — 투표 가능 */}
            {contestant.stats && (
              <div className="bg-bg-2 border border-line rounded-[14px] p-6">
                <h2 className="font-serif text-[22px] font-semibold mb-2 flex items-center gap-2">
                  <span className="text-accent-rose">◆</span> 게임 스탯
                </h2>
                <p className="text-[11.5px] text-muted mb-5">
                  ±1로 투표할 수 있어요. 같은 스탯은 1회만 가능. (쿠키 삭제 시 재투표)
                </p>
                <div className="grid sm:grid-cols-1 gap-y-3">
                  {allStats.map(([key, value]) => (
                    <VoteableStatBar
                      key={key}
                      contestantId={contestant.id}
                      stat={key}
                      value={value}
                      alreadyVoted={myVotedStats.has(key)}
                    />
                  ))}
                </div>
                {contestant.charm_points && contestant.charm_points.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-line">
                    <p className="text-[12px] text-muted uppercase tracking-widest mb-2.5">
                      매력 포인트
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {contestant.charm_points.map((p) => (
                        <span
                          key={p}
                          className="text-[12.5px] px-3 py-1 rounded-full bg-ink/[0.06] text-ink-soft"
                        >
                          #{p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Highlights */}
            {contestant.highlights.length > 0 && (
              <div>
                <h2 className="font-serif text-[22px] font-semibold mb-4 flex items-center gap-2">
                  <span className="text-accent-rose">▶</span> 하이라이트 영상
                </h2>
                <div className="grid gap-4">
                  {contestant.highlights.map((h) => (
                    <HighlightVideo
                      key={h.id}
                      youtubeId={h.youtube_id}
                      title={h.title}
                      description={h.description}
                      sourceChannel={h.source_channel}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Posts about this contestant */}
            <div>
              <h2 className="font-serif text-[22px] font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent-rose" />
                팬들이 남긴 이야기
              </h2>
              <div className="space-y-3">
                {filteredPosts.length === 0 ? (
                  <p className="text-muted text-[13.5px] py-6 text-center border border-dashed border-line rounded-[14px]">
                    아직 이 출연자에 대한 글이 없어요. 첫 글을 남겨보세요!
                  </p>
                ) : (
                  filteredPosts.slice(0, 5).map((p) => (
                    <PostCard
                      key={p.id}
                      post={p}
                      href={`/community/${p.season?.number ?? 1}#post-${p.id}`}
                      compact
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar — community post form */}
          <aside className="space-y-4">
            {contestant.season && (
              <PostForm
                seasonId={contestant.season.id}
                seasonNumber={contestant.season.number}
                contestantId={contestant.id}
              />
            )}
            <Link
              href={`/community/${contestant.season?.number ?? 1}`}
              className="block text-center px-4 py-3 border border-line-strong text-ink-soft text-[13px] rounded-full hover:bg-bg-3 transition-colors"
            >
              {contestant.season?.number ?? 1}기 전체 커뮤니티 →
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
