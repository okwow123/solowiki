-- =========================================================================
-- 솔로위키 · Solo Wiki — 실시간 채팅 (chat_messages) v1
-- =========================================================================
-- 익명 닉네임 + Supabase Realtime으로 broadcast.
-- 누군가 입장하면 첫 메시지로 "XXX 님 입장" 자동 추가.
-- =========================================================================

create table public.chat_messages (
  id              uuid primary key default gen_random_uuid(),
  anonymous_name  text not null,
  content         text not null check (char_length(content) between 1 and 500),
  is_system       boolean not null default false,  -- 입장/퇴장 시스템 메시지
  ip_hash         text,                            -- rate-limit (서버측)
  is_hidden       boolean not null default false,  -- 신고 누적 시 자동 숨김
  report_count    int not null default 0,
  created_at      timestamptz not null default now()
);

create index idx_chat_recent on public.chat_messages(created_at desc) where is_hidden = false;

-- =========================================================================
-- RLS
-- =========================================================================
alter table public.chat_messages enable row level security;

-- SELECT: 안 숨김 메시지만
create policy "chat: read visible"
  on public.chat_messages for select
  using (is_hidden = false);

-- INSERT: 누구나 (익명)
create policy "chat: insert anon"
  on public.chat_messages for insert
  with check (true);

-- =========================================================================
-- Realtime publication 추가
-- =========================================================================
alter publication supabase_realtime add table public.chat_messages;

-- =========================================================================
-- API 라우트에서 service role로 RLS bypass하므로 anon 직접 INSERT도 허용
-- (RLS WITH CHECK true)
-- =========================================================================

-- 검증 쿼리 (실행 후):
-- select count(*) from information_schema.tables where table_name = 'chat_messages';  -- 1
-- select count(*) from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'chat_messages';  -- 1
