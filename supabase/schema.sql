-- Brave Takes Database Schema
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Profiles table (stores user onboarding data)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  user_type text,
  avoidance text,
  top_fear text,
  daily_minutes int
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Check-ins table (daily anxiety tracking)
create table if not exists public.checkins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  date_local date not null,
  anxiety_before int not null,
  anxiety_after int,
  thought_tag text,
  note text
);

-- Enable RLS
alter table public.checkins enable row level security;

-- Checkins policies
create policy "Users can view own checkins"
  on public.checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert own checkins"
  on public.checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checkins"
  on public.checkins for update
  using (auth.uid() = user_id);

-- Reps table (the 14-day ladder content)
create table if not exists public.reps (
  id text primary key,
  ladder_name text,
  day_number int,
  title text,
  rep_main text,
  rep_easier text
);

-- Enable RLS (public read)
alter table public.reps enable row level security;

create policy "Anyone can view reps"
  on public.reps for select
  using (true);

-- Rep completions (tracking progress)
create table if not exists public.rep_completions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rep_id text references public.reps(id),
  created_at timestamptz not null default now(),
  date_local date not null,
  status text,
  skip_reason text
);

-- Enable RLS
alter table public.rep_completions enable row level security;

create policy "Users can view own completions"
  on public.rep_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own completions"
  on public.rep_completions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own completions"
  on public.rep_completions for update
  using (auth.uid() = user_id);

-- Wins table (celebration log)
create table if not exists public.wins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  date_local date not null,
  text text not null
);

-- Enable RLS
alter table public.wins enable row level security;

create policy "Users can view own wins"
  on public.wins for select
  using (auth.uid() = user_id);

create policy "Users can insert own wins"
  on public.wins for insert
  with check (auth.uid() = user_id);

-- Templates table (post templates library)
create table if not exists public.templates (
  id uuid primary key default uuid_generate_v4(),
  platform text,
  content_type text,
  tone text,
  text text
);

-- Enable RLS (public read)
alter table public.templates enable row level security;

create policy "Anyone can view templates"
  on public.templates for select
  using (true);

-- Create profile on signup (trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
