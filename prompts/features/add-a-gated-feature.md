# Add a paid-only (gated) feature

Use this prompt template when you want a feature to only work for users on
the Pro plan (or to enforce a Free-tier limit).

Paste the whole thing into Claude / Cursor and fill in the blanks.

---

## Context

This is an F8 SaaS template. Plan gating is centralised in
`lib/auth/subscription.ts`:

- `PLAN_LIMITS` — map of per-plan limits/flags. Source of truth.
- `getSubscription(userId)` — fetches the `subscriptions` row.
- `isPro(sub)` — boolean for active/trialing subscriptions.
- `getPlanLimits(sub)` — returns the row from `PLAN_LIMITS`.

Gates must exist in **two places**:

1. **Server-side (authoritative)** — the Server Action or Route Handler
   must refuse the request for non-Pro users. Without this, anyone who
   knows the action name can call it directly.
2. **UI (UX)** — show `<UpgradeCard />` from
   `components/billing/upgrade-card.tsx` instead of the form when the user
   is at the limit.

Follow the conventions in
`prompts/instructions/stripe/stripe-overview.md` → "Access control for
paid features".

## Task

Gate **`<FEATURE_NAME>`** so that:

- Free users: `<DESCRIBE LIMIT OR "not available">`.
- Pro users: `<DESCRIBE UNLOCKED BEHAVIOUR>`.

## Steps

1. **Add the limit** to `lib/auth/subscription.ts`:

   ```ts
   export const PLAN_LIMITS = {
     free: { maxProjects: 3, can<Feature>: false },
     pro: { maxProjects: null, can<Feature>: true },
   } as const;
   ```

2. **Gate the Server Action / Route Handler.** Fetch the subscription and
   return `{ error }` if the user is over-limit:

   ```ts
   import {
     getPlanLimits,
     getSubscription,
     isPro,
   } from "@/lib/auth/subscription";

   const sub = await getSubscription(user.id);
   if (!isPro(sub) && !getPlanLimits(sub).can<Feature>) {
     return { error: "This feature requires a Pro subscription." };
   }
   ```

3. **Show an upsell in the UI** for users at the limit:

   ```tsx
   import { UpgradeCard } from "@/components/billing/upgrade-card";

   {atLimit ? (
     <UpgradeCard
       title="Upgrade to Pro to unlock <FEATURE_NAME>"
       description="<CUSTOM_MESSAGE>"
     />
   ) : (
     <YourForm />
   )}
   ```

4. If you want the plan-limits change to appear in the pricing section
   copy, also update the `features` array in `lib/stripe/plans.ts`.

## File paths to create or edit

- `lib/auth/subscription.ts` — add the flag to `PLAN_LIMITS`
- `app/dashboard/<feature>/actions.ts` — add the server-side check
- `app/dashboard/<feature>/page.tsx` — render `<UpgradeCard />` at the limit
- `lib/stripe/plans.ts` — optional: update pricing copy

## Environment variables

None.

## Reference

- `app/dashboard/projects/` — canonical worked example (`maxProjects: 3`
  on Free, unlimited on Pro).
- `components/billing/upgrade-card.tsx` — the reusable upsell component.
