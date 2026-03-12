'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ShopifyCollection } from '@/types/shopify';

interface NavbarProps {
  collections: ShopifyCollection[];
  activeCollection: string;
  onCollectionChange: (handle: string) => void;
}

export default function Navbar({
  collections,
  activeCollection,
  onCollectionChange,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const filteredCollections = collections.filter(
    (c) => c.handle !== 'frontpage'
  );

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Focus first item when menu opens; handle Escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      // Focus first button inside mobile menu
      const firstBtn = menuRef.current?.querySelector('button');
      firstBtn?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeMenu();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [mobileMenuOpen, closeMenu]);

  return (
    <header className="sticky top-0 z-50 bg-parchment">
      {/* Top double rule */}
      <div className="double-rule" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Brand name */}
        <div className="py-3 text-center">
          <p className="font-mono text-[13px] tracking-[0.25em] text-sage uppercase">
            Ghost Forest Surf Club
          </p>
        </div>

        {/* Main banner */}
        <div className="double-rule" />

        <div className="py-4 sm:py-5 text-center">
          <span className="font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.15em] text-forest uppercase block">
            A Field Guide to Coastal Goods
          </span>
          <p className="font-mono text-[13px] tracking-[0.15em] sm:tracking-[0.3em] text-plate-border uppercase mt-1">
            First Edition &middot; Oregon Coast &middot; 45.10&deg;N
          </p>
        </div>

        <div className="double-rule" />

        {/* Category filters - desktop */}
        <nav aria-label="Collection filters" className="hidden md:flex items-center justify-center gap-2 py-3 flex-wrap">
          <button
            onClick={() => onCollectionChange('all')}
            aria-current={activeCollection === 'all' ? 'true' : undefined}
            className={`px-3 py-2 min-h-[44px] font-mono text-xs tracking-[0.15em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-umber focus-visible:ring-offset-2 ${
              activeCollection === 'all'
                ? 'bg-forest text-parchment'
                : 'text-ink hover:text-umber'
            }`}
          >
            All Specimens
          </button>
          {filteredCollections.map((collection) => {
            const isActive = activeCollection === collection.handle;
            return (
              <button
                key={collection.handle}
                onClick={() => onCollectionChange(collection.handle)}
                aria-current={isActive ? 'true' : undefined}
                className={`px-3 py-2 min-h-[44px] font-mono text-xs tracking-[0.15em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-umber focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-forest text-parchment'
                    : 'text-ink hover:text-umber'
                }`}
              >
                {collection.title}
              </button>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center justify-between py-3">
          <span className="font-mono text-xs tracking-[0.15em] text-sage uppercase">
            {activeCollection === 'all'
              ? 'All Specimens'
              : filteredCollections.find((c) => c.handle === activeCollection)
                  ?.title || 'All Specimens'}
          </span>
          <button
            ref={toggleRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-ink focus-visible:ring-2 focus-visible:ring-umber focus-visible:ring-offset-2"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <nav
          ref={menuRef}
          id="mobile-menu"
          aria-label="Mobile collection filters"
          aria-hidden={!mobileMenuOpen}
          {...(!mobileMenuOpen ? { inert: '' as unknown as boolean } : {})}
          className={`md:hidden border-t border-plate-border py-3 space-y-1 ${mobileMenuOpen ? '' : 'hidden'}`}
        >
          <button
            onClick={() => {
              onCollectionChange('all');
              closeMenu();
            }}
            aria-current={activeCollection === 'all' ? 'true' : undefined}
            className={`block w-full text-left px-3 py-3 min-h-[44px] font-mono text-xs tracking-[0.15em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-umber focus-visible:ring-offset-2 ${
              activeCollection === 'all'
                ? 'bg-forest text-parchment'
                : 'text-ink hover:text-umber'
            }`}
          >
            All Specimens
          </button>
          {filteredCollections.map((collection) => {
            const isActive = activeCollection === collection.handle;
            return (
              <button
                key={collection.handle}
                onClick={() => {
                  onCollectionChange(collection.handle);
                  closeMenu();
                }}
                aria-current={isActive ? 'true' : undefined}
                className={`block w-full text-left px-3 py-3 min-h-[44px] font-mono text-xs tracking-[0.15em] uppercase transition-colors focus-visible:ring-2 focus-visible:ring-umber focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-forest text-parchment'
                    : 'text-ink hover:text-umber'
                }`}
              >
                {collection.title}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom double rule */}
      <div className="double-rule" />
    </header>
  );
}
