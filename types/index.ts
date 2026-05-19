// ============================================================
// CORE PRODUCT TYPES
// ============================================================

export type ProductCategory =
  | "phones"
  | "laptops"
  | "smartwatches"
  | "power-banks"
  | "earbuds"
  | "accessories";

export interface ProductSpec {
  [key: string]: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  price: number;
  discountPrice?: number;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  specs: ProductSpec;
  rating: number;
  reviewCount: number;
  stockCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  tags: string[];
  reviews?: ProductReview[];
  relatedProductIds?: string[];
}

// ============================================================
// CART TYPES
// ============================================================

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// ============================================================
// FILTER TYPES
// ============================================================

export interface FilterState {
  category: ProductCategory | null;
  brand: string | null;
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
  rating: number | null;
}

// ============================================================
// CHECKOUT TYPES
// ============================================================

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingDetails;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  createdAt: string;
}
