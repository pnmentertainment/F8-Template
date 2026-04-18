"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type ProjectState = { error?: string } | undefined;

const createSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().max(500).optional(),
});

export async function createProject(
  _: ProjectState,
  formData: FormData,
): Promise<ProjectState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const parsed = createSchema.safeParse({
    name: formData.get("name"),
    description: (formData.get("description") as string) || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.insert(projects).values({
    userId: user.id,
    name: parsed.data.name,
    description: parsed.data.description,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  return undefined;
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, user.id)));

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
}
