import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductByHandle, getProducts } from '@/lib/shopify';
import ProductDetail from '@/components/ProductDetail';

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
  const variants = product.variants?.edges?.map((e) => e.node) || [];
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.priceRange.minVariantPrice.currencyCode,
    minimumFractionDigits: 0,
  }).format(price);
  const collection = product.collections?.edges[0]?.node;
  const shopifyUrl = product.onlineStoreUrl || `https://gfsurfclub.myshopify.com/products/${product.handle}`;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || '',
    image: images.map((img) => img.url),
    brand: {
      '@type': 'Brand',
      name: 'Ghost Forest Surf Club',
    },
    offers: variants.length > 0
      ? variants.map((v) => ({
          '@type': 'Offer',
          price: v.price.amount,
          priceCurrency: v.price.currencyCode,
          availability: v.availableForSale
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: shopifyUrl,
        }))
      : {
          '@type': 'Offer',
          price: product.priceRange.minVariantPrice.amount,
          priceCurrency: product.priceRange.minVariantPrice.currencyCode,
          url: shopifyUrl,
        },
  };

  return (
    <main className="min-h-screen bg-parchment">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header bar */}
      <div className="border-b border-plate-border/40 px-4 sm:px-8 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.2em] text-plate-border uppercase hover:text-forest transition-colors min-h-[44px]"
        >
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

          {/* Interactive image gallery + variant selection */}
          <ProductDetail
            title={product.title}
            images={images}
            variants={variants}
            shopifyUrl={shopifyUrl}
            handle={product.handle}
          />

          {/* Specimen data table */}
          <div className="border-t border-plate-border/40 mb-1" />
          <div className="border-t border-plate-border/20 mb-6" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
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
            <div>
              <span className="font-mono text-[11px] tracking-[0.2em] text-plate-border uppercase block mb-1">
                Availability
              </span>
              <span className="font-mono text-[12px] text-forest">
                {variants.some((v) => v.availableForSale) ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            {product.tags && product.tags.length > 0 && (
              <div className="col-span-2 sm:col-span-3">
                <span className="font-mono text-[11px] tracking-[0.2em] text-plate-border uppercase block mb-1">
                  Tags
                </span>
                <span className="font-mono text-[12px] text-forest">
                  {product.tags.join(', ')}
                </span>
              </div>
            )}
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
