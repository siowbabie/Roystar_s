'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, ShieldCheck, Mail, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface OrderDetails {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: string;
  total_price: number;
  created_at: string;
}

interface OrderItemDetails {
  quantity: number;
  price: number;
  products: {
    name: string;
    image: string;
  } | null;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [items, setItems] = useState<OrderItemDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError('Invalid Order Identification Key.');
      return;
    }

    const fetchOrderData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Order metadata
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw new Error(orderError.message);
        setOrder(orderData);

        // 2. Fetch Order items with product join
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('quantity, price, products (name, image)')
          .eq('order_id', orderId);

        if (itemsError) throw new Error(itemsError.message);
        setItems(itemsData as unknown as OrderItemDetails[]);
      } catch (err: unknown) {
        console.error('Error fetching order receipt:', err);
        const errorMessage = err instanceof Error ? err.message : 'Could not load your order receipt.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-neutral-500 font-medium animate-pulse">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Retrieving Order</h2>
        <p className="text-neutral-500 max-w-md mx-auto mb-8">{error || 'Order not found.'}</p>
        <Link href="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Success Message */}
      <div className="text-center flex flex-col items-center gap-4 bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#68d4b5]/10 flex items-center justify-center text-[#3fbf9c]">
          <CheckCircle2 size={36} strokeWidth={2} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
          Thank You for Your Order!
        </h1>
        <p className="text-neutral-500 max-w-md">
          Your order has been successfully placed. We are preparing your premium instruments for shipping.
        </p>
        <div className="mt-2 bg-neutral-50 border border-neutral-200 rounded-2xl px-6 py-3">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
            Order Number
          </span>
          <span className="text-lg font-bold text-neutral-900 tracking-wide font-mono">
            {order.order_number}
          </span>
        </div>
      </div>

      {/* Receipt Summary Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Customer and Delivery Details */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
          <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-4">
            Delivery & Receipt Details
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Customer Information
              </span>
              <div className="flex flex-col gap-2 text-sm text-neutral-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-900 font-bold">{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500">
                  <Mail size={14} />
                  <span>{order.customer_email}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500">
                  <Phone size={14} />
                  <span>{order.customer_phone}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Payment & Date
              </span>
              <div className="flex flex-col gap-2 text-sm text-neutral-700 font-medium">
                <div className="flex items-center gap-2 text-neutral-500">
                  <Calendar size={14} />
                  <span>{formatDate(order.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500">
                  <CreditCard size={14} />
                  <span>Method: {order.payment_method}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-neutral-100 pt-5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Shipping Address
            </span>
            <div className="flex items-start gap-2 text-sm text-neutral-600 font-medium">
              <MapPin size={16} className="text-[#68d4b5] shrink-0 mt-0.5" />
              <span>{order.delivery_address}</span>
            </div>
          </div>
        </div>

        {/* Order total receipt breakdown */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6 justify-between">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-4">
              Price Summary
            </h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400 font-medium">Shipping & Handling</span>
                <span className="font-semibold text-neutral-900">
                  {order.total_price > 2000 ? <span className="text-[#0ea27e]">Free</span> : '$150'}
                </span>
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-4">
                <span className="text-base font-bold text-neutral-900">Paid Total</span>
                <span className="text-2xl font-bold text-neutral-900">
                  {formatPrice(order.total_price)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-semibold pt-4">
            <ShieldCheck size={14} className="text-[#68d4b5]" />
            Official Yamaha Cambodia Warranty
          </div>
        </div>
      </div>

      {/* Purchased Items List */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-4">
          Ordered Items
        </h2>

        <ul className="flex flex-col divide-y divide-neutral-100">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="relative w-16 h-16 bg-neutral-50 rounded-xl overflow-hidden border border-neutral-100 shrink-0">
                  <Image
                    src={item.products?.image || '/images/classical-guitar.jpg'}
                    alt={item.products?.name || 'Instrument'}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-neutral-900">
                    {item.products?.name || 'Yamaha Premium Instrument'}
                  </h3>
                  <span className="text-xs text-neutral-400 font-semibold mt-1">
                    Quantity: {item.quantity}
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-neutral-900 shrink-0">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Checkout Action CTA */}
      <div className="flex justify-center mt-4">
        <Link href="/products" className="btn-primary">
          Continue Shopping Collection
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto px-6 w-full pt-32 pb-24">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-neutral-500 font-medium animate-pulse">Loading order details...</div>
          </div>
        }>
          <OrderSuccessContent />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
