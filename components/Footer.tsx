export default function Footer() {
  return (
    <footer className="mt-16 sm:mt-24" role="contentinfo" aria-label="Site footer">
      {/* Double rule at top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="double-rule" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center space-y-4">
          {/* Edition */}
          <p className="font-mono text-[13px] tracking-[0.3em] text-plate-border uppercase">
            First Edition, 2025
          </p>

          {/* Coordinates */}
          <p className="font-mono text-[13px] tracking-[0.2em] text-sage">
            45.10&deg;N, 123.98&deg;W
          </p>

          {/* Brand + Location */}
          <p className="font-mono text-[13px] tracking-[0.25em] text-plate-border uppercase">
            Ghost Forest Surf Club &middot; Neskowin, Oregon
          </p>

          {/* Botanical ornament divider */}
          <div className="flex items-center justify-center gap-3 pt-4" aria-hidden="true">
            <div className="w-12 border-t border-plate-border/40" />
            <span className="font-serif text-xs text-plate-border/50 italic">&#167;</span>
            <div className="w-12 border-t border-plate-border/40" />
          </div>

          {/* Publisher line */}
          <p className="font-mono text-[13px] tracking-[0.2em] text-plate-border/70 uppercase pt-1">
            Published by Ghost Forest Press, Neskowin
          </p>

          {/* Colophon note */}
          <p className="font-serif text-[13px] italic text-sage/80 max-w-md mx-auto leading-relaxed pt-2">
            Cataloged and illustrated in the field. All specimens sourced from the cold waters
            and ancient forests of the northern Oregon coast.
          </p>
        </div>
      </div>

      {/* Closing double-rule */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="double-rule" />
      </div>
    </footer>
  );
}
