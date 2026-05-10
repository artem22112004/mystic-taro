-- ════════════════════════════════════════════
-- Миграция 001: начальная схема
-- Применяй в Supabase: SQL Editor → Run
-- ════════════════════════════════════════════

-- Расширение для UUID
create extension if not exists "uuid-ossp";

-- ── Таблица пользователей ──────────────────────────────────
create table public.users (
  id   uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name  text,
  created_at timestamptz default now() not null
);

-- ── Расклады ──────────────────────────────────────────────
create table public.readings (
  id             uuid default uuid_generate_v4() primary key,
  user_id        uuid references auth.users(id) on delete cascade,
  type           text not null check (type in ('daily', 'yes-no', 'relationship')),
  question       text,
  cards          jsonb not null,
  interpretation jsonb not null,
  paid_amount    integer default 0 not null,
  created_at     timestamptz default now() not null
);

create index readings_user_id_created_at on public.readings(user_id, created_at desc);

-- ── Кэш карты дня ─────────────────────────────────────────
create table public.daily_cards (
  id             uuid default uuid_generate_v4() primary key,
  user_id        uuid references auth.users(id) on delete cascade not null,
  card_id        text not null,
  is_reversed    boolean not null,
  interpretation text,
  drawn_date     date not null default current_date,
  created_at     timestamptz default now() not null,
  unique (user_id, drawn_date)
);

-- ── Row Level Security ────────────────────────────────────
alter table public.users       enable row level security;
alter table public.readings    enable row level security;
alter table public.daily_cards enable row level security;

create policy "users_own"       on public.users
  for all using (auth.uid() = id);

create policy "readings_own"    on public.readings
  for all using (auth.uid() = user_id);

create policy "daily_cards_own" on public.daily_cards
  for all using (auth.uid() = user_id);

-- ── Триггер: авто-создание профиля при регистрации ───────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
