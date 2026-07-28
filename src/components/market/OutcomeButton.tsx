"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatCents, formatMultiplier } from "@/lib/format";
import type { Outcome } from "@/lib/types";

interface OutcomeButtonProps {
  outcome: Outcome;
  variant: "yes" | "no" | "neutral";
  onClick?: () => void;
  compact?: boolean;
}

export function OutcomeButton({ outcome, variant, onClick, compact }: OutcomeButtonProps) {
  const [pulse, setPulse] = useState<"up" | "down" | null>(null);
  const prevProb = useRef(outcome.probability);

  useEffect(() => {
    if (outcome.probability > prevProb.current) setPulse("up");
    else if (outcome.probability < prevProb.current) setPulse("down");
    prevProb.current = outcome.probability;
    if (pulse) {
      const t = setTimeout(() => setPulse(null), 600);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outcome.probability]);

  const colorClasses =
    variant === "yes"
      ? "border-yes/30 bg-yes/10 text-yes hover:bg-yes/20"
      : variant === "no"
      ? "border-no/30 bg-no/10 text-no hover:bg-no/20"
      : "border-border bg-secondary text-foreground hover:bg-accent";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors",
        colorClasses,
        pulse === "up" && "animate-pulse-yes",
        pulse === "down" && "animate-pulse-no",
        compact && "px-2.5 py-1.5"
      )}
    >
      <span className={cn("truncate font-medium", compact ? "text-xs" : "text-sm")}>{outcome.label}</span>
      <span className="flex items-center gap-1.5 font-mono tabular-nums">
        <span className={cn("font-semibold", compact ? "text-xs" : "text-sm")}>{formatCents(outcome.probability)}</span>
        <span className="text-[10px] text-muted-foreground">{formatMultiplier(outcome.multiplier)}</span>
      </span>
    </button>
  );
}
