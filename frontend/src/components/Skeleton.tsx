export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 bg-surface-100 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-surface-100 rounded-lg w-3/4" />
          <div className="h-3 bg-surface-100 rounded-lg w-1/2" />
          <div className="flex gap-2 mt-1">
            <div className="h-3 bg-surface-100 rounded-lg w-20" />
            <div className="h-3 bg-surface-100 rounded-lg w-24" />
          </div>
          <div className="flex gap-1.5 mt-1">
            <div className="h-6 bg-surface-100 rounded-lg w-16" />
            <div className="h-6 bg-surface-100 rounded-lg w-20" />
            <div className="h-6 bg-surface-100 rounded-lg w-14" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-surface-100 rounded-xl" />
      ))}
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="card animate-pulse space-y-6">
      <div className="flex items-center gap-5">
        <div className="h-20 w-20 bg-surface-100 rounded-2xl flex-shrink-0" />
        <div className="space-y-3">
          <div className="h-5 bg-surface-100 rounded-lg w-48" />
          <div className="h-3 bg-surface-100 rounded-lg w-64" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-surface-100 rounded-lg" />
        <div className="h-3 bg-surface-100 rounded-lg w-3/4" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-20 bg-surface-100 rounded-xl" />
        <div className="h-20 bg-surface-100 rounded-xl" />
        <div className="h-20 bg-surface-100 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 bg-surface-100 rounded-xl" />
        <div className="space-y-2">
          <div className="h-6 bg-surface-100 rounded-lg w-16" />
          <div className="h-3 bg-surface-100 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}
