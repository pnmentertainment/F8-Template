# Frontend Setup Instructions

Use this guide to set up the frontend for this project.

It uses **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and
**shadcn-style UI primitives**.

Write the complete code for every step. Do not get lazy. Write everything
that is needed.

Your goal is to completely finish the frontend setup.

## Helpful Links

If the user gets stuck, refer them to:

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)
- [shadcn/ui Installation for Next.js](https://ui.shadcn.com/docs/installation/next)
- [Radix UI primitives](https://www.radix-ui.com/primitives)

## Required Environment Variables

None at this stage.

## Install Libraries

```bash
# Framework + styling
npm i next@14 react react-dom
npm i -D typescript @types/node @types/react @types/react-dom
npm i -D tailwindcss postcss autoprefixer
npm i tailwindcss-animate class-variance-authority clsx tailwind-merge
npm i lucide-react

# Radix primitives used by our shadcn-style components
npm i @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-separator \
      @radix-ui/react-avatar @radix-ui/react-dropdown-menu @radix-ui/react-dialog \
      @radix-ui/react-tabs @radix-ui/react-toast
```

## Setup Steps

- Initialise Next.js with the App Router and TypeScript.

- Create `tailwind.config.ts` with the shadcn design tokens (border, input,
  primary, muted, destructive, etc.) all sourced from CSS variables, and the
  `tailwindcss-animate` plugin. See the repo's `tailwind.config.ts`.

- Create `postcss.config.mjs`:

```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

- Create `app/globals.css` with the `@tailwind` directives and the `:root` /
  `.dark` CSS variables that define the shadcn colour palette.

- Create a `cn` helper at `lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- Create the root layout at `app/layout.tsx` that imports `globals.css`:

```tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your SaaS",
  description: "Your SaaS description",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
```

- Create the following shadcn-style primitives under `components/ui/`:
  `button.tsx`, `input.tsx`, `label.tsx`, `card.tsx`, `separator.tsx`,
  `avatar.tsx`, `dropdown-menu.tsx`. Each one wraps the matching Radix
  primitive and applies Tailwind classes via `cn()`. See the corresponding
  files in this repo for exact implementations.

- Create a `components.json` at the repo root so the shadcn CLI can add more
  primitives later:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- Configure the `@/` path alias in `tsconfig.json`:

```json
"paths": { "@/*": ["./*"] }
```

- The frontend is now setup.
