export type OutcomeKind = "binary" | "multi";

export type MarketCategory =
  | "crypto"
  | "sports"
  | "esports"
  | "finance"
  | "politics"
  | "tech"
  | "entertainment";

export type MarketStatus = "live" | "presale" | "resolved";

export interface Outcome {
  id: string;
  label: string;
  probability: number; // 0-100
  multiplier: number; // e.g. 1.8x
}

export interface PricePoint {
  t: number; // unix ms
  yes: number; // 0-100
}

export interface MarketCreator {
  handle: string;
  avatar: string;
}

export interface Market {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: MarketCategory;
  kind: OutcomeKind;
  outcomes: Outcome[];
  volume: number;
  comments: number;
  resolutionDate: string; // ISO date
  status: MarketStatus;
  creator?: MarketCreator;
  priceHistory: PricePoint[];
  liquidity: number;
  bondStaked?: number;
  image?: string;
  featured?: boolean;
  rules?: string;
  oracleSource?: string;
}

export interface Trade {
  id: string;
  marketId: string;
  marketSlug: string;
  marketTitle: string;
  outcomeId: string;
  outcomeLabel: string;
  side: "buy" | "sell";
  position: "yes" | "no";
  amount: number; // USDC staked
  shares: number;
  price: number; // cents, 0-100
  timestamp: number;
  trader: string;
}

export interface Position {
  id: string;
  marketId: string;
  marketSlug: string;
  marketTitle: string;
  outcomeId: string;
  outcomeLabel: string;
  position: "yes" | "no";
  shares: number;
  avgPrice: number;
  currentPrice: number;
  invested: number;
  status: MarketStatus;
  claimable: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  handle: string;
  avatar: string;
  volume: number;
  profit: number;
  marketsCreated: number;
  winRate: number;
}

export interface User {
  address: string;
  handle: string;
  avatar: string;
  balance: number;
  positions: Position[];
}

export interface OrderBookLevel {
  price: number;
  shares: number;
}

export interface OrderBook {
  yes: { bids: OrderBookLevel[]; asks: OrderBookLevel[] };
  no: { bids: OrderBookLevel[]; asks: OrderBookLevel[] };
}

export interface Comment {
  id: string;
  marketId: string;
  author: string;
  avatar: string;
  body: string;
  timestamp: number;
  likes: number;
}

export interface Holder {
  handle: string;
  avatar: string;
  position: "yes" | "no";
  shares: number;
  value: number;
}
