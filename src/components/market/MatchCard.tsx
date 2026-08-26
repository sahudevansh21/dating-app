"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OutcomeButton } from "./OutcomeButton";
import { formatVolume, formatDateShort } from "@/lib/format";
import type { Market } from "@/lib/types";

export function MatchCard({ market }: { market: Market }) {
  return (
    <Card className="card-hover flex w-72 shrink-0 flex-col gap-3 p-4 sm:w-80">
      <div className="flex items-center justify-between">
        <Badge variant="cta" className="uppercase tracking-wide">
          Reg Time
        </Badge>
        <span className="font-mono text-xs text-muted-foreground">{formatDateShort(market.resolutionDate)}</span>
      </div>

      <Link href={`/markets/${market.slug}`}>
        <h3 className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug hover:text-cta">{market.title}</h3>
      </Link>

      <div className="flex flex-col gap-1.5">
        {market.outcomes.map((outcome, i) => (
          <OutcomeButton
            key={outcome.id}
            outcome={outcome}
            variant={market.kind === "binary" ? (i === 0 ? "yes" : "no") : "neutral"}
            compact
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="font-mono">{formatVolume(market.volume)} Vol.</span>
        <Link href={`/markets/${market.slug}`} className="font-medium text-cta hover:underline">
          Trade →
        </Link>
      </div>
    </Card>
  );
}
