"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe/plans";
import { cn } from "@/lib/utils";

type PricingProps = {
  isSignedIn: boolean;
};

export function Pricing({ isSignedIn }: PricingProps) {
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleSubscribe(priceId: string | undefined) {
    if (!priceId) return;
    if (!isSignedIn) {
      window.location.href = `/signup?next=/dashboard/billing`;
      return;
    }
    setLoadingPriceId(priceId);
    startTransition(async () => {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      setLoadingPriceId(null);
    });
  }

  return (
    <section id="pricing" className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Simple pricing
        </h2>
        <p className="mt-4 text-muted-foreground">
          Start free. Upgrade when you&apos;re ready.
        </p>

        <div className="mt-6 inline-flex rounded-lg border bg-muted p-1 text-sm">
          <button
            type="button"
            onClick={() => setInterval("month")}
            className={cn(
              "rounded-md px-3 py-1.5",
              interval === "month" && "bg-background shadow-sm",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setInterval("year")}
            className={cn(
              "rounded-md px-3 py-1.5",
              interval === "year" && "bg-background shadow-sm",
            )}
          >
            Yearly
            <span className="ml-1 text-xs text-muted-foreground">
              (2 months free)
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {PLANS.map((plan) => {
          const priceId =
            interval === "month" ? plan.priceIdMonthly : plan.priceIdYearly;
          const price =
            interval === "month" ? plan.priceMonthly : plan.priceYearly;
          const loading = loadingPriceId === priceId;
          const isFree = price === 0;

          return (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col rounded-xl border bg-card p-8",
                plan.featured && "border-primary shadow-lg",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {plan.featured && (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-6">
                <span className="text-4xl font-bold">${price}</span>
                {!isFree && (
                  <span className="text-muted-foreground">
                    {interval === "month" ? "/mo" : "/yr"}
                  </span>
                )}
              </div>

              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {isFree ? (
                  <Button asChild variant="outline" className="w-full">
                    <Link href={isSignedIn ? "/dashboard" : "/signup"}>
                      {isSignedIn ? "Go to dashboard" : "Get started"}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    disabled={loading || !priceId}
                    onClick={() => handleSubscribe(priceId)}
                  >
                    {loading
                      ? "Redirecting..."
                      : priceId
                      ? "Subscribe"
                      : "Add Stripe price ID"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
