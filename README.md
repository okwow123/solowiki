# 솔로위키 · Solo Wiki

솔로 데이팅 프로그램 출연자 아카이브 + 익명 팬 커뮤니티

> 팬이 직접 큐레이션한, 1기~33기 출연자 도감. 로그인 없이 자유롭게.

## ⚡ 빠른 시작

### 1) 의존성 설치

```bash
cd /Users/kimminje/workspace/solo
npm install
```

### 2) Supabase 프로젝트 생성

1. https://supabase.com/dashboard 접속
2. 새 프로젝트 생성 (이름: `solowiki`, region: Seoul)
3. **SQL Editor** 열기
4. `supabase/migrations/0001_initial.sql` 복붙 → Run (스키마 + RLS + 트리거)
5. `supabase/migrations/0002_seed_all_seasons.sql` 복붙 → Run (**1기~33기 408명 풀 데이터 + 18커플**)
6. **Project Settings → API** 에서 URL + anon key + service_role key 복사

### 3) 환경변수 설정

```bash
cp .env.example .env.local
# .env.local 열어서 키 입력
```

### 4) 개발 서버

```bash
npm run dev
# http://localhost:3000
```

### 5) 빌드 테스트

```bash
npm run build
npm run typecheck
```

## 🏗️ 기술 스택

- **Next.js 14** (App Router) + TypeScript + Tailwind
- **Supabase** (Postgres + RLS + Realtime)
- **Vercel** 배포

## 📁 구조

```
app/
  page.tsx                    홈 (Hero + 시즌 그리드 + 인기 출연자 + 최신 글)
  seasons/                    전체 기수 / 기수 상세
  contestants/[id]/           출연자 상세 (게임 스탯 + 하이라이트 + 커뮤니티)
  community/[number]/         기수별 익명 게시판
  search/                     통합 검색
  legal/                      운영 원칙
  sitemap.ts, robots.ts       SEO
components/
  layout/                     Header / Footer
  contestant/                 카드, 스탯바, 포트레이트, 하이라이트
  community/                  글 카드, 폼, 투표, 신고
  season/                     시즌 그리드
lib/
  supabase/                   server / client 클라이언트
  data/                       server-side data fetching
  types.ts                    도메인 타입
  utils.ts                    cn(), currentAge(), formatNumber()
  anonymous.ts                익명 닉네임 생성기
hooks/
  useVoterHash.ts             쿠키 해시 (투표/신고 dedup)
supabase/
  migrations/
    0001_initial.sql          스키마 + RLS + 트리거
    0002_seed_1gi.sql         1기 샘플 8명
```

## 🛡️ 저작권 안전판

- ❌ 방송 화면, 스틸컷, 공식 로고 사용 안 함
- ❌ "나는솔로" 직접 표기 최소화 (내부적으로만 데이터 식별자로 사용)
- ✅ 팬 큐레이션 정보 (Love Is Blind 팬덤과 동일 선상)
- ✅ YouTube 영상은 임베드 + 출처 표기
- ✅ UGC 중심, 1차 콘텐츠 = 사용자 작성
- ✅ 1인칭 이니셜 + 그라데이션 아바타 (출연자 사진 미사용)

## 🗃️ DB 스키마 (7 테이블)

- `seasons` — 기수
- `contestants` — 출연자
- `contestant_stats` — 게임 스탯 (0-100)
- `highlights` — YouTube 하이라이트
- `posts` — 익명 글 (신고 5회 누적 시 자동 숨김)
- `post_votes` — 쿠키 해시 dedup
- `reports` — 신고

## 🔧 데이터 추가 (운영 시)

### 방법 A: Supabase Studio 직접 입력
`https://<project>.supabase.co/project/default/editor` 에서 contestants 테이블 직접 추가

### 방법 B: SQL로 일괄 추가
`supabase/migrations/0003_seed_2gi.sql` 같은 파일로 시드 작성

### 방법 C: Admin 페이지 (TODO)
`app/admin/page.tsx` 미구현 — 추후 Supabase Auth + RLS로 보호된 입력 폼 구축

## 🚀 Vercel 배포

1. GitHub push
2. Vercel → New Project → repo 선택
3. Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (서버 전용, 절대 클라이언트 노출 X)
   - `NEXT_PUBLIC_SITE_URL` (배포된 도메인)
   - `NEXT_PUBLIC_SITE_NAME` = `솔로위키`
4. Deploy

## 🛣️ 로드맵

- [x] v0.1 — 정적 프로토타입 (`_legacy/`)
- [x] v0.5 — Next.js + Supabase 풀 스택
- [x] v0.6 — **1기~33기 풀 데이터 408명 + 18 결혼커플** (나무위키/팬DB 1차 검증)
- [ ] v0.7 — 1차 데이터 검증 (실명 매칭, 직업/나이 교차 확인)
- [ ] v0.8 — 게임 스탯 수기 조정 (현재 50 통일 → 실제 캐릭터 반영)
- [ ] v0.9 — 1-3기 MBTI/특징 추가
- [ ] v1.0 — 전 기수 + 검색 최적화 + Admin 패널
- [ ] v1.5 — 사용자 투표 기반 게임 스탯 (에디토리얼 → 커뮤니티)
- [ ] v2.0 — AI 출연자 요약 (LLM)
- [ ] v2.5 — PWA / Capacitor 앱

## 📜 데이터 출처 (v0.6)

- **408명 출연자 정보**: 나무위키 (방영 목록 2021~2026), 위키백과, 팬블로그(검증 다중 출처)
- **18 결혼 커플**: 나무위키 결혼 커플 문서 + 아주경제 보도
- **가명 체계**: 6기부터 고정 (남: 영수/영호/영식/영철/광수/상철, 여: 영숙/정숙/순자/영자/옥순/현숙)
- **추가 가명**: 경수(7/14/22/26/28/31/32기), 정희(22/28/31/32기), 미경(25기) — 특집/돌싱 회차 한정
- **게임 스탯**: 전원 50 (에디토리얼 placeholder, v0.8에 실제 캐릭터 반영)
- **MBTI/하이라이트 영상**: 미수집 (v0.9 / v1.5 예정)

## 📜 라이선스

팬 큐레이션 비영리 정보 아카이브. 모든 출연자 정보는 팬이 편집한 자료이며 정확성을 보장하지 않습니다.
