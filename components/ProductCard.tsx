'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, index * 120);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div
      ref={cardRef}
      id={`product-card-${product.id}`}
      style={{ opacity: 0, transform: 'translateY(32px)' }}
      className="card-hover group relative flex flex-col bg-white rounded-3xl border border-neutral-100 overflow-hidden cursor-pointer"
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#68d4b5] text-white text-xs font-semibold shadow-sm">
          {product.badge}
        </span>
      )}

      {/* Product image */}
      <div className="relative w-full aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={product.images?.[0] || product.imagePlaceholder}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          priority={index < 2}
        />
        {/* Subtle gradient overlay at bottom for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-[#68d4b5] font-semibold uppercase tracking-widest">
            {product.category}
          </p>
          <h3 className="text-base font-bold text-neutral-900 leading-snug">
            {product.name}
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-4 border-t border-neutral-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 font-medium">From</p>
              <p className="text-xl font-bold text-neutral-900">{formattedPrice}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 text-sm font-semibold hover:border-neutral-900 hover:text-neutral-900 transition-colors"
            >
              View Details
            </Link>
            <button
              id={`add-to-cart-${product.id}`}
              aria-label={`Add ${product.name} to cart`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(product);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#68d4b5]/10 text-[#3fbf9c] text-sm font-semibold hover:bg-[#68d4b5] hover:text-white transition-all duration-300"
            >
              <ShoppingCart size={16} strokeWidth={2} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
