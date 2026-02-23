import { Skeleton } from "@/components/ui/skeleton";

const MovieSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-lg border border-border bg-card p-4"
        >
          <Skeleton className="h-36 w-24 rounded-md bg-muted" />
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <Skeleton className="h-5 w-48 mb-2 bg-muted" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-16 bg-muted rounded-full" />
                <Skeleton className="h-5 w-20 bg-muted rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32 bg-muted" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-md bg-muted" />
                <Skeleton className="h-8 w-8 rounded-md bg-muted" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieSkeleton;
