// ─────────────────────────────────────────────────────────────
// SANITY DOCUMENT TYPES
// ─────────────────────────────────────────────────────────────

export type SanityProductCategory =
  | "phones"
  | "laptops"
  | "smartwatches"
  | "power-banks"
  | "earbuds"
  | "accessories";

export interface SanityImageObject {
  url: string;
  alt: string;
  isPrimary?: boolean;
  blurDataUrl?: string;
  dimensions?: { width: number; height: number; aspectRatio: number };
}

export interface SanityBrandRef {
  _id: string;
  name: string;
  slug: string;
  logo?: { asset: { _ref: string } };
}

// ── Category reference (now a full object from GROQ dereference) ──
export interface SanityCategoryRef {
  _id: string;
  title: string;
  slug: string;
  icon?: string;
  image?: { asset: { _ref: string } };
}

export interface SanitySpecItem {
  key: string;
  value: string;
}

// ── Product Card ─────────────────────────────────────────────
export interface SanityProductCard {
  _id: string;
  name: string;
  slug: string;
  brand: SanityBrandRef;
  category: SanityCategoryRef;   // ← object, not plain string
  price: number;
  discountPrice?: number;
  shortDescription: string;
  images: SanityImageObject[];
  rating: number;
  reviewCount: number;
  stockCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  tags: string[];
}

// ── Product Detail ───────────────────────────────────────────
export interface SanityProductDetail extends SanityProductCard {
  description: unknown[];
  specs: SanitySpecItem[];
  seoTitle?: string;
  seoDescription?: string;
}

// ── Brand ────────────────────────────────────────────────────
export interface SanityBrand {
  _id: string;
  name: string;
  slug: string;
  logo?: { asset: { _ref: string } };
  isFeatured: boolean;
}

// ── Banner ───────────────────────────────────────────────────
export interface SanityBanner {
  _id: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  ctaLabel: string;
  ctaHref: string;
  image?: { asset: { _ref: string } };
  accentColor: "cyan" | "violet" | "amber" | "rose";
}

// ─────────────────────────────────────────────────────────────
// ADAPTER — SanityProductCard → local Product type
// ─────────────────────────────────────────────────────────────
import type { Product, ProductCategory } from "@/types";

export function toProduct(p: SanityProductCard): Product {
  // category is now a dereferenced object — extract the slug
  const categorySlug =
    typeof p.category === "object"
      ? (p.category as SanityCategoryRef).slug
      : (p.category as string);

  return {
    id:               p._id,
    name:             p.name,
    slug:             p.slug,
    brand:            p.brand?.name ?? "",
    category:         categorySlug as ProductCategory,
    price:            p.price,
    discountPrice:    p.discountPrice,
    shortDescription: p.shortDescription,
    description:      "",
    images: p.images.map((img) => ({
      url:       img.url,
      alt:       img.alt,
      isPrimary: img.isPrimary,
    })),
    specs:        {},
    rating:       p.rating,
    reviewCount:  p.reviewCount,
    stockCount:   p.stockCount,
    isFeatured:   p.isFeatured,
    isNew:        p.isNew,
    isBestseller: p.isBestseller,
    tags:         p.tags ?? [],
  };
}

export function specsArrayToObject(
  specs: SanitySpecItem[]
): Record<string, string> {
  return Object.fromEntries(specs.map((s) => [s.key, s.value]));
}