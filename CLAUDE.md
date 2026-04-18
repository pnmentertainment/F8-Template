# CLAUDE.md

Guidance for AI assistants (and humans) building features on top of this
template.

## Stack

- Next.js 14 App Router, TypeScript, Server Components and Server Actions.
- Supabase Auth + Postgres. Auth clients live in `lib/supabase/`.
- Drizzle ORM. Schema in `db/schema/`, connection in `db/index.ts`.
- Stripe (only). Client in `lib/stripe/server.ts`, plans in `lib/stripe/plans.ts`.
- Tailwind + shadcn-style primitives in `components/ui/`.

## Product context

Before implementing a new feature, read `docs/prd.md` and
`docs/tech-spec.md` if they exist — they describe what the user is
building on top of this template. Raw customer research lives in
`docs/research/`.

## Reference docs

Before non-trivial work, read the matching doc in `prompts/`:

- `prompts/instructions/backend-instructions.md` — backend rules.
- `prompts/instructions/frontend-instructions.md` — frontend rules.
- `prompts/instructions/auth/auth-overview.md` — how auth is wired up.
- `prompts/instructions/stripe/stripe-overview.md` — how Stripe / webhooks work.
- `prompts/instructions/manage-plans/managing-plans.md` — add / change a plan.
- `prompts/project-setup/setup-tables.md` — add a new DB table (schema + actions + RLS).

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

## Gating a paid feature

1. Add the limit / flag to `PLAN_LIMITS` in `lib/auth/subscription.ts`.
2. In the Server Action, check `getPlanLimits(await getSubscription(user.id))`
   and return `{ error }` if the user is over-limit.
3. In the page UI, render `<UpgradeCard />` from
   `components/billing/upgrade-card.tsx` when the user is at the limit,
   instead of the form.

See `app/dashboard/projects/` for the canonical example.

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
