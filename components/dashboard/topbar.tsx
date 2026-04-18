import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "./user-menu";

type TopbarProps = {
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
};

export function Topbar({ email, fullName, avatarUrl }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="text-sm text-muted-foreground">Dashboard</div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu email={email} fullName={fullName} avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}
