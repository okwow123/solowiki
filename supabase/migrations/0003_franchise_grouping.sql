-- =========================================================================
-- 르헤메스 — 프랜차이즈 그룹화
-- 변경:
--   1) seasons 테이블에 franchise 컬럼 추가
--   2) 기존 33개 I'm Solo 시즌을 '나는솔로' 프랜차이즈로 묶음
--   3) 인덱스 추가 (프랜차이즈별 그룹화 쿼리 최적화)
-- =========================================================================

-- 0) 안전망: 작품 번호 범위 제약 (0000h가 drop하지만, 이 마이그레이션을 0000h보다
--    먼저/단독 실행할 경우를 위해 idempotent하게 한 번 더)
alter table public.seasons drop constraint if exists seasons_number_check;

-- 0-1) 안전망: current_status 체크 제약에 'widowed' 보장
alter table public.contestants drop constraint if exists contestants_current_status_check;
alter table public.contestants
  add constraint contestants_current_status_check
  check (current_status in ('single','dating','married','divorced','returned','doubly_returned','widowed','unknown'));

-- 1) franchise 컬럼 추가
alter table public.seasons
  add column if not exists franchise text;

comment on column public.seasons.franchise is
  '프랜차이즈명 (예: 나는솔로). NULL이면 단독 작품.';

-- 2) 기존 variety 33기(1~33)는 '나는솔로' 프랜차이즈로 그룹화
update public.seasons
   set franchise = '나는솔로'
 where kind = 'variety'
   and number between 1 and 33
   and franchise is null;

-- (선택) 안전 검증: 33개가 정확히 묶였는지
-- select count(*) from public.seasons where franchise = '나는솔로';

-- 3) 인덱스 (카테고리 + 프랜차이즈별 그룹화 쿼리)
create index if not exists idx_seasons_franchise
  on public.seasons(franchise, kind, number)
  where is_published = true;

-- =========================================================================
-- 검증 쿼리 (실행 후 확인)
-- =========================================================================
-- select
--   case when franchise is null then '(단독)' else franchise end as group,
--   kind,
--   count(*) as works,
--   sum(case when number between 1 and 60 then 1 else 0 end) as solo_seasons
-- from public.seasons
-- where is_published = true
-- group by group, kind
-- order by kind, group;
--
-- 기대 결과:
--   나는솔로     | variety | 1   | 33
--   (단독)       | movie   | 2   | 0
--   (단독)       | drama   | 2   | 0
