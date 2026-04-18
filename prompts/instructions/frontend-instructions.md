# Frontend Instructions

Use this guide for frontend work in this project.

It uses **Next.js 14 (App Router)**, **Tailwind CSS**, and **shadcn-style UI
primitives** (in `components/ui/`).

Write the complete code for every step. Do not get lazy. Write everything that
is needed.

Your goal is to completely finish whatever the user asks for.

## Steps

- All new pages go under `app/`.
  - Public marketing pages → `app/(marketing)/`
  - Auth pages → `app/(auth)/`
  - Authenticated app → `app/dashboard/`
- All new components go under `components/`.
  - Reusable UI primitives (buttons, inputs, cards) → `components/ui/`
  - Marketing sections (hero, pricing) → `components/marketing/`
  - Dashboard chrome (sidebar, user menu) → `components/dashboard/`
  - Feature-specific components → `components/<feature>/`
- Group related components in folders. Filenames are kebab-case:
  `components/dashboard/user-menu.tsx`.
- Use the `cn()` helper from `@/lib/utils` to merge Tailwind class lists.

## Reminders

- This project uses the **Next.js 14 App Router** — not the Pages Router.
- Anything under `app/dashboard/` is already auth-gated by both the global
  `middleware.ts` and `app/dashboard/layout.tsx`. You don't need to re-check
  auth in individual pages.

## Requirements

- **Default to Server Components.** Fetch data in a Server Component and pass
  it down as props.
- **Client components require `"use client"` at the top of the file.** Use
  client components only when you need `useState`, effects, browser APIs,
  Radix primitives, or event handlers on DOM elements.
- Import the router from `next/navigation` — never from `next/router`.
- Use the `@/` path alias for every internal import (e.g.
  `import { Button } from "@/components/ui/button"`).
- Forms that mutate data should call a Server Action via `<form action={...}>`
  and use `useFormState` / `useFormStatus` from `react-dom` for pending and
  error UI.
