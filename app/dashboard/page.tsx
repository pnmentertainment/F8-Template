import { db } from "@/db";
import { projects, subscriptions } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { count, eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GettingStarted } from "@/components/dashboard/getting-started";

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

  const [projectCountRow] = user
    ? await db
        .select({ value: count() })
        .from(projects)
        .where(eq(projects.userId, user.id))
    : [{ value: 0 }];
  const projectCount = projectCountRow?.value ?? 0;

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
            <CardTitle className="text-2xl">{projectCount}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {projectCount === 0
              ? "Create your first project to see it here."
              : projectCount === 1
              ? "You have 1 project."
              : `You have ${projectCount} projects.`}
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

      <GettingStarted />
    </div>
  );
}
