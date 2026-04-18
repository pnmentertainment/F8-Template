# Auth Overview

This document describes how authentication is wired up in this project. Read
this before adding login UIs, protecting new routes, or changing the session
model.

## Stack

- **Supabase Auth** — email/password + Google OAuth (extensible to any
  provider Supabase supports).
- **`@supabase/ssr`** — handles cookie-based session storage so that Server
  Components, Server Actions, Route Handlers, and the browser all agree on
  the current user.

## Files that make up the auth system

| File                                | Purpose                                                                                   |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `lib/supabase/client.ts`            | Browser-side Supabase client. Use in `"use client"` components only.                      |
| `lib/supabase/server.ts`            | Server-side Supabase client. Use in Server Components, Server Actions, and Route Handlers. |
| `lib/supabase/middleware.ts`        | `updateSession` — refreshes the session cookie and enforces route protection.             |
| `middleware.ts` (repo root)         | Runs `updateSession` on every non-static request.                                         |
| `app/auth/callback/route.ts`        | Handles the OAuth / email-confirmation redirect and exchanges the code for a session.     |
| `app/auth/signout/route.ts`         | POSTing here signs the user out and redirects to `/`.                                     |
| `app/(auth)/actions.ts`             | Server Actions: `signIn`, `signUp`, `signInWithOAuth`, `requestPasswordReset`, `resetPassword`. |
| `app/(auth)/login/`, `signup/`, etc | UI pages that call the actions above.                                                     |
| `app/dashboard/layout.tsx`          | Double-checks `supabase.auth.getUser()` and redirects to `/login` if no user.             |
| `db/sql/handle_new_user.sql`        | Supabase trigger that inserts a row into `profiles` whenever a user signs up.             |

## Route protection

Protection is enforced in two places:

1. **`lib/supabase/middleware.ts`** — `PROTECTED_PREFIXES` lists every URL
   prefix that requires a signed-in user. Unauthenticated requests are
   redirected to `/login?redirect=<pathname>`. Signed-in users visiting an
   auth page (`/login`, `/signup`, etc.) are redirected to `/dashboard`.
2. **`app/dashboard/layout.tsx`** — defensive double-check so that even a
   misconfigured middleware can't leak protected data.

To protect a new route group, add its prefix to `PROTECTED_PREFIXES`.

## Environment variables

The auth system needs:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # only used for privileged server operations
NEXT_PUBLIC_SITE_URL=        # used to build OAuth redirect URLs
```

## How a user flows through the system

1. User submits the signup form → `signUp` server action calls
   `supabase.auth.signUp(...)`.
2. Supabase sends a confirmation email. The link points at
   `${NEXT_PUBLIC_SITE_URL}/auth/callback`.
3. `app/auth/callback/route.ts` calls `exchangeCodeForSession(code)` and
   redirects to `/dashboard`.
4. The `on_auth_user_created` trigger in `db/sql/handle_new_user.sql`
   inserts a matching row into `profiles` using the Supabase user id as the
   primary key.
5. On every subsequent request, `middleware.ts` refreshes the cookie and
   gates protected routes.

## Getting the user server-side

```ts
import { createClient } from "@/lib/supabase/server";

const supabase = createClient();
const {
  data: { user },
} = await supabase.auth.getUser();
```

`user.id` is the Supabase UUID — use it as the foreign key everywhere
(`profiles.id`, `subscriptions.userId`).

## Adding an OAuth provider

1. Enable it in **Supabase → Authentication → Providers** and paste the
   provider's client ID and secret.
2. Add a button that calls `signInWithOAuth("<provider>")` (see
   `app/(auth)/login/form.tsx` for the Google example).
3. Make sure `${NEXT_PUBLIC_SITE_URL}/auth/callback` is listed in the
   provider's allowed redirect URLs.
