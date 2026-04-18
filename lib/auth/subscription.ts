import { db } from "@/db";
import { subscriptions, type Subscription } from "@/db/schema";
import { eq } from "drizzle-orm";

// Per-plan limits. `null` means unlimited.
// Add new keys here when you add gated features.
export const PLAN_LIMITS = {
  free: { maxProjects: 3 },
  pro: { maxProjects: null as number | null },
} as const;

export type PlanKey = keyof typeof PLAN_LIMITS;

export async function getSubscription(
  userId: string,
): Promise<Subscription | null> {
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);
  return sub ?? null;
}

export function isPro(sub: Subscription | null): boolean {
  if (!sub) return false;
  return sub.status === "active" || sub.status === "trialing";
}

export function planKey(sub: Subscription | null): PlanKey {
  return isPro(sub) ? "pro" : "free";
}

export function getPlanLimits(sub: Subscription | null) {
  return PLAN_LIMITS[planKey(sub)];
}
