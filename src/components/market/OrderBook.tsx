import type { OrderBook as OrderBookType } from "@/lib/types";
import { cn } from "@/lib/utils";

function Side({ label, levels, tone }: { label: string; levels: { price: number; shares: number }[]; tone: "yes" | "no" }) {
  const maxShares = Math.max(...levels.map((l) => l.shares), 1);
  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex justify-between px-2 text-xs text-muted-foreground">
        <span>{label} price</span>
        <span>Shares</span>
      </div>
      {levels.map((level, i) => (
        <div key={i} className="relative flex items-center justify-between overflow-hidden rounded px-2 py-1 text-xs font-mono">
          <div
            className={cn("absolute inset-y-0 left-0", tone === "yes" ? "bg-yes/10" : "bg-no/10")}
            style={{ width: `${(level.shares / maxShares) * 100}%` }}
          />
          <span className={cn("relative", tone === "yes" ? "text-yes" : "text-no")}>{level.price}¢</span>
          <span className="relative text-foreground">{level.shares.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function OrderBook({ orderBook }: { orderBook: OrderBookType }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-yes">YES</h4>
        <div className="flex gap-3">
          <Side label="Bid" levels={orderBook.yes.bids} tone="yes" />
          <Side label="Ask" levels={orderBook.yes.asks} tone="yes" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-no">NO</h4>
        <div className="flex gap-3">
          <Side label="Bid" levels={orderBook.no.bids} tone="no" />
          <Side label="Ask" levels={orderBook.no.asks} tone="no" />
        </div>
      </div>
    </div>
  );
}
