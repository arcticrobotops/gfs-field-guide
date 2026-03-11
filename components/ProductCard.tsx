import Image from 'next/image';
import { ShopifyProduct } from '@/types/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
  const collection = product.collections.edges[0]?.node;
  const specimenNumber = String(index + 1).padStart(3, '0');

  return (
    <a
      href={product.onlineStoreUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="botanical-border specimen-card block bg-parchment p-4 sm:p-5 cursor-pointer group"
    >
      {/* Specimen number */}
      <div className="flex items-baseline justify-between mb-3">
        <span className="font-mono text-[11px] tracking-[0.2em] text-plate-border">
          No. {specimenNumber}
        </span>
        {product.productType && (
          <span className="font-mono text-[9px] tracking-[0.15em] text-sage uppercase">
            {product.productType}
          </span>
        )}
      </div>

      {/* Product image */}
      {image && (
        <div className="relative w-full overflow-hidden bg-parchment-dark mb-4"
          style={{ height: 'clamp(260px, 30vw, 340px)' }}
        >
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Product title (specimen name) */}
      <h3 className="font-serif text-lg sm:text-xl text-forest leading-tight mb-2">
        {product.title}
      </h3>

      {/* Taxonomy line */}
      {collection && (
        <p className="font-mono text-[11px] italic text-sage tracking-wide mb-3">
          &mdash; Genus: {collection.title}
        </p>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-sm text-ink">
          ${price.toFixed(0)}
        </span>
        {maxPrice > price && (
          <span className="font-mono text-[11px] text-plate-border">
            &ndash; ${maxPrice.toFixed(0)}
          </span>
        )}
      </div>
    </a>
  );
}
