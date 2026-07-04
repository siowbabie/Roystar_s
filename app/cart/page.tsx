'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowLeft, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal, getCartCount, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-neutral-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-6 w-full pt-32 pb-24 flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-neutral-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-neutral-200 rounded col-span-2"></div>
                  <div className="h-2 bg-neutral-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-neutral-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const cartTotal = getCartTotal();
  const cartCount = getCartCount();
  const shippingFee = cartTotal > 2000 ? 0 : 150;
  const orderTotal = cartTotal + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-6 w-full pt-32 pb-24">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>

        <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-8">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center shadow-sm max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-6">
              <Trash2 size={28} className="text-neutral-300" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
            <p className="text-neutral-500 max-w-md mx-auto mb-8">
              Looks like you haven&apos;t added any products to your cart yet. Let&apos;s head back to our premium collection to find the perfect instrument.
            </p>
            <Link href="/products" className="btn-primary">
              Browse Collection
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
                  <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                    Product Details
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                <ul className="flex flex-col divide-y divide-neutral-100">
                  {items.map((item) => (
                    <li key={item.product.id} className="flex flex-col sm:flex-row gap-6 py-6 first:pt-0 last:pb-0">
                      {/* Product Image */}
                      <Link
                        href={`/products/${item.product.id}`}
                        className="relative w-full sm:w-28 aspect-square sm:h-28 shrink-0 bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100"
                      >
                        <Image
                          src={item.product.images?.[0] || item.product.imagePlaceholder}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </Link>

                      {/* Product details */}
                      <div className="flex flex-col flex-1 justify-between gap-4 sm:gap-2">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#68d4b5] uppercase tracking-widest mb-1">
                              {item.product.category}
                            </span>
                            <Link
                              href={`/products/${item.product.id}`}
                              className="text-base font-bold text-neutral-900 hover:text-[#68d4b5] transition-colors leading-tight"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-xs text-neutral-400 mt-1">
                              In Stock: {item.product.stock} available
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden h-10 bg-white">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.product.id, item.quantity - 1);
                                } else {
                                  removeItem(item.product.id);
                                }
                              }}
                              className="w-10 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 text-center text-sm font-semibold text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                if (item.quantity < item.product.stock) {
                                  updateQuantity(item.product.id, item.quantity + 1);
                                }
                              }}
                              disabled={item.quantity >= item.product.stock}
                              className="w-10 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors disabled:opacity-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Prices */}
                          <div className="text-right">
                            <p className="text-sm text-neutral-400 font-medium">Subtotal</p>
                            <p className="text-lg font-bold text-neutral-900">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6 lg:sticky lg:top-32">
              <h2 className="text-lg font-bold text-neutral-900">Order Summary</h2>

              <div className="flex flex-col gap-4 py-2 border-b border-neutral-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500">Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''})</span>
                  <span className="font-semibold text-neutral-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-500 flex items-center gap-1">
                    Shipping
                    <HelpCircle size={14} className="text-neutral-400" />
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {shippingFee === 0 ? (
                      <span className="text-[#0ea27e] font-semibold">Free Delivery</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-xs text-neutral-400 italic">
                    Free shipping on orders over $2,000. Add {formatPrice(2000 - cartTotal)} more to unlock free shipping.
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-neutral-900">Total Price</span>
                <span className="text-2xl font-bold text-neutral-900">{formatPrice(orderTotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 bg-neutral-900 rounded-full font-bold text-white hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/20 hover:-translate-y-0.5 transform duration-200 mt-2"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              {/* Secure Checkout Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 font-medium">
                <ShieldCheck size={16} className="text-[#68d4b5]" />
                Secure Checkout Powered by Roystar Cambodia
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
