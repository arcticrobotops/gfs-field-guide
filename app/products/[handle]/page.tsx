import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductByHandle, getProducts } from '@/lib/shopify';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const { products } = await getProducts(50);
    return products.map((product) => ({
      handle: product.handle,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: 'Specimen Not Found' };
  return {
    title: `${product.title} | A Field Guide to Coastal Goods`,
    description: product.description?.slice(0, 160) || `Specimen: ${product.title}. Documented by Ghost Forest Surf Club.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const images = product.images.edges.map((e) => e.node);
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode,
    minimumFractionDigits: 0,
  }).format(price);
  const collection = product.collections?.edges[0]?.node;
  const shopifyUrl = product.onlineStoreUrl || `https://gfsurfclub.myshopify.com/products/${product.handle}`;

  return (
    <main className="min-h-screen bg-parchment">
      {/* Header bar */}
      <div className="border-b border-plate-border/40 px-4 sm:px-8 py-3">
        <Link href="/" className="inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.2em] text-plate-border uppercase hover:text-forest transition-colors min-h-[44px]">
          &larr; Return to Field Guide
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Specimen plate header */}
        <div className="botanical-border p-6 sm:p-8 mb-8">
          {/* Plate number and taxonomy */}
          <div className="text-center mb-6">
            <span className="font-mono text-[11px] tracking-[0.3em] text-plate-border uppercase block mb-2">
              Specimen Record
            </span>
            <div className="border-t border-plate-border/30 mx-auto w-24 mb-4" />
            <h1 className="font-serif text-2xl sm:text-3xl text-forest leading-tight mb-3">
              {product.title}
            </h1>
            {collection && (
              <p className="font-mono text-[11px] text-sage tracking-wide">
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
          </div>

          {/* Double rule */}
          <div className="border-t border-plate-border/40 mb-1" />
          <div className="border-t border-plate-border/20 mb-6" />

          {/* Image plates */}
          <div className={`grid gap-4 mb-6 ${images.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-lg mx-auto'}`}>
            {images.length > 0 ? (
              images.map((image, i) => (
                <div key={i} className="botanical-border p-2">
                  <div className="relative aspect-[4/5] bg-parchment-dark overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.altText || product.title}
                      fill
                      sizes={images.length > 1 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, 600px"}
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                  <p className="font-mono text-[11px] tracking-[0.15em] text-plate-border text-center mt-2 uppercase">
                    Plate {String.fromCharCode(65 + i)}. {image.altText || product.title}
                  </p>
                </div>
              ))
            ) : (
              <div className="aspect-[4/5] bg-parchment-dark flex items-center justify-center botanical-border">
                <p className="font-mono text-[11px] text-plate-border tracking-[0.15em] uppercase">
                  No specimen image available
                </p>
              </div>
            )}
          </div>

          {/* Specimen data table */}
          <div className="border-t border-plate-border/40 mb-1" />
          <div className="border-t border-plate-border/20 mb-6" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div>
              <span className="font-mono text-[11px] tracking-[0.2em] text-plate-border uppercase block mb-1">
                Classification
              </span>
              <span className="font-mono text-[12px] text-forest">
                {product.productType || 'Unclassified'}
              </span>
            </div>
            <div>
              <span className="font-mono text-[11px] tracking-[0.2em] text-plate-border uppercase block mb-1">
                Acquisition Cost
              </span>
              <span className="font-mono text-[12px] text-forest">
                {formattedPrice} {product.priceRange.minVariantPrice.currencyCode}
              </span>
            </div>
            {product.tags && product.tags.length > 0 && (
              <div>
                <span className="font-mono text-[11px] tracking-[0.2em] text-plate-border uppercase block mb-1">
                  Tags
                </span>
                <span className="font-mono text-[12px] text-forest">
                  {product.tags.slice(0, 3).join(', ')}
                </span>
              </div>
            )}
            <div>
              <span className="font-mono text-[11px] tracking-[0.2em] text-plate-border uppercase block mb-1">
                Availability
              </span>
              <span className="font-mono text-[12px] text-forest">
                {product.variants?.edges?.some(e => e.node.availableForSale) ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Description as field notes */}
          {product.description && (
            <>
              <div className="border-t border-plate-border/40 mb-1" />
              <div className="border-t border-plate-border/20 mb-4" />
              <div>
                <span className="font-mono text-[11px] tracking-[0.2em] text-plate-border uppercase block mb-3">
                  Field Notes
                </span>
                <p className="font-sans text-sm text-ink/80 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Acquisition button */}
        <div className="botanical-border p-4 mb-8">
          <a
            href={shopifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-forest text-parchment text-center font-mono text-[11px] tracking-[0.2em] uppercase py-4 hover:bg-forest/90 transition-colors"
          >
            Acquire Specimen
          </a>
        </div>

        {/* Colophon footer */}
        <div className="text-center py-6">
          <div className="border-t border-plate-border/30 mx-auto w-16 mb-4" />
          <p className="font-mono text-[11px] tracking-[0.2em] text-plate-border uppercase">
            A Field Guide to Coastal Goods &middot; Ghost Forest Surf Club
          </p>
        </div>
      </div>
    </main>
  );
}
