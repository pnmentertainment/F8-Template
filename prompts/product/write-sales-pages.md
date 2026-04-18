# Write the public sales pages

Use this prompt to turn your PRD and customer research into the public
marketing surface: hero, features, pricing, FAQ, footer, metadata, and OG
image. The template already ships with all of these as components — this
prompt **edits them in place** rather than creating new pages.

Save nothing new — this is a copy-and-component-editing pass.

---

## Prerequisite

You've got:

- `docs/prd.md` — written via
  [`write-prd.md`](./write-prd.md).
- `docs/research/` — raw customer quotes, survey answers, interview notes.
- (Optional) `docs/inspiration/` — landing pages / brands you like.

## Step 1 — Prime the AI

Start a fresh chat. Ask the AI to read, in this order:

- `docs/prd.md` — what you're building and who for.
- `docs/research/**` — raw quotes. These are gold for copywriting — the
  words your customers actually use should show up on the page.
- `docs/inspiration/**` (if you have any) — visual and tonal references.
- `CLAUDE.md` — stack + conventions.
- `app/(marketing)/page.tsx` — the landing page composition.
- `components/marketing/site-header.tsx`
- `components/marketing/site-footer.tsx`
- `components/marketing/hero.tsx`
- `components/marketing/features.tsx`
- `components/marketing/pricing.tsx`
- `components/marketing/faq.tsx`
- `lib/stripe/plans.ts` — plan names, descriptions, features arrays.
- `app/layout.tsx` — page metadata.
- `app/opengraph-image.tsx` — OG image text.

## Step 2 — Generate the copy

Give the AI this instruction, filling in the blanks:

---

> Using `docs/prd.md` and the raw quotes in `docs/research/`, rewrite the
> public marketing surface of this template for **`<PRODUCT_NAME>`**.
>
> **Principles:**
>
> - Use the **customer's own words** from the research wherever possible —
>   especially in the headline, the FAQ, and the feature descriptions.
> - Lead with the **outcome**, not the feature. The headline should
>   describe the result the user gets, not the mechanism.
> - Every feature copy block should answer "so what?" — what does this
>   mean for the user, not what does it do technically.
> - FAQ questions should be the ones the research actually surfaced as
>   objections or worries. Don't invent generic FAQ.
> - Keep tone consistent with `docs/inspiration/` if present; otherwise
>   default to clear, confident, no-hype.
> - **Edit the existing files in place.** Do not create new marketing
>   pages or components.
>
> **Files to update:**
>
> 1. **Header / logo** — `components/marketing/site-header.tsx`: replace
>    the "F8" text and the square logo block with the real product name.
>    (Also update the same in
>    `components/dashboard/sidebar.tsx` and `app/(auth)/layout.tsx`.)
>
> 2. **Hero** — `components/marketing/hero.tsx`: replace the pill,
>    headline, subheadline, and two CTAs. Headline should be ≤12 words.
>    Subheadline ≤30 words. Primary CTA goes to `/signup`.
>
> 3. **Features** — `components/marketing/features.tsx`: replace the
>    `FEATURES` array. 4–6 items. For each: Lucide icon, title (≤5 words,
>    benefit-led), description (≤30 words, outcome-focused).
>
> 4. **Pricing copy** — `lib/stripe/plans.ts`: update each plan's `name`,
>    `description`, and `features` array. **Do not** change `priceIdMonthly` /
>    `priceIdYearly` or `priceMonthly` / `priceYearly` unless the PRD
>    explicitly calls for new tiers. Features array items should map
>    1-to-1 with what differs between plans.
>
> 5. **FAQ** — `components/marketing/faq.tsx`: replace the `FAQS` array.
>    4–6 entries. Each question should be something the research actually
>    flagged. Answers ≤60 words, direct.
>
> 6. **Footer** — `components/marketing/site-footer.tsx`: update the
>    copyright and the contact email.
>
> 7. **Metadata** — `app/layout.tsx`: update the `title.default`,
>    `description`, and `openGraph` fields.
>
> 8. **OG image** — `app/opengraph-image.tsx`: update the "F8" badge
>    text, the headline, and the subheadline.
>
> After editing, produce a short summary listing:
>
> - The headline you chose and which quote / research insight it came from.
> - The 3 biggest objections from research and which FAQ entries address
>   each.
> - Anything the research didn't answer where you made a judgement call.

---

## Step 3 — Review

Walk the home page at `http://localhost:3000`:

- [ ] Could a stranger explain what this does from just the hero?
- [ ] Do the features describe outcomes, not features?
- [ ] Does the FAQ address your top 3 objections from research?
- [ ] Does the pricing make it obvious why someone would upgrade to Pro?
- [ ] Does the footer link work (`/privacy`, `/terms`)?
- [ ] Light mode AND dark mode look OK (toggle in the header).
- [ ] OG image renders at
      `http://localhost:3000/opengraph-image` — looks on-brand.

## Step 4 — Iterate

Copy isn't a one-shot. As you run the product past real users:

- Add their new quotes to `docs/research/`.
- Ask the AI to rewrite just the one section that isn't landing.

## Where it lives

- All output goes into **existing files** in `app/`,
  `components/marketing/`, and `lib/stripe/plans.ts`. No new files.
- Legal pages (`app/(marketing)/privacy/page.tsx`,
  `app/(marketing)/terms/page.tsx`) are separate — update those directly
  when you have real policies.
