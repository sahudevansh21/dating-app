import Link from "next/link";
import { CompassIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center gap-4 py-24 text-center">
      <CompassIcon className="size-10 text-muted-foreground" />
      <h1 className="text-xl font-semibold">This market drifted off the grid</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist, or the market has since resolved and been archived.
      </p>
      <Button asChild>
        <Link href="/markets">Browse Markets</Link>
      </Button>
    </div>
  );
}
