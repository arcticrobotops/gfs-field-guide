'use client';

import { useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface ProductImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions: Array<{ name: string; value: string }>;
}

interface ProductDetailProps {
  title: string;
  images: ProductImage[];
  variants: Variant[];
  shopifyUrl: string;
}

export default function ProductDetail({
  title,
  images,
  variants,
  shopifyUrl,
}: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Build option groups from variants
  const optionGroups = variants.reduce<Record<string, string[]>>((acc, variant) => {
    variant.selectedOptions.forEach(({ name, value }) => {
      if (!acc[name]) acc[name] = [];
      if (!acc[name].includes(value)) acc[name].push(value);
    });
    return acc;
  }, {});

  const optionNames = Object.keys(optionGroups);

  // Initialize selected options to first variant's options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    if (variants.length === 0) return {};
    const first = variants[0];
    const opts: Record<string, string> = {};
    first.selectedOptions.forEach(({ name, value }) => {
      opts[name] = value;
    });
    return opts;
  });

  // Find matching variant
  const selectedVariant = variants.find((v) =>
    v.selectedOptions.every(
      (opt) => selectedOptions[opt.name] === opt.value
    )
  );

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
  };

  const selectedPrice = selectedVariant
    ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
    : null;

  const isAvailable = selectedVariant?.availableForSale ?? false;

  // Build Shopify checkout URL with variant
  const checkoutUrl = selectedVariant
    ? `${shopifyUrl}?variant=${selectedVariant.id.split('/').pop()}`
    : shopifyUrl;

  const selectedImage = images[selectedImageIndex];

  const ctaClasses = `w-full text-center font-mono text-[13px] tracking-[0.15em] sm:tracking-[0.2em] uppercase py-4 transition-colors min-h-[44px] flex items-center justify-center`;

  return (
    <>
      {/* Interactive Image Gallery */}
      <div className="mb-6">
        {/* Main image */}
        {selectedImage ? (
          <div className="botanical-border p-2 mb-3">
            <div className="relative aspect-[4/5] bg-parchment-dark overflow-hidden">
              <Image
                src={selectedImage.url}
                alt={selectedImage.altText || title}
                fill
                sizes="(max-width: 640px) 100vw, 600px"
                className="object-cover"
                priority
              />
            </div>
            <p className="font-mono text-xs tracking-[0.15em] text-plate-border text-center mt-2 uppercase">
              Plate {String.fromCharCode(65 + selectedImageIndex)}.{' '}
              {selectedImage.altText || title}
            </p>
          </div>
        ) : (
          <div className="aspect-[4/5] bg-parchment-dark flex items-center justify-center botanical-border mb-3">
            <p className="font-mono text-xs text-plate-border tracking-[0.15em] uppercase">
              No specimen image available
            </p>
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-1">
            {images.map((image, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`relative snap-start shrink-0 w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border-2 transition-colors ${
                  i === selectedImageIndex
                    ? 'border-forest'
                    : 'border-plate-border/30 hover:border-plate-border'
                }`}
                aria-label={`View image ${i + 1}: ${image.altText || title}`}
              >
                <Image
                  src={image.url}
                  alt={image.altText || `${title} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Variant Selection */}
      {optionNames.length > 0 && !(optionNames.length === 1 && optionGroups[optionNames[0]].length === 1 && optionGroups[optionNames[0]][0] === 'Default Title') && (
        <div className="mb-6">
          <div className="border-t border-plate-border/40 mb-1" />
          <div className="border-t border-plate-border/20 mb-4" />

          {optionNames.map((optionName) => (
            <div key={optionName} className="mb-4">
              <span className="font-mono text-xs tracking-[0.15em] sm:tracking-[0.2em] text-plate-border uppercase block mb-2">
                {optionName}
              </span>
              <div className="flex flex-wrap gap-2">
                {optionGroups[optionName].map((value) => {
                  const isSelected = selectedOptions[optionName] === value;
                  // Check if this option value is available in any variant with current other selections
                  const testOptions = { ...selectedOptions, [optionName]: value };
                  const matchingVariant = variants.find((v) =>
                    v.selectedOptions.every(
                      (opt) => testOptions[opt.name] === opt.value
                    )
                  );
                  const optionAvailable = matchingVariant?.availableForSale ?? false;

                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(optionName, value)}
                      disabled={!optionAvailable && !isSelected}
                      className={`min-w-[44px] min-h-[44px] px-3 py-2 font-mono text-[13px] tracking-wide border transition-colors ${
                        isSelected
                          ? 'bg-forest text-parchment border-forest'
                          : optionAvailable
                          ? 'border-plate-border text-ink hover:border-forest'
                          : 'border-plate-border/30 text-plate-border/50 line-through cursor-not-allowed'
                      }`}
                      aria-label={`Select ${optionName}: ${value}`}
                      aria-pressed={isSelected}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Selected variant price */}
          {selectedPrice && (
            <div className="mt-3">
              <span className="font-mono text-lg text-forest">{selectedPrice}</span>
              {!isAvailable && (
                <span className="font-mono text-xs text-plate-border ml-2 uppercase tracking-wider">
                  Sold Out
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Desktop Acquisition button */}
      <div className="hidden sm:block botanical-border p-4 mb-8">
        {isAvailable ? (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${ctaClasses} bg-forest text-parchment hover:bg-forest/90`}
          >
            Acquire Specimen
          </a>
        ) : (
          <span
            className={`${ctaClasses} bg-plate-border/20 text-plate-border cursor-not-allowed`}
            aria-disabled="true"
          >
            Currently Unavailable
          </span>
        )}
      </div>

      {/* Sticky Mobile CTA */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-parchment border-t border-plate-border/40 py-4 px-3 safe-area-bottom">
        {isAvailable ? (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full font-mono text-[13px] tracking-[0.15em] sm:tracking-[0.2em] uppercase py-4 transition-colors min-h-[44px] flex items-center justify-center gap-2 bg-forest text-parchment hover:bg-forest/90"
          >
            <span className="max-w-[180px] truncate">Acquire Specimen</span>
            {selectedPrice && <span className="text-sm">{`\u2014 ${selectedPrice}`}</span>}
          </a>
        ) : (
          <span
            className="w-full font-mono text-[13px] tracking-[0.15em] sm:tracking-[0.2em] uppercase py-4 transition-colors min-h-[44px] flex items-center justify-center gap-2 bg-plate-border/20 text-plate-border cursor-not-allowed"
            aria-disabled="true"
          >
            Currently Unavailable
          </span>
        )}
      </div>

      {/* Spacer for sticky CTA on mobile */}
      <div className="sm:hidden h-20" />
    </>
  );
}
