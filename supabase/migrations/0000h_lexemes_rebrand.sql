-- =========================================================================
-- 솔로위키 → 르헤메스(Lexemes) 리브랜드 + 영화/드라마/예능 통합
-- =========================================================================
-- 변경:
--   1) seasons.kind 컬럼 추가 (variety/movie/drama/anime/other)
--   2) 기존 33기는 자동으로 kind='variety' (나는솔로)
--   3) 영화 2개 + 드라마 2개 작품 INSERT (예시)
--   4) 각 작품 캐릭터 INSERT (총 ~14명)
-- =========================================================================

-- 0) 작품 번호 범위 확장 (영화/드라마는 100번대, 200번대 사용 — 원래 1~60 제약)
alter table public.seasons drop constraint if exists seasons_number_check;

-- 0-1) current_status 체크 제약에 'widowed' (사별) 추가 — 원래 누락됨
alter table public.contestants drop constraint if exists contestants_current_status_check;
alter table public.contestants
  add constraint contestants_current_status_check
  check (current_status in ('single','dating','married','divorced','returned','doubly_returned','widowed','unknown'));

-- 1) kind 컬럼 추가
alter table public.seasons
  add column if not exists kind text not null default 'variety'
    check (kind in ('variety', 'movie', 'drama', 'anime', 'other'));

-- 기존 33기 자동으로 'variety' (default)

-- 2) 새 작품 INSERT (영화 2 + 드라마 2)
-- kind 컬럼 명시. 기존 INSERT는 default 'variety'.

insert into public.seasons (number, title, kind, air_date_start, air_date_end, episode_count, description, is_published, sort_order)
values
  -- 영화
  (100, '기생충 (2019)', 'movie', '2019-05-30', '2019-05-30', 1,
   '봉준호 감독의 한국 사회 풍자 영화. 계급 갈등과 기생적 관계를 그린 블랙 코미디 스릴러.',
   true, 100),
  (101, '범죄도시 (2017)', 'movie', '2017-10-03', '2017-10-03', 1,
   '마석도 형사와 서울 강남 범죄조직의 대결. 마동석·윤계상 주연의 한국형 액션 영화.',
   true, 101),
  -- 드라마
  (200, '오징어 게임 (2021)', 'drama', '2021-09-17', '2021-09-17', 1,
   '456억 원의 상금을 걸고 456명이 벌이는 생존 게임. 넷플릭스 오리지널 시리즈.',
   true, 200),
  (201, '더 글로리 (2023)', 'drama', '2023-03-10', '2023-03-10', 1,
   '학교 폭력의 복수를 준비하는 여교사의 이야기. 송혜교 주연의 넷플릭스 시리즈.',
   true, 201)
on conflict (number) do update set
  kind = excluded.kind,
  title = excluded.title,
  description = excluded.description;

-- 3) 캐릭터 INSERT (예시 작품 4개 × 2-4명)
-- 주의:
--   - birth_date는 date 타입이므로 VALUES에서 'YYYY-01-01'::date 로 명시
--   - data_source는 namu wiki URL 사용
--   - job 필드: 'variety'는 직업, 'movie/drama'는 배우 이름
--   - job_category: 'variety'는 직장인/전문직 등, 'movie/drama'는 주인공/조연/빌런

-- 기생충 캐릭터
insert into public.contestants (
  season_id, name, gender, birth_date, age_at_appearance, job, job_category, intro, ideal_type, catchphrase, charm_points, hobbies, marital_history, current_status, data_source, confidence, portrait_color, appearance_order, is_published
)
select s.id, c.name, c.gender, c.birth_date, c.age_at_appearance, c.job, c.job_category, c.intro, c.ideal_type, c.catchphrase, c.charm_points, c.hobbies, c.marital_history, c.current_status, c.data_source, c.confidence, c.portrait_color, c.appearance_order, true
from public.seasons s
join (values
  ('기택',  'male',   '1967-01-01'::date, 52, '송강호', '주인공', '오래 실직한 기숙사 가정의 가장. 가족을 위해 기숙사에 기생하며 사건에 휘말림. 빈곤 속에서도 자존심을 지키는 인물.', NULL, NULL, ARRAY['책임감','자존심','계층의식'], ARRAY['가족','면역','맥주'], 'never_married', 'married', 'https://namu.wiki/l/기택(기생충)', 'high', 'rose', 1),
  ('기우정', 'male',   '1994-01-01'::date, 25, '최우식', '주인공', '서울대 진학 실패 후 재수를 준비하는 기택의 아들. 친구 민기와 사립고 입학 자격을 위해 위조 문서를 만들어 사건에 연루됨.', NULL, NULL, ARRAY['우유부담','순수함','계획성'], ARRAY['게임','만화','웹툰'], 'never_married', 'single', 'https://namu.wiki/l/기우정', 'high', 'navy', 2),
  ('기정숙', 'female', '1972-01-01'::date, 47, '장혜진', '조연',   '기택의 아내이자 두 아이의 엄마. 가사 노동으로 가족을 먹여 살림. 봉준호 영화의 또 다른 결말을 꿈꿈.', NULL, NULL, ARRAY['헌신','근면','인내'], ARRAY['빨래','요리','TV시청'], 'never_married', 'married', 'https://namu.wiki/l/기정숙', 'high', 'plum', 3),
  ('박동익', 'male',   '1965-01-01'::date, 54, '이선균', '주인공', 'IT 기업 대표. 부와 N번방 사건의 연루로 가족과 위기를 맞음. 계급과 능력을 모두 가진 신흥 부유층.', NULL, NULL, ARRAY['합리성','냉철함','계산적'], ARRAY['와인','골프','독서'], 'divorced', 'divorced', 'https://namu.wiki/l/박동익', 'high', 'gold', 4)
) as c(name, gender, birth_date, age_at_appearance, job, job_category, intro, ideal_type, catchphrase, charm_points, hobbies, marital_history, current_status, data_source, confidence, portrait_color, appearance_order)
on s.number = 100 and s.kind = 'movie'
on conflict do nothing;

-- 범죄도시 캐릭터
insert into public.contestants (
  season_id, name, gender, birth_date, age_at_appearance, job, job_category, intro, charm_points, marital_history, current_status, data_source, confidence, portrait_color, appearance_order, is_published
)
select s.id, c.name, c.gender, c.birth_date, c.age_at_appearance, c.job, c.job_category, c.intro, c.charm_points, c.marital_history, c.current_status, c.data_source, c.confidence, c.portrait_color, c.appearance_order, true
from public.seasons s
join (values
  ('마석도', 'male', '1971-01-01'::date, 46, '마동석', '주인공', '서울 광역수사대 형사. 괴력으로 유명하며 신선한 방식으로 범죄자를 소탕하는 "괴물 형사". 약간 엉성하지만 정의감 강함.', ARRAY['괴력','정의감','유머'], 'never_married', 'married', 'https://namu.wiki/l/마석도', 'high', 'rose', 1),
  ('전일만', 'male', '1973-01-01'::date, 44, '윤계상', '빌런', '강남 일대에서 활동하는 거대 범죄 조직의 보스. 잔인하면서도 카리스마 있는 갱스터. 돈과 권력을 위해 수단 가리지 않음.', ARRAY['카리스마','잔인함','지략'], 'never_married', 'unknown', 'https://namu.wiki/l/전일만', 'high', 'navy', 2)
) as c(name, gender, birth_date, age_at_appearance, job, job_category, intro, charm_points, marital_history, current_status, data_source, confidence, portrait_color, appearance_order)
on s.number = 101 and s.kind = 'movie'
on conflict do nothing;

-- 오징어 게임 캐릭터
insert into public.contestants (
  season_id, name, gender, birth_date, age_at_appearance, job, job_category, intro, charm_points, marital_history, current_status, data_source, confidence, portrait_color, appearance_order, is_published
)
select s.id, c.name, c.gender, c.birth_date, c.age_at_appearance, c.job, c.job_category, c.intro, c.charm_points, c.marital_history, c.current_status, c.data_source, c.confidence, c.portrait_color, c.appearance_order, true
from public.seasons s
join (values
  ('기훈',   'male', '1981-01-01'::date, 40, '이정재', '주인공', '성남시 운전만사 기숙사에서 가족을 위해 거액 빚을 떠안고 사는 456번 참가자. 어린 시절 친구들과 도시락 도박을 한 과거가 있음. 게임 속에서 승리하는 인물.', ARRAY['우정','가족애','의리'], 'divorced', 'divorced', 'https://namu.wiki/l/기훈(오징어게임)', 'high', 'rose', 1),
  ('상우',   'male', '1994-01-01'::date, 27, '박해수', '주인공', '서울대 의대생. 학비 마련을 위해 오징어 게임에 참가. 의리 있는 성격으로 기훈과 동맹을 맺음. 진학을 위해 사채를 받음.', ARRAY['학구적','정의감','우유부단'], 'never_married', 'single', 'https://namu.wiki/l/상우(오징어게임)', 'high', 'navy', 2),
  ('오일남', 'male', '1944-01-01'::date, 77, '오영수', '조연',   '오징어 게임 001번 참가자. 뇌종양 진단을 받고 마지막 인생을 게임에서 보내기로 함. 기훈과 친구가 되어 함께 게임함. 본명은 오일남.', ARRAY['인생철학','유머','현실도피'], 'widowed', 'widowed', 'https://namu.wiki/l/오일남', 'high', 'gold', 3)
) as c(name, gender, birth_date, age_at_appearance, job, job_category, intro, charm_points, marital_history, current_status, data_source, confidence, portrait_color, appearance_order)
on s.number = 200 and s.kind = 'drama'
on conflict do nothing;

-- 더 글로리 캐릭터
insert into public.contestants (
  season_id, name, gender, birth_date, age_at_appearance, job, job_category, intro, charm_points, marital_history, current_status, data_source, confidence, portrait_color, appearance_order, is_published
)
select s.id, c.name, c.gender, c.birth_date, c.age_at_appearance, c.job, c.job_category, c.intro, c.charm_points, c.marital_history, c.current_status, c.data_source, c.confidence, c.portrait_color, c.appearance_order, true
from public.seasons s
join (values
  ('문동은', 'female', '1985-01-01'::date, 38, '송혜교', '주인공', '고등학교 때 가해자들에 의해 끔찍한 학교 폭력을 당한 후 복수를 다짐하고 18년간 준비한 여교사. 정체성을 숨긴 채 가해자들 곁에 다가감.', ARRAY['냉철함','인내','계획성'], 'never_married', 'single', 'https://namu.wiki/l/문동은', 'high', 'rose', 1),
  ('박연진', 'female', '1984-01-01'::date, 39, '임지연', '빌런',   '동은을 괴롭힌 가해자 그룹의 리더. 현재 부유한 호텔리어. 겉으로는 성공적이나 내면은 공허.', ARRAY['오만함','외면','공허'], 'divorced', 'married', 'https://namu.wiki/l/박연진', 'high', 'plum', 2),
  ('주해오', 'male',   '1988-01-01'::date, 35, '이도현', '조연',   '동은의 복수 계획에 자발적으로 합류하는 남자. 건재학원 재벌 2세로 외할머니의 병을 고치기 위해 동은과 손을 잡음.', ARRAY['정의감','낭만','솔직함'], 'never_married', 'single', 'https://namu.wiki/l/주해오', 'high', 'sage', 3)
) as c(name, gender, birth_date, age_at_appearance, job, job_category, intro, charm_points, marital_history, current_status, data_source, confidence, portrait_color, appearance_order)
on s.number = 201 and s.kind = 'drama'
on conflict do nothing;

-- 4) highlights도 4개 작품에 1개씩 (시청각 자료)
-- (지금은 placeholder. 사용자가 원할 때 추후)

-- =========================================================================
-- 검증 쿼리 (실행 후 확인)
-- =========================================================================
-- select kind, count(*) from seasons group by kind order by kind;
-- -- 기대: drama | 2, movie | 2, variety | 33
--
-- select s.kind, s.title, count(c.id) as char_count
-- from seasons s left join contestants c on c.season_id = s.id
-- where s.kind in ('movie', 'drama')
-- group by s.kind, s.title
-- order by s.kind, s.title;
-- -- 기대: 4개 작품, 각 2~4명 캐릭터
