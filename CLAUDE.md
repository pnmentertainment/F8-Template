# CLAUDE.md

Guidance for AI assistants (and humans) building features on top of this
template.

## Stack

- Next.js 14 App Router, TypeScript, Server Components and Server Actions.
- Supabase Auth + Postgres. Auth clients live in `lib/supabase/`.
- Drizzle ORM. Schema in `db/schema/`, connection in `db/index.ts`.
- Stripe (only). Client in `lib/stripe/server.ts`, plans in `lib/stripe/plans.ts`.
- Tailwind + shadcn-style primitives in `components/ui/`.

## Conventions

- **Use the alias `@/…`** for all internal imports.
- **Server components by default.** Add `"use client"` only when you need
  state, effects, or browser APIs.
- **Auth in server components:** `const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser();`
- **Writes from the client** go through server actions (see
  `app/(auth)/actions.ts`) or route handlers in `app/api/`.
- **Protected routes:** anything under `/dashboard` is gated by
  `middleware.ts` + the `dashboard/layout.tsx` guard.
- **Stripe state is the source of truth for billing.** Don't write
  subscription fields anywhere except in `app/api/stripe/webhook/route.ts`.

## Adding a new feature

1. Add a table to `db/schema/<feature>.ts` and export it from
   `db/schema/index.ts`. Run `npm run db:push`.
2. Add a page under `app/dashboard/<feature>/page.tsx` (server component).
   Fetch data with `db` and `createClient()`.
3. For mutations, create `app/dashboard/<feature>/actions.ts` with
   `"use server"` and export server actions. Import them from client forms.
4. Add a nav link in `components/dashboard/sidebar.tsx`.

## Adding a new plan

1. Create a product + price in the Stripe dashboard.
2. Add the price ID to `.env.local` and `.env.example`.
3. Add an entry to `PLANS` in `lib/stripe/plans.ts`.

## Things not to do

- Don't reintroduce Clerk or any other auth provider.
- Don't add PayPal, LemonSqueezy, Paddle or any other payment provider —
  Stripe only.
- Don't bypass the webhook to set subscription fields manually.
- Don't edit `next-env.d.ts` (generated).
