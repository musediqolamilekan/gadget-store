import { MetadataRoute } from "next";
import { getAllProductSlugs, getAllCategories, getAllPostSlugs } from "@/sanity/lib/fetch";

const BASE = "https://horlarzgadgets.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, categories, postSlugs] = await Promise.all([
    getAllProductSlugs(),
    getAllCategories(),
    getAllPostSlugs(),
  ]);

  const productUrls = slugs.map(({ slug }) => ({
    url:          `${BASE}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority:     0.8,
  }));

  const categoryUrls = categories.map((c) => ({
    url:          `${BASE}/products?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority:     0.7,
  }));

  const blogUrls = postSlugs.map(({ slug }) => ({
    url:          `${BASE}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority:     0.7,
  }));

  return [
    { url: BASE,                    lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/products`,      lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/blog`,          lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/about`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/faq`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/policies`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/terms`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    ...categoryUrls,
    ...productUrls,
    ...blogUrls,
  ];
}