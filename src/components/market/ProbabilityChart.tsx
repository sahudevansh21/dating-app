"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { PricePoint } from "@/lib/types";

const RANGES = [
  { key: "1H", ms: 60 * 60 * 1000 },
  { key: "1D", ms: 24 * 60 * 60 * 1000 },
  { key: "1W", ms: 7 * 24 * 60 * 60 * 1000 },
  { key: "ALL", ms: Infinity },
] as const;

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: PricePoint }[] }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <div className="font-mono font-semibold text-yes">{point.yes.toFixed(1)}¢ YES</div>
      <div className="mt-0.5 text-muted-foreground">{new Date(point.t).toLocaleString()}</div>
    </div>
  );
}

export function ProbabilityChart({ priceHistory }: { priceHistory: PricePoint[] }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("1D");

  const data = useMemo(() => {
    const rangeConfig = RANGES.find((r) => r.key === range)!;
    if (rangeConfig.ms === Infinity) return priceHistory;
    const cutoff = Date.now() - rangeConfig.ms;
    const filtered = priceHistory.filter((p) => p.t >= cutoff);
    return filtered.length > 1 ? filtered : priceHistory.slice(-Math.min(20, priceHistory.length));
  }, [priceHistory, range]);

  const latest = data[data.length - 1]?.yes ?? 0;
  const first = data[0]?.yes ?? 0;
  const isUp = latest >= first;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className={cn("font-mono text-2xl font-bold", isUp ? "text-yes" : "text-no")}>
            {latest.toFixed(1)}¢
          </span>
          <span className={cn("font-mono text-sm", isUp ? "text-yes" : "text-no")}>
            {isUp ? "+" : ""}
            {(latest - first).toFixed(1)}¢
          </span>
        </div>
        <ToggleGroup
          type="single"
          value={range}
          onValueChange={(v) => v && setRange(v as typeof range)}
          className="flex gap-1"
        >
          {RANGES.map((r) => (
            <ToggleGroupItem key={r.key} value={r.key} size="sm">
              {r.key}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="yesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3DDC84" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3DDC84" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="t"
              tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
            />
            <YAxis
              domain={[0, 100]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}¢`}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="yes" stroke="#3DDC84" strokeWidth={2} fill="url(#yesFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
