'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, ShieldCheck, ShoppingBag, CreditCard, Wallet, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ABA Pay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-neutral-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-6 w-full pt-32 pb-24 flex items-center justify-center">
          <div className="text-neutral-500 font-medium">Loading checkout...</div>
        </div>
        <Footer />
      </main>
    );
  }

  const cartTotal = getCartTotal();
  const shippingFee = cartTotal > 2000 ? 0 : 150;
  const orderTotal = cartTotal + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Generate unique order number (e.g. RS-20260704-1234)
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `RS-${dateStr}-${randomDigits}`;

      // 2. Insert order into the database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          delivery_address: address,
          payment_method: paymentMethod,
          total_price: orderTotal,
        })
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);
      if (!orderData) throw new Error('Order creation failed.');

      const orderId = orderData.id;

      // 3. Insert order items
      const orderItemsToInsert = items.map((item) => ({
        order_id: orderId,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) throw new Error(itemsError.message);

      // 4. Clear cart & redirect
      clearCart();
      router.push(`/orders/success?id=${orderId}`);
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong during checkout. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-neutral-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-6 w-full pt-32 pb-24 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
            <ShoppingBag size={28} className="text-neutral-300" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Checkout Empty</h2>
          <p className="text-neutral-500 max-w-md mb-8">
            You don&apos;t have any items in your cart to checkout.
          </p>
          <Link href="/products" className="btn-primary">
            Browse Instruments
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-6 w-full pt-32 pb-24">
        {/* Back Link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-8">
          Checkout Details
        </h1>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
              <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-4">
                Shipping Information
              </h2>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="customer-name" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    disabled={loading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#68d4b5]/50 focus:border-[#68d4b5] transition-all text-sm disabled:opacity-60"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="customer-phone" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    disabled={loading}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+855 12 345 678"
                    className="px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#68d4b5]/50 focus:border-[#68d4b5] transition-all text-sm disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="customer-email" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="customer-email"
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className="px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#68d4b5]/50 focus:border-[#68d4b5] transition-all text-sm disabled:opacity-60"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="customer-address" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Delivery Address
                </label>
                <textarea
                  id="customer-address"
                  required
                  disabled={loading}
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, District, Phnom Penh, Cambodia"
                  className="px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#68d4b5]/50 focus:border-[#68d4b5] transition-all text-sm resize-none disabled:opacity-60"
                />
              </div>

              <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-4 pt-2">
                Payment Method
              </h2>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { id: 'ABA Pay', label: 'ABA Pay', icon: Wallet },
                  { id: 'Credit Card', label: 'Credit Card', icon: CreditCard },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Truck },
                ].map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      disabled={loading}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left disabled:opacity-60 ${
                        isSelected
                          ? 'border-[#68d4b5] bg-[#68d4b5]/5 text-neutral-900 font-bold'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                      }`}
                    >
                      <Icon size={20} className={isSelected ? 'text-[#68d4b5]' : 'text-neutral-400'} />
                      <span className="text-sm">{method.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-neutral-900 rounded-full font-bold text-white hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/20 hover:-translate-y-0.5 transform duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
              >
                {loading ? 'Processing Order...' : 'Complete Purchase'}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Checkout Summary */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6 lg:sticky lg:top-32">
            <h2 className="text-lg font-bold text-neutral-900">Order Summary</h2>

            <ul className="flex flex-col gap-4 max-h-60 overflow-y-auto scrollbar-thin pb-4 border-b border-neutral-100">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3">
                  <div className="relative w-12 h-12 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100 shrink-0">
                    <Image
                      src={item.product.imagePlaceholder}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-neutral-900 truncate leading-snug">
                      {item.product.name}
                    </h3>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      Qty: {item.quantity} × {formatPrice(item.product.price)}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 py-2 border-b border-neutral-100 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Subtotal</span>
                <span className="font-semibold text-neutral-900">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Shipping</span>
                <span className="font-semibold text-neutral-900">
                  {shippingFee === 0 ? <span className="text-[#0ea27e]">Free</span> : formatPrice(shippingFee)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-neutral-900">Order Total</span>
              <span className="text-xl font-bold text-neutral-900">{formatPrice(orderTotal)}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 font-medium pt-2">
              <ShieldCheck size={16} className="text-[#68d4b5]" />
              Secure Checkout Powered by Roystar Cambodia
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
