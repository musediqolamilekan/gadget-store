import { notFound }      from "next/navigation";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getRelatedProducts,
  getAllProductSlugs,
} from "@/sanity/lib/fetch";
import { toProduct, specsArrayToObject } from "@/sanity/lib/types";
import ProductDetailClient from "./ProductDetailClient";
import ProductCard          from "@/components/ProductCard";
import { StaggerGrid, StaggerItem, FadeUp } from "@/components/animations";

interface Props {
  params: { slug: string };
}

// ── Static params for ISR/SSG ─────────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

// ── SEO metadata ─────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getProductBySlug(params.slug);
  if (!data) return { title: "Product Not Found" };
  return {
    title:       data.seoTitle       ?? data.name,
    description: data.seoDescription ?? data.shortDescription,
    openGraph: {
      title:       data.seoTitle       ?? data.name,
      description: data.seoDescription ?? data.shortDescription,
      images:      data.images?.[0]?.url ? [{ url: data.images[0].url }] : [],
    },
  };
}

// ── Page ─────────────────────────────────────────────────────
export default async function ProductDetailPage({ params }: Props) {
  const data = await getProductBySlug(params.slug);
  if (!data) notFound();

  // Convert Sanity shape → local Product type
  const product = {
    ...toProduct(data),
    description: "",                                // rendered via Portable Text below
    specs:       specsArrayToObject(data.specs ?? []),
  };

  // Category slug for related products query
  const categorySlug =
    typeof data.category === "object"
      ? (data.category as { slug: string }).slug
      : (data.category as string);

  const related = await getRelatedProducts(categorySlug, params.slug, 4);

  return (
    <div className="min-h-screen bg-slate-950">
      <ProductDetailClient product={product} portableDescription={data.description} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="container-app py-16 border-t border-slate-800/60">
          <FadeUp>
            <h2 className="text-2xl font-black tracking-tight text-slate-50 mb-8">
              You may also like
            </h2>
          </FadeUp>
          <StaggerGrid className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} variant="compact" />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      )}
    </div>
  );
}