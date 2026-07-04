# Roystar Cambodia

Course: Ecommerce

Chau ChanRanksey, a student of National University of Management, Faculty of Digital Economy, Under Mentorship of Prof. Daiyon Cho

# Roystar Music Store

Roystar Music Store is a premium, fully-functional e-commerce web application dedicated to showcasing and selling handcrafted acoustic and classical musical instruments. Roystar is positioned as the official authorized distributor of Yamaha instruments in Cambodia.

Built on Next.js 15, TypeScript, and Tailwind CSS, the platform connects to a Supabase PostgreSQL database as its single source of truth for product listings, orders, and purchase items.

---

## 🚀 Features

- **Dynamic Catalog Page (`/products`)**:
  - Live query searching, filtering by instrument category (Guitars, Pianos, Drums, Keyboards, Wind), and price/date sorting.
- **Product Details Route (`/products/[id]`)**:
  - Interactive page featuring large optimized image, stock metrics, full specification details table, and an add-to-cart layout.
- **Global Shopping Cart Drawer**:
  - Slide-out cart drawer supporting quantity updates, removal, and live subtotal math.
- **Persistent Cart State**:
  - Cart data is managed with `zustand` and automatically persisted inside the user's `localStorage` across page reloads.
- **Dedicated Checkout Form (`/checkout`)**:
  - Form capturing shipping addresses, customer contact details, and payment options (ABA Pay, Credit Card, Cash on Delivery).
- **Secure Transaction Commitments**:
  - Saves purchases as new rows in `orders` and `order_items` tables within Supabase, then clears the shopping cart on completion.
- **Receipt & Confirmation Page (`/orders/success`)**:
  - Validates order details dynamically from Supabase using the order UUID parameter.

---

## 🛠️ Technologies Used

- **Framework**: Next.js 15 (App Router)
- **Programming Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Database / Backend**: Supabase (PostgreSQL)

---

## 📁 Folder Structure

```
roystar/
├── app/
│   ├── cart/               # Full screen cart page
│   ├── checkout/           # Checkout form page
│   ├── orders/
│   │   └── success/        # Order success page
│   ├── products/
│   │   ├── [id]/           # Product detail page
│   │   └── page.tsx        # Product catalog page
│   ├── globals.css         # Styling directives and custom tokens
│   ├── layout.tsx          # Root layout featuring CartDrawer
│   └── page.tsx            # Main Landing/Home page assembly
├── components/
│   ├── About.tsx           # Company story and values
│   ├── CartDrawer.tsx      # Sidebar cart drawer UI
│   ├── FeaturedProducts.tsx# Homepage featured listing
│   ├── Footer.tsx          # Site footer
│   ├── Hero.tsx            # Responsive hero highlight
│   └── Navbar.tsx          # Top navigation bar
├── lib/
│   ├── products.ts         # Supabase database fetch helpers
│   └── supabase.ts         # Supabase client singleton setup
├── public/
│   └── images/             # Local optimized instruments photos
├── store/
│   └── cartStore.ts        # Zustand cart management store
└── types/
    └── index.ts            # Type definitions
```

---

## 💻 Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Roystar_s
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root folder and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-api-key
   ```

---

## 🗄️ Supabase Setup

### Step 1 — Create Tables
Run the following query inside the **SQL Editor** of your Supabase project:

```sql
-- Create Products Table
create table public.products (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  description       text not null,
  price             numeric not null,
  image             text not null,
  category          text not null,
  created_at        timestamptz not null default now()
);

-- Create Orders Table
create table public.orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text unique not null,
  customer_name    text not null,
  customer_email   text not null,
  customer_phone   text not null,
  delivery_address text not null,
  payment_method   text not null,
  total_price      numeric not null,
  created_at       timestamptz not null default now()
);

-- Create Order Items Table
create table public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid not null references public.products(id),
  quantity    integer not null check (quantity > 0),
  price       numeric not null,
  created_at  timestamptz not null default now()
);
```

### Step 2 — Enable Row Level Security (RLS) & Policies

```sql
-- Enable RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for products
create policy "Public read products" on public.products for select using (true);

-- Policies for orders
create policy "Anyone can create an order" on public.orders for insert with check (true);
create policy "Anyone can read orders" on public.orders for select using (true);

-- Policies for order_items
create policy "Anyone can insert order items" on public.order_items for insert with check (true);
create policy "Anyone can read order items" on public.order_items for select using (true);
```

---

## 🛠️ How to Run

To run the development server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the next available port indicated in your terminal) in your browser to view the application.

---

## 🖼️ Screenshots

*Placeholders for screenshots representing key aspects of the website:*

1. **Homepage & Hero Highlight**
   <!-- [Insert Hero Section Screenshot Here] -->
2. **Product Catalog & Filters**
   <!-- [Insert Products Page Screenshot Here] -->
3. **Shopping Drawer & Checkout Form**
   <!-- [Insert Checkout Page Screenshot Here] -->
4. **Order Confirmation Receipt**
   <!-- [Insert Success Page Screenshot Here] -->

---

## 🔮 Future Improvements

- **User Authentication**: Implement email/social authentication so customers can track past orders.
- **Stock Deductions**: Automatically reduce product stock counts in the database when an order is submitted.
- **Interactive Map Delivery**: Add Google Maps or OpenStreetMap pin selection during checkout.
- **Checkout Payment Processing**: Integrate real payment gateways like ABA Pay QR code generator API.

---

## 👤 Author Information

- **Development Team**: Built with care for premium classical musicians.
- **Branding**: Official Yamaha Authorized Distributor in Cambodia.
