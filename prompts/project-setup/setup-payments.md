# Payments Setup Instructions

Use this guide to set up payments for this project.

It uses **Stripe only**. Do not add PayPal, Paddle, LemonSqueezy, or Whop.

Write the complete code for every step. Do not get lazy. Write everything
that is needed.

Your goal is to completely finish the payments setup.

## Helpful Links

If the user gets stuck, refer them to:

- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Stripe Docs](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Billing Portal](https://stripe.com/docs/customer-management)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (for local webhook testing)

## Required Environment Variables

Tell the user to set these in `.env.local`:

```bash
# Stripe API keys (Dashboard → Developers → API keys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Webhook signing secret. In local dev, `stripe listen` prints this.
# In prod, get it from Dashboard → Developers → Webhooks → your endpoint.
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs for the Pro plan (create monthly + yearly prices in Stripe)
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY=price_...

# Base URL used to build checkout success/cancel URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Install Libraries

```bash
npm i stripe
```

And install the Stripe CLI (for local webhook testing) from
<https://stripe.com/docs/stripe-cli>.

## Setup Steps

- In Stripe Dashboard:
  1. Create a product called "Pro".
  2. Add two **recurring** prices: one monthly, one yearly.
  3. Copy each `price_…` into the env vars above.

- Create the Stripe server client at `lib/stripe/server.ts`:

```ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
  typescript: true,
  appInfo: { name: "Your SaaS", version: "0.1.0" },
});
```

- Create `lib/stripe/plans.ts` as the single source of truth for plans the UI
  renders. Each entry references a Stripe price ID via env var. See
  `lib/stripe/plans.ts` in this repo.

- Make sure the database has a `subscriptions` table (see
  [`setup-backend.md`](./setup-backend.md)). The webhook below owns every
  write to this table.

- Create the checkout route at `app/api/stripe/checkout/route.ts`:
  - Accepts `{ priceId }` in the POST body.
  - Resolves the signed-in user via `createClient()` from
    `@/lib/supabase/server`.
  - Looks up or creates a Stripe customer and stores the `stripeCustomerId`
    on the user's `subscriptions` row.
  - Creates a `checkout.Session` with `mode: "subscription"`,
    `client_reference_id: user.id`, and
    `subscription_data.metadata.supabaseUserId: user.id` so the webhook can
    match events back to the user.
  - Returns `{ url }`.

  See `app/api/stripe/checkout/route.ts` in this repo.

- Create the billing portal route at `app/api/stripe/portal/route.ts`:
  - Resolves the user.
  - Reads `stripeCustomerId` from their `subscriptions` row.
  - Creates a `billingPortal.Session` and returns `{ url }`.

  See `app/api/stripe/portal/route.ts` in this repo.

- Create the webhook route at `app/api/stripe/webhook/route.ts`:

  - Use `runtime = "nodejs"` (required for `stripe.webhooks.constructEvent`).
  - Verify the signature with `STRIPE_WEBHOOK_SECRET`.
  - Handle these events:
    - `checkout.session.completed` — upsert the customer id, then
      `syncSubscription(subscription)` for the subscription it created.
    - `customer.subscription.created`, `updated`, `deleted` —
      `syncSubscription(sub)`.
  - `syncSubscription` writes status, priceId, interval, currentPeriodEnd,
    and cancelAtPeriodEnd into the `subscriptions` row keyed by
    `metadata.supabaseUserId`.

  See `app/api/stripe/webhook/route.ts` in this repo.

- Add a script to `package.json` for local webhook testing:

```json
"scripts": {
  "stripe:listen": "stripe listen --forward-to localhost:3000/api/stripe/webhook"
}
```

- Run it in a second terminal and paste the `whsec_…` it prints into
  `STRIPE_WEBHOOK_SECRET` in `.env.local`.

- Wire up the UI:
  - **Public pricing section** (`components/marketing/pricing.tsx`) — for
    each plan, POST to `/api/stripe/checkout` with `{ priceId }` and
    redirect to the returned URL. If the user isn't signed in, send them to
    `/signup?next=/dashboard/billing` first.
  - **In-app upgrade flow** (`app/dashboard/billing/plan-picker.tsx`) — same
    pattern, but the user is always signed in.
  - **Manage billing button** (`app/dashboard/billing/manage-button.tsx`) —
    POSTs to `/api/stripe/portal` and redirects to the returned URL.

- **Production**: add a webhook endpoint in the Stripe Dashboard pointing to
  `https://<your-domain>/api/stripe/webhook`. Subscribe to:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

  Copy the signing secret into the production `STRIPE_WEBHOOK_SECRET`.

- The payments system is now setup.
