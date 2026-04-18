-- Run this ONCE in the Supabase SQL editor after `npm run db:push` has
-- created the tables. It wires up two things:
--
--   1. A trigger that auto-creates a `profiles` row whenever a user signs up
--      (so you don't have to do it manually in your signup flow).
--   2. Row Level Security on the `projects` example table so the Supabase
--      client only ever returns the signed-in user's rows.
--
-- If you delete the `projects` example feature, you can also delete the
-- second half of this file — but keep the first half.

-- -------------------------------------------------------------------
-- 1. Auto-create a profile row on signup
-- -------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- -------------------------------------------------------------------
-- 2. Row Level Security on the example `projects` table
-- -------------------------------------------------------------------

alter table public.projects enable row level security;

drop policy if exists "Users can read their own projects" on public.projects;
create policy "Users can read their own projects"
on public.projects for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own projects" on public.projects;
create policy "Users can insert their own projects"
on public.projects for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own projects" on public.projects;
create policy "Users can update their own projects"
on public.projects for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own projects" on public.projects;
create policy "Users can delete their own projects"
on public.projects for delete
using (auth.uid() = user_id);
