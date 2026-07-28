"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Rocket, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPresaleMarkets, backPresaleMarket } from "@/lib/api";
import { CATEGORY_LABELS, formatUSDC, formatDate } from "@/lib/format";

function BackMarketRow({ marketId }: { marketId: string }) {
  const [amount, setAmount] = useState("50");
  const queryClient = useQueryClient();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const mutation = useMutation({
    mutationFn: () => backPresaleMarket(marketId, parseFloat(amount) || 0),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["presale"] }),
  });

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          className="h-9 w-24 pl-5 text-sm"
        />
      </div>
      <Button
        size="sm"
        onClick={() => (isConnected ? mutation.mutate() : openConnectModal?.())}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Backing..." : "Back this market"}
      </Button>
    </div>
  );
}

export default function PresalePage() {
  const { data: markets, isLoading } = useQuery({
    queryKey: ["presale"],
    queryFn: getPresaleMarkets,
  });

  return (
    <div className="container flex flex-col gap-6 py-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-1">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-xs font-medium text-violet">
            <Rocket className="size-3.5" />
            Pre-Sale
          </div>
          <h1 className="text-2xl font-bold">Back a Market Before It Launches</h1>
          <p className="text-sm text-muted-foreground">
            These markets have been proposed and bonded, but aren&apos;t live yet. Add liquidity to help them launch.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-1.5">
          <Link href="/create">
            <Plus className="size-4" />
            Propose a Market
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : markets && markets.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {markets.map((market) => (
            <Card key={market.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{CATEGORY_LABELS[market.category]}</Badge>
                <span className="text-xs text-muted-foreground">Resolves {formatDate(market.resolutionDate)}</span>
              </div>
              <Link href={`/markets/${market.slug}`} className="font-semibold leading-snug hover:text-cta">
                {market.title}
              </Link>
              {market.creator && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Avatar className="size-4">
                    <AvatarImage src={market.creator.avatar} alt="" />
                    <AvatarFallback>{market.creator.handle[0]}</AvatarFallback>
                  </Avatar>
                  {market.creator.handle} · bonded {formatUSDC(market.bondStaked ?? 0)}
                </div>
              )}
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="text-sm">
                  <span className="font-mono font-semibold">{formatUSDC(market.liquidity)}</span>
                  <span className="text-muted-foreground"> backed so far</span>
                </div>
                <BackMarketRow marketId={market.id} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">No markets in pre-sale right now</p>
          <p className="text-sm text-muted-foreground">Be the first to propose one.</p>
          <Button asChild className="mt-2">
            <Link href="/create">Propose a Market</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
