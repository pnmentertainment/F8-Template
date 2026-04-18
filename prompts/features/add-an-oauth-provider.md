# Add an OAuth provider

Use this prompt template when you want to let users sign in with an
additional social provider (e.g. GitHub, Microsoft, Discord).

Paste the whole thing into Claude / Cursor and fill in the blanks.

---

## Context

This is an F8 SaaS template. Supabase Auth handles OAuth — we already
support Google via `signInWithOAuth("google")` in `app/(auth)/actions.ts`.
Adding another provider is mostly configuration, not code.

Follow the conventions in
`prompts/instructions/auth/auth-overview.md`.

## Task

Add **`<PROVIDER_NAME>`** (e.g. "GitHub") as a sign-in option.

## Steps

1. **In Supabase → Authentication → Providers**, enable
   `<PROVIDER_NAME>`. Supabase tells you which callback URL to paste into
   the provider's console
   (`https://<project>.supabase.co/auth/v1/callback`).

2. **In the provider's OAuth console** (e.g. GitHub → Settings →
   Developer settings → OAuth Apps), create an OAuth app with the
   callback URL from step 1. Copy the Client ID and Client Secret.

3. **Back in Supabase**, paste the Client ID and Client Secret into the
   provider's config and save.

4. **Update the type** in `app/(auth)/actions.ts` to include the new
   provider:

   ```ts
   export async function signInWithOAuth(
     provider: "google" | "<provider>",
   ) { /* ... */ }
   ```

5. **Add a button** to both `app/(auth)/login/form.tsx` and
   `app/(auth)/signup/form.tsx`:

   ```tsx
   <form action={() => signInWithOAuth("<provider>")}>
     <Button variant="outline" className="w-full" type="submit">
       Continue with <PROVIDER_NAME>
     </Button>
   </form>
   ```

6. Make sure the provider's allowed callback URL list includes your
   production site too (`https://your-domain.com/auth/callback`) before
   launch. See `DEPLOY.md`.

## File paths to create or edit

- `app/(auth)/actions.ts` — widen the `provider` union type
- `app/(auth)/login/form.tsx` — add button
- `app/(auth)/signup/form.tsx` — add button

## Environment variables

None in Next.js — OAuth secrets live in Supabase, not in `.env.local`.

## Reference

- `app/(auth)/actions.ts` → `signInWithOAuth("google")` — existing example.
- `app/(auth)/login/form.tsx` — Google button markup.
