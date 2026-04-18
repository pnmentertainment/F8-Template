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
      <UserMenu email={email} fullName={fullName} avatarUrl={avatarUrl} />
    </header>
  );
}
