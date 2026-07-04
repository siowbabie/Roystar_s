'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getCartTotal, getCartCount } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, setIsOpen]);

  if (!isMounted) return null;

  const cartTotal = getCartTotal();
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cartTotal);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-neutral-900" strokeWidth={2} />
            <h2 className="text-lg font-bold text-neutral-900">Your Cart</h2>
            <span className="flex items-center justify-center w-6 h-6 ml-1 rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600">
              {getCartCount()}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-2">
                <ShoppingBag size={32} className="text-neutral-300" strokeWidth={1.5} />
              </div>
              <p className="text-lg font-semibold text-neutral-900">Your cart is empty</p>
              <p className="text-sm text-neutral-500 max-w-[250px] leading-relaxed">
                Looks like you haven't added any instruments to your cart yet.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 btn-primary text-sm px-6 py-2.5"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => {
                const formattedPrice = new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(item.product.price);

                return (
                  <li key={item.product.id} className="flex gap-4 group">
                    {/* Item Image */}
                    <div className="relative w-20 h-20 shrink-0 bg-neutral-50 rounded-xl overflow-hidden border border-neutral-100">
                      <Image
                        src={item.product.images[0] || item.product.imagePlaceholder}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-col flex-1 justify-between py-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-[#68d4b5] uppercase tracking-widest mb-1">
                            {item.product.category}
                          </span>
                          <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                            {item.product.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1 -mt-1 -mr-1"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden h-8">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.product.id, item.quantity - 1);
                              } else {
                                removeItem(item.product.id);
                              }
                            }}
                            className="w-8 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              if (item.quantity < item.product.stock) {
                                updateQuantity(item.product.id, item.quantity + 1);
                              }
                            }}
                            disabled={item.quantity >= item.product.stock}
                            className="w-8 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-bold text-neutral-900">
                          {formattedPrice}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-neutral-100 p-6 bg-neutral-50/50 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-500 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-neutral-900">{formattedTotal}</span>
            </div>
            <p className="text-xs text-neutral-500 mb-6">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="w-full flex justify-center py-3.5 border-2 border-neutral-200 rounded-full text-sm font-bold text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-neutral-900 rounded-full text-sm font-bold text-white hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/20 hover:shadow-neutral-900/30 hover:-translate-y-0.5 transform duration-200"
              >
                Checkout
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
