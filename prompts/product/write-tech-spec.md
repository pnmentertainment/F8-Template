# Write a tech spec

Use this prompt to turn your PRD (`docs/prd.md`) into a technical
specification grounded in this template. The output becomes the checklist
you and your AI assistant work through to build v1.

Save the output as `docs/tech-spec.md`.

---

## Prerequisite

You've already run [`write-prd.md`](./write-prd.md) and have a
`docs/prd.md` you're happy with.

## Step 1 — Prime the AI (again)

Even if the AI read the template before, start a fresh chat and ask it to
re-read:

- `docs/prd.md` — what we're building.
- `CLAUDE.md` — stack + conventions.
- `prompts/instructions/` — all files.
- `prompts/features/` — the canonical recipes you'll follow.
- `app/dashboard/projects/` and `db/schema/projects.ts` — the worked
  CRUD example.
- `lib/stripe/plans.ts` — current plans.
- `lib/auth/subscription.ts` — how gating works.
- `db/schema/` — existing tables.

## Step 2 — Generate the tech spec

Give the AI this instruction:

---

> You have the PRD at `docs/prd.md` and full access to this template. Write
> a tech spec and save it as `docs/tech-spec.md`.
>
> Goal: turn the PRD into a set of concrete engineering tickets against
> this specific template. Every decision must reference the template's
> conventions. Where the PRD calls for something the template already
> provides, explicitly say "use existing X" instead of re-specifying it.
>
> Use exactly these sections, in this order:
>
> 1. **Overview** — 3-sentence summary of what we're building, who for, and
>    the v1 scope (pulled from the PRD).
>
> 2. **Data model**
>    - New tables to add under `db/schema/`. For each: name, columns (type
>      + nullability + FK), why it exists, which PRD feature it supports.
>    - Follow the pattern in `prompts/features/add-a-table.md`.
>    - Call out any RLS policies needed beyond the standard "owner can
>      CRUD" pattern.
>
> 3. **Routes and pages**
>    - New pages under `app/dashboard/` (list them with their URLs).
>    - Which are Server Components vs contain client forms.
>    - Which existing pages need changes.
>    - Any new public marketing pages.
>    - Follow the pattern in `prompts/features/add-a-page.md`.
>
> 4. **Server actions and API routes**
>    - List every mutation as a named Server Action with its input schema
>      (use zod at the boundary) and return shape.
>    - Any new Route Handlers under `app/api/` (and why they aren't
>      Server Actions).
>
> 5. **Plan gating**
>    - Changes to `PLAN_LIMITS` in `lib/auth/subscription.ts`.
>    - For each gated feature: where the server-side check lives, and
>      where `<UpgradeCard />` renders.
>    - Follow the pattern in `prompts/features/add-a-gated-feature.md`.
>
> 6. **Stripe / plans**
>    - Changes to `lib/stripe/plans.ts` (new tiers, new features arrays,
>      new price IDs).
>    - New env vars required.
>    - Follow the pattern in
>      `prompts/instructions/manage-plans/managing-plans.md`.
>
> 7. **UI components**
>    - New shared components that don't belong to one page
>      (`components/<area>/*`). Keep this list small.
>
> 8. **Out of scope (explicitly reusing from template)**
>    - List every template feature we are NOT touching: auth, login pages,
>      signup flow, billing portal, webhook, account page, etc. This
>      stops scope creep.
>
> 9. **Build order**
>    - A numbered list of tickets in dependency order. Each ticket
>      references the prompt in `prompts/features/` that should be used
>      to implement it.
>
> 10. **Risks and unknowns**
>    - Anything you couldn't decide from the PRD.
>
> Keep this tight — 2–3 pages. Favour concrete file paths over prose. Every
> section should reference existing files by path.

---

## Step 3 — Sanity check

- Does every "Must have" from the PRD appear in section 9?
- Does section 8 prevent us re-building template features?
- Can you hand section 9 to an AI agent ticket-by-ticket without more
  context?

## Step 4 — Build

Work through section 9 in order. For each ticket, open a fresh chat and
paste the matching `prompts/features/*.md` plus the relevant slice of
`docs/tech-spec.md`. The AI now has everything it needs.

## Where it lives

- `docs/tech-spec.md` — the output.
- `docs/prd.md` — the input it was derived from.
