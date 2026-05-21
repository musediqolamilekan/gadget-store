import { sanityClient } from "./client";
import {
  ALL_PRODUCTS_QUERY,
  FEATURED_PRODUCTS_QUERY,
  BESTSELLER_PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  RELATED_PRODUCTS_QUERY,
  ALL_PRODUCT_SLUGS_QUERY,
  ALL_BRANDS_QUERY,
  ALL_CATEGORIES_QUERY,
  FEATURED_CATEGORIES_QUERY,
  CATEGORY_BY_SLUG_QUERY,
  CATEGORY_WITH_PRODUCTS_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
  ACTIVE_BANNERS_QUERY,
  ALL_POSTS_QUERY,
  FEATURED_POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  POSTS_BY_CATEGORY_QUERY,
  ALL_POST_SLUGS_QUERY,
  RELATED_POSTS_QUERY,
} from "./queries";
import {
  SanityProductCard,
  SanityProductDetail,
  SanityBrand,
  SanityBanner,
  toProduct,
} from "./types";
import type { Product } from "@/types";

// ─────────────────────────────────────────────────────────────
// CATEGORY TYPES
// ─────────────────────────────────────────────────────────────

export interface SanityCategory {
  _id:          string;
  title:        string;
  slug:         string;
  description?: string;
  icon?:        string;
  image?:       { asset: { _ref: string } };
  isFeatured?:  boolean;
  order?:       number;
}

export interface SanityCategoryWithProducts extends SanityCategory {
  products: SanityProductCard[];
}

// ─────────────────────────────────────────────────────────────
// BLOG TYPES
// ─────────────────────────────────────────────────────────────

export interface SanityPost {
  _id:             string;
  title:           string;
  slug:            string;
  excerpt:         string;
  category:        string;
  tags:            string[];
  author:          string;
  publishedAt:     string;
  featured:        boolean;
  readingTime:     number;
  coverImage:      { url: string; alt: string; blurDataUrl?: string } | null;
  body?:           unknown[];
  seoTitle?:       string;
  seoDescription?: string;
}

// ─────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const data = await sanityClient.fetch<SanityProductCard[]>(
    ALL_PRODUCTS_QUERY, {},
    { next: { revalidate: 30, tags: ["products"] } }
  );
  return data.map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const data = await sanityClient.fetch<SanityProductCard[]>(
    FEATURED_PRODUCTS_QUERY, {},
    { next: { revalidate: 30, tags: ["products", "featured"] } }
  );
  return data.map(toProduct);
}

export async function getBestsellerProducts(): Promise<Product[]> {
  const data = await sanityClient.fetch<SanityProductCard[]>(
    BESTSELLER_PRODUCTS_QUERY, {},
    { next: { revalidate: 30, tags: ["products", "bestsellers"] } }
  );
  return data.map(toProduct);
}

export async function getProductBySlug(
  slug: string
): Promise<SanityProductDetail | null> {
  return sanityClient.fetch<SanityProductDetail | null>(
    PRODUCT_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 30, tags: [`product-${slug}`] } }
  );
}

export async function getRelatedProducts(
  categorySlug: string,
  currentSlug:  string,
  limit = 4
): Promise<Product[]> {
  const data = await sanityClient.fetch<SanityProductCard[]>(
    RELATED_PRODUCTS_QUERY,
    { categorySlug, slug: currentSlug, limit },
    { next: { revalidate: 30, tags: ["products"] } }
  );
  return data.map(toProduct);
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const data = await sanityClient.fetch<SanityProductCard[]>(
    PRODUCTS_BY_CATEGORY_QUERY,
    { categorySlug },
    { next: { revalidate: 30, tags: ["products", `category-${categorySlug}`] } }
  );
  return data.map(toProduct);
}

export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  return sanityClient.fetch<{ slug: string }[]>(
    ALL_PRODUCT_SLUGS_QUERY, {},
    { next: { revalidate: 30 } }
  );
}

// ─────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<SanityCategory[]> {
  return sanityClient.fetch<SanityCategory[]>(
    ALL_CATEGORIES_QUERY, {},
    { next: { revalidate: 30, tags: ["categories"] } }
  );
}

export async function getFeaturedCategories(): Promise<SanityCategory[]> {
  return sanityClient.fetch<SanityCategory[]>(
    FEATURED_CATEGORIES_QUERY, {},
    { next: { revalidate: 30, tags: ["categories"] } }
  );
}

export async function getCategoryBySlug(
  slug: string
): Promise<SanityCategory | null> {
  return sanityClient.fetch<SanityCategory | null>(
    CATEGORY_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 30, tags: [`category-${slug}`] } }
  );
}

export async function getCategoryWithProducts(
  slug: string
): Promise<SanityCategoryWithProducts | null> {
  return sanityClient.fetch<SanityCategoryWithProducts | null>(
    CATEGORY_WITH_PRODUCTS_QUERY,
    { slug },
    { next: { revalidate: 30, tags: [`category-${slug}`, "products"] } }
  );
}

// ─────────────────────────────────────────────────────────────
// BRANDS
// ─────────────────────────────────────────────────────────────

export async function getAllBrands(): Promise<SanityBrand[]> {
  return sanityClient.fetch<SanityBrand[]>(
    ALL_BRANDS_QUERY, {},
    { next: { revalidate: 30, tags: ["brands"] } }
  );
}

// ─────────────────────────────────────────────────────────────
// BANNERS
// ─────────────────────────────────────────────────────────────

export async function getActiveBanners(): Promise<SanityBanner[]> {
  return sanityClient.fetch<SanityBanner[]>(
    ACTIVE_BANNERS_QUERY, {},
    { next: { revalidate: 30, tags: ["banners"] } }
  );
}

// ─────────────────────────────────────────────────────────────
// BLOG
// ─────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch<SanityPost[]>(
    ALL_POSTS_QUERY, {},
    { next: { revalidate: 30, tags: ["posts"] } }
  );
}

export async function getFeaturedPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch<SanityPost[]>(
    FEATURED_POSTS_QUERY, {},
    { next: { revalidate: 30, tags: ["posts", "featured-posts"] } }
  );
}

export async function getPostBySlug(
  slug: string
): Promise<SanityPost | null> {
  return sanityClient.fetch<SanityPost | null>(
    POST_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 30, tags: [`post-${slug}`] } }
  );
}

export async function getPostsByCategory(
  category: string
): Promise<SanityPost[]> {
  return sanityClient.fetch<SanityPost[]>(
    POSTS_BY_CATEGORY_QUERY,
    { category },
    { next: { revalidate: 30, tags: ["posts"] } }
  );
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  return sanityClient.fetch<{ slug: string }[]>(
    ALL_POST_SLUGS_QUERY, {},
    { next: { revalidate: 30 } }
  );
}

export async function getRelatedPosts(
  category: string,
  slug:     string
): Promise<SanityPost[]> {
  return sanityClient.fetch<SanityPost[]>(
    RELATED_POSTS_QUERY,
    { category, slug },
    { next: { revalidate: 30, tags: ["posts"] } }
  );
}