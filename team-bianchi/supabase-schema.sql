-- TEAM BIANCHI — Supabase SQL setup
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);
create table if not exists public.user_app_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.user_app_data enable row level security;
drop policy if exists "profile read own or admin" on public.profiles;
create policy "profile read own or admin" on public.profiles for select to authenticated
using (id = auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
drop policy if exists "profile insert own as user" on public.profiles;
create policy "profile insert own as user" on public.profiles for insert to authenticated
with check (id=auth.uid() and role='user');
drop policy if exists "profile update own name only" on public.profiles;
create policy "profile update own name only" on public.profiles for update to authenticated
using (id=auth.uid()) with check (id=auth.uid() and role='user');
drop policy if exists "data read own or admin" on public.user_app_data;
create policy "data read own or admin" on public.user_app_data for select to authenticated
using (user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
drop policy if exists "data insert own" on public.user_app_data;
create policy "data insert own" on public.user_app_data for insert to authenticated
with check (user_id=auth.uid());
drop policy if exists "data update own or admin" on public.user_app_data;
create policy "data update own or admin" on public.user_app_data for update to authenticated
using (user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'))
with check (user_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
-- Admin authorization must be performed by the project owner, never from the public registration form.
-- After creating the account and confirming its email, run:
-- update public.profiles set role='admin' where id=(select id from auth.users where email='SEU_EMAIL_ADMIN');
