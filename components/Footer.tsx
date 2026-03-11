export default function Footer() {
  return (
    <footer className="mt-16 sm:mt-24">
      {/* Double rule at top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-plate-border" />
        <div className="mt-1 border-t border-plate-border" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center space-y-4">
          {/* Edition */}
          <p className="font-mono text-[11px] tracking-[0.3em] text-plate-border uppercase">
            First Edition, 2024
          </p>

          {/* Coordinates */}
          <p className="font-mono text-[11px] tracking-[0.2em] text-sage">
            45.10&deg;N, 123.98&deg;W
          </p>

          {/* Brand + Location */}
          <p className="font-mono text-[10px] tracking-[0.25em] text-plate-border uppercase">
            Ghost Forest Surf Club &mdash; Neskowin, Oregon
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="w-8 border-t border-plate-border/50" />
            <span className="font-mono text-[9px] text-plate-border/60 tracking-[0.2em]">
              &#10043;
            </span>
            <div className="w-8 border-t border-plate-border/50" />
          </div>

          {/* Colophon note */}
          <p className="font-serif text-[11px] italic text-sage/70 max-w-md mx-auto leading-relaxed pt-2">
            Cataloged and illustrated in the field. All specimens sourced from the cold waters
            and ancient forests of the northern Oregon coast.
          </p>
        </div>
      </div>
    </footer>
  );
}
