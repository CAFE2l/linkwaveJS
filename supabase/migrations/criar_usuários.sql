-- Create the user-content bucket for avatar and banner uploads
insert into storage.buckets (id, name, public)
values ('user-content', 'user-content', true)
on conflict (id) do nothing;

-- Allow public read access
drop policy if exists "user_content_public_select" on storage.objects;
create policy "user_content_public_select"
on storage.objects for select
using (bucket_id = 'user-content');

-- Allow authenticated users to upload
drop policy if exists "user_content_authenticated_insert" on storage.objects;
create policy "user_content_authenticated_insert"
on storage.objects for insert
with check (
  bucket_id = 'user-content'
  and auth.role() = 'authenticated'
);

-- Allow users to update their own files
drop policy if exists "user_content_owner_update" on storage.objects;
create policy "user_content_owner_update"
on storage.objects for update
using (
  bucket_id = 'user-content'
  and auth.uid() = owner
);

-- Allow users to delete their own files
drop policy if exists "user_content_owner_delete" on storage.objects;
create policy "user_content_owner_delete"
on storage.objects for delete
using (
  bucket_id = 'user-content'
  and auth.uid() = owner
);
