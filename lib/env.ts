// Friendly startup check for required environment variables.
// Called from instrumentation.ts on server boot.
// Logs a clear error so newbies don't have to decode cryptic runtime failures.

const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
] as const;

// These are "nice to have" — app still boots, but features won't work until
// they're set. Warn rather than block.
const RECOMMENDED = [
  "NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY",
  "NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY",
] as const;

export function checkEnv() {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  const weak = RECOMMENDED.filter((k) => !process.env[k]);

  if (missing.length === 0 && weak.length === 0) return;

  const lines: string[] = [""];

  if (missing.length > 0) {
    lines.push("🚨  Missing required environment variables:");
    for (const k of missing) lines.push(`    - ${k}`);
    lines.push("");
    lines.push(
      "    Copy .env.example to .env.local and fill in the values. See README.md.",
    );
  }

  if (weak.length > 0) {
    lines.push("");
    lines.push("⚠️   Missing optional environment variables (features will be disabled):");
    for (const k of weak) lines.push(`    - ${k}`);
  }

  lines.push("");
  console.error(lines.join("\n"));
}
