-- Add role column to users table (default: 'user')
alter table public.users add column if not exists role text not null default 'user' check (role in ('user', 'admin'));

-- Set gutiajs@gmail.com as admin master
update public.users set role = 'admin' where email = 'gutiajs@gmail.com';

-- Create index for admin lookups
create index if not exists users_role_idx on public.users(role);
