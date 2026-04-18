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
- **Example feature**: a working Projects CRUD under `app/dashboard/projects/` that mirrors `prompts/project-setup/setup-tables.md` — study it, then delete it when you build your own
- **Paid-feature gating**: `lib/auth/subscription.ts` + a worked example (Free plan capped at 3 projects, Pro unlimited) with an `UpgradeCard` upsell
- **Route protection** via middleware (anything under `/dashboard` is gated)
- **Dark mode** via `next-themes` — toggle in the header
- **Polish**: branded 404 / error / loading screens, dynamic favicon + OG image, a dismissible "getting started" checklist on the dashboard, and a startup env-var check with friendly errors
- **Legal placeholders**: `/privacy` and `/terms` pages ready to be replaced

## Your journey (clone → launch)

From cloning the template to shipping your first paid user, in order.
Each step links into the detailed section or doc.

### Set up the template

1. **Clone** this repo — or click "Use this template" on GitHub to get
   your own copy.
2. **Install** dependencies: `npm install`.
3. **Configure services + env vars** — create your Supabase and Stripe
   accounts and fill in `.env.local`. See [Setup details](#setup-details).
4. **Run the DB setup** — `npm run db:push`, then paste
   [`db/sql/setup.sql`](./db/sql/setup.sql) into the Supabase SQL editor.
5. **Start the dev server** — `npm run dev`, then open
   <http://localhost:3000> and sign up to verify everything works.

### Product phase (plan before you build)

6. **Prepare your research** — convert your `.pptx` decks, PDFs, and
   notes into markdown files in `docs/research/` →
   [`prepare-research.md`](./prompts/product/prepare-research.md).
7. **Write the PRD** →
   [`write-prd.md`](./prompts/product/write-prd.md) → saves to
   `docs/prd.md`.
8. **Write the tech spec** →
   [`write-tech-spec.md`](./prompts/product/write-tech-spec.md) → saves
   to `docs/tech-spec.md`.
9. **Rewrite the sales pages** — hero, features, pricing copy, FAQ,
   metadata, OG image, all grounded in your research →
   [`write-sales-pages.md`](./prompts/product/write-sales-pages.md).

### Build and ship

10. **Build your features** — work through your tech spec using the
    recipes in [`prompts/features/`](./prompts/features/) (add a page,
    add a table, add an OAuth provider, add a gated feature).
11. **Deploy to production** →
    [`DEPLOY.md`](./DEPLOY.md) — Vercel + Supabase + Stripe checklist
    with smoke tests.

---

## Setup details

Expanded notes for steps 2–5 above.

### Install

```bash
npm install
```

### Configure environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

You need:

- **Supabase** — create a project at [supabase.com](https://supabase.com) and copy the URL, anon key, service-role key and the Postgres connection string.
- **Stripe** — create an account at [stripe.com](https://stripe.com), copy your test keys, create a "Pro" product with monthly + yearly prices, and paste the price IDs into `.env.local`.

If a required variable is missing, the server prints a friendly list of
what's missing on startup.

### Push the database schema

```bash
npm run db:push
```

Then open the Supabase SQL editor and run
[`db/sql/setup.sql`](./db/sql/setup.sql) once. It installs the trigger that
auto-creates a `profiles` row on signup plus Row Level Security on the
example Projects table.

### Run the dev server

```bash
npm run dev
```

Visit <http://localhost:3000>.

### Test Stripe webhooks locally

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
docs/                ← your product research, PRD, tech spec, inspiration
```

## Prompts for your AI assistant

The [`prompts/`](./prompts) folder contains reference docs + recipes written
to be pasted into Claude / Cursor / v0 when you're extending the template:

- `prompts/product/` — prepare research, write your PRD, tech spec, and sales pages (the product phase above).
- `prompts/instructions/` — backend, frontend, auth, Stripe, and plan-management
  conventions so the assistant writes code that fits.
- `prompts/project-setup/` — step-by-step recipes for rebuilding any layer
  from scratch, plus `setup-tables.md` for adding a new database table.
- `prompts/features/` — task-shaped prompts for common additions
  (page, table, OAuth provider, gated feature).

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

## Credits

Structurally inspired by
[VolkisAI/codespring-boilerplate](https://github.com/VolkisAI/codespring-boilerplate),
rebuilt from scratch with Supabase Auth instead of Clerk and Stripe as the
sole payment provider.
