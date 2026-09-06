// app/preview/page.tsx
// 디자인 미리보기 — Supabase 연결 없이 카드/스탯/페이지 UI 확인용
// 운영 데이터와는 무관. /preview?tab=home|season|card|detail

import { PortraitPlaceholder } from "@/components/contestant/PortraitPlaceholder";
import { ContestantCard } from "@/components/contestant/ContestantCard";
import { StatBar } from "@/components/contestant/StatBar";
import { PostCard } from "@/components/community/PostCard";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { cn, formatNumber } from "@/lib/utils";
import { Heart } from "lucide-react";
import Link from "next/link";
import type { ContestantWithStats, PostWithRefs } from "@/lib/types";

export const metadata = {
  title: "디자인 미리보기",
  description: "Supabase 연결 전 디자인 확인용 페이지",
};

// ====== Sample data (no DB) ======
const sampleContestants: ContestantWithStats[] = [
  {
    id: "p1", season_id: 1, name: "영호", name_initial: "영호", gender: "male",
    birth_date: "1990-04-12", age_at_appearance: 34, job: "사업가", job_category: "자영업",
    location_city: "서울", location_district: "강남", mbti: "ENTJ", height_cm: 182,
    body_type: null, education: null, intro: "듬직한 첫인상, 묵직한 말투.",
    charm_points: ["듬직", "리더십", "듬직한목소리"], current_status: "married",
    partner_id: "p5", instagram_handle: "sample_jh", instagram_followers: 124_000,
    tiktok_handle: null, tiktok_followers: null, youtube_handle: null,
    ideal_type: null, catchphrase: null, hobbies: null,
    marital_history: "unknown", is_final_couple: false, final_choice: null,
    eliminated_episode: null, recent_news: null, data_source: null,
    confidence: "high",
    portrait_color: "rose", appearance_order: 1, is_published: true,
    created_at: "2026-01-01", updated_at: "2026-01-01",
    stats: { contestant_id: "p1", overall_charm: 82, villain_power: 65, appearance: 78, inner_qualities: 88, career_score: 70, age_score: 50, conversation: 75, style_score: 70, intelligence_score: 78, appetite: 50, updated_at: "2026-01-01" },
    season: { id: 1, number: 1, title: "1기", air_date_start: "2021-09-19", air_date_end: "2021-12-22", episode_count: 24, description: null, is_published: true, sort_order: 0, created_at: "2026-01-01" },
    highlights: [],
    partner: { id: "p5", name: "영자", name_initial: "영자", portrait_color: "rose" },
  },
  {
    id: "p2", season_id: 1, name: "영수", name_initial: "영수", gender: "male",
    birth_date: "1993-07-22", age_at_appearance: 31, job: "변호사", job_category: "전문직",
    location_city: "서울", location_district: "서초", mbti: "INTJ", height_cm: 178,
    body_type: null, education: null, intro: "분석적, 신중한 스타일.",
    charm_points: ["지적", "차분", "성실"], current_status: "married",
    partner_id: "p6", instagram_handle: null, instagram_followers: null,
    tiktok_handle: null, tiktok_followers: null, youtube_handle: null,
    ideal_type: null, catchphrase: null, hobbies: null,
    marital_history: "unknown", is_final_couple: false, final_choice: null,
    eliminated_episode: null, recent_news: null, data_source: null,
    confidence: "high",
    portrait_color: "navy", appearance_order: 2, is_published: true,
    created_at: "2026-01-01", updated_at: "2026-01-01",
    stats: { contestant_id: "p2", overall_charm: 75, villain_power: 30, appearance: 70, inner_qualities: 70, career_score: 95, age_score: 60, conversation: 60, style_score: 85, intelligence_score: 95, appetite: 50, updated_at: "2026-01-01" },
    season: null, highlights: [],
    partner: { id: "p6", name: "영아", name_initial: "영아", portrait_color: "plum" },
  },
  {
    id: "p3", season_id: 1, name: "영훈", name_initial: "영훈", gender: "male",
    birth_date: "1994-03-05", age_at_appearance: 30, job: "강사", job_category: "직장인",
    location_city: "서울", location_district: "마포", mbti: "ENFP", height_cm: 175,
    body_type: null, education: null, intro: "밝은 에너지, 유머러스.",
    charm_points: ["유머", "활발", "긍정"], current_status: "single",
    partner_id: null, instagram_handle: "sample_ch", instagram_followers: 89_500,
    tiktok_handle: null, tiktok_followers: null, youtube_handle: null,
    ideal_type: null, catchphrase: null, hobbies: null,
    marital_history: "unknown", is_final_couple: false, final_choice: null,
    eliminated_episode: null, recent_news: null, data_source: null,
    confidence: "high",
    portrait_color: "gold", appearance_order: 3, is_published: true,
    created_at: "2026-01-01", updated_at: "2026-01-01",
    stats: { contestant_id: "p3", overall_charm: 80, villain_power: 25, appearance: 75, inner_qualities: 85, career_score: 65, age_score: 65, conversation: 95, style_score: 88, intelligence_score: 70, appetite: 60, updated_at: "2026-01-01" },
    season: null, highlights: [],
    partner: null,
  },
  {
    id: "p4", season_id: 1, name: "영경", name_initial: "영경", gender: "female",
    birth_date: "1997-11-18", age_at_appearance: 27, job: "크리에이터", job_category: "예술·스포츠",
    location_city: "서울", location_district: "서초", mbti: "ENFP", height_cm: 165,
    body_type: null, education: null, intro: "자유롭고 개성 강한 스타일.",
    charm_points: ["자유", "개성", "트렌디"], current_status: "returned",
    partner_id: null, instagram_handle: "sample_yk", instagram_followers: 256_000,
    tiktok_handle: "sample_yk", tiktok_followers: 412_000,
    youtube_handle: null,
    ideal_type: null, catchphrase: null, hobbies: null,
    marital_history: "unknown", is_final_couple: false, final_choice: null,
    eliminated_episode: null, recent_news: null, data_source: null,
    confidence: "high",
    portrait_color: "plum", appearance_order: 4, is_published: true,
    created_at: "2026-01-01", updated_at: "2026-01-01",
    stats: { contestant_id: "p4", overall_charm: 90, villain_power: 60, appearance: 96, inner_qualities: 78, career_score: 70, age_score: 80, conversation: 88, style_score: 96, intelligence_score: 72, appetite: 50, updated_at: "2026-01-01" },
    season: null, highlights: [],
    partner: null,
  },
  {
    id: "p5", season_id: 1, name: "영자", name_initial: "영자", gender: "female",
    birth_date: "1996-02-14", age_at_appearance: 28, job: "디자이너", job_category: "직장인",
    location_city: "서울", location_district: "성수", mbti: "INFP", height_cm: 162,
    body_type: null, education: null, intro: "감성적이고 섬세한 매력.",
    charm_points: ["감성", "섬세", "예술"], current_status: "married",
    partner_id: "p1", instagram_handle: "sample_ke", instagram_followers: 78_200,
    tiktok_handle: null, tiktok_followers: null, youtube_handle: null,
    ideal_type: null, catchphrase: null, hobbies: null,
    marital_history: "unknown", is_final_couple: false, final_choice: null,
    eliminated_episode: null, recent_news: null, data_source: null,
    confidence: "high",
    portrait_color: "rose", appearance_order: 5, is_published: true,
    created_at: "2026-01-01", updated_at: "2026-01-01",
    stats: { contestant_id: "p5", overall_charm: 88, villain_power: 20, appearance: 92, inner_qualities: 90, career_score: 80, age_score: 55, conversation: 75, style_score: 92, intelligence_score: 78, appetite: 50, updated_at: "2026-01-01" },
    season: null, highlights: [],
    partner: { id: "p1", name: "영호", name_initial: "영호", portrait_color: "rose" },
  },
  {
    id: "p6", season_id: 1, name: "영아", name_initial: "영아", gender: "female",
    birth_date: "1995-09-30", age_at_appearance: 29, job: "마케터", job_category: "직장인",
    location_city: "서울", location_district: "강남", mbti: "ESTJ", height_cm: 168,
    body_type: null, education: null, intro: "쿨한 외모, 따뜻한 내면.",
    charm_points: ["쿨", "이성적", "패션"], current_status: "married",
    partner_id: "p2", instagram_handle: null, instagram_followers: null,
    tiktok_handle: null, tiktok_followers: null, youtube_handle: null,
    ideal_type: null, catchphrase: null, hobbies: null,
    marital_history: "unknown", is_final_couple: false, final_choice: null,
    eliminated_episode: null, recent_news: null, data_source: null,
    confidence: "high",
    portrait_color: "plum", appearance_order: 6, is_published: true,
    created_at: "2026-01-01", updated_at: "2026-01-01",
    stats: { contestant_id: "p6", overall_charm: 82, villain_power: 40, appearance: 90, inner_qualities: 80, career_score: 88, age_score: 60, conversation: 70, style_score: 95, intelligence_score: 85, appetite: 50, updated_at: "2026-01-01" },
    season: null, highlights: [],
    partner: { id: "p2", name: "영수", name_initial: "영수", portrait_color: "navy" },
  },
  {
    id: "p7", season_id: 1, name: "영란", name_initial: "영란", gender: "female",
    birth_date: "1998-06-08", age_at_appearance: 26, job: "요리사", job_category: "자영업",
    location_city: "서울", location_district: "이태원", mbti: "ISFP", height_cm: 160,
    body_type: null, education: null, intro: "조용하지만 강한 매력.",
    charm_points: ["차분", "실용", "진정성"], current_status: "single",
    partner_id: null, instagram_handle: "sample_sr", instagram_followers: 42_000,
    tiktok_handle: null, tiktok_followers: null, youtube_handle: null,
    ideal_type: null, catchphrase: null, hobbies: null,
    marital_history: "unknown", is_final_couple: false, final_choice: null,
    eliminated_episode: null, recent_news: null, data_source: null,
    confidence: "high",
    portrait_color: "sage", appearance_order: 7, is_published: true,
    created_at: "2026-01-01", updated_at: "2026-01-01",
    stats: { contestant_id: "p7", overall_charm: 78, villain_power: 25, appearance: 82, inner_qualities: 88, career_score: 85, age_score: 65, conversation: 65, style_score: 82, intelligence_score: 80, appetite: 70, updated_at: "2026-01-01" },
    season: null, highlights: [],
    partner: null,
  },
  {
    id: "p8", season_id: 1, name: "영진", name_initial: "영진", gender: "male",
    birth_date: "1991-12-25", age_at_appearance: 33, job: "의사", job_category: "전문직",
    location_city: "서울", location_district: "송파", mbti: "ISFJ", height_cm: 180,
    body_type: null, education: null, intro: "다정하고 꼼꼼한 성격.",
    charm_points: ["따뜻", "배려", "신뢰"], current_status: "married",
    partner_id: null, instagram_handle: null, instagram_followers: null,
    tiktok_handle: null, tiktok_followers: null, youtube_handle: null,
    ideal_type: null, catchphrase: null, hobbies: null,
    marital_history: "unknown", is_final_couple: false, final_choice: null,
    eliminated_episode: null, recent_news: null, data_source: null,
    confidence: "high",
    portrait_color: "sage", appearance_order: 8, is_published: true,
    created_at: "2026-01-01", updated_at: "2026-01-01",
    stats: { contestant_id: "p8", overall_charm: 78, villain_power: 20, appearance: 70, inner_qualities: 92, career_score: 95, age_score: 70, conversation: 70, style_score: 65, intelligence_score: 85, appetite: 50, updated_at: "2026-01-01" },
    season: null, highlights: [],
    partner: null,
  },
];

const samplePosts: PostWithRefs[] = [
  {
    id: "sp1", season_id: 1, contestant_id: "p1",
    content: "영호 첫 등장 진짜 압도적이었음. 그때 운명이었나..",
    anonymous_name: "달빛한입", vote_up_count: 24, vote_down_count: 1, report_count: 0,
    is_hidden: false,
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    season: { id: 1, number: 1, title: "1기" },
    contestant: { id: "p1", name: "영호", name_initial: "영호", portrait_color: "rose" },
  },
  {
    id: "sp2", season_id: 1, contestant_id: null,
    content: "1기 다시 보면 영수 의외의 명대사가 많아 ㅋㅋ 차분한 척 하는데 웃긴 포인트가 있음",
    anonymous_name: "솔로관찰자", vote_up_count: 18, vote_down_count: 0, report_count: 0,
    is_hidden: false,
    created_at: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    season: { id: 1, number: 1, title: "1기" },
    contestant: null,
  },
  {
    id: "sp3", season_id: 1, contestant_id: "p4",
    content: "영경 패션 진짜 매 회차 다른 컨셉인데 하나같이 다 잘 어울려. 스타일 스탯 96이 무슨.",
    anonymous_name: "밤의독자", vote_up_count: 31, vote_down_count: 2, report_count: 0,
    is_hidden: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    season: { id: 1, number: 1, title: "1기" },
    contestant: { id: "p4", name: "영경", name_initial: "영경", portrait_color: "plum" },
  },
];

const sampleSeasons = Array.from({ length: 33 }, (_, i) => ({
  id: i + 1, number: i + 1, title: `${i + 1}기`, is_published: true, sort_order: i,
  air_date_start: null, air_date_end: null, episode_count: null, description: null,
  created_at: "2026-01-01",
}));

interface PageProps {
  searchParams: { tab?: string };
}

export default function PreviewPage({ searchParams }: PageProps) {
  const tab = searchParams.tab ?? "card";

  return (
    <section className="py-10">
      <div className="max-w-site mx-auto px-6">
        <div className="mb-8">
          <p className="text-muted text-[12px] tracking-widest mb-2">DESIGN PREVIEW</p>
          <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-semibold mb-2">
            디자인 미리보기
          </h1>
          <p className="text-ink-soft text-[14.5px]">
            Supabase 연결 전, 카드/스탯/페이지 UI를 먼저 확인할 수 있어요. 운영 데이터와는 무관.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap border-b border-line">
          {[
            { key: "card", label: "출연자 카드" },
            { key: "detail", label: "출연자 상세" },
            { key: "season", label: "기수 페이지" },
            { key: "home", label: "홈" },
          ].map((t) => (
            <Link
              key={t.key}
              href={`/preview?tab=${t.key}`}
              className={cn(
                "px-4 py-2.5 text-[14px] -mb-px border-b-2 transition-colors",
                tab === t.key
                  ? "border-accent-rose text-ink"
                  : "border-transparent text-ink-soft hover:text-ink"
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {tab === "card" && <CardPreview />}
        {tab === "detail" && <DetailPreview />}
        {tab === "season" && <SeasonPreview />}
        {tab === "home" && <HomePreview />}
      </div>
    </section>
  );
}

function CardPreview() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-[18px] font-semibold mb-4">그리드 (4열)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sampleContestants.slice(0, 4).map((c) => (
            <ContestantCard key={c.id} contestant={c} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-[18px] font-semibold mb-4">풀 카드 (모든 스탯 보임)</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {sampleContestants.slice(0, 2).map((c) => (
            <FullCard key={c.id} contestant={c} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-[18px] font-semibold mb-4">포트레이트 컬러 팔레트</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(["rose", "gold", "navy", "sage", "plum"] as const).map((color) => (
            <PortraitPlaceholder
              key={color}
              nameInitial="○○"
              color={color}
              status="single"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FullCard({ contestant: c }: { contestant: ContestantWithStats }) {
  return (
    <div className="bg-bg-3 border border-line rounded-[14px] overflow-hidden">
      <PortraitPlaceholder
        nameInitial={c.name_initial ?? c.name}
        color={c.portrait_color}
        status={c.current_status}
      />
      <div className="p-5">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-[18px] font-semibold">{c.name}</h3>
          <span className="text-[11px] text-muted">1기</span>
        </div>
        <p className="text-muted text-[13px] mb-4">
          {c.job} · {c.location_city} {c.location_district}
        </p>
        {c.stats && (
          <div className="space-y-2.5">
            <StatBar stat="overall_charm" value={c.stats.overall_charm} />
            <StatBar stat="conversation" value={c.stats.conversation} />
            <StatBar stat="inner_qualities" value={c.stats.inner_qualities} />
            <StatBar stat="intelligence_score" value={c.stats.intelligence_score} />
            <StatBar stat="villain_power" value={c.stats.villain_power} />
            <StatBar stat="style_score" value={c.stats.style_score} />
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mt-4">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-ink/[0.06] text-ink-soft">
            {c.mbti}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-ink/[0.06] text-ink-soft">
            {c.gender === "male" ? "남" : "여"}
          </span>
          {c.instagram_handle && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent-rose/10 text-accent-rose border border-accent-rose/20">
              IG {formatNumber(c.instagram_followers)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailPreview() {
  const c = sampleContestants[0]; // 영호
  return (
    <div className="bg-bg-2 border border-line rounded-[14px] overflow-hidden">
      <div className="grid md:grid-cols-[280px_1fr]">
        <div className="p-6 md:p-8">
          <PortraitPlaceholder
            nameInitial={c.name_initial ?? c.name}
            color={c.portrait_color}
            size="xl"
          />
        </div>
        <div className="p-6 md:p-8 md:pl-0">
          <div className="flex flex-wrap items-center gap-2 mb-3 text-[12px] text-muted">
            <span className="px-2.5 py-1 rounded-md bg-ink/[0.06] text-ink-soft">1기</span>
            <span className="px-2.5 py-1 rounded-md bg-ink/[0.06] text-ink-soft">남</span>
            <span className="px-2.5 py-1 rounded-md bg-accent-rose/90 text-bg border-transparent">결혼</span>
          </div>
          <h1 className="font-serif text-[clamp(32px,5vw,48px)] font-semibold leading-tight mb-3">
            {c.name} <span className="text-muted text-[18px] font-normal ml-3">· 36세</span>
          </h1>
          <p className="text-ink-soft text-[15px] leading-relaxed mb-5 italic">
            "{c.intro}"
          </p>
          <p className="text-ink-soft text-[14px] mb-1">사업가 · 서울 강남</p>
          <p className="text-ink-soft text-[14px] mb-1">출연 당시 34세 · 현재 36세</p>
          {c.partner && (
            <div className="mt-5 p-3.5 bg-bg-3 border border-line rounded-[10px]">
              <div className="flex items-center gap-2 text-[12px] text-muted mb-2">
                <Heart className="w-3.5 h-3.5 text-accent-rose" />
                현재 파트너
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg grid place-items-center font-serif font-semibold text-ink/90 text-sm"
                  style={{ background: "linear-gradient(135deg, #d96b7c, #6e2c39)" }}
                >
                  {c.partner.name_initial}
                </div>
                <span className="font-semibold">{c.partner.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SeasonPreview() {
  return (
    <div>
      <h2 className="text-[18px] font-semibold mb-4">기수 그리드 (33기)</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {sampleSeasons.map((s) => (
          <div
            key={s.id}
            className="relative aspect-square grid place-items-center bg-bg-3 border border-line rounded-[12px] hover:border-accent-rose/40 transition-colors"
          >
            <div className="text-center">
              <div className="font-serif text-2xl font-semibold text-ink">{s.number}</div>
              <div className="text-[11px] text-muted mt-0.5">기</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePreview() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {samplePosts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
