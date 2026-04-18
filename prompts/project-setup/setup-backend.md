# Backend Setup Instructions

Use this guide to set up the backend for this project.

It uses **Supabase (Postgres)**, **Drizzle ORM**, and **Next.js Server
Actions / Route Handlers**.

Write the complete code for every step. Do not get lazy. Write everything
that is needed.

Your goal is to completely finish the backend setup.

## Helpful Links

If the user gets stuck, refer them to:

- [Supabase](https://supabase.com/)
- [Drizzle Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle with Supabase](https://orm.drizzle.team/learn/tutorials/drizzle-with-supabase)

## Required Environment Variables

Tell the user to set the following in `.env.local`:

```bash
# From Supabase → Project Settings → Database → Connection string (URI, pooler)
DATABASE_URL=postgresql://postgres:password@host:5432/postgres
```

## Install Libraries

```bash
npm i drizzle-orm postgres
npm i -D drizzle-kit
```

## Setup Steps

- Create a `drizzle.config.ts` at the repo root:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
  verbose: true,
  strict: true,
});
```

- Create the database client at `db/index.ts`:

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle(client, { schema });
```

- Create `db/schema/index.ts` that re-exports every schema file (start with
  profiles and subscriptions):

```ts
export * from "./profiles";
export * from "./subscriptions";
```

- Create `db/schema/profiles.ts` — this table's primary key is the Supabase
  user id (UUID), not a generated id:

```ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
```

- Create `db/schema/subscriptions.ts` — one row per user, owned by the
  Stripe webhook:

```ts
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const subscriptionStatus = pgEnum("subscription_status", [
  "trialing", "active", "canceled", "incomplete",
  "incomplete_expired", "past_due", "unpaid", "paused",
]);

export const planInterval = pgEnum("plan_interval", ["month", "year"]);

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" })
    .unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripePriceId: text("stripe_price_id"),
  status: subscriptionStatus("status"),
  interval: planInterval("interval"),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelAtPeriodEnd: text("cancel_at_period_end"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
```

- Add these scripts to `package.json`:

```json
"scripts": {
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

- Push the schema to Supabase:

```bash
npm run db:push
```

- In the Supabase SQL editor, run the trigger that auto-creates a `profiles`
  row whenever a user signs up. The SQL lives at
  `db/sql/handle_new_user.sql`:

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

- The backend is now setup.

## Where to put new code

- **New tables:** `db/schema/<name>.ts`, re-exported from `db/schema/index.ts`. Run `npm run db:push` to apply.
- **Mutations (writes):** Server Actions colocated with the page that uses them — e.g. `app/dashboard/<feature>/actions.ts` with `"use server"` at the top.
- **HTTP endpoints:** Route Handlers in `app/api/<name>/route.ts`.
- **Reads:** Fetch in a Server Component using `import { db } from "@/db"`. Pass data down as props.
