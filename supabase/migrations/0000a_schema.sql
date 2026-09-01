-- =========================================================================
-- 솔로위키 v2 마이그레이션 [1/2] — 스키마 (12KB)
-- Supabase SQL Editor에 붙여넣고 Run (기존 데이터는 모두 삭제됩니다)
-- =========================================================================

-- 1) DROP ALL
drop table if exists public.posts cascade;
drop table if exists public.post_votes cascade;
drop table if exists public.reports cascade;
drop table if exists public.highlights cascade;
drop table if exists public.contestant_stats cascade;
drop table if exists public.contestants cascade;
drop table if exists public.seasons cascade;
drop function if exists public.bump_post_counters() cascade;

-- 2) SCHEMA (v2 — 22개 필드)

-- =========================================================================
-- 솔로위키 · Solo Wiki — initial schema
-- =========================================================================
-- Copyright-safe positioning: user-curated fan data + UGC community.
-- No official broadcast material is stored. All contestant info is editor-curated.
-- =========================================================================

-- Enable required extensions
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "pg_trgm";     -- trigram search

-- =========================================================================
-- 1) seasons — 방송 기수
-- =========================================================================
create table public.seasons (
  id              bigserial primary key,
  number          int  not null unique check (number between 1 and 60),
  title           text,                              -- e.g. "25기" (공식 타이틀 직접 표기는 회피)
  air_date_start  date,
  air_date_end    date,
  episode_count   int,
  description     text,
  is_published    boolean not null default false,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

create index idx_seasons_published on public.seasons(is_published, number);

-- =========================================================================
-- 2) contestants — 출연자
-- =========================================================================
create table public.contestants (
  id                  uuid primary key default gen_random_uuid(),
  season_id           bigint not null references public.seasons(id) on delete cascade,
  name                text not null,
  name_initial        text,                          -- e.g. "김○수" (이니셜 마스킹)
  gender              text not null check (gender in ('male', 'female')),
  birth_date          date,
  age_at_appearance   int,
  job                 text,
  job_category        text,                          -- for filtering: 직장인/전문직/자영업/공공기관/예술·스포츠
  location_city       text,                          -- 서울/부산/...
  location_district   text,                          -- 강남/해운대/...
  mbti                text,
  height_cm           int,
  body_type           text,
  education           text,
  intro               text,                          -- 한 줄 소개
  ideal_type          text,                          -- 이상형 (출연자 본인 발언)
  catchphrase         text,                          -- 시그니처 멘트/유행어
  charm_points        text[],                        -- 매력 포인트 키워드 (해시태그)
  hobbies             text[],                        -- 취미
  marital_history     text not null default 'unknown' check (marital_history in ('never_married','divorced','twice_divorced','widowed','de_facto','unknown')),
  current_status      text not null default 'unknown' check (current_status in ('single','dating','married','divorced','returned','doubly_returned','unknown')),
  is_final_couple     boolean not null default false,  -- 방송 내 최종 커플 여부
  final_choice        text,                            -- 최종 선택한 파트너 가명 (nullable)
  eliminated_episode  int,                             -- 탈락 회차 (nullable)
  partner_id          uuid references public.contestants(id) on delete set null,
  instagram_handle    text,
  instagram_followers int,
  tiktok_handle       text,
  tiktok_followers    int,
  youtube_handle      text,
  recent_news         text,                            -- 최근 뉴스/근황 (1-2줄)
  data_source         text,                            -- 정보 출처 URL
  confidence          text not null default 'medium' check (confidence in ('high','medium','low')),
  portrait_color      text not null default 'rose' check (portrait_color in ('rose','gold','navy','sage','plum')),
  appearance_order    int not null default 0,
  is_published        boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_contestants_season      on public.contestants(season_id);
create index idx_contestants_gender     on public.contestants(gender);
create index idx_contestants_job        on public.contestants using gin (job gin_trgm_ops);
create index idx_contestants_location   on public.contestants(location_city);
create index idx_contestants_published  on public.contestants(is_published);
create index idx_contestants_name_trgm  on public.contestants using gin (name gin_trgm_ops);
create index idx_contestants_partner    on public.contestants(partner_id);

-- =========================================================================
-- 3) contestant_stats — 게임 스탯 (에디토리얼)
-- =========================================================================
create table public.contestant_stats (
  contestant_id  uuid primary key references public.contestants(id) on delete cascade,
  charm          int not null default 50 check (charm between 0 and 100),
  humor          int not null default 50 check (humor between 0 and 100),
  warmth         int not null default 50 check (warmth between 0 and 100),
  intelligence   int not null default 50 check (intelligence between 0 and 100),
  leadership     int not null default 50 check (leadership between 0 and 100),
  style          int not null default 50 check (style between 0 and 100),
  updated_at     timestamptz not null default now()
);

-- =========================================================================
-- 4) highlights — YouTube 하이라이트
-- =========================================================================
create table public.highlights (
  id              uuid primary key default gen_random_uuid(),
  contestant_id   uuid not null references public.contestants(id) on delete cascade,
  youtube_id      text not null,                     -- 11-char YouTube video id
  title           text,
  description     text,
  duration_sec    int,
  source_channel  text,                              -- e.g. 공식 채널 / 팬 채널
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

create index idx_highlights_contestant on public.highlights(contestant_id, sort_order);

-- =========================================================================
-- 5) posts — 익명 커뮤니티 글
-- =========================================================================
create table public.posts (
  id               uuid primary key default gen_random_uuid(),
  season_id        bigint references public.seasons(id) on delete cascade,
  contestant_id    uuid references public.contestants(id) on delete set null,
  content          text not null check (char_length(content) between 1 and 1000),
  anonymous_name   text not null,                    -- 생성된 닉네임
  ip_hash          text,                             -- rate-limit (exposed only server-side)
  vote_up_count    int not null default 0,
  vote_down_count  int not null default 0,
  report_count     int not null default 0,
  is_hidden        boolean not null default false,   -- 자동 숨김 (신고 누적)
  created_at       timestamptz not null default now()
);

create index idx_posts_season_created on public.posts(season_id, created_at desc) where is_hidden = false;
create index idx_posts_contestant     on public.posts(contestant_id, created_at desc) where is_hidden = false;
create index idx_posts_recent         on public.posts(created_at desc) where is_hidden = false;

-- =========================================================================
-- 6) post_votes — 투표 (쿠키 해시로 dedup)
-- =========================================================================
create table public.post_votes (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid not null references public.posts(id) on delete cascade,
  voter_hash   text not null,                        -- hashed cookie
  vote_type    text not null check (vote_type in ('up','down')),
  created_at   timestamptz not null default now(),
  unique (post_id, voter_hash)
);

create index idx_post_votes_post on public.post_votes(post_id);

-- =========================================================================
-- 7) reports — 신고
-- =========================================================================
create table public.reports (
  id              uuid primary key default gen_random_uuid(),
  post_id         uuid not null references public.posts(id) on delete cascade,
  reason          text not null check (reason in ('spam','abuse','hate','sexual','privacy','other')),
  detail          text,
  reporter_hash   text not null,
  created_at      timestamptz not null default now()
);

create index idx_reports_post on public.reports(post_id);
create unique index uq_reports_dedup on public.reports(post_id, reporter_hash);

-- =========================================================================
-- 8) Triggers — auto-hide on report threshold + counters
-- =========================================================================
create or replace function public.bump_post_counters() returns trigger as $$
begin
  if tg_table_name = 'post_votes' then
    if new.vote_type = 'up' then
      update public.posts set vote_up_count = vote_up_count + 1 where id = new.post_id;
    else
      update public.posts set vote_down_count = vote_down_count + 1 where id = new.post_id;
    end if;
  elsif tg_table_name = 'reports' then
    update public.posts
       set report_count = report_count + 1,
           is_hidden    = case when report_count + 1 >= 5 then true else is_hidden end
     where id = new.post_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_post_votes_count
  after insert on public.post_votes
  for each row execute function public.bump_post_counters();

create trigger trg_reports_count
  after insert on public.reports
  for each row execute function public.bump_post_counters();

-- =========================================================================
-- 9) Row Level Security
-- =========================================================================
alter table public.seasons         enable row level security;
alter table public.contestants     enable row level security;
alter table public.contestant_stats enable row level security;
alter table public.highlights      enable row level security;
alter table public.posts           enable row level security;
alter table public.post_votes      enable row level security;
alter table public.reports         enable row level security;

-- Public read for published content
create policy "seasons: read published"
  on public.seasons for select
  using (is_published = true);

create policy "contestants: read published"
  on public.contestants for select
  using (is_published = true);

create policy "contestant_stats: read"
  on public.contestant_stats for select
  using (true);

create policy "highlights: read"
  on public.highlights for select
  using (true);

create policy "posts: read visible"
  on public.posts for select
  using (is_hidden = false);

-- Anyone can create posts (no login)
create policy "posts: insert anon"
  on public.posts for insert
  with check (true);

-- Votes & reports
create policy "post_votes: insert anon"
  on public.post_votes for insert
  with check (true);

create policy "post_votes: read own"
  on public.post_votes for select
  using (true);

create policy "reports: insert anon"
  on public.reports for insert
  with check (true);

-- =========================================================================
-- 10) Realtime — enable for posts (for live community feed)
-- =========================================================================
alter publication supabase_realtime add table public.posts;
