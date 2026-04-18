"use client";

import { useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "./actions";

export function PasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useFormState(
    async (prev: Parameters<typeof updatePassword>[0], fd: FormData) => {
      const result = await updatePassword(prev, fd);
      if (result?.message) formRef.current?.reset();
      return result;
    },
    undefined,
  );

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      {state?.message && (
        <p className="text-sm text-muted-foreground">{state.message}</p>
      )}

      <SaveButton />
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Updating..." : "Update password"}
    </Button>
  );
}
