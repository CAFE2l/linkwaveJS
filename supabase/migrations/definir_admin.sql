-- Keep the system owner synchronized in the public user/profile mirrors.
update public.users
set
  username = 'gutiajs',
  role = 'admin',
  active = true
where lower(email) = 'gutiajs@gmail.com';

update public.profiles
set
  username = 'gutiajs',
  active = true,
  updated_at = now()
where lower(email) = 'gutiajs@gmail.com';

create index if not exists users_role_idx on public.users(role);
