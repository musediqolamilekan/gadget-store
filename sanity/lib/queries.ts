import { groq } from "next-sanity";

// ─────────────────────────────────────────────────────────────
// FRAGMENTS
// ─────────────────────────────────────────────────────────────

const BRAND_FRAGMENT = groq`
  brand->{
    _id,
    name,
    "slug": slug.current,
    logo
  }
`;

const CATEGORY_FRAGMENT = groq`
  category->{
    _id,
    title,
    "slug": slug.current,
    icon,
    image
  }
`;

const IMAGES_FRAGMENT = groq`
  images[]{
    alt,
    isPrimary,
    "url": image.asset->url,
    "blurDataUrl": image.asset->metadata.lqip,
    "dimensions": image.asset->metadata.dimensions
  }
`;

const SPECS_FRAGMENT = groq`
  specs[]{
    key,
    value
  }
`;

// ─────────────────────────────────────────────────────────────
// PRODUCT CARD FIELDS
// ─────────────────────────────────────────────────────────────
export const PRODUCT_CARD_FIELDS = groq`
  _id,
  name,
  "slug": slug.current,
  ${BRAND_FRAGMENT},
  ${CATEGORY_FRAGMENT},
  price,
  discountPrice,
  shortDescription,
  ${IMAGES_FRAGMENT},
  rating,
  reviewCount,
  stockCount,
  isFeatured,
  isNew,
  isBestseller,
  tags
`;

// ─────────────────────────────────────────────────────────────
// PRODUCT DETAIL FIELDS
// ─────────────────────────────────────────────────────────────
export const PRODUCT_DETAIL_FIELDS = groq`
  ${PRODUCT_CARD_FIELDS},
  description,
  ${SPECS_FRAGMENT},
  seoTitle,
  seoDescription
`;

// ─────────────────────────────────────────────────────────────
// PRODUCT QUERIES
// ─────────────────────────────────────────────────────────────

export const ALL_PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(_createdAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const FEATURED_PRODUCTS_QUERY = groq`
  *[_type == "product" && isFeatured == true] | order(_createdAt desc)[0...8] {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const BESTSELLER_PRODUCTS_QUERY = groq`
  *[_type == "product" && isBestseller == true] | order(reviewCount desc)[0...8] {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ${PRODUCT_DETAIL_FIELDS}
  }
`;

export const RELATED_PRODUCTS_QUERY = groq`
  *[
    _type == "product" &&
    category->slug.current == $categorySlug &&
    slug.current != $slug
  ] | order(_createdAt desc)[0...$limit] {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const PRODUCTS_BY_CATEGORY_QUERY = groq`
  *[_type == "product" && category->slug.current == $categorySlug]
  | order(_createdAt desc) {
    ${PRODUCT_CARD_FIELDS}
  }
`;

export const ALL_PRODUCT_SLUGS_QUERY = groq`
  *[_type == "product"]{ "slug": slug.current }
`;

// ─────────────────────────────────────────────────────────────
// CATEGORY QUERIES
// ─────────────────────────────────────────────────────────────

export const ALL_CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    icon,
    image,
    isFeatured,
    order
  }
`;

export const FEATURED_CATEGORIES_QUERY = groq`
  *[_type == "category" && isFeatured == true] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    icon,
    image,
    order
  }
`;

export const CATEGORY_BY_SLUG_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    icon,
    image,
    isFeatured,
    order
  }
`;

export const CATEGORY_WITH_PRODUCTS_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    icon,
    image,
    "products": *[_type == "product" && category->slug.current == $slug]
      | order(_createdAt desc) {
        ${PRODUCT_CARD_FIELDS}
      }
  }
`;

// ─────────────────────────────────────────────────────────────
// BRAND QUERIES
// ─────────────────────────────────────────────────────────────

export const ALL_BRANDS_QUERY = groq`
  *[_type == "brand"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    isFeatured,
    "logoUrl": logo.asset->url
  }
`;

// ─────────────────────────────────────────────────────────────
// BANNER QUERIES
// ─────────────────────────────────────────────────────────────

export const ACTIVE_BANNERS_QUERY = groq`
  *[_type == "banner" && isActive == true] | order(order asc) {
    _id,
    title,
    subtitle,
    badgeText,
    ctaLabel,
    ctaHref,
    image,
    accentColor
  }
`;

// ─────────────────────────────────────────────────────────────
// BLOG QUERIES
// ─────────────────────────────────────────────────────────────

export const BLOG_CARD_FIELDS = groq`
  _id,
  title,
  "slug":        slug.current,
  excerpt,
  category,
  tags,
  author,
  publishedAt,
  featured,
  readingTime,
  "coverImage": {
    "url":        coverImage.asset->url,
    "alt":        coverImage.alt,
    "blurDataUrl": coverImage.asset->metadata.lqip
  }
`;

export const ALL_POSTS_QUERY = groq`
  *[_type == "post"] | order(publishedAt desc) {
    ${BLOG_CARD_FIELDS}
  }
`;

export const FEATURED_POSTS_QUERY = groq`
  *[_type == "post" && featured == true] | order(publishedAt desc)[0...3] {
    ${BLOG_CARD_FIELDS}
  }
`;

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${BLOG_CARD_FIELDS},
    body,
    seoTitle,
    seoDescription
  }
`;

export const POSTS_BY_CATEGORY_QUERY = groq`
  *[_type == "post" && category == $category] | order(publishedAt desc) {
    ${BLOG_CARD_FIELDS}
  }
`;

export const ALL_POST_SLUGS_QUERY = groq`
  *[_type == "post"]{ "slug": slug.current }
`;

export const RELATED_POSTS_QUERY = groq`
  *[
    _type == "post" &&
    category == $category &&
    slug.current != $slug
  ] | order(publishedAt desc)[0...3] {
    ${BLOG_CARD_FIELDS}
  }
`;