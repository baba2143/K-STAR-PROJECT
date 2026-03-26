import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-[#1a1a1a] animate-pulse rounded", className)}
      {...props}
    />
  );
}

// Chart entry skeleton
function ChartEntrySkeleton() {
  return (
    <div className="flex items-center gap-0 px-3 sm:px-5 py-2.5 border-b border-[#1a1a1a]">
      <div className="flex-shrink-0 w-12 flex items-center justify-center mr-2">
        <Skeleton className="w-10 h-10" />
      </div>
      <div className="flex-shrink-0 w-5 mr-2">
        <Skeleton className="w-4 h-4 rounded-full" />
      </div>
      <div className="flex-shrink-0 w-11 h-11 mr-3">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex-1 min-w-0 mr-4">
        <Skeleton className="h-4 w-3/4 mb-1.5" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="hidden sm:flex items-center gap-5 flex-shrink-0 mr-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center w-10">
            <Skeleton className="h-3 w-6 mx-auto mb-1" />
            <Skeleton className="h-5 w-8 mx-auto" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Skeleton className="w-7 h-7 rounded-full" />
        <Skeleton className="w-7 h-7 rounded-full" />
      </div>
    </div>
  );
}

// Chart list skeleton
function ChartListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="animate-in fade-in duration-300">
      {[...Array(count)].map((_, i) => (
        <ChartEntrySkeleton key={i} />
      ))}
    </div>
  );
}

// Album card skeleton
function AlbumCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-square rounded-lg mb-2" />
      <Skeleton className="h-4 w-3/4 mb-1" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

// Detail page skeleton
function DetailPageSkeleton() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="relative px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-5 w-16 rounded" />
              <Skeleton className="h-5 w-16 rounded" />
            </div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 py-6 border-t border-[#1e1e1e]">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <AlbumCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export { Skeleton, ChartEntrySkeleton, ChartListSkeleton, AlbumCardSkeleton, DetailPageSkeleton };
