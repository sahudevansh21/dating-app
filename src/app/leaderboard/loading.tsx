import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container flex flex-col gap-6 py-8">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}
