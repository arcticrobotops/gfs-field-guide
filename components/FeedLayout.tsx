'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const handleCollectionChange = useCallback(async (handle: string) => {
    setActiveCollection(handle);
    setLoading(true);

    try {
      const params = handle !== 'all' ? `?collection=${handle}` : '';
      const res = await fetch(`/api/products${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
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
            <TextMoment content={note} />
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

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Catalog introduction */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="font-mono text-[10px] tracking-[0.3em] text-plate-border uppercase mb-2">
            Specimen Catalog
          </p>
          <p className="font-serif text-sm italic text-sage max-w-lg mx-auto leading-relaxed">
            A curated collection of goods for the coldwater practitioner.
            Each specimen selected for durability, function, and coastal provenance.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <p className="font-mono text-[11px] tracking-[0.2em] text-sage animate-pulse uppercase">
              Cataloging specimens...
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-[11px] tracking-[0.2em] text-sage uppercase">
              No specimens found in this collection.
            </p>
          </div>
        )}

        {/* Feed grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {buildFeed()}
          </div>
        )}
      </main>
    </>
  );
}
