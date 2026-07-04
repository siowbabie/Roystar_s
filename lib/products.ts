import { Product } from '@/types';
import { supabase } from '@/lib/supabase';

// ─── Row type matching the exact schema specified by the user ──────────────
interface ProductRow {
  id: string; // uuid
  name: string; // text
  description: string; // text
  price: number; // numeric
  image: string; // text
  category: string; // text
  created_at: string; // timestamp
}

// Map Supabase ProductRow → Product interface
function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    description: row.description,
    imagePlaceholder: row.image,
    images: row.image ? [row.image] : [],
    stock: 10, // Stock default as it is not present in the new schema
    specs: [], // Specs default as it is not present in the new schema
    badge: undefined, // Badge default as it is not present in the new schema
  };
}

// ─── Async fetch functions (relying entirely on Supabase) ─────────────────

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[Roystar] fetchProducts error:', error.message);
    throw new Error(error.message);
  }

  return (data as ProductRow[]).map(mapRow);
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  // Since there is no is_featured column in the new schema,
  // we just fetch the first 4 products ordered by created_at.
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(4);

  if (error) {
    console.error('[Roystar] fetchFeaturedProducts error:', error.message);
    throw new Error(error.message);
  }

  return (data as ProductRow[]).map(mapRow);
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // PostgREST returns PGRST116 when no rows match
    console.error('[Roystar] fetchProductById error:', error.message);
    throw new Error(error.message);
  }

  return mapRow(data as ProductRow);
}
