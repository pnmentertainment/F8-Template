# Stripe Overview

This document describes how Stripe is wired up in this project. Read this
before adding plans, changing checkout behaviour, or touching the webhook.

## Overview

- **Stripe is the only payment provider.** No PayPal, Paddle, LemonSqueezy,
  or Whop — do not add any.
- Users pay via **Stripe Checkout**. Existing subscribers manage their plan
  via the **Stripe Billing Portal**.
- The `subscriptions` table is kept in sync with Stripe entirely through the
  **webhook** (`app/api/stripe/webhook/route.ts`). Nothing else writes to
  that table.

## Files that make up the payments system

| File                                         | Purpose                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| `lib/stripe/server.ts`                       | Shared Stripe Node SDK client.                                            |
| `lib/stripe/plans.ts`                        | Source-of-truth list of plans, prices, and the features each includes.   |
| `app/api/stripe/checkout/route.ts`           | Creates a Checkout session for a given price ID. Called from pricing UIs. |
| `app/api/stripe/portal/route.ts`             | Opens the Stripe Billing Portal for the current customer.                 |
| `app/api/stripe/webhook/route.ts`            | Handles `checkout.session.completed` + `customer.subscription.*` events. |
| `db/schema/subscriptions.ts`                 | Drizzle schema for the `subscriptions` table.                             |
| `components/marketing/pricing.tsx`           | Public pricing section — calls `/api/stripe/checkout`.                    |
| `app/dashboard/billing/*`                    | Authenticated billing page — subscribe, or open the portal.               |

## Database

The `subscriptions` table (`db/schema/subscriptions.ts`) stores:

- `userId` — UUID, foreign key to `profiles.id` (unique: one row per user).
- `stripeCustomerId` — created on the first checkout.
- `stripeSubscriptionId` — `null` until the user has an active subscription.
- `stripePriceId`, `status`, `interval`, `currentPeriodEnd`, `cancelAtPeriodEnd`
  — mirrored from Stripe by the webhook.

Plan tiers are derived at read-time by comparing `stripePriceId` against
`lib/stripe/plans.ts`.

## Environment variables

```bash
STRIPE_SECRET_KEY=                           # sk_test_... / sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=          # pk_test_... / pk_live_...
STRIPE_WEBHOOK_SECRET=                       # whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=         # price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY=          # price_...
NEXT_PUBLIC_SITE_URL=                        # used to build success/cancel URLs
```

In local dev, run `npm run stripe:listen` (which wraps `stripe listen
--forward-to localhost:3000/api/stripe/webhook`) and paste the `whsec_…`
secret it prints into `.env.local` as `STRIPE_WEBHOOK_SECRET`.

## End-to-end flow

1. User clicks a plan in `components/marketing/pricing.tsx` or
   `app/dashboard/billing/plan-picker.tsx`.
2. Client POSTs `{ priceId }` to `/api/stripe/checkout`.
3. The route handler:
   - gets the current user (redirects to login if none),
   - looks up or creates a Stripe customer,
   - stores the customer id on `subscriptions` (keyed by `userId`),
   - creates a `checkout.Session` with `client_reference_id: user.id` and
     `subscription_data.metadata.supabaseUserId: user.id`.
4. User pays on Stripe's hosted page and is redirected back to
   `/dashboard?checkout=success`.
5. Stripe sends webhook events to `/api/stripe/webhook`:
   - `checkout.session.completed` → `upsertCustomer` + sync the new subscription.
   - `customer.subscription.created` / `updated` / `deleted` → `syncSubscription`.
6. `syncSubscription` writes everything Stripe knows (status, interval,
   period end, cancel-at-period-end) into the `subscriptions` row for that
   user.

## Managing an existing subscription

The **Billing Portal** is Stripe's hosted page for upgrading, downgrading,
updating the payment method, and cancelling. The
`/api/stripe/portal` route creates a portal session for the current user
and returns the URL. `app/dashboard/billing/manage-button.tsx` calls it.

## Access control for paid features

Read the `subscriptions` row for the current user in the server component
that needs gating:

```ts
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

const [sub] = await db
  .select()
  .from(subscriptions)
  .where(eq(subscriptions.userId, user.id))
  .limit(1);

const isPro = sub?.status === "active" || sub?.status === "trialing";
```

## Deploying the webhook

In production you need a **separate** webhook endpoint configured in the
Stripe Dashboard (not the one `stripe listen` creates).

1. Go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**.
2. URL: `https://<your-domain>/api/stripe/webhook`.
3. Events: `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `customer.subscription.deleted`.
4. Copy the signing secret into the production `STRIPE_WEBHOOK_SECRET` env
   var.
