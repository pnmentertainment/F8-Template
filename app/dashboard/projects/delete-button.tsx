"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProject } from "./actions";

export function DeleteProjectButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this project?")) return;
        startTransition(() => deleteProject(id));
      }}
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete project</span>
    </Button>
  );
}
