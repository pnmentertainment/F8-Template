import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  const customerId = existing[0]?.stripeCustomerId;
  if (!customerId) {
    return NextResponse.json(
      { error: "No Stripe customer on file" },
      { status: 400 },
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
