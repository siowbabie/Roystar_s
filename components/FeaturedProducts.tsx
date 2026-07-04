'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BadgeCheck, AlertCircle } from 'lucide-react';
import { fetchFeaturedProducts } from '@/lib/products';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

// ─── Skeleton card shown while loading ───────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-3xl border border-neutral-100 overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-neutral-100" />
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-neutral-100 rounded-full w-16" />
          <div className="h-4 bg-neutral-100 rounded-full w-3/4" />
          <div className="h-3 bg-neutral-100 rounded-full w-full" />
          <div className="h-3 bg-neutral-100 rounded-full w-5/6" />
        </div>
        <div className="mt-auto pt-4 border-t border-neutral-100 flex gap-2">
          <div className="flex-1 h-10 bg-neutral-100 rounded-xl" />
          <div className="flex-1 h-10 bg-neutral-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Featured Products section ───────────────────────────────────────────────
export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headingRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Fetch from Supabase on mount
  useEffect(() => {
    fetchFeaturedProducts()
      .then(setProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Scroll-in animation for heading
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll-in animation for distributor banner
  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 200);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="products"
      className="section-padding bg-neutral-50"
      aria-labelledby="products-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div
          ref={headingRef}
          style={{ opacity: 0, transform: 'translateY(24px)' }}
          className="flex flex-col items-center text-center gap-4 mb-10"
        >
          <span className="px-4 py-1.5 rounded-full bg-[#68d4b5]/10 text-[#3fbf9c] text-xs font-semibold tracking-widest uppercase">
            Our Collection
          </span>
          <h2
            id="products-heading"
            className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight"
          >
            Featured Instruments
          </h2>
          <p className="text-neutral-500 text-lg max-w-xl leading-relaxed">
            Each instrument is selected for its tonal character, craftsmanship, and enduring value.
          </p>
        </div>

        {/* Official distributor banner */}
        <div
          ref={bannerRef}
          style={{ opacity: 0, transform: 'translateY(16px)' }}
          className="flex items-center justify-center gap-3 mb-12 px-6 py-3.5 rounded-2xl bg-white border border-[#68d4b5]/25 shadow-sm w-fit mx-auto"
        >
          <BadgeCheck size={18} className="text-[#68d4b5] shrink-0" />
          <p className="text-sm font-medium text-neutral-600">
            <span className="font-bold text-neutral-900">Roystar</span> is the official authorised Yamaha distributor in Cambodia — all instruments are genuine, warranted, and expertly supported.
          </p>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={22} className="text-red-400" />
            </div>
            <p className="text-neutral-700 font-semibold">Could not load products</p>
            <p className="text-sm text-neutral-400 max-w-sm">{error}</p>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-neutral-500 font-medium">No featured products found.</p>
            <p className="text-sm text-neutral-400">Check back soon — we're adding new instruments.</p>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* View all CTA */}
        <div className="flex justify-center mt-12">
          <Link
            href="/products"
            id="view-all-products"
            className="btn-outline"
            aria-label="View all products"
          >
            View All Instruments
          </Link>
        </div>
      </div>
    </section>
  );
}
