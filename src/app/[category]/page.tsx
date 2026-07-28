import { notFound } from "next/navigation";
import { MarketCard } from "@/components/market/MarketCard";
import { getMarketsByCategory } from "@/lib/api";
import { CATEGORY_LABELS } from "@/lib/format";
import type { MarketCategory } from "@/lib/types";

const VALID_CATEGORIES = Object.keys(CATEGORY_LABELS) as MarketCategory[];

export default async function CategoryPage({ params }: { params: { category: string } }) {
  if (!VALID_CATEGORIES.includes(params.category as MarketCategory)) notFound();
  const category = params.category as MarketCategory;
  const markets = await getMarketsByCategory(category);

  return (
    <div className="container flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{CATEGORY_LABELS[category]}</h1>
        <p className="text-sm text-muted-foreground">
          {markets.length} live market{markets.length === 1 ? "" : "s"} in this category.
        </p>
      </div>

      {markets.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">No markets in {CATEGORY_LABELS[category]} yet</p>
          <p className="text-sm text-muted-foreground">Check back soon, or propose one yourself.</p>
        </div>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}
