create extension if not exists "pgcrypto";

-- =============================================================================
-- USERS (mirror of auth.users for public queries)
-- =============================================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text not null,
  name text not null default '',
  avatar_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- PROFILES (rich profile data)
-- =============================================================================
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  name text not null,
  username text not null,
  email text not null,
  avatar_url text,
  active boolean not null default true,
  bio text check (char_length(bio) <= 180),
  theme text not null default 'wave' check (theme in ('wave', 'midnight', 'minimal', 'aurora')),
  custom_colors jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- RATE LIMIT for registrations
-- =============================================================================
create table if not exists public.registration_rate_limits (
  id uuid primary key default gen_random_uuid(),
  ip_key text not null,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- LINKS
-- =============================================================================
create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 60),
  url text not null check (url ~* '^https?://'),
  icon text,
  order_position integer not null default 0,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- CLICKS
-- =============================================================================
create table if not exists public.clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  ip_address inet,
  country text,
  city text,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================
create index if not exists users_active_idx on public.users(active);
create index if not exists users_username_idx on public.users(username);
create unique index if not exists users_username_lower_idx on public.users(lower(username));
create unique index if not exists users_email_lower_idx on public.users(lower(email));
create index if not exists profiles_active_idx on public.profiles(active);
create unique index if not exists profiles_username_lower_idx on public.profiles(lower(username));
create unique index if not exists profiles_email_lower_idx on public.profiles(lower(email));
create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists links_user_order_idx on public.links(user_id, order_position);
create index if not exists clicks_user_created_idx on public.clicks(user_id, created_at desc);
create index if not exists clicks_link_created_idx on public.clicks(link_id, created_at desc);
create index if not exists registration_rate_limits_ip_created_idx
  on public.registration_rate_limits(ip_key, created_at desc);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.clicks enable row level security;
alter table public.registration_rate_limits enable row level security;

-- Users: public can see active users; owners see own
drop policy if exists "Public active users are readable" on public.users;
create policy "Public active users are readable"
  on public.users for select
  using (active = true or auth.uid() = id);

drop policy if exists "Users can insert own user row" on public.users;
create policy "Users can insert own user row"
  on public.users for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own user row" on public.users;
create policy "Users can update own user row"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Profiles: public can see active profiles; owners see own
drop policy if exists "Public profiles are readable" on public.profiles;
create policy "Public profiles are readable"
  on public.profiles for select
  using (active = true or auth.uid() = user_id);

drop policy if exists "Users can manage own profile" on public.profiles;
create policy "Users can manage own profile"
  on public.profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Rate limits: service role only
drop policy if exists "Service role manages registration limits" on public.registration_rate_limits;
create policy "Service role manages registration limits"
  on public.registration_rate_limits for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Links: public read, owner manage
drop policy if exists "Public links are readable" on public.links;
create policy "Public links are readable"
  on public.links for select
  using (true);

drop policy if exists "Users can manage own links" on public.links;
create policy "Users can manage own links"
  on public.links for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Clicks: owner read, anyone record
drop policy if exists "Owners can read own clicks" on public.clicks;
create policy "Owners can read own clicks"
  on public.clicks for select
  using (auth.uid() = user_id);

drop policy if exists "Anyone can record public clicks" on public.clicks;
create policy "Anyone can record public clicks"
  on public.clicks for insert
  with check (
    exists (
      select 1
      from public.links l
      where l.id = link_id
        and l.user_id = clicks.user_id
    )
  );

-- =============================================================================
-- TRIGGER: auto-create public.users + profiles on auth.users insert
-- =============================================================================
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  generated_username text;
  user_name text;
begin
  user_name := coalesce(
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1)
  );

  generated_username := public.unique_username(
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );

  insert into public.users (id, email, username, name, avatar_url, active)
  values (
    new.id,
    lower(new.email),
    generated_username,
    user_name,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    true
  )
  on conflict (id) do nothing;

  insert into public.profiles (
    user_id, name, username, email, avatar_url, active, bio, theme, custom_colors
  )
  values (
    new.id,
    user_name,
    generated_username,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    true,
    'Minha onda de links.',
    'wave',
    '{}'::jsonb
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

-- =============================================================================
-- FUNCTION: unique username generator
-- =============================================================================
create or replace function public.unique_username(base_username text)
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  normalized text;
  candidate text;
  suffix integer := 0;
begin
  normalized := lower(regexp_replace(coalesce(base_username, 'user'), '[^a-z0-9_]', '_', 'g'));
  normalized := trim(both '_' from normalized);

  if char_length(normalized) < 3 then
    normalized := 'user_' || substr(md5(random()::text), 1, 8);
  end if;

  normalized := substr(normalized, 1, 24);
  candidate := normalized;

  while exists (select 1 from public.users where username = candidate)
     or exists (select 1 from public.profiles where username = candidate) loop
    suffix := suffix + 1;
    candidate := substr(normalized, 1, 24) || '_' || suffix::text;
  end loop;

  return substr(candidate, 1, 30);
end;
$$;

-- =============================================================================
-- TRIGGER: auto-update updated_at on profiles
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
