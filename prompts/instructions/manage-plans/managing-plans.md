# Managing Plans

Use this guide whenever you need to add, rename, reprice, or remove a
subscription plan.

It uses **Stripe** (products + prices) and the TypeScript plan list in
`lib/stripe/plans.ts`.

Write the complete code for every step. Do not get lazy.

## How plans are represented

Plans live in **one place in code** — `lib/stripe/plans.ts`. Every consumer
in the app reads from that array:

- `components/marketing/pricing.tsx` — public pricing section.
- `app/dashboard/billing/plan-picker.tsx` — in-app upgrade flow.
- `app/dashboard/billing/page.tsx` — reads the current user's
  `subscriptions.stripePriceId` and looks it up here to label the plan.

`lib/stripe/plans.ts` **does not** contain the source-of-truth prices —
Stripe does. The price IDs in the file are references to Stripe objects.

## Required environment variables

Every paid plan needs a price ID in `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY=price_...
```

Add a new env var for each additional plan (e.g.
`NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_MONTHLY`). Update `.env.example` at the
same time.

## Add a new plan

### Step 1: Create the product and prices in Stripe

1. **Stripe Dashboard → Product catalogue → Add product.**
2. Name it (e.g. "Team").
3. Add two **recurring** prices: one monthly, one yearly.
4. Copy each `price_…` ID.

### Step 2: Add env vars

In `.env.local` and `.env.example`:

```bash
NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_YEARLY=price_...
```

### Step 3: Add the plan to `lib/stripe/plans.ts`

```ts
{
  name: "Team",
  description: "For small teams shipping together.",
  priceMonthly: 49,
  priceYearly: 490,
  priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_MONTHLY,
  priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_TEAM_YEARLY,
  features: [
    "Everything in Pro",
    "Up to 10 team members",
    "SSO",
  ],
},
```

That's it — the pricing page and the billing page will both render the new
plan automatically.

### Step 4 (optional): Gate features on the new plan

If the new plan unlocks specific features, update `PLAN_LIMITS` in
`lib/auth/subscription.ts` and read the limits in the Server Action /
Server Component that needs gating. See
`prompts/instructions/stripe/stripe-overview.md` → "Access control for paid
features" for the full pattern. `app/dashboard/projects/` is the canonical
example.

## Rename a plan

- Change `name`, `description`, `features` in `lib/stripe/plans.ts`.
- Existing subscriptions keep working — `stripePriceId` is unchanged.
- Optionally update the product name in Stripe for invoice clarity.

## Change the price of a plan

**Do not edit an existing price in Stripe** — prices are immutable. Instead:

1. Create a new price under the same product in Stripe.
2. Update the env var to the new price ID.
3. Existing subscribers stay on the old price until they cancel or the
   Billing Portal migrates them. You can set a price "migration" in the
   Stripe Billing Portal settings if you want automatic upgrades.

## Remove a plan

1. **Archive** the product in Stripe (don't delete — existing
   subscriptions rely on it).
2. Remove the entry from `PLANS` in `lib/stripe/plans.ts`.
3. Remove the env vars from `.env.local` and `.env.example`.
4. Audit any hard-coded price-ID comparisons in the codebase.

## Reminders

- After changing `.env.local`, restart `npm run dev` so Next.js picks up the
  new values.
- The webhook (`app/api/stripe/webhook/route.ts`) is plan-agnostic — you do
  **not** need to touch it when adding or removing plans.
