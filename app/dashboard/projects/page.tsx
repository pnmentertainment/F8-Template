import { FolderOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { desc, eq } from "drizzle-orm";
import { NewProjectForm } from "./new-project-form";
import { DeleteProjectButton } from "./delete-button";

export default async function ProjectsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rows = user
    ? await db
        .select()
        .from(projects)
        .where(eq(projects.userId, user.id))
        .orderBy(desc(projects.createdAt))
    : [];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="text-muted-foreground">
          An example CRUD feature demonstrating the table → action → page
          pattern. Delete this folder once you&apos;ve built your own feature.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New project</CardTitle>
          <CardDescription>Create one to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewProjectForm />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Your projects ({rows.length})
        </h2>

        {rows.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No projects yet. Create your first one above.
              </p>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-3">
            {rows.map((p) => (
              <li key={p.id}>
                <Card>
                  <CardContent className="flex items-start justify-between gap-4 p-4">
                    <div className="space-y-1">
                      <p className="font-medium">{p.name}</p>
                      {p.description && (
                        <p className="text-sm text-muted-foreground">
                          {p.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <DeleteProjectButton id={p.id} />
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
