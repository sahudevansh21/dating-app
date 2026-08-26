import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo, formatUSDC } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Trade } from "@/lib/types";

export function ActivityFeed({ trades }: { trades: Trade[] }) {
  if (!trades.length) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No activity yet — be the first to trade.</p>;
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {trades.map((trade) => (
        <div key={trade.id} className="flex items-center gap-3 py-3">
          <Avatar className="size-8">
            <AvatarImage src={`https://api.dicebear.com/9.x/identicon/svg?seed=${trade.trader}`} alt="" />
            <AvatarFallback>{trade.trader[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-sm">
            <span className="font-medium">{trade.trader}</span>{" "}
            <span className="text-muted-foreground">
              {trade.side === "buy" ? "bought" : "sold"}{" "}
              <span className={cn("font-medium", trade.position === "yes" ? "text-yes" : "text-no")}>
                {trade.outcomeLabel}
              </span>
            </span>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm font-semibold">{formatUSDC(trade.amount)}</div>
            <div className="text-xs text-muted-foreground">{formatTimeAgo(trade.timestamp)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
