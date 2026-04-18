import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UpgradeCardProps = {
  title?: string;
  description?: string;
  cta?: string;
  href?: string;
};

export function UpgradeCard({
  title = "Upgrade to Pro",
  description = "You've hit the Free plan limit. Upgrade to unlock unlimited usage.",
  cta = "View plans",
  href = "/dashboard/billing",
}: UpgradeCardProps) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild size="sm">
          <Link href={href}>{cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
