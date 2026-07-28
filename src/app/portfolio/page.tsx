"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Wallet, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPortfolioPositions, getCurrentUser } from "@/lib/api";
import { formatCents, formatSignedUSDC, formatUSDC } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function PortfolioPage() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const { data: user } = useQuery({ queryKey: ["user"], queryFn: getCurrentUser });
  const { data: positions, isLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: getPortfolioPositions,
  });

  if (!isConnected) {
    return (
      <div className="container flex flex-col items-center gap-4 py-24 text-center">
        <Wallet className="size-10 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Connect your wallet to view your portfolio</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your open positions, P&amp;L, and claimable winnings will show up here once you connect.
        </p>
        <Button onClick={() => openConnectModal?.()}>Connect Wallet</Button>
      </div>
    );
  }

  const totalInvested = positions?.reduce((sum, p) => sum + p.invested, 0) ?? 0;
  const totalValue =
    positions?.reduce((sum, p) => sum + (p.shares * p.currentPrice) / 100, 0) ?? 0;
  const totalPnl = totalValue - totalInvested;

  return (
    <div className="container flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <p className="text-sm text-muted-foreground">{user?.handle ?? "you.base"}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Balance</div>
          <div className="mt-1 font-mono text-xl font-bold">{formatUSDC(user?.balance ?? 0)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Portfolio Value</div>
          <div className="mt-1 font-mono text-xl font-bold">{formatUSDC(totalValue)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Total P&amp;L</div>
          <div className={cn("mt-1 font-mono text-xl font-bold", totalPnl >= 0 ? "text-yes" : "text-no")}>
            {formatSignedUSDC(totalPnl)}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Open Positions</h2>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : positions && positions.length ? (
          <div className="flex flex-col gap-3">
            {positions.map((position) => {
              const value = (position.shares * position.currentPrice) / 100;
              const pnl = value - position.invested;
              return (
                <Card key={position.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <Link href={`/markets/${position.marketSlug}`} className="font-medium hover:text-cta">
                      {position.marketTitle}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={position.position === "yes" ? "yes" : "no"}>{position.outcomeLabel}</Badge>
                      <span className="font-mono">{position.shares.toFixed(2)} shares</span>
                      <span>@ {formatCents(position.avgPrice)} avg</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 sm:gap-8">
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold">{formatUSDC(value)}</div>
                      <div className={cn("font-mono text-xs", pnl >= 0 ? "text-yes" : "text-no")}>
                        {formatSignedUSDC(pnl)}
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/markets/${position.marketSlug}`}>
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
            <p className="font-medium">No open positions yet</p>
            <p className="text-sm text-muted-foreground">Pick a market to get started.</p>
            <Button asChild className="mt-2">
              <Link href="/markets">Browse Markets</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
