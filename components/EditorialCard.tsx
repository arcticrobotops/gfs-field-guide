import Image from 'next/image';

interface EditorialCardProps {
  plateNumber: string;
  imageUrl: string;
  alt: string;
  caption: string;
}

const EDITORIALS: EditorialCardProps[] = [
  {
    plateNumber: 'PLATE I.',
    imageUrl: 'https://images.unsplash.com/photo-1502680390548-bdbac40d7154?w=800&q=80',
    alt: 'Oregon coast morning surf',
    caption: 'Dawn patrol, Neskowin. The ghost forest emerges at low tide, silver snags standing sentinel against the winter swell.',
  },
  {
    plateNumber: 'PLATE II.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    alt: 'Coastal fog rolling over headlands',
    caption: 'Marine layer, Cape Lookout. Persistent fog typical of the northern Oregon littoral zone, June through August.',
  },
  {
    plateNumber: 'PLATE III.',
    imageUrl: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=80',
    alt: 'Tidepools at sunset',
    caption: 'Intertidal survey, Cascade Head. Exposed basalt shelves reveal diverse populations during extreme minus tides.',
  },
  {
    plateNumber: 'PLATE IV.',
    imageUrl: 'https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=800&q=80',
    alt: 'Surfer walking on misty beach',
    caption: 'Field observation, Pacific City. Solitary practitioner, dorymen tradition. 5/4mm specimen required, water temperature 48-52\u00b0F.',
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
}: EditorialCardProps) {
  return (
    <div className="botanical-border bg-parchment p-4 sm:p-5">
      {/* Plate number */}
      <p className="font-mono text-[11px] tracking-[0.25em] text-plate-border uppercase mb-3">
        {plateNumber}
      </p>

      {/* Full-bleed image */}
      <div className="relative w-full overflow-hidden -mx-4 sm:-mx-5"
        style={{ height: 'clamp(200px, 25vw, 300px)' }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw"
        />
      </div>

      {/* Caption */}
      <p className="font-serif text-sm italic text-sage leading-relaxed mt-4">
        {caption}
      </p>
    </div>
  );
}
