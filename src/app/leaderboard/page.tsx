import { Trophy } from "lucide-react";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { getLeaderboard } from "@/lib/api";

export default async function LeaderboardPage() {
  const entries = await getLeaderboard();

  return (
    <div className="container flex flex-col gap-6 py-8">
      <div className="flex items-center gap-2">
        <Trophy className="size-6 text-cta" />
        <div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Top traders and market creators, ranked by volume.</p>
        </div>
      </div>
      <LeaderboardTable entries={entries} />
    </div>
  );
}
