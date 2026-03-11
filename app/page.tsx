import Image from 'next/image';
import { getProducts, getCollections } from '@/lib/shopify';
import FeedLayout from '@/components/FeedLayout';
import Footer from '@/components/Footer';

export const revalidate = 60;

export default async function Home() {
  const [productData, collections] = await Promise.all([
    getProducts(50),
    getCollections(),
  ]);

  // Pick up to 3 hero images from first products
  const heroImages = productData.products
    .slice(0, 3)
    .map((p) => p.images.edges[0]?.node)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-forest">
        {/* Background image from first product */}
        {heroImages[0] && (
          <div className="absolute inset-0">
            <Image
              src={heroImages[0].url}
              alt={heroImages[0].altText || 'Ghost Forest Surf Club'}
              fill
              className="object-cover opacity-30"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/40 to-forest" />
          </div>
        )}

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-24 text-center">
          {/* Double rule top */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 sm:w-24 border-t border-parchment/30" />
            <span className="font-mono text-[11px] tracking-[0.3em] text-parchment/50 uppercase">Est. 2025</span>
            <div className="w-16 sm:w-24 border-t border-parchment/30" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-parchment tracking-wide leading-tight mb-4">
            Ghost Forest
            <br />
            Surf Club
          </h1>

          <p className="font-mono text-[11px] tracking-[0.3em] text-parchment/60 uppercase mb-6">
            A Field Guide to Coastal Goods
          </p>

          <p className="font-serif text-base sm:text-lg italic text-parchment/80 max-w-lg mx-auto leading-relaxed mb-8">
            Specimen catalog of coldwater surf goods, curated from the northern Oregon coast. First Edition.
          </p>

          {/* Hero product thumbnails */}
          {heroImages.length > 1 && (
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {heroImages.map((img, i) => (
                <div key={i} className="relative w-20 h-24 sm:w-28 sm:h-36 border border-parchment/20 overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.altText || 'Featured specimen'}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Double rule bottom */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <div className="w-16 sm:w-24 border-t border-parchment/30" />
            <span className="font-mono text-[11px] text-parchment/40">45.10&deg;N, 123.98&deg;W</span>
            <div className="w-16 sm:w-24 border-t border-parchment/30" />
          </div>
        </div>
      </section>

      <FeedLayout
        initialProducts={productData.products}
        collections={collections}
      />
      <Footer />
    </div>
  );
}
