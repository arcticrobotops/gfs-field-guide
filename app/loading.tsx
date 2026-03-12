export default function Loading() {
  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero skeleton */}
      <section className="relative overflow-hidden bg-forest">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-24 text-center">
          <div className="h-4 w-32 bg-parchment/10 rounded mx-auto mb-8 animate-pulse" />
          <div className="h-10 w-64 bg-parchment/15 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-4 w-48 bg-parchment/10 rounded mx-auto mb-6 animate-pulse" />
          <div className="h-5 w-80 bg-parchment/10 rounded mx-auto animate-pulse" />
        </div>
      </section>

      {/* Grid skeleton */}
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-xl mx-auto mb-12 sm:mb-16 text-center">
          <div className="h-3 w-40 bg-plate-border/15 rounded mx-auto mb-3 animate-pulse" />
          <div className="h-3 w-32 bg-plate-border/15 rounded mx-auto mb-3 animate-pulse" />
          <div className="h-4 w-72 bg-plate-border/10 rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="col-span-1">
              <div className="border border-plate-border/30 p-3">
                <div className="aspect-square bg-plate-border/10 animate-pulse" />
                <div className="mt-4 space-y-2 px-1">
                  <div className="h-3 w-3/4 bg-plate-border/15 animate-pulse rounded-sm" />
                  <div className="h-3 w-1/2 bg-plate-border/10 animate-pulse rounded-sm" />
                </div>
                <div className="mt-3 px-1 pb-1">
                  <div className="h-3 w-1/4 bg-plate-border/15 animate-pulse rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
