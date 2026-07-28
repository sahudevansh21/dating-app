"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketCard } from "@/components/market/MarketCard";
import { getMarkets } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/format";
import type { MarketCategory } from "@/lib/types";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "ending-soon", label: "Ending Soon" },
  { key: "volume", label: "Volume" },
  { key: "open", label: "Open" },
] as const;

export default function MarketsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [category, setCategory] = useState<MarketCategory | "all">("all");
  const [search, setSearch] = useState("");

  const { data: markets, isLoading } = useQuery({
    queryKey: ["markets", "live"],
    queryFn: () => getMarkets({ status: "live" }),
  });

  const filtered = useMemo(() => {
    if (!markets) return [];
    let result = [...markets];
    if (category !== "all") result = result.filter((m) => m.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.title.toLowerCase().includes(q));
    }
    if (filter === "ending-soon") {
      result.sort((a, b) => new Date(a.resolutionDate).getTime() - new Date(b.resolutionDate).getTime());
    } else if (filter === "volume") {
      result.sort((a, b) => b.volume - a.volume);
    } else if (filter === "open") {
      result = result.filter((m) => m.status === "live");
    }
    return result;
  }, [markets, category, search, filter]);

  return (
    <div className="container flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">All Markets</h1>
        <p className="text-sm text-muted-foreground">Browse every live market on Oracle Pit.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup type="single" value={filter} onValueChange={(v) => v && setFilter(v as typeof filter)}>
          {FILTERS.map((f) => (
            <ToggleGroupItem key={f.key} value={f.key}>
              {f.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search markets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 pl-9 sm:w-64"
            />
          </div>
          <Select value={category} onValueChange={(v) => setCategory(v as MarketCategory | "all")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">No markets match your filters</p>
          <p className="text-sm text-muted-foreground">Try a different category or search term.</p>
        </div>
      )}
    </div>
  );
}
