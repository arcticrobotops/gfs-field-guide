export default function PDPSkeleton() {
  return (
    <main className="min-h-screen bg-parchment animate-pulse">
      {/* Header bar */}
      <div className="border-b border-plate-border/40 px-4 sm:px-8 py-3">
        <div className="h-4 w-40 bg-plate-border/10" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Specimen plate header */}
        <div className="botanical-border p-6 sm:p-8 mb-8">
          {/* Plate number */}
          <div className="text-center mb-6">
            <div className="h-3 w-28 bg-plate-border/15 mx-auto mb-3" />
            <div className="border-t border-plate-border/30 mx-auto w-24 mb-4" />
            <div className="h-8 w-56 bg-plate-border/10 mx-auto mb-3" />
            <div className="h-3 w-44 bg-sage/15 mx-auto" />
          </div>

          {/* Double rule */}
          <div className="border-t border-plate-border/40 mb-1" />
          <div className="border-t border-plate-border/20 mb-6" />

          {/* Image gallery */}
          <div className="mb-6">
            <div className="botanical-border p-2 mb-3">
              <div className="aspect-[4/5] bg-plate-border/8" />
              <div className="h-3 w-32 bg-plate-border/10 mx-auto mt-2" />
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-20 sm:w-20 sm:h-24 bg-plate-border/8 border border-plate-border/20" />
              ))}
            </div>
          </div>

          {/* Double rule */}
          <div className="border-t border-plate-border/40 mb-1" />
          <div className="border-t border-plate-border/20 mb-6" />

          {/* Data table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="h-3 w-20 bg-plate-border/15 mb-2" />
                <div className="h-3 w-28 bg-plate-border/8" />
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="border-t border-plate-border/40 mb-1" />
          <div className="border-t border-plate-border/20 mb-4" />
          <div className="h-3 w-20 bg-plate-border/15 mb-3" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-plate-border/8" />
            <div className="h-3 w-5/6 bg-plate-border/8" />
            <div className="h-3 w-2/3 bg-plate-border/8" />
          </div>
        </div>
      </div>
    </main>
  );
}
