-- Team Bianchi: private storage bucket for chat image attachments.
-- Run this once in Supabase SQL Editor. The bucket remains private; signed URLs are created by the app.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('chat-images', 'chat-images', false, 6291456, array['image/jpeg','image/png','image/webp','image/gif','image/heic'])
on conflict (id) do update set
  public = false,
  file_size_limit = 6291456,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','image/heic'];

drop policy if exists "Team Bianchi chat images upload own folder" on storage.objects;
create policy "Team Bianchi chat images upload own folder"
on storage.objects for insert to authenticated
with check (bucket_id = 'chat-images' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Team Bianchi chat images read authenticated" on storage.objects;
create policy "Team Bianchi chat images read authenticated"
on storage.objects for select to authenticated
using (bucket_id = 'chat-images');

drop policy if exists "Team Bianchi chat images delete own folder" on storage.objects;
create policy "Team Bianchi chat images delete own folder"
on storage.objects for delete to authenticated
using (bucket_id = 'chat-images' and (storage.foldername(name))[1] = auth.uid()::text);
