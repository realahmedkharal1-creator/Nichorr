-- Migration 00063: Create public.waitlist table with insert-only anonymous RLS
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  source text not null default 'landing_page',
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Allow anyone (anonymous visitors) to INSERT a signup, but never read, update, or delete via the public API.
create policy "Public can join waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);
