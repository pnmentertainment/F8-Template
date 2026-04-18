# Add a new database table

Use this prompt template when you want to add a new table to the database.

Paste the whole thing into Claude / Cursor and fill in the blanks.

---

## Context

This is an F8 SaaS template: Supabase Postgres + Drizzle ORM + Server
Actions.

- Schema files live in `db/schema/`.
- Every schema file MUST be re-exported from `db/schema/index.ts` — the
  `db` client in `db/index.ts` imports everything from the barrel and the
  app will fail to build if you miss this.
- User foreign keys are `uuid` and reference `profiles.id`, which equals
  `auth.uid()` in Supabase.

Follow the conventions in `prompts/instructions/backend-instructions.md`.
See `prompts/project-setup/setup-tables.md` for the long-form walkthrough.

## Task

Add a table called **`<TABLE_NAME>`** with the following columns:

- `<COLUMN_1>` — `<TYPE>` — `<NOTES>`
- `<COLUMN_2>` — `<TYPE>` — `<NOTES>`
- ... plus `userId`, `createdAt`, `updatedAt`.

## Steps

1. Create `db/schema/<table>.ts` using `pgTable`. Include `id` (uuid PK,
   default random), a `userId` foreign key to `profiles.id` with
   `onDelete: "cascade"`, `createdAt`, `updatedAt`, and `$inferSelect` /
   `$inferInsert` type exports.

2. Add `export * from "./<table>";` to `db/schema/index.ts`.

3. Push the schema to Supabase with `npm run db:push`.

4. In the Supabase SQL editor, enable Row Level Security on the new table
   (defence-in-depth — our server code already filters by `userId`):

   ```sql
   alter table public.<table> enable row level security;

   create policy "Users can read their own <table>"
   on public.<table> for select using (auth.uid() = user_id);

   create policy "Users can insert their own <table>"
   on public.<table> for insert with check (auth.uid() = user_id);

   create policy "Users can update their own <table>"
   on public.<table> for update
   using (auth.uid() = user_id)
   with check (auth.uid() = user_id);

   create policy "Users can delete their own <table>"
   on public.<table> for delete using (auth.uid() = user_id);
   ```

5. Create server actions in `app/dashboard/<feature>/actions.ts` following
   the pattern in `app/dashboard/projects/actions.ts`: get the user,
   validate with zod, run the query, `revalidatePath`.

## File paths to create or edit

- `db/schema/<table>.ts` — new
- `db/schema/index.ts` — add one export line

## Environment variables

None — `DATABASE_URL` already configured.

## Reference

- `db/schema/projects.ts` — canonical table with a user FK.
- `db/schema/profiles.ts` — table keyed by the Supabase user id.
- `db/schema/subscriptions.ts` — table with enums and a unique constraint.
