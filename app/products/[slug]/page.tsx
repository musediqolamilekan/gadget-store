import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* ── Product detail (interactive — client component) ── */}
      <ProductDetailClient product={product} />

      {/* ── Related products ─────────────────────────────── */}
      {related.length > 0 && (
        <section className="container-app py-16 border-t border-slate-800/60">
          <h2 className="text-2xl font-black tracking-tight text-slate-50 mb-8">
            You may also like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
