-- Supabase initialization SQL for Linkwave
-- Run in Supabase SQL editor

-- Enable pgcrypto (for gen_random_uuid)
create extension if not exists pgcrypto;

-- Profiles table (linked to auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade,
  username text unique not null,
  name text,
  bio text,
  avatar_url text,
  banner_url text,
  theme_type text,
  theme_value text,
  created_at timestamptz default now(),
  primary key (id)
);

-- Links table
create table if not exists links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  url text not null,
  icon text,
  position integer default 0,
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY
alter table profiles force row level security;
alter table links force row level security;

-- Profiles policies
-- Public read for profiles (so public pages can fetch)
create policy "profiles_public_select" on profiles
  for select using (true);

-- Allow authenticated users to insert their own profile (id = auth.uid())
create policy "profiles_insert_own" on profiles
  for insert using (auth.role() = 'authenticated') with check (auth.uid() = id);

-- Allow users to update/delete only their own profile
create policy "profiles_modify_own" on profiles
  for update delete using (auth.role() = 'authenticated' AND auth.uid() = id) with check (auth.uid() = id);

-- Links policies
-- Public read (ordered by position) for links
create policy "links_public_select" on links
  for select using (true);

-- Allow authenticated users to insert links for themselves
create policy "links_insert_own" on links
  for insert using (auth.role() = 'authenticated') with check (auth.uid() = user_id);

-- Allow users to update/delete only their own links
create policy "links_modify_own" on links
  for update, delete using (auth.role() = 'authenticated' AND auth.uid() = user_id) with check (auth.uid() = user_id);

-- Indexes for common queries
create index if not exists idx_profiles_username on profiles(username);
create index if not exists idx_links_user_pos on links(user_id, position);

-- Storage guidance (buckets must be created via the Supabase UI or CLI)
-- Buckets: avatars, banners
-- Example policy for public read and owner-only write (adjust if using private buckets):
-- For private buckets, use storage policies like:
-- create policy "storage_avatars_insert" on storage.objects
--   for insert using (auth.role() = 'authenticated' AND auth.uid() = (auth.uid()));

-- Note: storage policies often reference metadata and require careful configuration.
-- After running this migration, create the 'avatars' and 'banners' buckets and set rules in the Supabase Storage UI.
