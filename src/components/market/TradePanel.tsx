"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatCents, formatUSDC } from "@/lib/format";
import type { Market, Outcome } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

const QUICK_AMOUNTS = [10, 25, 100, 500];

export function TradePanel({ market }: { market: Market }) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [selectedOutcomeId, setSelectedOutcomeId] = useState(market.outcomes[0].id);
  const [amount, setAmount] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const selectedOutcome = market.outcomes.find((o) => o.id === selectedOutcomeId) as Outcome;
  const isBinary = market.kind === "binary";

  const parsedAmount = parseFloat(amount) || 0;
  const priceDecimal = selectedOutcome.probability / 100;
  const shares = priceDecimal > 0 ? parsedAmount / priceDecimal : 0;
  const potentialPayout = shares;
  const profit = potentialPayout - parsedAmount;

  const canTrade = parsedAmount > 0;

  const handlePlaceTrade = () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    setConfirmOpen(true);
  };

  return (
    <>
      <Card className="sticky top-36 flex flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1">
          <button
            onClick={() => setSide("buy")}
            aria-pressed={side === "buy"}
            className={cn(
              "rounded-md py-1.5 text-sm font-medium transition-colors",
              side === "buy" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setSide("sell")}
            aria-pressed={side === "sell"}
            className={cn(
              "rounded-md py-1.5 text-sm font-medium transition-colors",
              side === "sell" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            Sell
          </button>
        </div>

        <div className={cn("grid gap-2", isBinary ? "grid-cols-2" : "grid-cols-1")}>
          {market.outcomes.map((outcome) => {
            const active = outcome.id === selectedOutcomeId;
            const isYes = outcome.id === "yes" || outcome.id === "home" || outcome.id === "a";
            return (
              <button
                key={outcome.id}
                onClick={() => setSelectedOutcomeId(outcome.id)}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? isYes
                      ? "border-yes bg-yes/15 text-yes"
                      : "border-no bg-no/15 text-no"
                    : "border-border bg-transparent text-muted-foreground hover:border-muted-foreground"
                )}
              >
                <span>{outcome.label}</span>
                <span className="font-mono">{formatCents(outcome.probability)}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="trade-amount">
            Amount (USDC)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input
              id="trade-amount"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              className="pl-6 text-lg font-semibold"
            />
          </div>
          <div className="flex gap-1.5">
            {QUICK_AMOUNTS.map((qa) => (
              <Button key={qa} variant="outline" size="sm" className="flex-1" onClick={() => setAmount(String(qa))}>
                ${qa}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-secondary/40 p-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Avg. price</span>
            <span className="font-mono text-foreground">{formatCents(selectedOutcome.probability)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shares</span>
            <span className="font-mono text-foreground">{shares.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Potential payout</span>
            <span className="font-mono font-semibold text-yes">{formatUSDC(potentialPayout)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Potential profit</span>
            <span className={cn("font-mono font-semibold", profit >= 0 ? "text-yes" : "text-no")}>
              {formatUSDC(profit)}
            </span>
          </div>
        </div>

        <Button size="lg" disabled={!canTrade} onClick={handlePlaceTrade} className="w-full">
          {isConnected ? "Place Trade" : "Connect Wallet to Trade"}
        </Button>

        <p className="text-center text-[11px] text-muted-foreground">
          Trades are simulated for this demo — no funds move on-chain.
        </p>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-yes" />
              Trade confirmed (simulated)
            </DialogTitle>
            <DialogDescription>
              {side === "buy" ? "Bought" : "Sold"} {shares.toFixed(2)} {selectedOutcome.label} shares in &quot;
              {market.title}&quot; for {formatUSDC(parsedAmount)}.
            </DialogDescription>
          </DialogHeader>
          {/* TODO: wire to pm-AMM pool contract on Base */}
          <Button onClick={() => setConfirmOpen(false)}>Done</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
