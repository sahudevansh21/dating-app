"use client";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
          >
            {!connected ? (
              <Button onClick={openConnectModal} size="sm" className="gap-2">
                <Wallet className="size-4" />
                Connect Wallet
              </Button>
            ) : chain.unsupported ? (
              <Button onClick={openChainModal} size="sm" variant="no">
                Wrong network
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button onClick={openChainModal} variant="outline" size="sm" className="hidden sm:inline-flex">
                  {chain.name}
                </Button>
                <Button onClick={openAccountModal} variant="secondary" size="sm" className="font-mono">
                  {account.displayName}
                  {account.displayBalance ? ` · ${account.displayBalance}` : ""}
                </Button>
              </div>
            )}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
