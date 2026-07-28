import type { Market, LeaderboardEntry, Comment, Holder, OrderBook, Trade } from "./types";

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function minutesFromNow(minutes: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

function genPriceHistory(points: number, start: number, volatility: number, drift = 0): { t: number; yes: number }[] {
  const now = Date.now();
  const stepMs = (24 * 60 * 60 * 1000) / (points / 30);
  let value = start;
  const history: { t: number; yes: number }[] = [];
  for (let i = points; i >= 0; i--) {
    value += (Math.random() - 0.5) * volatility + drift;
    value = Math.max(2, Math.min(98, value));
    history.push({ t: now - i * stepMs, yes: Math.round(value * 10) / 10 });
  }
  history[history.length - 1].yes = start;
  return history;
}

function multiplierFromProb(prob: number): number {
  return Math.round((100 / Math.max(prob, 1)) * 100) / 100;
}

const AVATARS = [
  "https://api.dicebear.com/9.x/identicon/svg?seed=orbit",
  "https://api.dicebear.com/9.x/identicon/svg?seed=nova",
  "https://api.dicebear.com/9.x/identicon/svg?seed=comet",
  "https://api.dicebear.com/9.x/identicon/svg?seed=quasar",
  "https://api.dicebear.com/9.x/identicon/svg?seed=zenith",
  "https://api.dicebear.com/9.x/identicon/svg?seed=vertex",
  "https://api.dicebear.com/9.x/identicon/svg?seed=pulsar",
  "https://api.dicebear.com/9.x/identicon/svg?seed=drift",
];

export const mockMarkets: Market[] = [
  {
    id: "m1",
    slug: "btc-up-or-down-5-min",
    title: "BTC Up or Down – 5 Min",
    description: "Will Bitcoin's price be higher or lower than the current price in 5 minutes?",
    category: "crypto",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Up", probability: 54, multiplier: multiplierFromProb(54) },
      { id: "no", label: "Down", probability: 46, multiplier: multiplierFromProb(46) },
    ],
    volume: 182_400,
    comments: 41,
    resolutionDate: minutesFromNow(5),
    status: "live",
    priceHistory: genPriceHistory(60, 52, 6),
    liquidity: 94_200,
    featured: true,
    rules: "Resolves YES if the BTC/USD price on the Chainlink oracle is strictly higher 5 minutes after market open than at open.",
    oracleSource: "Chainlink BTC/USD Price Feed (Base)",
  },
  {
    id: "m2",
    slug: "eth-up-or-down-5-min",
    title: "ETH Up or Down – 5 Min",
    description: "Will Ethereum's price be higher or lower than the current price in 5 minutes?",
    category: "crypto",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Up", probability: 48, multiplier: multiplierFromProb(48) },
      { id: "no", label: "Down", probability: 52, multiplier: multiplierFromProb(52) },
    ],
    volume: 96_800,
    comments: 22,
    resolutionDate: minutesFromNow(5),
    status: "live",
    priceHistory: genPriceHistory(60, 50, 6),
    liquidity: 51_000,
    rules: "Resolves YES if the ETH/USD price on the Chainlink oracle is strictly higher 5 minutes after market open than at open.",
    oracleSource: "Chainlink ETH/USD Price Feed (Base)",
  },
  {
    id: "m3",
    slug: "btc-150k-by-end-of-2026",
    title: "Will BTC hit $150K by end of 2026?",
    description: "Bitcoin has been on a tear this cycle. Will it cross $150,000 before Jan 1, 2027?",
    category: "crypto",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 37, multiplier: multiplierFromProb(37) },
      { id: "no", label: "No", probability: 63, multiplier: multiplierFromProb(63) },
    ],
    volume: 2_140_000,
    comments: 318,
    resolutionDate: daysFromNow(157),
    status: "live",
    priceHistory: genPriceHistory(180, 34, 2, 0.02),
    liquidity: 640_000,
    featured: true,
    rules: "Resolves YES if BTC/USD trades at or above $150,000 on any major exchange before market close.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "m4",
    slug: "fed-rate-cut-september",
    title: "Fed cuts rates in September meeting?",
    description: "Will the Federal Reserve cut the federal funds rate at the September FOMC meeting?",
    category: "finance",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 71, multiplier: multiplierFromProb(71) },
      { id: "no", label: "No", probability: 29, multiplier: multiplierFromProb(29) },
    ],
    volume: 890_000,
    comments: 154,
    resolutionDate: daysFromNow(52),
    status: "live",
    priceHistory: genPriceHistory(120, 65, 3, 0.03),
    liquidity: 310_000,
    rules: "Resolves YES if the FOMC announces a reduction in the federal funds target rate at its September meeting.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "m5",
    slug: "sp500-new-ath-this-month",
    title: "S&P 500 closes at new all-time high this month?",
    description: "Will the S&P 500 index close at a new record high before the end of the month?",
    category: "finance",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 58, multiplier: multiplierFromProb(58) },
      { id: "no", label: "No", probability: 42, multiplier: multiplierFromProb(42) },
    ],
    volume: 412_000,
    comments: 67,
    resolutionDate: daysFromNow(9),
    status: "live",
    priceHistory: genPriceHistory(90, 55, 4),
    liquidity: 180_000,
    rules: "Resolves YES if the S&P 500 closes above its prior all-time closing high on any trading day this month.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "m6",
    slug: "man-city-vs-bournemouth",
    title: "Man City vs Bournemouth",
    description: "Premier League matchday fixture — who wins?",
    category: "sports",
    kind: "multi",
    outcomes: [
      { id: "home", label: "Man City", probability: 62, multiplier: multiplierFromProb(62) },
      { id: "draw", label: "Draw", probability: 22, multiplier: multiplierFromProb(22) },
      { id: "away", label: "Bournemouth", probability: 16, multiplier: multiplierFromProb(16) },
    ],
    volume: 318_500,
    comments: 89,
    resolutionDate: daysFromNow(2),
    status: "live",
    priceHistory: genPriceHistory(60, 60, 3),
    liquidity: 140_000,
    featured: true,
    rules: "Resolves to the official final result of the fixture per the Premier League.",
    oracleSource: "Sports Data Oracle — Premier League",
  },
  {
    id: "m7",
    slug: "arsenal-vs-liverpool",
    title: "Arsenal vs Liverpool",
    description: "Premier League matchday fixture — who wins?",
    category: "sports",
    kind: "multi",
    outcomes: [
      { id: "home", label: "Arsenal", probability: 41, multiplier: multiplierFromProb(41) },
      { id: "draw", label: "Draw", probability: 27, multiplier: multiplierFromProb(27) },
      { id: "away", label: "Liverpool", probability: 32, multiplier: multiplierFromProb(32) },
    ],
    volume: 501_200,
    comments: 132,
    resolutionDate: daysFromNow(4),
    status: "live",
    priceHistory: genPriceHistory(60, 40, 3),
    liquidity: 205_000,
    rules: "Resolves to the official final result of the fixture per the Premier League.",
    oracleSource: "Sports Data Oracle — Premier League",
  },
  {
    id: "m8",
    slug: "lakers-vs-celtics",
    title: "Lakers vs Celtics",
    description: "NBA regular season matchup — who wins?",
    category: "sports",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Lakers", probability: 47, multiplier: multiplierFromProb(47) },
      { id: "no", label: "Celtics", probability: 53, multiplier: multiplierFromProb(53) },
    ],
    volume: 275_900,
    comments: 74,
    resolutionDate: daysFromNow(1),
    status: "live",
    priceHistory: genPriceHistory(60, 50, 4),
    liquidity: 120_000,
    rules: "Resolves to the official final result per the NBA.",
    oracleSource: "Sports Data Oracle — NBA",
  },
  {
    id: "m9",
    slug: "faze-vs-navi-major-final",
    title: "FaZe vs NAVI — CS Major Final",
    description: "Counter-Strike Major grand final — who lifts the trophy?",
    category: "esports",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "FaZe Clan", probability: 44, multiplier: multiplierFromProb(44) },
      { id: "no", label: "NAVI", probability: 56, multiplier: multiplierFromProb(56) },
    ],
    volume: 156_300,
    comments: 58,
    resolutionDate: daysFromNow(6),
    status: "live",
    priceHistory: genPriceHistory(60, 45, 4),
    liquidity: 72_000,
    rules: "Resolves to the official Major final result per the tournament organizer.",
    oracleSource: "Esports Data Oracle",
  },
  {
    id: "m10",
    slug: "t1-worlds-champion-2026",
    title: "T1 wins League of Legends Worlds 2026?",
    description: "Will T1 win the League of Legends World Championship this year?",
    category: "esports",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 29, multiplier: multiplierFromProb(29) },
      { id: "no", label: "No", probability: 71, multiplier: multiplierFromProb(71) },
    ],
    volume: 244_000,
    comments: 96,
    resolutionDate: daysFromNow(38),
    status: "live",
    priceHistory: genPriceHistory(90, 25, 3, 0.02),
    liquidity: 98_000,
    rules: "Resolves YES if T1 wins the League of Legends World Championship grand final.",
    oracleSource: "Esports Data Oracle",
  },
  {
    id: "m11",
    slug: "which-party-wins-house-2026",
    title: "Which party wins the House in 2026?",
    description: "Which party will hold a majority of seats in the U.S. House of Representatives after the 2026 midterms?",
    category: "politics",
    kind: "multi",
    outcomes: [
      { id: "dem", label: "Democratic Party", probability: 52, multiplier: multiplierFromProb(52) },
      { id: "rep", label: "Republican Party", probability: 47, multiplier: multiplierFromProb(47) },
      { id: "other", label: "Other / Tied", probability: 1, multiplier: multiplierFromProb(1) },
    ],
    volume: 3_820_000,
    comments: 612,
    resolutionDate: daysFromNow(99),
    status: "live",
    priceHistory: genPriceHistory(180, 50, 2),
    liquidity: 1_240_000,
    featured: true,
    rules: "Resolves to whichever party holds a majority of U.S. House seats when the 120th Congress is seated.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "m12",
    slug: "next-uk-pm-by-2027",
    title: "Will the UK have a new PM before 2027?",
    description: "Will there be a change in UK Prime Minister before January 1, 2027?",
    category: "politics",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 33, multiplier: multiplierFromProb(33) },
      { id: "no", label: "No", probability: 67, multiplier: multiplierFromProb(67) },
    ],
    volume: 512_000,
    comments: 145,
    resolutionDate: daysFromNow(157),
    status: "live",
    priceHistory: genPriceHistory(120, 30, 3),
    liquidity: 210_000,
    rules: "Resolves YES if a new individual is sworn in as UK Prime Minister before Jan 1, 2027.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "m13",
    slug: "gpt6-release-2026",
    title: "OpenAI releases GPT-6 in 2026?",
    description: "Will OpenAI publicly release a model officially branded GPT-6 before the end of 2026?",
    category: "tech",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 22, multiplier: multiplierFromProb(22) },
      { id: "no", label: "No", probability: 78, multiplier: multiplierFromProb(78) },
    ],
    volume: 674_000,
    comments: 203,
    resolutionDate: daysFromNow(156),
    status: "live",
    priceHistory: genPriceHistory(120, 20, 2, 0.01),
    liquidity: 260_000,
    rules: "Resolves YES if OpenAI releases a model officially named GPT-6 to the public before Jan 1, 2027.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "m14",
    slug: "apple-foldable-iphone-2026",
    title: "Apple announces a foldable iPhone in 2026?",
    description: "Will Apple officially announce a foldable iPhone at any event during 2026?",
    category: "tech",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 18, multiplier: multiplierFromProb(18) },
      { id: "no", label: "No", probability: 82, multiplier: multiplierFromProb(82) },
    ],
    volume: 298_000,
    comments: 88,
    resolutionDate: daysFromNow(156),
    status: "live",
    priceHistory: genPriceHistory(90, 16, 2),
    liquidity: 110_000,
    rules: "Resolves YES if Apple announces a foldable iPhone at any official product event in 2026.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "m15",
    slug: "oscars-best-picture-2026",
    title: "Which film wins Best Picture 2026?",
    description: "Which film takes home the Academy Award for Best Picture this year?",
    category: "entertainment",
    kind: "multi",
    outcomes: [
      { id: "a", label: "The Long Horizon", probability: 34, multiplier: multiplierFromProb(34) },
      { id: "b", label: "Static & Sound", probability: 28, multiplier: multiplierFromProb(28) },
      { id: "c", label: "Harbor Lights", probability: 21, multiplier: multiplierFromProb(21) },
      { id: "d", label: "Field Notes", probability: 17, multiplier: multiplierFromProb(17) },
    ],
    volume: 445_000,
    comments: 176,
    resolutionDate: daysFromNow(45),
    status: "live",
    priceHistory: genPriceHistory(90, 30, 3),
    liquidity: 165_000,
    rules: "Resolves to the film announced as Best Picture winner by the Academy of Motion Picture Arts and Sciences.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "m16",
    slug: "taylor-swift-album-2026",
    title: "Taylor Swift releases a new album in 2026?",
    description: "Will Taylor Swift release a new studio album before the end of 2026?",
    category: "entertainment",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 61, multiplier: multiplierFromProb(61) },
      { id: "no", label: "No", probability: 39, multiplier: multiplierFromProb(39) },
    ],
    volume: 212_000,
    comments: 94,
    resolutionDate: daysFromNow(156),
    status: "live",
    priceHistory: genPriceHistory(90, 58, 3),
    liquidity: 88_000,
    rules: "Resolves YES if a new Taylor Swift studio album is released to major streaming platforms before Jan 1, 2027.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "m17",
    slug: "sol-flips-eth-market-cap",
    title: "Solana flips Ethereum market cap in 2026?",
    description: "Will Solana's total market capitalization exceed Ethereum's at any point in 2026?",
    category: "crypto",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 12, multiplier: multiplierFromProb(12) },
      { id: "no", label: "No", probability: 88, multiplier: multiplierFromProb(88) },
    ],
    volume: 389_000,
    comments: 121,
    resolutionDate: daysFromNow(156),
    status: "live",
    priceHistory: genPriceHistory(120, 10, 2),
    liquidity: 145_000,
    rules: "Resolves YES if SOL total market cap exceeds ETH total market cap per CoinGecko at any point before Jan 1, 2027.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "m18",
    slug: "real-madrid-champions-league-2026",
    title: "Real Madrid wins Champions League 2026?",
    description: "Will Real Madrid lift the UEFA Champions League trophy this season?",
    category: "sports",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 24, multiplier: multiplierFromProb(24) },
      { id: "no", label: "No", probability: 76, multiplier: multiplierFromProb(76) },
    ],
    volume: 723_000,
    comments: 187,
    resolutionDate: daysFromNow(72),
    status: "live",
    priceHistory: genPriceHistory(120, 22, 3),
    liquidity: 290_000,
    rules: "Resolves YES if Real Madrid wins the UEFA Champions League final.",
    oracleSource: "Sports Data Oracle — UEFA",
  },
  {
    id: "m19",
    slug: "creator-index-defi-tvl-100b",
    title: "DeFi TVL crosses $100B this quarter?",
    description: "Will total value locked across DeFi protocols exceed $100B before quarter end?",
    category: "finance",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 39, multiplier: multiplierFromProb(39) },
      { id: "no", label: "No", probability: 61, multiplier: multiplierFromProb(61) },
    ],
    volume: 87_500,
    comments: 19,
    resolutionDate: daysFromNow(31),
    status: "live",
    priceHistory: genPriceHistory(60, 36, 3),
    liquidity: 41_000,
    creator: { handle: "0xLumen.eth", avatar: AVATARS[0] },
    rules: "Resolves YES if aggregate DeFi TVL per DefiLlama exceeds $100B on any day before quarter end.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "m20",
    slug: "creator-base-daily-active-addresses",
    title: "Base network hits 2M daily active addresses?",
    description: "Will Base see a single day with 2,000,000+ active addresses this quarter?",
    category: "tech",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 45, multiplier: multiplierFromProb(45) },
      { id: "no", label: "No", probability: 55, multiplier: multiplierFromProb(55) },
    ],
    volume: 64_200,
    comments: 27,
    resolutionDate: daysFromNow(31),
    status: "live",
    priceHistory: genPriceHistory(60, 42, 3),
    liquidity: 33_000,
    creator: { handle: "basemaxi.eth", avatar: AVATARS[1] },
    rules: "Resolves YES if on-chain analytics show 2M+ active addresses on Base in a single day this quarter.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "m21",
    slug: "creator-vitalik-tweet-count",
    title: "Vitalik tweets 50+ times this month?",
    description: "Will @VitalikButerin post 50 or more tweets/X posts this calendar month?",
    category: "crypto",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 66, multiplier: multiplierFromProb(66) },
      { id: "no", label: "No", probability: 34, multiplier: multiplierFromProb(34) },
    ],
    volume: 41_800,
    comments: 33,
    resolutionDate: daysFromNow(9),
    status: "live",
    priceHistory: genPriceHistory(60, 64, 4),
    liquidity: 18_500,
    creator: { handle: "0xLumen.eth", avatar: AVATARS[0] },
    rules: "Resolves YES if the public post count for the specified account is 50 or more by month end, per platform analytics.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "p1",
    slug: "presale-quantum-chip-2027",
    title: "First commercial quantum chip ships in 2027?",
    description: "Will a company ship a commercially available quantum computing chip to consumers in 2027?",
    category: "tech",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 15, multiplier: multiplierFromProb(15) },
      { id: "no", label: "No", probability: 85, multiplier: multiplierFromProb(85) },
    ],
    volume: 4_200,
    comments: 3,
    resolutionDate: daysFromNow(300),
    status: "presale",
    priceHistory: genPriceHistory(20, 15, 2),
    liquidity: 4_200,
    bondStaked: 2_500,
    creator: { handle: "quantumdrift.eth", avatar: AVATARS[2] },
    rules: "Resolves YES if a company publicly ships a quantum chip product to retail consumers in 2027.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "p2",
    slug: "presale-mars-starship-launch",
    title: "SpaceX launches an uncrewed Starship to Mars trajectory?",
    description: "Will SpaceX launch a Starship on a Mars-bound trajectory before the 2026 transfer window closes?",
    category: "tech",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 41, multiplier: multiplierFromProb(41) },
      { id: "no", label: "No", probability: 59, multiplier: multiplierFromProb(59) },
    ],
    volume: 8_900,
    comments: 7,
    resolutionDate: daysFromNow(120),
    status: "presale",
    priceHistory: genPriceHistory(20, 40, 3),
    liquidity: 8_900,
    bondStaked: 3_000,
    creator: { handle: "orbitalvenn", avatar: AVATARS[3] },
    rules: "Resolves YES if SpaceX launches a Starship vehicle on a confirmed Mars transfer trajectory.",
    oracleSource: "UMA Optimistic Oracle",
  },
  {
    id: "p3",
    slug: "presale-messi-retirement",
    title: "Messi announces retirement from professional football?",
    description: "Will Lionel Messi publicly announce his retirement from professional football this year?",
    category: "sports",
    kind: "binary",
    outcomes: [
      { id: "yes", label: "Yes", probability: 19, multiplier: multiplierFromProb(19) },
      { id: "no", label: "No", probability: 81, multiplier: multiplierFromProb(81) },
    ],
    volume: 2_100,
    comments: 2,
    resolutionDate: daysFromNow(156),
    status: "presale",
    priceHistory: genPriceHistory(20, 18, 2),
    liquidity: 2_100,
    bondStaked: 1_500,
    creator: { handle: "footyoracle", avatar: AVATARS[4] },
    rules: "Resolves YES if Messi makes an official public retirement announcement before year end.",
    oracleSource: "UMA Optimistic Oracle",
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, handle: "0xLumen.eth", avatar: AVATARS[0], volume: 4_820_000, profit: 312_400, marketsCreated: 14, winRate: 68 },
  { rank: 2, handle: "orbitalvenn", avatar: AVATARS[3], volume: 3_910_000, profit: 244_100, marketsCreated: 9, winRate: 61 },
  { rank: 3, handle: "footyoracle", avatar: AVATARS[4], volume: 3_402_000, profit: 198_700, marketsCreated: 22, winRate: 57 },
  { rank: 4, handle: "basemaxi.eth", avatar: AVATARS[1], volume: 2_760_000, profit: 152_300, marketsCreated: 6, winRate: 63 },
  { rank: 5, handle: "quantumdrift.eth", avatar: AVATARS[2], volume: 2_310_000, profit: 121_900, marketsCreated: 4, winRate: 55 },
  { rank: 6, handle: "nightowl.base", avatar: AVATARS[5], volume: 1_980_000, profit: 98_400, marketsCreated: 3, winRate: 52 },
  { rank: 7, handle: "graphgremlin", avatar: AVATARS[6], volume: 1_640_000, profit: 74_200, marketsCreated: 11, winRate: 49 },
  { rank: 8, handle: "signalchaser", avatar: AVATARS[7], volume: 1_205_000, profit: 51_600, marketsCreated: 2, winRate: 58 },
  { rank: 9, handle: "driftking.eth", avatar: AVATARS[0], volume: 980_500, profit: 32_100, marketsCreated: 1, winRate: 44 },
  { rank: 10, handle: "vertexvibe", avatar: AVATARS[1], volume: 742_000, profit: 18_900, marketsCreated: 5, winRate: 41 },
];

export const CURRENT_USER = {
  address: "0x7A2f...9E4c",
  handle: "you.base",
  avatar: AVATARS[6],
  balance: 4_250.55,
};

export function genComments(marketId: string): Comment[] {
  const bodies = [
    "This is looking way more likely than the market is pricing in.",
    "Watching the oracle source closely, resolution criteria seem clear.",
    "Loaded up on YES here, liquidity is solid.",
    "Anyone got a source on the latest data point?",
    "NO is criminally underpriced right now imo.",
    "This flipped hard after the news this morning.",
  ];
  return bodies.slice(0, 4).map((body, i) => ({
    id: `${marketId}-c${i}`,
    marketId,
    author: AVATARS[i % AVATARS.length].split("seed=")[1],
    avatar: AVATARS[i % AVATARS.length],
    body,
    timestamp: Date.now() - (i + 1) * 1000 * 60 * (37 + i * 12),
    likes: Math.floor(Math.random() * 40),
  }));
}

export function genHolders(marketId: string, outcomes: { id: string; label: string }[]): Holder[] {
  const holders: Holder[] = [];
  for (let i = 0; i < 8; i++) {
    const outcome = outcomes[i % outcomes.length];
    holders.push({
      handle: AVATARS[i % AVATARS.length].split("seed=")[1],
      avatar: AVATARS[i % AVATARS.length],
      position: outcome.id === "yes" || outcome.id === "home" || outcome.id === "a" ? "yes" : "no",
      shares: Math.floor(500 + Math.random() * 12000),
      value: Math.floor(200 + Math.random() * 8000),
    });
  }
  return holders.sort((a, b) => b.value - a.value);
}

export function genOrderBook(yesPrice: number): OrderBook {
  const build = (mid: number) => {
    const bids = Array.from({ length: 5 }, (_, i) => ({
      price: Math.max(1, Math.round(mid - (i + 1) * 1.2)),
      shares: Math.floor(200 + Math.random() * 4000),
    }));
    const asks = Array.from({ length: 5 }, (_, i) => ({
      price: Math.min(99, Math.round(mid + (i + 1) * 1.2)),
      shares: Math.floor(200 + Math.random() * 4000),
    }));
    return { bids, asks };
  };
  return { yes: build(yesPrice), no: build(100 - yesPrice) };
}

export function genActivity(marketId: string, marketSlug: string, marketTitle: string, outcomes: { id: string; label: string; probability: number }[]): Trade[] {
  return Array.from({ length: 10 }, (_, i) => {
    const outcome = outcomes[i % outcomes.length];
    const side: Trade["side"] = Math.random() > 0.3 ? "buy" : "sell";
    const position: Trade["position"] = outcome.id === "yes" || outcome.id === "home" || outcome.id === "a" ? "yes" : "no";
    const amount = Math.floor(50 + Math.random() * 5000);
    return {
      id: `${marketId}-t${i}`,
      marketId,
      marketSlug,
      marketTitle,
      outcomeId: outcome.id,
      outcomeLabel: outcome.label,
      side,
      position,
      amount,
      shares: Math.floor(amount / (outcome.probability / 100)),
      price: outcome.probability,
      timestamp: Date.now() - (i + 1) * 1000 * 60 * (8 + i * 4),
      trader: AVATARS[i % AVATARS.length].split("seed=")[1],
    };
  });
}
