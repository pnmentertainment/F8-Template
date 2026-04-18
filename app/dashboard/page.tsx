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

export default async function DashboardHome() {
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

  const plan = sub?.status === "active" ? "Pro" : "Free";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""} 👋
        </h1>
        <p className="text-muted-foreground">
          This is your dashboard. Build your product from here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current plan</CardDescription>
            <CardTitle className="text-2xl">{plan}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {sub?.status === "active"
              ? "Thanks for being a subscriber."
              : "Upgrade to unlock everything."}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Projects</CardDescription>
            <CardTitle className="text-2xl">0</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            You haven&apos;t created any projects yet.
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Account</CardDescription>
            <CardTitle className="text-2xl">Active</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Signed in as {user?.email}.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
          <CardDescription>
            Here&apos;s what to do to make this template your own.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            <li>Replace the marketing copy in <code>components/marketing/</code>.</li>
            <li>Create your Stripe products and paste the price IDs in <code>.env.local</code>.</li>
            <li>Add your own tables to <code>db/schema/</code> and run <code>npm run db:push</code>.</li>
            <li>Build your first feature — ask your AI assistant to scaffold it for you.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
