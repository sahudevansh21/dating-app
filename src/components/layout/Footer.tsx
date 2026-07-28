import Link from "next/link";
import { Target } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Markets", href: "/markets" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Create a Market", href: "/create" },
      { label: "Pre-Sale", href: "/presale" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Crypto", href: "/crypto" },
      { label: "Sports", href: "/sports" },
      { label: "Politics", href: "/politics" },
      { label: "Tech", href: "/tech" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Oracle Sources", href: "#" },
      { label: "Fees", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 pb-20 pt-12 md:pb-12">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg bg-cta/15 text-cta">
                <Target className="size-4.5" />
              </span>
              Oracle Pit
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The future has a price. Trade YES/NO shares on tomorrow&apos;s outcomes, on Base.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Oracle Pit. All markets are for informational demonstration purposes.</p>
          <p className="font-mono">Built on Base</p>
        </div>
      </div>
    </footer>
  );
}
