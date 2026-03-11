'use client';

import { useState, useCallback } from 'react';
import { ShopifyProduct, ShopifyCollection } from '@/types/shopify';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import EditorialCard, { getEditorial } from './EditorialCard';
import TextMoment, { getFieldNote } from './TextMoment';

interface FeedLayoutProps {
  initialProducts: ShopifyProduct[];
  collections: ShopifyCollection[];
}

export default function FeedLayout({
  initialProducts,
  collections,
}: FeedLayoutProps) {
  const [products, setProducts] = useState(initialProducts);
  const [activeCollection, setActiveCollection] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCollectionChange = useCallback(async (handle: string) => {
    setActiveCollection(handle);
    setLoading(true);
    setError(false);

    try {
      const params = handle !== 'all' ? `?collection=${handle}` : '';
      const res = await fetch(`/api/products${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Build the interleaved feed: products + editorials every 4 + text moments every 7
  const buildFeed = () => {
    const feed: React.ReactNode[] = [];
    let editorialIndex = 0;
    let fieldNoteIndex = 0;
    let globalIndex = 0;

    products.forEach((product, productIndex) => {
      // Insert editorial every 4 products (after 4th, 8th, 12th...)
      if (productIndex > 0 && productIndex % 4 === 0) {
        const editorial = getEditorial(editorialIndex);
        feed.push(
          <div
            key={`editorial-${editorialIndex}`}
            className="col-span-1 md:col-span-2"
          >
            <EditorialCard {...editorial} />
          </div>
        );
        editorialIndex++;
        globalIndex++;
      }

      // Insert text moment every 7 products (after 7th, 14th...)
      if (productIndex > 0 && productIndex % 7 === 0) {
        const note = getFieldNote(fieldNoteIndex);
        feed.push(
          <div key={`note-${fieldNoteIndex}`} className="col-span-1">
            <TextMoment content={note} observationIndex={fieldNoteIndex} />
          </div>
        );
        fieldNoteIndex++;
        globalIndex++;
      }

      // Product card
      feed.push(
        <div key={product.id} className="col-span-1">
          <ProductCard product={product} index={productIndex} />
        </div>
      );
      globalIndex++;
    });

    return feed;
  };

  return (
    <>
      <Navbar
        collections={collections}
        activeCollection={activeCollection}
        onCollectionChange={handleCollectionChange}
      />

      <main className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Catalog introduction with volume numbering and double-rule framing */}
        <div className="max-w-xl mx-auto mb-12 sm:mb-16">
          <div className="double-rule mb-6" />
          <div className="text-center space-y-3">
            <p className="font-mono text-[11px] tracking-[0.35em] text-plate-border/60 uppercase">
              Vol. I &middot; First Edition
            </p>
            <p className="font-mono text-[11px] tracking-[0.3em] text-plate-border uppercase">
              Specimen Catalog
            </p>
            <p className="font-serif text-sm italic text-sage max-w-md mx-auto leading-relaxed">
              A curated collection of goods for the coldwater practitioner,
              selected for durability, function, and coastal provenance.
              Compiled from fieldwork along the northern Oregon littoral, 44&ndash;46&deg;N.
            </p>
          </div>
          <div className="double-rule mt-6" />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <div className="space-y-3">
              <p className="font-mono text-[11px] tracking-[0.25em] text-plate-border uppercase">
                &#9678;
              </p>
              <p className="font-mono text-[11px] tracking-[0.2em] text-sage animate-pulse uppercase">
                Cataloging specimens&hellip;
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-20">
            <div className="botanical-border max-w-md mx-auto p-8 space-y-3">
              <p className="font-mono text-[11px] tracking-[0.2em] text-plate-border/50">
                &#9678;
              </p>
              <p className="font-mono text-[11px] tracking-[0.2em] text-forest uppercase">
                Catalog Temporarily Unavailable
              </p>
              <p className="font-serif text-sm italic text-sage/80">
                We were unable to retrieve specimens at this time. Please try again.
              </p>
              <button
                onClick={() => handleCollectionChange(activeCollection)}
                className="mt-4 px-6 py-3 bg-forest text-parchment font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-forest/90 transition-colors min-h-[44px]"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <div className="space-y-3">
              <p className="font-mono text-[11px] tracking-[0.2em] text-plate-border/50">
                &#9678;
              </p>
              <p className="font-mono text-[11px] tracking-[0.2em] text-sage uppercase">
                No specimens found in this collection.
              </p>
              <p className="font-serif text-xs italic text-sage/60">
                Try selecting a different genus from the navigation above.
              </p>
            </div>
          </div>
        )}

        {/* Feed grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {buildFeed()}
          </div>
        )}
      </main>
    </>
  );
}
