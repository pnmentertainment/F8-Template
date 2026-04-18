-- Run this in the Supabase SQL editor after `npm run db:push` creates the
-- `projects` table. Enables Row Level Security so that the Supabase client
-- (if you ever use it) only returns rows for the signed-in user.
--
-- Our server code already filters by user_id, but RLS is defence-in-depth.

alter table public.projects enable row level security;

create policy "Users can read their own projects"
on public.projects for select
using (auth.uid() = user_id);

create policy "Users can insert their own projects"
on public.projects for insert
with check (auth.uid() = user_id);

create policy "Users can update their own projects"
on public.projects for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own projects"
on public.projects for delete
using (auth.uid() = user_id);
