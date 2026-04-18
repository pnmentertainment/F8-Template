import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="container flex flex-col items-center gap-6 py-24 text-center md:py-32">
      <span className="rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
        Ship your first SaaS in a weekend
      </span>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
        The starter that gets you from idea to paying customers — fast.
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Auth, payments, a landing page and a dashboard, all wired up with
        Next.js, Supabase and Stripe. Customise the bits that matter, ignore
        the plumbing.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/signup">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/#features">See features</Link>
        </Button>
      </div>
    </section>
  );
}
