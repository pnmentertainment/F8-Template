"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLANS } from "@/lib/stripe/plans";
import { cn } from "@/lib/utils";

export function PlanPicker() {
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  async function subscribe(priceId: string | undefined) {
    if (!priceId) return;
    setLoadingPriceId(priceId);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoadingPriceId(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade</CardTitle>
        <CardDescription>
          Switch to Pro to unlock everything.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="inline-flex rounded-lg border bg-muted p-1 text-sm">
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
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PLANS.filter((p) => p.priceMonthly > 0).map((plan) => {
            const priceId =
              interval === "month" ? plan.priceIdMonthly : plan.priceIdYearly;
            const price =
              interval === "month" ? plan.priceMonthly : plan.priceYearly;
            return (
              <div
                key={plan.name}
                className="flex flex-col rounded-lg border p-6"
              >
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted-foreground">
                    {interval === "month" ? "/mo" : "/yr"}
                  </span>
                </div>
                <ul className="mt-4 flex-1 space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full"
                  disabled={!priceId || loadingPriceId === priceId}
                  onClick={() => subscribe(priceId)}
                >
                  {loadingPriceId === priceId
                    ? "Redirecting..."
                    : priceId
                    ? "Subscribe"
                    : "Add Stripe price ID"}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
