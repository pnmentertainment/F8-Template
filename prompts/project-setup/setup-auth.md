# Auth Setup Instructions

Use this guide to set up authentication for this project.

It uses **Supabase Auth** (email/password + OAuth) via the `@supabase/ssr`
helper, which persists the session in cookies so that Server Components,
Server Actions, Route Handlers, and the browser all agree on the current
user.

Write the complete code for every step. Do not get lazy. Write everything
that is needed.

Your goal is to completely finish the auth setup.

## Helpful Links

If the user gets stuck, refer them to:

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase OAuth providers](https://supabase.com/docs/guides/auth/social-login)

## Required Environment Variables

Make sure the user sets these in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...    # server-only, never ship to the browser
NEXT_PUBLIC_SITE_URL=http://localhost:3000 # used to build OAuth redirect URLs
```

## Install Libraries

```bash
npm i @supabase/ssr @supabase/supabase-js
```

## Setup Steps

- Create `lib/supabase/client.ts` — used in client components only:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- Create `lib/supabase/server.ts` — used in Server Components, Server
  Actions, and Route Handlers:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options));
          } catch {
            // Server Components can't set cookies — middleware handles refresh.
          }
        },
      },
    },
  );
}
```

- Create `lib/supabase/middleware.ts` with an `updateSession` function that
  refreshes the session cookie and enforces route protection. List every
  protected URL prefix in `PROTECTED_PREFIXES`:

```ts
const PROTECTED_PREFIXES = ["/dashboard", "/account"];
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];
```

(See `lib/supabase/middleware.ts` in this repo for the full implementation.)

- Create `middleware.ts` at the repo root:

```ts
import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

- Create `app/auth/callback/route.ts` for OAuth / email-confirmation
  redirects:

```ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
```

- Create `app/auth/signout/route.ts`:

```ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
```

- Create `app/(auth)/actions.ts` with Server Actions for `signIn`, `signUp`,
  `signInWithOAuth`, `requestPasswordReset`, and `resetPassword`. Use
  `redirect()` from `next/navigation` on success and return
  `{ error: string }` on failure so the forms can show the message via
  `useFormState`. See `app/(auth)/actions.ts` in this repo.

- Create the auth pages under `app/(auth)/`:
  - `layout.tsx` — centred card layout with the logo.
  - `login/page.tsx` + `login/form.tsx`
  - `signup/page.tsx` + `signup/form.tsx`
  - `forgot-password/page.tsx`
  - `reset-password/page.tsx`

  Forms use `<form action={serverAction}>` + `useFormState` / `useFormStatus`.

- In Supabase → **Authentication → URL Configuration**, add your site URL
  (e.g. `http://localhost:3000` in dev, your production URL in prod) and
  add `${NEXT_PUBLIC_SITE_URL}/auth/callback` to the allowed redirect URLs.

- To enable an OAuth provider (e.g. Google):
  1. In **Supabase → Authentication → Providers**, enable Google and paste
     the client ID and secret from Google Cloud.
  2. In Google Cloud → OAuth consent + credentials, add
     `https://<project>.supabase.co/auth/v1/callback` as an authorised
     redirect URI.

- The auth system is now setup.
