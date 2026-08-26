"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
}

const SEED: TickerItem[] = [
  { symbol: "BTC", price: 118_420, change: 2.34 },
  { symbol: "ETH", price: 4_312, change: -1.12 },
  { symbol: "SOL", price: 268, change: 5.81 },
  { symbol: "BASE-TVL", price: 3_120_000_000, change: 0.92 },
  { symbol: "House Majority", price: 52, change: 0.4 },
  { symbol: "Fed Cut Sep", price: 71, change: 3.1 },
];

function formatTickerPrice(item: TickerItem): string {
  if (item.symbol === "BASE-TVL") return `$${(item.price / 1_000_000_000).toFixed(2)}B`;
  if (item.symbol.includes("Majority") || item.symbol.includes("Cut")) return `${item.price}%`;
  return `$${item.price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function PriceTicker() {
  const [items, setItems] = useState<TickerItem[]>(SEED);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.5) * (item.price > 1000 ? item.price * 0.002 : 1.2);
          return {
            ...item,
            price: Math.max(0, item.price + delta),
            change: item.change + (Math.random() - 0.5) * 0.4,
          };
        })
      );
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const loop = [...items, ...items];

  return (
    <div className="overflow-hidden border-b border-border bg-card/50 py-1.5">
      <div className="flex w-max animate-marquee gap-8 motion-reduce:animate-none">
        {loop.map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-mono text-xs">
            <span className="text-muted-foreground">{item.symbol}</span>
            <span className="text-foreground">{formatTickerPrice(item)}</span>
            <span className={cn(item.change >= 0 ? "text-yes" : "text-no")}>
              {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
