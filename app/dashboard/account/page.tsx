import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profile] = user
    ? await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1)
    : [];

  const initialFullName =
    profile?.fullName ??
    (user?.user_metadata?.full_name as string | undefined) ??
    "";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-muted-foreground">Manage your personal details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your display name and email. Changes save immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            email={user?.email ?? ""}
            initialFullName={initialFullName}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Choose a strong password — at least 8 characters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
