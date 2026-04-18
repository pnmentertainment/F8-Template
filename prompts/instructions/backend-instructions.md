# Backend Instructions

Use this guide for backend work in this project.

It uses **Supabase** (Auth + Postgres), **Drizzle ORM**, and **Next.js Server
Actions / Route Handlers**.

Write the complete code for every step. Do not get lazy. Write everything that
is needed.

Your goal is to completely finish whatever the user asks for.

## Steps

- New tables go in a new schema file in `db/schema/` like `db/schema/profiles.ts`.
  - Export the new schema from `db/schema/index.ts`.
  - Drizzle picks up everything exported from `db/schema/index.ts` via
    `db/index.ts` — you don't need to register tables anywhere else.
- Server-side data reads go in the server component that needs them, using
  the `db` helper from `@/db` and the Supabase server client from
  `@/lib/supabase/server`.
- Server mutations (writes) go in **Server Actions**. Prefer colocating them
  with the page that uses them:
  - `app/dashboard/<feature>/actions.ts` with `"use server"` at the top.
  - Import them directly into client forms (`form action={yourAction}`).
- HTTP endpoints (webhooks, Stripe checkout redirects, OAuth callbacks) go in
  `app/api/<name>/route.ts` as Route Handlers.
- Once a schema changes, run `npm run db:push` to apply it to Supabase.
  For production, prefer `npm run db:generate` + `npm run db:migrate`.

## Requirements

- **Data fetching happens in Server Components.** Fetch in the server
  component, pass data down to client components as props.
- **All writes must come from the server.** Never call `db` from a
  `"use client"` file. Use a Server Action or Route Handler.
- **Always get the user on the server** with
  `const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser();`.
  Use `user.id` (a Supabase UUID) as your foreign key to `profiles.id`.
- **Never trust input.** Validate with `zod` at the boundary of every Server
  Action and Route Handler.
- **Subscription state is owned by the Stripe webhook.** Do not write to the
  `subscriptions` table from anywhere except
  `app/api/stripe/webhook/route.ts`.
