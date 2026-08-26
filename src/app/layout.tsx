import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Web3Provider } from "@/providers/Web3Provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CategoryStrip } from "@/components/layout/CategoryStrip";
import { PriceTicker } from "@/components/layout/PriceTicker";
import { MobileTabBar } from "@/components/layout/MobileTabBar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oracle Pit — Trade the Future",
  description:
    "Oracle Pit is a prediction market on Base. Trade YES/NO shares on crypto, sports, politics, and creator-owned markets.",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(spaceGrotesk.variable, jetbrainsMono.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <Web3Provider>
            <TooltipProvider delayDuration={200}>
              <PriceTicker />
              <Navbar />
              <CategoryStrip />
              <main className="pb-16 md:pb-0">{children}</main>
              <Footer />
              <MobileTabBar />
            </TooltipProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
