import { create } from "zustand";
import type { Market, Outcome } from "@/lib/types";

interface TradeStoreState {
  isTradeModalOpen: boolean;
  market: Market | null;
  outcome: Outcome | null;
  side: "buy" | "sell";
  amount: string;
  openTrade: (market: Market, outcome: Outcome, side?: "buy" | "sell") => void;
  closeTrade: () => void;
  setSide: (side: "buy" | "sell") => void;
  setOutcome: (outcome: Outcome) => void;
  setAmount: (amount: string) => void;
}

export const useTradeStore = create<TradeStoreState>((set) => ({
  isTradeModalOpen: false,
  market: null,
  outcome: null,
  side: "buy",
  amount: "",
  openTrade: (market, outcome, side = "buy") =>
    set({ isTradeModalOpen: true, market, outcome, side, amount: "" }),
  closeTrade: () => set({ isTradeModalOpen: false }),
  setSide: (side) => set({ side }),
  setOutcome: (outcome) => set({ outcome }),
  setAmount: (amount) => set({ amount }),
}));

interface PresaleStoreState {
  createdMarketIds: string[];
  addCreatedMarket: (id: string) => void;
}

export const usePresaleStore = create<PresaleStoreState>((set) => ({
  createdMarketIds: [],
  addCreatedMarket: (id) => set((s) => ({ createdMarketIds: [...s.createdMarketIds, id] })),
}));
