# ⚡ HolarzGadgets — Premium Gadget E-Commerce

> A high-performance, dark-mode-first gadget store built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and optimised for **Vercel deployment**.

---

## 🗂 Project Structure

```
HolarzGadgets/
├── app/
│   ├── layout.tsx              ← Root layout (CartProvider, Navbar, Footer)
│   ├── page.tsx                ← Homepage (Hero, Categories, Featured, Promo, Bestsellers)
│   ├── globals.css             ← Tailwind base + CSS variables + custom utilities
│   ├── products/
│   │   ├── page.tsx            ← Product listing with sidebar filters (CLIENT)
│   │   └── [slug]/
│   │       ├── page.tsx        ← Product detail (SERVER — SEO + related products)
│   │       └── ProductDetailClient.tsx ← Gallery, specs, cart actions (CLIENT)
│   └── checkout/
│       └── page.tsx            ← Checkout form + order summary + simulated payment
│
├── components/
│   ├── Navbar.tsx              ← Sticky nav with search, cart badge, mobile menu
│   ├── Footer.tsx              ← Link columns, social, copyright
│   ├── ProductCard.tsx         ← Reusable card (default + compact variants)
│   ├── CartDrawer.tsx          ← Slide-out cart with quantity controls
│   ├── HeroSearch.tsx          ← Hero search input (client island)
│   └── NewsletterForm.tsx      ← Email signup with loading + success state
│
├── context/
│   └── CartContext.tsx         ← useReducer cart state + React Context + useCart hook
│
├── lib/
│   └── data.ts                 ← Mock product data + helper utilities
│
├── types/
│   └── index.ts                ← All TypeScript interfaces (Product, Cart, Order, etc.)
│
├── next.config.js              ← Image domains, experimental flags
├── tailwind.config.ts          ← Extended theme (colors, animations, shadows)
├── tsconfig.json               ← Strict TS config with @/* path aliases
└── package.json                ← All dependencies
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

---

## 🎨 Design System

| Token          | Value                         | Usage                         |
|----------------|-------------------------------|-------------------------------|
| `bg-slate-950` | `#0F172A`                     | Page backgrounds              |
| `bg-slate-900` | `#0F172A` + 60% opacity       | Card surfaces                 |
| `cyan-500`     | `#06B6D4`                     | Primary CTA, accents, active  |
| `violet-600`   | `#7C3AED`                     | Secondary accent, badges      |
| `amber-400`    | `#FBBF24`                     | Star ratings, bestseller tag  |
| `emerald-400`  | `#34D399`                     | In-stock status, free labels  |
| `rose-500`     | `#F43F5E`                     | Out-of-stock, discount badges |

### Utility Classes (globals.css)

```css
.glass          /* Glassmorphism: backdrop-blur + border */
.glass-card     /* Rounded glassmorphism card */
.glow-cyan      /* Box shadow glow effect */
.text-gradient-cyan   /* Cyan → white gradient text */
.text-gradient-volt   /* Violet → cyan gradient text */
.section-padding      /* py-16 md:py-24 */
.container-app        /* max-w-7xl centered with padding */
```

---

## 🧩 Key Components

### `ProductCard` — Two Variants
```tsx
// Default: full-height card with image, specs preview, rating, CTA
<ProductCard product={product} />

// Compact: condensed for sidebars, carousels, smaller grids
<ProductCard product={product} variant="compact" />
```

### `CartContext` — Shopping Cart State
```tsx
const {
  items,           // CartItem[]
  isOpen,          // boolean
  totalItems,      // number
  subtotal,        // number
  addItem,         // (product: Product) => void
  removeItem,      // (id: string) => void
  updateQuantity,  // (id: string, qty: number) => void
  clearCart,       // () => void
  openCart,        // () => void
  closeCart,       // () => void
  toggleCart,      // () => void
} = useCart();
```

---

## 📄 Pages

| Route                | Type          | Description                                      |
|----------------------|---------------|--------------------------------------------------|
| `/`                  | Server        | Hero, categories, featured, promo, bestsellers   |
| `/products`          | Client        | Grid + sidebar filters (category, brand, price, rating, stock) |
| `/products/[slug]`   | Server+Client | Image gallery, specs table, add-to-cart, related |
| `/checkout`          | Client        | Shipping form + payment form + order summary     |

---

## 🛒 Product Data Schema (TypeScript)

```ts
interface Product {
  id:                string;
  name:              string;
  slug:              string;           // URL-safe identifier
  brand:             string;
  category:          ProductCategory;  // phones | laptops | smartwatches | power-banks | earbuds | accessories
  price:             number;
  discountPrice?:    number;           // undefined = no discount
  description:       string;           // full description
  shortDescription:  string;           // 1-line spec summary
  images:            ProductImage[];   // { url, alt, isPrimary? }
  specs:             ProductSpec;      // { [key: string]: string }
  rating:            number;
  reviewCount:       number;
  stockCount:        number;
  isFeatured:        boolean;
  isNew:             boolean;
  isBestseller:      boolean;
  tags:              string[];
}
```

---

## 🔌 Next Steps

### Connect a Real Backend
- Replace `lib/data.ts` with API calls (Supabase, Prisma, Shopify Storefront API)
- Add `generateStaticParams` to product pages for ISR/SSG
- Implement proper payment via Stripe or Paystack

### Add Authentication
- NextAuth.js or Clerk for user accounts
- Wishlist, order history, saved addresses

### Enhance Cart
- `localStorage` persistence (hydrate from storage on mount)
- Or use Zustand with `persist` middleware for cross-tab sync

### Add Pages
- `/account` — order history, profile
- `/orders/[id]` — order tracking
- `/compare` — side-by-side product comparison
- `/wishlist` — saved products

---

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect GitHub repo at vercel.com for automatic deployments
```

Environment variables needed (when adding real integrations):
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
# STRIPE_SECRET_KEY=sk_...
# DATABASE_URL=postgresql://...
```

---

## 📦 Dependencies

| Package          | Purpose                              |
|------------------|--------------------------------------|
| `next@14`        | Framework (App Router, SSR, RSC)     |
| `react@18`       | UI library                            |
| `typescript`     | Type safety                           |
| `tailwindcss`    | Utility-first styling                 |
| `lucide-react`   | Icon library (tree-shakeable SVGs)    |

Zero heavy UI libraries — everything built from scratch with Tailwind for maximum performance.

---

Built with ⚡ by HolarzGadgets
