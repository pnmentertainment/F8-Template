# Prompts

A library of context documents and step-by-step recipes to hand to an AI
assistant (Claude, Cursor, v0, etc.) when you want it to do something
non-trivial to this template.

Use them two ways:

- **Paste a whole file** into the assistant when you're setting up a new
  integration or asking it to follow a recipe.
- **Reference them** ("follow the conventions in
  `prompts/instructions/backend-instructions.md`") so the assistant writes
  code that fits the existing layout.

## What's here

### `product/`

Prompts you run **before** writing code — to turn customer research into a
PRD and tech spec that are grounded in this template.

- [`write-prd.md`](./product/write-prd.md) — turn research + a proposed
  solution into `docs/prd.md`.
- [`write-tech-spec.md`](./product/write-tech-spec.md) — turn the PRD into
  `docs/tech-spec.md` that references the template's conventions.
- [`write-sales-pages.md`](./product/write-sales-pages.md) — rewrite the
  public marketing surface (hero, features, pricing copy, FAQ, metadata,
  OG image) grounded in your research.

### `instructions/`

Permanent reference docs — the rules and architecture of the template.
Read or reference these any time you're asking the assistant to add code.

- [`backend-instructions.md`](./instructions/backend-instructions.md) —
  Supabase + Drizzle + Server Actions conventions.
- [`frontend-instructions.md`](./instructions/frontend-instructions.md) —
  Next.js 14 + Tailwind + shadcn conventions.
- [`auth/auth-overview.md`](./instructions/auth/auth-overview.md) — how
  Supabase Auth is wired up here.
- [`stripe/stripe-overview.md`](./instructions/stripe/stripe-overview.md) —
  how Stripe Checkout / Portal / webhooks work in this template.
- [`manage-plans/managing-plans.md`](./instructions/manage-plans/managing-plans.md)
  — add / rename / reprice / remove a paid plan.

### `project-setup/`

From-scratch setup recipes. The template already ships with all of these
wired up — these docs exist so you understand how each layer was built and
so your assistant can rebuild or swap one out.

- [`setup-project.md`](./project-setup/setup-project.md) — master index, run order.
- [`setup-frontend.md`](./project-setup/setup-frontend.md) — Next.js 14 + Tailwind + shadcn.
- [`setup-backend.md`](./project-setup/setup-backend.md) — Supabase Postgres + Drizzle ORM.
- [`setup-auth.md`](./project-setup/setup-auth.md) — Supabase Auth (email/password + OAuth).
- [`setup-payments.md`](./project-setup/setup-payments.md) — Stripe Checkout, Portal, webhook.
- [`setup-tables.md`](./project-setup/setup-tables.md) — add a new DB table + queries + actions + RLS.

### `features/`

Short, task-shaped prompt templates to paste into Claude / Cursor when
extending the template. Each one names the files to edit, the env vars
involved, and the canonical example to mimic.

- [`add-a-page.md`](./features/add-a-page.md) — add a new protected dashboard page.
- [`add-a-table.md`](./features/add-a-table.md) — add a new database table.
- [`add-an-oauth-provider.md`](./features/add-an-oauth-provider.md) — enable GitHub, Microsoft, etc. alongside Google.
- [`add-a-gated-feature.md`](./features/add-a-gated-feature.md) — make a feature paid-only using the subscription helper.
