// Product type used across the Roystar store
export interface Product {
  id: string;
  name: string;
  category: 'guitar' | 'piano' | 'drums' | 'wind' | 'keys' | string;
  price: number;
  description: string;
  imagePlaceholder: string;
  images: string[];
  stock: number;
  specs: { label: string; value: string }[];
  badge?: string;
}

// Cart item (placeholder for future implementation)
export interface CartItem {
  product: Product;
  quantity: number;
}

// Navigation link
export interface NavLink {
  label: string;
  href: string;
}
