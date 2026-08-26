"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Bitcoin,
  Trophy,
  Gamepad2,
  LineChart,
  Landmark,
  Cpu,
  Clapperboard,
} from "lucide-react";

const CATEGORIES = [
  { slug: "all", label: "All Markets", icon: LayoutGrid },
  { slug: "crypto", label: "Crypto", icon: Bitcoin },
  { slug: "sports", label: "Sports", icon: Trophy },
  { slug: "esports", label: "Esports", icon: Gamepad2 },
  { slug: "finance", label: "Finance", icon: LineChart },
  { slug: "politics", label: "Politics", icon: Landmark },
  { slug: "tech", label: "Tech", icon: Cpu },
  { slug: "entertainment", label: "Entertainment", icon: Clapperboard },
];

export function CategoryStrip() {
  const pathname = usePathname();

  return (
    <div className="border-b border-border bg-background/60">
      <div className="container">
        <div className="no-scrollbar flex items-center gap-1 overflow-x-auto py-2">
          {CATEGORIES.map(({ slug, label, icon: Icon }) => {
            const href = slug === "all" ? "/markets" : `/${slug}`;
            const active = pathname === href || (slug === "all" && pathname === "/markets");
            return (
              <Link
                key={slug}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active && "border-border bg-secondary text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
