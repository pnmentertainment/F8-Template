import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ManageBillingButton } from "./manage-button";
import { PlanPicker } from "./plan-picker";

export default async function BillingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [sub] = user
    ? await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, user.id))
        .limit(1)
    : [];

  const isActive = sub?.status === "active" || sub?.status === "trialing";

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment method.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
          <CardDescription>
            {isActive
              ? `You're on the Pro plan (${sub?.interval === "year" ? "yearly" : "monthly"}).`
              : "You're on the Free plan."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            {sub?.currentPeriodEnd
              ? `Renews on ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`
              : "Upgrade to unlock everything."}
          </div>
          {isActive ? <ManageBillingButton /> : null}
        </CardContent>
      </Card>

      {!isActive && <PlanPicker />}
    </div>
  );
}
