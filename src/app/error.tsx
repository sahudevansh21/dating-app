"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center gap-4 py-24 text-center">
      <AlertTriangle className="size-10 text-no" />
      <h1 className="text-xl font-semibold">Something broke on our side</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The market data didn&apos;t load. This is a demo error boundary — try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
