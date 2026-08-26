import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatVolume, formatSignedUSDC, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/types";

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/40 text-left text-xs text-muted-foreground">
            <th className="px-4 py-3 font-medium">Rank</th>
            <th className="px-4 py-3 font-medium">Trader</th>
            <th className="px-4 py-3 text-right font-medium">Volume</th>
            <th className="px-4 py-3 text-right font-medium">Profit</th>
            <th className="px-4 py-3 text-right font-medium">Markets Created</th>
            <th className="px-4 py-3 text-right font-medium">Win Rate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map((entry) => (
            <tr key={entry.handle} className="transition-colors hover:bg-accent/50">
              <td className="px-4 py-3 font-mono font-semibold text-muted-foreground">#{entry.rank}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Avatar className="size-7">
                    <AvatarImage src={entry.avatar} alt="" />
                    <AvatarFallback>{entry.handle[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{entry.handle}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-mono">{formatVolume(entry.volume)}</td>
              <td className={cn("px-4 py-3 text-right font-mono font-semibold", entry.profit >= 0 ? "text-yes" : "text-no")}>
                {formatSignedUSDC(entry.profit)}
              </td>
              <td className="px-4 py-3 text-right font-mono">{entry.marketsCreated}</td>
              <td className="px-4 py-3 text-right font-mono">{formatPercent(entry.winRate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
