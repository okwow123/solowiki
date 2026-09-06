-- =========================================================================
-- 솔로위키 · Solo Wiki — 게임 스탯 v3 (6개 → 10개)
-- =========================================================================
-- 변경 사항:
--   - 기존 6개 컬럼 (charm, humor, warmth, intelligence, leadership, style) 은 유지
--   - 새 10개 컬럼 추가 (default 50, 0-100 check)
--   - 기존 데이터를 새 컬럼으로 best-effort 매핑
-- =========================================================================

alter table public.contestant_stats
  add column if not exists overall_charm     int not null default 50 check (overall_charm     between 0 and 100),
  add column if not exists villain_power     int not null default 50 check (villain_power     between 0 and 100),
  add column if not exists appearance        int not null default 50 check (appearance        between 0 and 100),
  add column if not exists inner_qualities   int not null default 50 check (inner_qualities   between 0 and 100),
  add column if not exists career_score      int not null default 50 check (career_score      between 0 and 100),
  add column if not exists age_score         int not null default 50 check (age_score         between 0 and 100),
  add column if not exists conversation      int not null default 50 check (conversation      between 0 and 100),
  add column if not exists style_score       int not null default 50 check (style_score       between 0 and 100),
  add column if not exists intelligence_score int not null default 50 check (intelligence_score between 0 and 100),
  add column if not exists appetite          int not null default 50 check (appetite          between 0 and 100);

-- 기존 6개 → 새 10개 best-effort 매핑
-- (charm → 종합매력, humor → 대화, warmth → 내면, intelligence → 지능, style → 스타일, leadership → 빌런력)
update public.contestant_stats set
  overall_charm      = charm,
  conversation       = humor,
  inner_qualities    = warmth,
  intelligence_score = intelligence,
  style_score        = style,
  villain_power      = leadership;
-- appearance, career_score, age_score, appetite는 default 50 유지

-- 검증 (실행 후):
-- select count(*) from contestant_stats;  -- 408
-- select avg(overall_charm)::int, avg(villain_power)::int from contestant_stats;  -- 50, 50
