'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-2xl mb-4 text-ink">
          Something went wrong
        </h1>
        <p className="font-sans text-sm text-ink/60 mb-8">
          We hit a snag loading the page. This usually resolves on retry.
        </p>
        <button
          onClick={() => reset()}
          className="font-sans text-xs uppercase tracking-widest px-6 py-3 border border-ink/20 hover:bg-ink hover:text-parchment transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
