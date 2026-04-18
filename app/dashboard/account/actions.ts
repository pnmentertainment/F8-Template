"use server";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type AccountState = { error?: string; message?: string } | undefined;

const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(100),
});

export async function updateProfile(
  _: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not signed in" };

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: parsed.data.fullName },
  });
  if (authError) return { error: authError.message };

  await db
    .update(profiles)
    .set({ fullName: parsed.data.fullName, updatedAt: new Date() })
    .where(eq(profiles.id, user.id));

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/account");
  return { message: "Profile updated." };
}

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function updatePassword(
  _: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not signed in" };

  const parsed = passwordSchema.safeParse({
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) return { error: error.message };

  return { message: "Password updated." };
}
