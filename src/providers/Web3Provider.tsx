"use client";

import * as React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";

const config = getDefaultConfig({
  appName: "Oracle Pit",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "oracle-pit-dev-placeholder",
  chains: [base],
  ssr: true,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

function RainbowKitWithTheme({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <RainbowKitProvider
      theme={
        resolvedTheme === "light"
          ? lightTheme({ accentColor: "#F5A623", accentColorForeground: "#0A0A0A", borderRadius: "medium" })
          : darkTheme({ accentColor: "#F5A623", accentColorForeground: "#0A0A0A", borderRadius: "medium" })
      }
      modalSize="compact"
    >
      {children}
    </RainbowKitProvider>
  );
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitWithTheme>{children}</RainbowKitWithTheme>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
