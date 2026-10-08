import { db } from "@/db";
import { subscriptionStatus, subscriptions } from "@/db/schema";
import { stripe } from "@/lib/stripe/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";

const relevantEvents = new Set<Stripe.Event.Type>([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook signature failed: ${message}` },
      { status: 400 },
    );
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const customerId = session.customer as string;
        if (userId && customerId) {
          await upsertCustomer(userId, customerId);
        }
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string,
          );
          await syncSubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(sub);
        break;
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Handler failed: ${message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}

async function upsertCustomer(userId: string, customerId: string) {
  await db
    .insert(subscriptions)
    .values({ userId, stripeCustomerId: customerId })
    .onConflictDoUpdate({
      target: subscriptions.userId,
      set: { stripeCustomerId: customerId, updatedAt: new Date() },
    });
}

async function syncSubscription(sub: Stripe.Subscription) {
  const userId = sub.metadata?.supabaseUserId;
  const customerId = sub.customer as string;

  if (!userId) {
    return;
  }

  const item = sub.items.data[0];
  const priceId = item?.price.id;
  const interval = item?.price.recurring?.interval as
    | "month"
    | "year"
    | undefined;
  // Since Stripe API 2025-03-31, billing periods live on subscription items.
  const currentPeriodEnd = item
    ? new Date(item.current_period_end * 1000)
    : null;
  const status = toSubscriptionStatus(sub.status);

  await db
    .insert(subscriptions)
    .values({
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: sub.id,
      stripePriceId: priceId,
      status,
      interval,
      currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    })
    .onConflictDoUpdate({
      target: subscriptions.userId,
      set: {
        stripeSubscriptionId: sub.id,
        stripePriceId: priceId,
        status,
        interval,
        currentPeriodEnd,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        updatedAt: new Date(),
      },
    });
}

type SubscriptionStatus = (typeof subscriptionStatus.enumValues)[number];

// Stripe's status type is open-ended; anything we don't model is stored as
// null rather than failing the insert against the Postgres enum.
function toSubscriptionStatus(status: string): SubscriptionStatus | null {
  return (subscriptionStatus.enumValues as readonly string[]).includes(status)
    ? (status as SubscriptionStatus)
    : null;
}
