export const SkeletonBlock = ({ className = "" }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-xl bg-gradient-to-r from-slate-100 via-slate-200/70 to-slate-100 ${className}`}
  />
);

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div
      role="status"
      aria-label="Loading table"
      aria-busy="true"
      className="space-y-3 p-5"
    >
      {Array.from({ length: rows }, (_, row) => (
        <div
          key={row}
          className="grid items-center gap-4 rounded-xl border border-slate-100 p-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }, (_, column) => (
            <SkeletonBlock
              key={column}
              className={`h-4 ${column === 0 ? "w-3/4" : "w-1/2"}`}
            />
          ))}
        </div>
      ))}
      <span className="sr-only">Loading data…</span>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      aria-busy="true"
      className="space-y-6"
    >
      <SkeletonBlock className="h-40 rounded-2xl" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonBlock key={index} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonBlock className="h-72 rounded-2xl" />
        <SkeletonBlock className="h-72 rounded-2xl" />
      </div>
      <span className="sr-only">Loading dashboard…</span>
    </div>
  );
}

export function FormSkeleton({ fields = 6 }) {
  return (
    <div
      role="status"
      aria-label="Loading form"
      aria-busy="true"
      className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
    >
      <SkeletonBlock className="mb-8 h-16" />
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: fields }, (_, index) => (
          <div key={index} className={index > 2 ? "md:col-span-2" : ""}>
            <SkeletonBlock className="mb-2 h-4 w-28" />
            <SkeletonBlock className="h-12 w-full" />
          </div>
        ))}
      </div>
      <SkeletonBlock className="mt-8 h-12 w-40 sm:ml-auto" />
      <span className="sr-only">Loading form…</span>
    </div>
  );
}

export function LoadingSpinner({ className = "h-4 w-4" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
    />
  );
}
