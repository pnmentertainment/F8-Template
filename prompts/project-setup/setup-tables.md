# New Table Instructions

Use this guide to add a new table to the database.

It uses **Supabase (Postgres)**, **Drizzle ORM**, and **Supabase Row Level
Security (RLS)**.

Write the complete code for every step. Do not get lazy. Write everything
that is needed.

## Before you start

- The database already has `profiles` (keyed by the Supabase user id UUID)
  and `subscriptions`. See `db/schema/`.
- User foreign keys should always be `uuid` and reference `profiles.id`
  (which equals `auth.uid()` in Supabase).
- Subscription state is owned by the Stripe webhook — do not add tables or
  columns that duplicate it.

## Step 1: Create the schema file

New tables live in `db/schema/<name>.ts`. Example for a `projects` table
owned by the signed-in user:

```ts
// db/schema/projects.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
```

## Step 2: Export it from `db/schema/index.ts`

**CRITICAL: If you forget this, Drizzle won't see the table and builds will
fail in production.**

```ts
// db/schema/index.ts
export * from "./profiles";
export * from "./subscriptions";
export * from "./projects"; // ← add your new table here
```

The `db` client in `db/index.ts` does `import * as schema from "./schema"`,
which relies on the barrel export.

## Step 3: Push the schema to Supabase

```bash
npm run db:push
```

For production, prefer `npm run db:generate` (writes a migration file to
`db/migrations/`) then `npm run db:migrate`.

## Step 4: Write server actions

Mutations go in a **Server Action** file, colocated with the page that uses
them:

```ts
// app/dashboard/projects/actions.ts
"use server";

import { db } from "@/db";
import { projects, type NewProject } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export async function createProject(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = createProjectSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  await db.insert(projects).values({ ...parsed, userId: user.id });
  revalidatePath("/dashboard/projects");
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, user.id)));

  revalidatePath("/dashboard/projects");
}
```

## Step 5: Read from a Server Component

```tsx
// app/dashboard/projects/page.tsx
import { db } from "@/db";
import { projects } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, desc } from "drizzle-orm";

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user!.id))
    .orderBy(desc(projects.createdAt));

  return (
    <ul>{rows.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
  );
}
```

## Step 6: Enable Row Level Security in Supabase

Even though our server code filters by `userId`, **you should still enable
RLS** as defence-in-depth. Run this in the Supabase SQL editor:

```sql
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
```

> **Note:** Drizzle connects via the `DATABASE_URL` (pooler) — this uses
> the `postgres` superuser and **bypasses RLS**. RLS protects you if anyone
> ever queries the database through the Supabase client (browser or
> anon-key server calls). Keep your server code's `userId` filters too.

## Step 7 (optional): Add a nav link

Add an entry to `components/dashboard/sidebar.tsx` so the new page shows up
in the sidebar.

- The new table is now set up.
