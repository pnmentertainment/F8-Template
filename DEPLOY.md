# Deploying to production

A checklist to get F8 from `localhost:3000` to a real domain on Vercel.
Allow ~30 minutes the first time.

You'll touch three dashboards:

1. **Vercel** — hosting + env vars.
2. **Supabase** — auth redirect URLs.
3. **Stripe** — live API keys + production webhook.

---

## 1. Push the code to GitHub

If you haven't already:

```bash
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

## 2. Import the repo into Vercel

1. Go to <https://vercel.com/new> and import your repo.
2. Framework preset: **Next.js** (auto-detected).
3. Root directory: **.** (default).
4. Don't deploy yet — set env vars first.

## 3. Set production environment variables in Vercel

In the Vercel project → **Settings → Environment Variables**, add everything
from `.env.example`. The production values differ from local in three places:

| Variable                           | Local                          | Production                                    |
| ---------------------------------- | ------------------------------ | --------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`             | `http://localhost:3000`        | `https://your-domain.com`                     |
| `STRIPE_SECRET_KEY`                | `sk_test_…`                    | `sk_live_…` (after activating your Stripe account) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_…`                  | `pk_live_…`                                   |
| `STRIPE_WEBHOOK_SECRET`            | from `stripe listen`           | from the production webhook (step 6)          |
| `NEXT_PUBLIC_STRIPE_PRICE_ID_*`    | test-mode price IDs            | live-mode price IDs (recreate the product)    |

Supabase keys are the same for local and production — Supabase doesn't have
"test mode".

Hit **Deploy**. Vercel will give you a URL like
`your-project.vercel.app` — you can attach a custom domain now or later.

## 4. Configure Supabase for the production URL

In **Supabase → Authentication → URL Configuration**:

- **Site URL**: `https://your-domain.com`.
- **Redirect URLs**: add `https://your-domain.com/auth/callback`. Keep the
  localhost entry so dev still works.

If you added OAuth providers, update the redirect URIs in the provider's
console (Google Cloud / GitHub OAuth Apps) to include the same callback.

## 5. Run the SQL once (if you haven't)

Open the Supabase SQL editor and run the contents of
[`db/sql/setup.sql`](./db/sql/setup.sql). This is a one-time step per
project.

## 6. Create the production Stripe webhook

In **Stripe Dashboard → Developers → Webhooks → Add endpoint**:

- **Endpoint URL**: `https://your-domain.com/api/stripe/webhook`.
- **Events to send**:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- **Signing secret**: copy it. Paste into Vercel as
  `STRIPE_WEBHOOK_SECRET` (production only — don't overwrite local).
- Redeploy so the new env var takes effect.

> **Warning:** the `stripe listen` webhook secret from local dev will NOT
> work in production. You must create a separate webhook here.

## 7. Create live-mode Stripe products

Toggle the Stripe Dashboard from **Test data** to **Live data** (top-left
switch), then recreate your Pro product with monthly + yearly prices.
Copy the new live-mode `price_…` IDs into Vercel env vars and redeploy.

## 8. Smoke test in production

- [ ] Visit `https://your-domain.com` — landing page renders.
- [ ] Sign up with a real email, confirm via the email link.
- [ ] Land on `/dashboard` after confirmation.
- [ ] Create a project — stored in Supabase.
- [ ] Click "Subscribe" on the pricing page — redirects to live Stripe.
- [ ] Use a real card (or `4242 4242 4242 4242` in test mode if you're
      still testing).
- [ ] Back in Stripe → **Webhooks → Endpoint → Events**, confirm
      `checkout.session.completed` succeeded (200 response).
- [ ] Back in your app → `/dashboard/billing`, plan shows as Pro.
- [ ] Click "Manage billing" — opens the Stripe Billing Portal.

## 9. Before you launch

- [ ] Replace the legal copy in `app/(marketing)/privacy/page.tsx` and
      `app/(marketing)/terms/page.tsx` — the shipped versions are
      placeholders.
- [ ] Replace the F8 logo + name in:
      `components/marketing/site-header.tsx`,
      `components/marketing/site-footer.tsx`,
      `components/dashboard/sidebar.tsx`,
      `app/(auth)/layout.tsx`,
      `app/layout.tsx` (metadata).
- [ ] Replace marketing copy in `components/marketing/hero.tsx`,
      `features.tsx`, `faq.tsx`.
- [ ] Update OG image text in `app/opengraph-image.tsx`.
- [ ] Verify your Stripe business profile (required for live payments).
- [ ] Enable Supabase Point-in-Time Recovery on a paid plan if the data
      matters.

## Troubleshooting

**"Auth: invalid redirect URL" after signup**
You didn't add the production URL to Supabase → Auth → URL Configuration
(step 4).

**Webhook returns 400**
`STRIPE_WEBHOOK_SECRET` in Vercel doesn't match the one Stripe generated
for the production endpoint. Re-copy and redeploy.

**Subscription shows as Free after paying**
The webhook isn't reaching production. Check the Stripe Dashboard →
Webhooks → Endpoint → Events tab. Look for error responses.

**"Build failed: missing environment variable"**
You forgot to add one of the vars from `.env.example` in Vercel. The
server startup log (`lib/env.ts`) will tell you which one.
