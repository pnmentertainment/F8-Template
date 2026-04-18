# Write a PRD

Use this prompt to turn your customer research and proposed solution into a
Product Requirements Document (PRD). The AI will first read this template
so the PRD is grounded in what you're actually building on.

Save the output as `docs/prd.md`.

---

## Step 1 — Prime the AI on the template

Before writing anything, ask your AI assistant to read:

- `CLAUDE.md`
- `prompts/instructions/backend-instructions.md`
- `prompts/instructions/frontend-instructions.md`
- `prompts/instructions/auth/auth-overview.md`
- `prompts/instructions/stripe/stripe-overview.md`
- `lib/stripe/plans.ts`
- `db/schema/`

Then ask:

> Summarise in one page: the stack, the file conventions, and every feature
> this template already ships with (auth, payments, gating, dashboard,
> example Projects feature, etc.). I'll use this as my "what I won't
> re-build" baseline.

Keep that summary in your chat context — it's what makes the PRD honest.

## Step 2 — Add your research

So you should have your completed PPT files from Week 1 homework. Put those into the /docs folder.
You should also have from your conversations with AI:
- User story list
- Screens you will need list
Put those in the /docs folder as well. Easiest if you save them as .md files.

## Step 3 — Generate the PRD

Give the AI this instruction, filling in the blanks:

---

> You have the template summary above. You also have my customer research
> and proposed solution documentation in the /docs folder. Write a PRD for **`<PRODUCT_NAME>`** and save it
> as `docs/prd.md`.
>
> Use exactly these sections, in this order:
>
> 1. **TL;DR** — 2 sentences.
> 2. **Problem** — grounded in quotes/data from the research.
> 3. **Target user** — who, and why they have this problem.
> 4. **Top 3 jobs-to-be-done** — each phrased as "When ___, I want to
>    ___, so that ___".
>    **Tech Stack** - We want to use React, Tailwind, next.js, shadcn, supabase, and vercel. 
> 6. **Scope**
>    - **Must have (v1):** features needed for the product to be useful.
>    - **Should have (v1.1):** desirable but not launch-blocking.
>    - **Could have (later):** nice ideas to park.
>    - **Won't have:** explicit non-goals — the things we are intentionally
>      not doing.
> 7. **Already covered by the template** — list every v1/v1.1 feature that
>    the template already provides so we don't re-spec it (auth, billing,
>    account page, plan gating, etc.). Reference the exact files/folders.
> 8. **Success metrics** — one activation metric and one retention metric
>    we can actually measure.
> 9. **Pricing thoughts** — any changes to the Free/Pro split in
>    `lib/stripe/plans.ts`? What should Free users be allowed to do, and
>    what should be gated behind Pro?
> 10. **Open questions** — things the research didn't answer.
>
> Keep it short — 1–2 pages. Every claim in "Problem" and "Target user"
> should cite a specific piece of the research I pasted.

---

## Step 4 — Review and iterate

- Does every "Must have" map to a concrete user quote?
- Is "Won't have" brave enough? Be ruthless — a small v1 ships.
- Does section 6 stop you from re-building stuff the template already does?
- Are the success metrics actually measurable with what you have?

When you're happy, move on to
[`write-tech-spec.md`](./write-tech-spec.md).

## Where it lives

- `docs/prd.md` — the output.
- `docs/research/` — the raw research that backed it.
