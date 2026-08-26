import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarketCard } from "@/components/market/MarketCard";
import { MatchCard } from "@/components/market/MatchCard";
import { getFeaturedMarkets, getEndingSoonMarkets, getMarketsByCategory, getLeaderboard } from "@/lib/api";
import { CATEGORY_LABELS, formatVolume, formatSignedUSDC } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MarketCategory } from "@/lib/types";

const RAIL_CATEGORIES: MarketCategory[] = ["crypto", "sports", "politics", "esports", "tech"];
const RAIL_LIMIT = 4;

export default async function Home() {
  const [featured, endingSoon, leaderboard] = await Promise.all([
    getFeaturedMarkets(),
    getEndingSoonMarkets(8),
    getLeaderboard(),
  ]);

  const categorySections = await Promise.all(
    RAIL_CATEGORIES.map(async (category) => {
      const allInCategory = await getMarketsByCategory(category);
      return { category, total: allInCategory.length, markets: allInCategory.slice(0, RAIL_LIMIT) };
    })
  );

  return (
    <div className="container flex flex-col gap-16 py-10">
      {/* Hero */}
      <section className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-background p-8 sm:p-12">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cta/30 bg-cta/10 px-3 py-1 text-xs font-medium text-cta">
          <TrendingUp className="size-3.5" />
          Live on Base
        </div>
        <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          The future has a price. <span className="text-cta">Choose how you profit.</span>
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Trade YES/NO shares on crypto, sports, politics and creator-made markets. Deep liquidity, instant
          settlement, on-chain resolution.
        </p>
        <Button asChild size="lg">
          <Link href="/markets">
            Start Trading
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      {/* Featured rail */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured Markets</h2>
          <Link href="/markets" className="text-sm font-medium text-cta hover:underline">
            View all
          </Link>
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {featured.map((market) => (
            <MatchCard key={market.id} market={market} />
          ))}
        </div>
      </section>

      {/* Ending soon */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Ending Soon</h2>
          <Link href="/markets" className="text-sm font-medium text-cta hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {endingSoon.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </section>

      {/* Category sections */}
      {categorySections.map(({ category, total, markets }) =>
        markets.length ? (
          <section key={category} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {CATEGORY_LABELS[category]}{" "}
                <span className="text-muted-foreground">
                  (showing {markets.length} of {total})
                </span>
              </h2>
              <Link href={`/${category}`} className="text-sm font-medium text-cta hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {markets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          </section>
        ) : null
      )}

      {/* Leaderboard preview */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Top Traders</h2>
          <Link href="/leaderboard" className="text-sm font-medium text-cta hover:underline">
            Full leaderboard
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {leaderboard.slice(0, 3).map((entry) => (
            <Card key={entry.handle} className="flex items-center gap-4 p-4">
              <span className="font-mono text-2xl font-bold text-muted-foreground">#{entry.rank}</span>
              <Avatar className="size-10">
                <AvatarImage src={entry.avatar} alt="" />
                <AvatarFallback>{entry.handle[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col">
                <span className="font-semibold">{entry.handle}</span>
                <span className="font-mono text-xs text-muted-foreground">{formatVolume(entry.volume)} volume</span>
              </div>
              <div className="text-right">
                <div className={cn("font-mono text-sm font-semibold", entry.profit >= 0 ? "text-yes" : "text-no")}>
                  {formatSignedUSDC(entry.profit)}
                </div>
                <div className="text-xs text-muted-foreground">{entry.marketsCreated} markets</div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
