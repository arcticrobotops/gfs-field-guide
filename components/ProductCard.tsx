import Image from 'next/image';
import Link from 'next/link';
import { ShopifyProduct } from '@/types/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
  const currencyCode = product.priceRange.minVariantPrice.currencyCode;
  const collection = product.collections.edges[0]?.node;
  const specimenNumber = String(index + 1).padStart(3, '0');

  return (
    <Link
      href={`/products/${product.handle}`}
      className="botanical-border specimen-card block bg-parchment p-4 sm:p-5 cursor-pointer group"
    >
      {/* Specimen number header */}
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-xs tracking-[0.15em] sm:tracking-[0.2em] text-plate-border uppercase">
          Specimen No. {specimenNumber}
        </span>
        {product.productType && (
          <span className="font-mono text-xs tracking-[0.1em] sm:tracking-[0.15em] text-sage uppercase">
            {product.productType}
          </span>
        )}
      </div>

      {/* Thin rule separator */}
      <div className="border-t border-plate-border/30 mb-4" />

      {/* Product image */}
      {image && (
        <div className="relative w-full overflow-hidden bg-parchment-dark mb-4"
          style={{ height: 'clamp(200px, 28vw, 320px)' }}
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
      <h3 className="font-serif text-lg sm:text-xl text-forest leading-tight mb-2 line-clamp-2">
        {product.title}
      </h3>

      {/* Taxonomy line with italic labels */}
      {collection && (
        <p className="font-mono text-[13px] text-sage tracking-wide sm:tracking-wider mb-3">
          <span className="italic">Genus:</span>{' '}
          <span className="text-forest">{collection.title}</span>
          {product.productType && (
            <>
              {' '}&middot;{' '}
              <span className="italic">Form:</span>{' '}
              <span className="text-forest">{product.productType}</span>
            </>
          )}
        </p>
      )}

      {/* Thin rule before price */}
      <div className="border-t border-plate-border/30 mb-3 mt-1" />

      {/* Price with USD annotation */}
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-sm text-ink">
          ${price.toFixed(0)}
        </span>
        {maxPrice > price && (
          <span className="font-mono text-[13px] text-plate-border">
            &ndash; ${maxPrice.toFixed(0)}
          </span>
        )}
        <span className="font-mono text-[13px] tracking-[0.1em] sm:tracking-[0.15em] text-plate-border/70 uppercase ml-auto">
          {currencyCode}
        </span>
      </div>
    </Link>
  );
}
