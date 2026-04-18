import {
  Lock,
  CreditCard,
  Database,
  LayoutDashboard,
  Sparkles,
  Rocket,
} from "lucide-react";

const FEATURES = [
  {
    icon: Lock,
    title: "Auth out of the box",
    desc: "Supabase Auth with email/password and OAuth providers — sessions, password reset, and route protection already wired up.",
  },
  {
    icon: CreditCard,
    title: "Stripe subscriptions",
    desc: "Checkout, webhooks and a billing portal so customers can upgrade, downgrade and cancel without you lifting a finger.",
  },
  {
    icon: Database,
    title: "Typed database",
    desc: "Supabase Postgres with Drizzle ORM. Define your schema in TypeScript and push migrations in one command.",
  },
  {
    icon: LayoutDashboard,
    title: "Polished dashboard",
    desc: "Pre-built dashboard layout with sidebar, user menu and a billing page. Drop your features in and go.",
  },
  {
    icon: Sparkles,
    title: "Ready to vibecode",
    desc: "Sensible file layout, shadcn/ui components and clear conventions so your AI pair-programmer knows exactly where to build.",
  },
  {
    icon: Rocket,
    title: "Deploys anywhere",
    desc: "One-click deploy to Vercel, or anywhere Next.js runs. No servers to manage, no DevOps rabbit holes.",
  },
];

export function Features() {
  return (
    <section id="features" className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Everything you need, nothing you don&apos;t
        </h2>
        <p className="mt-4 text-muted-foreground">
          The boring bits of a SaaS are already done. Spend your time on the
          product, not the plumbing.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-xl border bg-card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
