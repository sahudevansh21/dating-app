import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProbabilityChart } from "@/components/market/ProbabilityChart";
import { TradePanel } from "@/components/market/TradePanel";
import { OrderBook } from "@/components/market/OrderBook";
import { ActivityFeed } from "@/components/market/ActivityFeed";
import { getMarketBySlug, getOrderBook, getActivity, getHolders, getComments } from "@/lib/api";
import { CATEGORY_LABELS, formatDate, formatVolume, formatTimeAgo } from "@/lib/format";

export default async function MarketDetailPage({ params }: { params: { slug: string } }) {
  const market = await getMarketBySlug(params.slug);
  if (!market) notFound();

  const [orderBook, activity, holders, comments] = await Promise.all([
    getOrderBook(market.id),
    getActivity(market.id),
    getHolders(market.id),
    getComments(market.id),
  ]);

  return (
    <div className="container flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/${market.category}`}>
            <Badge variant="outline">{CATEGORY_LABELS[market.category]}</Badge>
          </Link>
          {market.status === "presale" && <Badge variant="violet">Pre-Sale</Badge>}
          <span className="text-sm text-muted-foreground">Resolves {formatDate(market.resolutionDate)}</span>
        </div>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{market.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="font-mono">{formatVolume(market.volume)} volume</span>
          <span className="flex items-center gap-1">
            <MessageSquare className="size-3.5" />
            {market.comments} comments
          </span>
          {market.creator && (
            <span className="flex items-center gap-1.5">
              <Avatar className="size-5">
                <AvatarImage src={market.creator.avatar} alt="" />
                <AvatarFallback>{market.creator.handle[0]}</AvatarFallback>
              </Avatar>
              Created by {market.creator.handle}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="p-4 sm:p-6">
            <ProbabilityChart priceHistory={market.priceHistory} />
          </Card>

          <Tabs defaultValue="orderbook">
            <TabsList>
              <TabsTrigger value="orderbook">Order Book</TabsTrigger>
              <TabsTrigger value="holders">Holders</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="orderbook">
              <Card className="p-4">
                {orderBook ? <OrderBook orderBook={orderBook} /> : null}
              </Card>
            </TabsContent>

            <TabsContent value="holders">
              <Card className="divide-y divide-border p-4">
                {holders.length ? (
                  holders.map((holder) => (
                    <div key={holder.handle} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                      <Avatar className="size-8">
                        <AvatarImage src={holder.avatar} alt="" />
                        <AvatarFallback>{holder.handle[0]}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1 text-sm font-medium">{holder.handle}</span>
                      <Badge variant={holder.position === "yes" ? "yes" : "no"}>{holder.position.toUpperCase()}</Badge>
                      <span className="w-24 text-right font-mono text-sm">{holder.shares.toLocaleString()} sh</span>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">No holders yet.</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="p-4">
                <ActivityFeed trades={activity} />
              </Card>
            </TabsContent>

            <TabsContent value="comments">
              <Card className="divide-y divide-border p-4">
                {comments.length ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                      <Avatar className="size-8">
                        <AvatarImage src={comment.avatar} alt="" />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.timestamp)}</span>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">{comment.body}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No comments yet — share your take.
                  </p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card className="flex flex-col gap-3 p-4">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-cta" />
                  <p className="text-sm text-muted-foreground">{market.rules}</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
                  Oracle source: <span className="font-mono text-foreground">{market.oracleSource}</span>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <TradePanel market={market} />
        </div>
      </div>
    </div>
  );
}
