-- Run this ONCE in the Supabase SQL editor after `npm run db:push` has
-- created the tables. It wires up three things:
--
--   1. A trigger that auto-creates a `profiles` row whenever a user signs up
--      (so you don't have to do it manually in your signup flow).
--   2. Row Level Security on `profiles` and `subscriptions`. Supabase exposes
--      every table in the `public` schema to the browser via its API, using
--      the public anon key. Without RLS, anyone could read every user's email
--      or mark themselves as Pro. Users can only read their own rows; all
--      writes go through the server (Drizzle) and the Stripe webhook.
--   3. Row Level Security on the `projects` example table.
--
-- If you delete the `projects` example feature, you can also delete
-- section 3 of this file — but keep sections 1 and 2.
--
-- Every table you add MUST get RLS too. See prompts/features/add-a-table.md.

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
-- 2. Row Level Security on `profiles` and `subscriptions`
-- -------------------------------------------------------------------
-- Read-only for the owner. No insert/update/delete policies on purpose:
-- with RLS on and no policy, the browser can't write. The app writes via
-- Drizzle (a direct Postgres connection, which isn't subject to RLS).

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select
using (auth.uid() = id);

alter table public.subscriptions enable row level security;

drop policy if exists "Users can read their own subscription" on public.subscriptions;
create policy "Users can read their own subscription"
on public.subscriptions for select
using (auth.uid() = user_id);

-- -------------------------------------------------------------------
-- 3. Row Level Security on the example `projects` table
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
