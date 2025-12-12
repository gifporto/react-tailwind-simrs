import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton({ lines = 4 }) {
  return (
    <div className="space-y-3">
      {[...Array(lines)].map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}
