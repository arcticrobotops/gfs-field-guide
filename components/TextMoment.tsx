interface TextMomentProps {
  content: string;
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

export default function TextMoment({ content }: TextMomentProps) {
  const lines = content.split('\n');

  return (
    <div className="botanical-border bg-parchment p-5 sm:p-6">
      {/* Header */}
      <p className="font-mono text-[10px] tracking-[0.3em] text-plate-border uppercase small-caps mb-4">
        Field Notes
      </p>

      {/* Decorative rule */}
      <div className="border-t border-plate-border/40 mb-4" />

      {/* Content */}
      <div className="space-y-2">
        {lines.map((line, i) => {
          const [label, ...rest] = line.split(':');
          const value = rest.join(':').trim();
          if (value) {
            return (
              <p key={i} className="font-serif text-sm text-ink leading-relaxed">
                <span className="font-mono text-[10px] tracking-[0.15em] text-sage uppercase">
                  {label}:
                </span>{' '}
                <span className="italic text-forest">{value}</span>
              </p>
            );
          }
          return (
            <p key={i} className="font-serif text-sm italic text-forest leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>

      {/* Bottom decorative rule */}
      <div className="border-t border-plate-border/40 mt-4" />
    </div>
  );
}
