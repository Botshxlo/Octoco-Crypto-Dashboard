function SkeletonRow({ delay }: { delay: number }) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-8 flex justify-center">
        <div className="h-4 w-4 rounded bg-accent animate-pulse" />
      </div>
      <div className="flex flex-1 items-center gap-3">
        <div className="size-10 rounded-full bg-accent animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-accent animate-pulse" />
          <div className="h-3 w-10 rounded bg-accent animate-pulse" />
        </div>
      </div>
      <div className="w-32 flex justify-end">
        <div className="h-4 w-24 rounded bg-accent animate-pulse" />
      </div>
      <div className="w-24 flex justify-end">
        <div className="h-6 w-16 rounded-full bg-accent animate-pulse" />
      </div>
      <div className="hidden w-36 md:flex justify-end">
        <div className="h-4 w-24 rounded bg-accent animate-pulse" />
      </div>
      <div className="hidden w-28 lg:flex justify-end">
        <div className="h-4 w-20 rounded bg-accent animate-pulse" />
      </div>
      <div className="w-6" />
    </div>
  );
}

export default function CoinTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="overflow-hidden">
      <div className="flex items-center gap-4 border-b border-border/50 px-4 py-3">
        <div className="w-8 flex justify-center">
          <div className="h-3 w-4 rounded bg-accent animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="h-3 w-12 rounded bg-accent animate-pulse" />
        </div>
        <div className="w-32 flex justify-end">
          <div className="h-3 w-12 rounded bg-accent animate-pulse" />
        </div>
        <div className="w-24 flex justify-end">
          <div className="h-3 w-8 rounded bg-accent animate-pulse" />
        </div>
        <div className="hidden w-36 md:flex justify-end">
          <div className="h-3 w-20 rounded bg-accent animate-pulse" />
        </div>
        <div className="hidden w-28 lg:flex justify-end">
          <div className="h-3 w-16 rounded bg-accent animate-pulse" />
        </div>
        <div className="w-6" />
      </div>
      <div className="divide-y divide-border/30">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} delay={i * 50} />
        ))}
      </div>
    </div>
  );
}
