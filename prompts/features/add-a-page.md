# Add a new dashboard page

Use this prompt template when you want to add a new page to the
authenticated dashboard (e.g. Documents, Settings, Team).

Paste the whole thing into Claude / Cursor and fill in the blanks.

---

## Context

This is an F8 SaaS template: Next.js 14 App Router, Supabase Auth, Drizzle
ORM over Supabase Postgres, shadcn-style UI primitives in
`components/ui/`.

Every page under `app/dashboard/**` is automatically:

- Auth-gated by `middleware.ts` (redirects to `/login` if not signed in).
- Wrapped in `app/dashboard/layout.tsx`, which provides the sidebar, topbar,
  and a double-checked `user` object.

Follow the conventions in:

- `prompts/instructions/frontend-instructions.md`
- `prompts/instructions/backend-instructions.md`

## Task

Add a new dashboard page called **`<FEATURE_NAME>`** (e.g. "Documents").

## Steps

1. Create `app/dashboard/<feature>/page.tsx` as a **Server Component**. Get
   the user with `createClient()` from `@/lib/supabase/server` and
   `supabase.auth.getUser()`. If the page needs data, fetch it in this file
   via `db` from `@/db`.

2. If the page contains forms, create a client component
   `app/dashboard/<feature>/<feature>-form.tsx` with `"use client"` at the
   top. Use `useFormState` + `useFormStatus` from `react-dom`.

3. If the page writes to the database, create
   `app/dashboard/<feature>/actions.ts` with `"use server"`. Validate input
   with `zod`, re-check the user with `supabase.auth.getUser()`, and call
   `revalidatePath` after mutations.

4. Add a nav link to `components/dashboard/sidebar.tsx` — add an entry to
   `NAV_ITEMS` with an appropriate Lucide icon.

5. If the feature is paid-only, see
   `prompts/features/add-a-gated-feature.md`.

## File paths to create or edit

- `app/dashboard/<feature>/page.tsx` — new
- `app/dashboard/<feature>/actions.ts` — new (if mutations)
- `app/dashboard/<feature>/<feature>-form.tsx` — new (if forms)
- `components/dashboard/sidebar.tsx` — edit `NAV_ITEMS`

## Environment variables

None — auth and DB connection env vars are already configured.

## Reference

- `app/dashboard/projects/` is the canonical example of a fully-worked
  feature (schema, action, server component, client form, client delete
  button, sidebar nav).
