"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "f8-getting-started-state";

type Step = {
  id: string;
  label: string;
  description: string;
  href?: string;
};

const STEPS: Step[] = [
  {
    id: "rebrand",
    label: "Rebrand the template",
    description:
      "Replace the F8 logo and name in components/marketing/site-header.tsx and components/dashboard/sidebar.tsx.",
  },
  {
    id: "copy",
    label: "Write your landing copy",
    description:
      "Edit components/marketing/hero.tsx, features.tsx, and faq.tsx to describe your product.",
  },
  {
    id: "pricing",
    label: "Configure your Stripe plans",
    description:
      "Create products in Stripe, paste price IDs into .env.local, and update lib/stripe/plans.ts.",
    href: "/dashboard/billing",
  },
  {
    id: "project",
    label: "Build your first feature",
    description:
      "Follow prompts/project-setup/setup-tables.md to add your own table and page. Delete the example Projects feature when you do.",
    href: "/dashboard/projects",
  },
  {
    id: "deploy",
    label: "Deploy to production",
    description:
      "Follow DEPLOY.md for the Vercel + Supabase + Stripe production checklist.",
  },
];

type State = { done: Record<string, boolean>; dismissed: boolean };

const INITIAL_STATE: State = { done: {}, dismissed: false };

function readState(): State {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    return { ...INITIAL_STATE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_STATE;
  }
}

function writeState(state: State) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function GettingStarted() {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setState(readState());
    setMounted(true);
  }, []);

  if (!mounted || state.dismissed) return null;

  const completed = STEPS.filter((s) => state.done[s.id]).length;
  const total = STEPS.length;
  const allDone = completed === total;

  function toggle(id: string) {
    const next = {
      ...state,
      done: { ...state.done, [id]: !state.done[id] },
    };
    setState(next);
    writeState(next);
  }

  function dismiss() {
    const next = { ...state, dismissed: true };
    setState(next);
    writeState(next);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle>Getting started</CardTitle>
          <CardDescription>
            {allDone
              ? "Everything&apos;s done — you can hide this card."
              : `${completed} of ${total} complete. Work through these to make the template yours.`}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={dismiss}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {STEPS.map((step) => {
            const done = !!state.done[step.id];
            return (
              <li key={step.id} className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggle(step.id)}
                  aria-label={done ? "Mark as not done" : "Mark as done"}
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40 hover:border-foreground",
                  )}
                >
                  {done && <Check className="h-3 w-3" />}
                </button>
                <div
                  className={cn(
                    "flex-1 text-sm",
                    done && "text-muted-foreground line-through",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">
                      {step.label}
                    </span>
                    {step.href && (
                      <Link
                        href={step.href}
                        className="text-xs text-primary hover:underline"
                      >
                        Open →
                      </Link>
                    )}
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
