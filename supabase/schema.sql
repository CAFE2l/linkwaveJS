create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text not null unique check (username ~ '^[a-z0-9_]{3,32}$'),
  avatar_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  bio text check (char_length(bio) <= 180),
  theme text not null default 'wave' check (theme in ('wave', 'midnight', 'minimal', 'aurora')),
  custom_colors jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 60),
  url text not null check (url ~* '^https?://'),
  icon text,
  order_position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  ip_address inet,
  country text,
  city text,
  created_at timestamptz not null default now()
);

create index if not exists users_active_idx on public.users(active);
create index if not exists users_username_idx on public.users(username);
create index if not exists links_user_order_idx on public.links(user_id, order_position);
create index if not exists clicks_user_created_idx on public.clicks(user_id, created_at desc);
create index if not exists clicks_link_created_idx on public.clicks(link_id, created_at desc);

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.clicks enable row level security;

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

drop policy if exists "Public profiles are readable" on public.profiles;
create policy "Public profiles are readable"
  on public.profiles for select
  using (true);

drop policy if exists "Users can manage own profile" on public.profiles;
create policy "Users can manage own profile"
  on public.profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Public links are readable" on public.links;
create policy "Public links are readable"
  on public.links for select
  using (true);

drop policy if exists "Users can manage own links" on public.links;
create policy "Users can manage own links"
  on public.links for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

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

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  generated_username text;
begin
  generated_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), '[^a-z0-9_]', '_', 'g'));

  insert into public.users (id, email, username, active)
  values (new.id, new.email, generated_username, true)
  on conflict (id) do nothing;

  insert into public.profiles (user_id, bio, theme, custom_colors)
  values (new.id, 'Minha onda de links.', 'wave', '{}'::jsonb)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
