'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Minus, Plus, ShoppingCart, ArrowLeft, ShieldCheck, Truck, AlertCircle } from 'lucide-react';
import { fetchProductById } from '@/lib/products';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ─── Loading skeleton for product detail page ─────────────────────────────────
function ProductDetailSkeleton() {
  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start animate-pulse">
      <div className="w-full aspect-square rounded-[2.5rem] bg-neutral-100" />
      <div className="flex flex-col gap-6 pt-4">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-neutral-100 rounded-full" />
          <div className="h-6 w-24 bg-neutral-100 rounded-full" />
        </div>
        <div className="h-10 w-3/4 bg-neutral-100 rounded-xl" />
        <div className="h-8 w-24 bg-neutral-100 rounded-xl" />
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-neutral-100 rounded-full w-full" />
          <div className="h-4 bg-neutral-100 rounded-full w-5/6" />
          <div className="h-4 bg-neutral-100 rounded-full w-4/5" />
        </div>
        <div className="h-40 bg-neutral-100 rounded-3xl" />
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundState, setNotFoundState] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProductById(resolvedParams.id)
      .then((p) => {
        if (!p) {
          setNotFoundState(true);
        } else {
          setProduct(p);
        }
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  // notFound() must be called during render — use redirect approach
  if (notFoundState) {
    notFound();
  }

  const formattedPrice = product
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(product.price)
    : '';

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-6 w-full pt-32 pb-24">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Collection
        </Link>

        {/* Loading state */}
        {loading && <ProductDetailSkeleton />}

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={26} className="text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Failed to load product</h2>
            <p className="text-sm text-neutral-500 max-w-md">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchProductById(resolvedParams.id)
                  .then((p) => { if (!p) setNotFoundState(true); else setProduct(p); })
                  .catch((err: Error) => setError(err.message))
                  .finally(() => setLoading(false));
              }}
              className="mt-2 px-6 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Product content */}
        {!loading && !error && product && (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: Image Gallery */}
            <div className="flex flex-col gap-4 sticky top-32">
              <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden bg-neutral-50 border border-neutral-100">
                <Image
                  src={product.images?.[0] || product.imagePlaceholder}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 ${
                        i === 0 ? 'border-[#68d4b5]' : 'border-transparent hover:border-neutral-200'
                      }`}
                    >
                      <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#68d4b5]/10 text-[#3fbf9c] text-xs font-semibold tracking-widest uppercase">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold tracking-widest uppercase">
                      {product.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.1] mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-neutral-900">{formattedPrice}</p>
              </div>

              {/* Description */}
              <div className="mb-10">
                <p className="text-lg text-neutral-500 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              {product.specs && product.specs.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-neutral-900 tracking-widest uppercase mb-4">
                    Specifications
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="flex flex-col border-b border-neutral-100 pb-3">
                        <dt className="text-xs text-neutral-400 font-medium mb-1">{spec.label}</dt>
                        <dd className="text-sm font-semibold text-neutral-900">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Add to Cart Actions */}
              <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900">Availability</span>
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0ea27e]">
                      <span className="w-2 h-2 rounded-full bg-[#0ea27e]" />
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity */}
                  <div className="flex items-center justify-between border border-neutral-200 bg-white rounded-xl h-14 px-2 sm:w-32 shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-semibold text-neutral-900 w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-xl font-bold transition-all duration-200 shadow-lg disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed hover:-translate-y-0.5 transform ${
                      added
                        ? 'bg-[#0ea27e] text-white shadow-[#0ea27e]/20'
                        : 'bg-[#68d4b5] text-white hover:bg-[#3fbf9c] shadow-[#68d4b5]/20 hover:shadow-[#68d4b5]/30'
                    }`}
                  >
                    <ShoppingCart size={20} />
                    {product.stock === 0 ? 'Out of Stock' : added ? 'Added ✓' : 'Add to Cart'}
                  </button>
                </div>
              </div>

              {/* Value Props */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#68d4b5]/10 text-[#3fbf9c] shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900">Genuine Yamaha</span>
                    <span className="text-xs text-neutral-500">Official Cambodian distributor with full warranty.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#68d4b5]/10 text-[#3fbf9c] shrink-0">
                    <Truck size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900">Secure Delivery</span>
                    <span className="text-xs text-neutral-500">Professional transport for delicate instruments.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
