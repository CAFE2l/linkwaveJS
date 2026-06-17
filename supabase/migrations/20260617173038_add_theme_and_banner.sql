-- Add banner_url and theme_json to users table
alter table public.users add column if not exists banner_url text;
alter table public.users add column if not exists theme_json jsonb not null default '{}'::jsonb;

-- Add missing icon columns to links table (icone, icon_blob, is_custom_icon)
alter table public.links add column if not exists icone text;
alter table public.links add column if not exists icon_blob text;
alter table public.links add column if not exists is_custom_icon boolean not null default false;
