# F8 SaaS Template

A batteries-included starter for vibecoding your first SaaS. Everything the
boring part of a SaaS needs is already wired up so you can spend your time on
the product.

## What's in the box

- **Next.js 14** (App Router, TypeScript, Server Components, Server Actions)
- **Supabase** for authentication (email/password + OAuth) and Postgres
- **Drizzle ORM** with a typed schema for profiles and subscriptions
- **Stripe** subscriptions: checkout, billing portal, and webhooks
- **Tailwind CSS** + **shadcn/ui**-style components (Button, Input, Card, Dropdown, Avatar, etc.)
- **Landing page**: hero, features, pricing toggle, FAQ, footer
- **Auth pages**: sign in, sign up, forgot / reset password
- **Dashboard**: sidebar, top bar with user menu, account + billing + settings pages
- **Route protection** via middleware (`/dashboard`, `/account` are gated)

## Quick start

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

You need:

- **Supabase** — create a project at [supabase.com](https://supabase.com) and copy the URL, anon key, service-role key and the Postgres connection string.
- **Stripe** — create an account at [stripe.com](https://stripe.com), copy your test keys, create a "Pro" product with monthly + yearly prices, and paste the price IDs into `.env.local`.

### 3. Push the database schema

```bash
npm run db:push
```

Then open the Supabase SQL editor and run the contents of
`db/sql/handle_new_user.sql`. This creates a trigger that automatically inserts
a row into `profiles` whenever someone signs up.

### 4. Run the dev server

```bash
npm run dev
```

Visit <http://localhost:3000>.

### 5. Test Stripe webhooks locally

In a separate terminal:

```bash
npm run stripe:listen
```

Copy the `whsec_…` secret it prints and paste it into
`STRIPE_WEBHOOK_SECRET` in `.env.local`.

## Project layout

```
app/
  (marketing)/       ← public landing page
  (auth)/            ← login, signup, forgot/reset-password
  dashboard/         ← protected app (layout, overview, account, billing, settings)
  api/stripe/        ← checkout, portal, webhook routes
  auth/              ← Supabase OAuth callback + sign-out
components/
  ui/                ← shadcn-style primitives (Button, Input, Card, etc.)
  marketing/         ← landing-page sections
  dashboard/         ← sidebar, topbar, user menu
lib/
  supabase/          ← browser + server + middleware Supabase clients
  stripe/            ← Stripe client and plan definitions
  utils.ts           ← `cn` helper
db/
  schema/            ← Drizzle tables (profiles, subscriptions)
  sql/               ← raw SQL helpers you run in Supabase
  index.ts           ← drizzle db connection
middleware.ts        ← refreshes Supabase session + protects routes
prompts/             ← recipes + conventions to paste into your AI assistant
```

## Prompts for your AI assistant

The [`prompts/`](./prompts) folder contains reference docs + recipes written
to be pasted into Claude / Cursor / v0 when you're extending the template:

- `prompts/instructions/` — backend, frontend, auth, Stripe, and plan-management
  conventions so the assistant writes code that fits.
- `prompts/project-setup/` — step-by-step recipes for rebuilding any layer
  from scratch, plus `setup-tables.md` for adding a new database table.

See [`prompts/README.md`](./prompts/README.md) for the full index.

## Customising

- **Copy** — edit `components/marketing/*` for the landing page and
  `app/(auth)/*` for auth-page copy.
- **Plans** — edit `lib/stripe/plans.ts` and update the price IDs in
  `.env.local`. The pricing section and billing page read from this file.
- **Database** — add tables under `db/schema/`, re-export from
  `db/schema/index.ts`, then run `npm run db:push`.
- **Routes** — anything under `/dashboard` or `/account` is auto-protected.
  Update `PROTECTED_PREFIXES` in `lib/supabase/middleware.ts` to change.

## Deploying

Push this repo to GitHub and import it on [Vercel](https://vercel.com). Add
the same env vars you have in `.env.local`, set
`NEXT_PUBLIC_SITE_URL` to your deployed URL, and hook the Stripe webhook
(<https://dashboard.stripe.com/webhooks>) to
`https://your-site.com/api/stripe/webhook`.

## Credits

Structurally inspired by
[VolkisAI/codespring-boilerplate](https://github.com/VolkisAI/codespring-boilerplate),
rebuilt from scratch with Supabase Auth instead of Clerk and Stripe as the
sole payment provider.
