interface TextMomentProps {
  content: string;
  observationIndex?: number;
}

const FIELD_NOTES: string[] = [
  'Habitat: Exposed headlands and pocket coves, 44\u201346\u00b0N\nRange: Cape Meares to Cascade Head\nSeason: Year-round, peak autumn swells\nNotes: Consistent NW groundswell, 6\u201312 ft faces. Water temp 48\u201354\u00b0F.',
  'Habitat: Spruce-hemlock canopy, coastal dune interface\nRange: Neskowin to Pacific City corridor\nSeason: Optimal September through November\nNotes: Prevailing NW winds shift offshore pre-dawn. Glass conditions before 9 AM.',
  'Habitat: Rocky intertidal, basalt bench formations\nRange: Three Capes Scenic Loop\nSeason: Low tide windows, all seasons\nNotes: Anemones, sea stars, chiton colonies. Observe from established paths.',
  'Habitat: River mouth sandbars, shifting channels\nRange: Nestucca River to Salmon River estuaries\nSeason: Late summer through early winter\nNotes: Sand deposits create ephemeral breaks. Check swell direction and tide.',
];

export function getFieldNote(index: number): string {
  return FIELD_NOTES[index % FIELD_NOTES.length];
}

export default function TextMoment({ content, observationIndex }: TextMomentProps) {
  const lines = content.split('\n');
  const obsNumber = observationIndex !== undefined
    ? String(observationIndex + 1).padStart(2, '0')
    : undefined;

  return (
    <div className="botanical-border bg-parchment p-5 sm:p-6">
      {/* Header with observation number */}
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-mono text-[11px] tracking-[0.3em] text-plate-border uppercase small-caps">
          Field Notes
        </p>
        {obsNumber && (
          <span className="font-mono text-[11px] tracking-[0.15em] text-plate-border/60">
            Obs. {obsNumber}
          </span>
        )}
      </div>

      {/* Compass ornament rule */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 border-t border-plate-border/40" />
        <span className="font-mono text-[11px] text-plate-border/50 leading-none">&#9678;</span>
        <div className="flex-1 border-t border-plate-border/40" />
      </div>

      {/* Content with improved label/value contrast */}
      <div className="space-y-2.5">
        {lines.map((line, i) => {
          const colonIndex = line.indexOf(':');
          if (colonIndex === -1) {
            return (
              <p key={i} className="font-serif text-sm italic text-forest leading-relaxed">
                {line}
              </p>
            );
          }
          const label = line.slice(0, colonIndex);
          const value = line.slice(colonIndex + 1).trim();
          return (
            <p key={i} className="text-sm leading-relaxed">
              <span className="font-mono text-[11px] tracking-[0.15em] text-plate-border uppercase">
                {label}
              </span>
              <span className="font-mono text-[11px] text-plate-border/50 mx-1">/</span>
              <span className="font-serif italic text-forest">{value}</span>
            </p>
          );
        })}
      </div>

      {/* Bottom compass ornament rule */}
      <div className="flex items-center gap-2 mt-4">
        <div className="flex-1 border-t border-plate-border/40" />
        <span className="font-mono text-[11px] text-plate-border/50 leading-none">&#9678;</span>
        <div className="flex-1 border-t border-plate-border/40" />
      </div>
    </div>
  );
}
