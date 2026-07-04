'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { fetchProducts } from '@/lib/products';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ─── Skeleton grid shown while loading ────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-white rounded-3xl border border-neutral-100 overflow-hidden animate-pulse"
        >
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
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Fetch all products from Supabase on mount
  useEffect(() => {
    fetchProducts()
      .then(setAllProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'All Instruments' },
    { id: 'guitar', label: 'Guitars' },
    { id: 'piano', label: 'Pianos' },
    { id: 'drums', label: 'Drums' },
    { id: 'keys', label: 'Keyboards' },
    { id: 'wind', label: 'Wind Instruments' },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allProducts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => {
          if (a.badge === 'New Arrival' || a.badge === 'New') return -1;
          if (b.badge === 'New Arrival' || b.badge === 'New') return 1;
          return 0;
        });
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-6 w-full pt-32 pb-24">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
            Our Collection
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl">
            Discover our full range of premium musical instruments, handpicked for exceptional tone and craftsmanship.
          </p>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-start lg:items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          {/* Search */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search instruments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#68d4b5]/50 focus:border-[#68d4b5] transition-all text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide w-full lg:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="hidden lg:block w-px h-8 bg-neutral-200" />

            {/* Sort Select */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <SlidersHorizontal size={18} className="text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2.5 pl-3 pr-8 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#68d4b5]/50 focus:border-[#68d4b5] cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                }}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={26} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">Failed to load products</h3>
            <p className="text-sm text-neutral-500 max-w-md">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchProducts()
                  .then(setAllProducts)
                  .catch((err: Error) => setError(err.message))
                  .finally(() => setLoading(false));
              }}
              className="mt-2 px-6 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && <SkeletonGrid />}

        {/* Results info + grid */}
        {!loading && !error && (
          <>
            <div className="mb-6 text-sm text-neutral-500 font-medium">
              Showing {filteredAndSortedProducts.length} result{filteredAndSortedProducts.length !== 1 ? 's' : ''}
            </div>

            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <Filter size={24} className="text-neutral-400" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">No instruments found</h3>
                <p className="text-neutral-500 max-w-md">
                  We couldn't find anything matching your current filters. Try adjusting your search term or clearing the selected categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSortBy('featured');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full border-2 border-neutral-200 text-sm font-bold text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
