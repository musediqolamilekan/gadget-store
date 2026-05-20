import { createClient } from "next-sanity";
import imageUrlBuilder  from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2024-01-01";

// ─────────────────────────────────────────────────────────────
// READ CLIENT  (used in Server Components / generateStaticParams)
// ─────────────────────────────────────────────────────────────
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,          // CDN-cached reads — fastest for public pages
  perspective: "published",
});

// ─────────────────────────────────────────────────────────────
// WRITE / PREVIEW CLIENT  (used for draft preview if needed)
// ─────────────────────────────────────────────────────────────
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: "previewDrafts",
});

// ─────────────────────────────────────────────────────────────
// IMAGE URL BUILDER
// ─────────────────────────────────────────────────────────────
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Quick helper — returns a ready-to-use string URL.
 * Usage:  urlForString(image, 600, 600)
 */
export function urlForString(
  source: SanityImageSource,
  width  = 800,
  height = 800,
  quality = 80
): string {
  return urlFor(source)
    .width(width)
    .height(height)
    .quality(quality)
    .auto("format")   // serves WebP where supported
    .fit("crop")
    .url();
}