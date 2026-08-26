"use client";

import Link from "next/link";
import { MessageSquare, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OutcomeButton } from "./OutcomeButton";
import { CATEGORY_LABELS, formatVolume, timeUntil } from "@/lib/format";
import type { Market } from "@/lib/types";

export function MarketCard({ market }: { market: Market }) {
  const isBinary = market.kind === "binary";
  const yesOutcome = market.outcomes.find((o) => o.id === "yes") ?? market.outcomes[0];
  const noOutcome = market.outcomes.find((o) => o.id === "no") ?? market.outcomes[1];

  return (
    <Card className="card-hover flex h-full flex-col p-4">
      <Link href={`/markets/${market.slug}`} className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline">{CATEGORY_LABELS[market.category]}</Badge>
          {market.status === "presale" ? (
            <Badge variant="violet">Pre-Sale</Badge>
          ) : (
            <span className="text-xs text-muted-foreground">{timeUntil(market.resolutionDate)} left</span>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug">{market.title}</h3>

        {market.creator && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Avatar className="size-4">
              <AvatarImage src={market.creator.avatar} alt="" />
              <AvatarFallback>{market.creator.handle[0]}</AvatarFallback>
            </Avatar>
            <span>{market.creator.handle}</span>
            <Sparkles className="size-3 text-violet" />
          </div>
        )}
      </Link>

      <div className="mt-3 flex flex-col gap-2">
        {isBinary ? (
          <div className="grid grid-cols-2 gap-2">
            <OutcomeButton outcome={yesOutcome} variant="yes" compact />
            <OutcomeButton outcome={noOutcome} variant="no" compact />
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {market.outcomes.slice(0, 3).map((outcome) => (
              <OutcomeButton key={outcome.id} outcome={outcome} variant="neutral" compact />
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="font-mono">{formatVolume(market.volume)} Vol.</span>
        <span className="flex items-center gap-1">
          <MessageSquare className="size-3" />
          {market.comments}
        </span>
      </div>
    </Card>
  );
}
