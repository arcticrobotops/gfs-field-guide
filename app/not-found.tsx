import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-parchment flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center botanical-border p-8 sm:p-12">
        <span className="font-mono text-xs tracking-[0.3em] text-plate-border uppercase block mb-4">
          Specimen Record
        </span>
        <div className="border-t border-plate-border/30 mx-auto w-24 mb-6" />

        <p className="font-mono text-[64px] leading-none text-forest/20 font-bold mb-2">
          404
        </p>
        <h1 className="font-serif text-xl text-forest mb-4">
          Specimen Not Located
        </h1>
        <p className="font-mono text-xs text-plate-border leading-relaxed tracking-wide mb-8">
          The specimen you are seeking has not been catalogued, or may have been removed from the collection.
        </p>

        <div className="border-t border-plate-border/40 mb-1" />
        <div className="border-t border-plate-border/20 mb-6" />

        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-plate-border uppercase hover:text-forest transition-colors min-h-[44px]"
        >
          &larr; Return to Field Guide
        </Link>
      </div>
    </main>
  );
}
