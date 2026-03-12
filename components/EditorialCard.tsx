import Image from 'next/image';

interface EditorialCardProps {
  plateNumber: string;
  imageUrl: string;
  alt: string;
  caption: string;
  location?: string;
}

const EDITORIALS: EditorialCardProps[] = [
  {
    plateNumber: 'PLATE I.',
    imageUrl: 'https://images.unsplash.com/photo-1502680390548-bdbac40d7154?w=800&q=80',
    alt: 'Oregon coast morning surf',
    caption: 'Dawn patrol, Neskowin. The ghost forest emerges at low tide, silver snags standing sentinel against the winter swell.',
    location: 'Neskowin, OR \u2014 45.10\u00b0N',
  },
  {
    plateNumber: 'PLATE II.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    alt: 'Coastal fog rolling over headlands',
    caption: 'Marine layer, Cape Lookout. Persistent fog typical of the northern Oregon littoral zone, June through August.',
    location: 'Cape Lookout, OR \u2014 45.34\u00b0N',
  },
  {
    plateNumber: 'PLATE III.',
    imageUrl: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=80',
    alt: 'Tidepools at sunset',
    caption: 'Intertidal survey, Cascade Head. Exposed basalt shelves reveal diverse populations during extreme minus tides.',
    location: 'Cascade Head, OR \u2014 45.06\u00b0N',
  },
  {
    plateNumber: 'PLATE IV.',
    imageUrl: 'https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=800&q=80',
    alt: 'Surfer walking on misty beach',
    caption: 'Field observation, Pacific City. Solitary practitioner, dorymen tradition. 5/4mm specimen required, water temperature 48\u201352\u00b0F.',
    location: 'Pacific City, OR \u2014 45.20\u00b0N',
  },
];

export function getEditorial(index: number): EditorialCardProps {
  return EDITORIALS[index % EDITORIALS.length];
}

export default function EditorialCard({
  plateNumber,
  imageUrl,
  alt,
  caption,
  location,
}: EditorialCardProps) {
  return (
    <div className="botanical-border bg-parchment p-4 sm:p-5">
      {/* Plate number */}
      <p className="font-mono text-xs tracking-[0.125em] sm:tracking-[0.25em] text-plate-border uppercase mb-2">
        {plateNumber}
      </p>

      {/* Rule before image */}
      <div className="border-t border-plate-border/30 mb-4" />

      {/* Full-bleed image with proper width calc */}
      <div
        className="relative w-[calc(100%+2rem)] sm:w-[calc(100%+2.5rem)] -ml-4 sm:-ml-5 overflow-hidden"
        style={{ height: 'clamp(220px, 28vw, 320px)' }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
        />
      </div>

      {/* Rule after image */}
      <div className="border-t border-plate-border/30 mt-4 mb-3" />

      {/* Caption block */}
      <p className="font-serif text-sm italic text-forest/80 leading-relaxed">
        {caption}
      </p>

      {/* Location annotation */}
      {location && (
        <p className="font-mono text-xs tracking-[0.2em] text-plate-border/70 uppercase mt-3">
          {location}
        </p>
      )}
    </div>
  );
}
