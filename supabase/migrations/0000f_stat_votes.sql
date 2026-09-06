-- =========================================================================
-- 솔로위키 · Solo Wiki — 게임 스탯 투표 (stat_votes) v1
-- =========================================================================
-- 한 사용자(voter_hash 쿠키)는 (contestant, stat) 조합당 1회만 투표 가능.
-- 쿠키 삭제 시 재투표 가능. 투표는 contestant_stats의 해당 stat을 +1/-1.
-- =========================================================================

create table public.stat_votes (
  id              uuid primary key default gen_random_uuid(),
  contestant_id   uuid not null references public.contestants(id) on delete cascade,
  stat_key        text not null check (stat_key in (
    'overall_charm','villain_power','appearance','inner_qualities',
    'career_score','age_score','conversation','style_score',
    'intelligence_score','appetite'
  )),
  voter_hash      text not null,
  direction       smallint not null check (direction in (1, -1)),
  created_at      timestamptz not null default now(),

  -- 같은 voter_hash + contestant + stat → 한 번만
  unique (contestant_id, stat_key, voter_hash)
);

create index idx_stat_votes_contestant on public.stat_votes(contestant_id);
create index idx_stat_votes_voter      on public.stat_votes(voter_hash);
create index idx_stat_votes_stat       on public.stat_votes(stat_key);

-- =========================================================================
-- RPC: cast_stat_vote
-- -1개의 stat_votes INSERT (중복 시 아무 일도 안 함)
-- +1개의 contestant_stats UPDATE (0~100 clamp)
-- 모두 한 트랜잭션 내에서 atomic.
-- =========================================================================
create or replace function public.cast_stat_vote(
  p_contestant_id uuid,
  p_stat_key      text,
  p_voter_hash    text,
  p_direction     smallint
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_inserted boolean;
  v_old_value int;
  v_new_value int;
  v_clamped   boolean := false;
begin
  -- 1) stat_votes에 INSERT (중복 시 무시)
  insert into public.stat_votes (contestant_id, stat_key, voter_hash, direction)
  values (p_contestant_id, p_stat_key, p_voter_hash, p_direction)
  on conflict (contestant_id, stat_key, voter_hash) do nothing
  returning true into v_inserted;

  if v_inserted is null or v_inserted = false then
    return jsonb_build_object(
      'ok', false,
      'code', 'ALREADY_VOTED',
      'message', '이미 이 스탯에 투표하셨습니다. 쿠키를 삭제하면 다시 투표할 수 있어요.'
    );
  end if;

  -- 2) 현재 값 가져오기
  execute format(
    'select %I from public.contestant_stats where contestant_id = $1',
    p_stat_key
  ) into v_old_value using p_contestant_id;

  if v_old_value is null then
    raise exception 'no stats row for contestant %', p_contestant_id;
  end if;

  -- 3) clamp + UPDATE
  v_new_value := greatest(0, least(100, v_old_value + p_direction));
  v_clamped   := (v_new_value <> v_old_value + p_direction);

  execute format(
    'update public.contestant_stats set %I = $1, updated_at = now() where contestant_id = $2',
    p_stat_key
  ) using v_new_value, p_contestant_id;

  return jsonb_build_object(
    'ok', true,
    'new_value', v_new_value,
    'old_value', v_old_value,
    'direction', p_direction,
    'clamped', v_clamped,
    'message', case
      when v_clamped and p_direction = 1  then '이미 최대치(100)입니다.'
      when v_clamped and p_direction = -1 then '이미 최소치(0)입니다.'
      else '투표 완료'
    end
  );
end;
$$;

-- RLS
alter table public.stat_votes enable row level security;

-- INSERT: anyone (anon) — RPC로만 호출되므로 service role이 대신 처리
-- (anon 직접 INSERT는 막고 RPC만 통과)
create policy "stat_votes: read own"
  on public.stat_votes for select
  using (true);

-- (anon INSERT/UPDATE/DELETE는 막음. RPC가 대신 처리.)

-- RPC 권한: anon도 호출 가능
grant execute on function public.cast_stat_vote(uuid, text, text, smallint) to anon, authenticated, service_role;
