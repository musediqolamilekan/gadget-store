"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Zap,
  Star,
  ChevronLeft,
  Shield,
  Truck,
  RotateCcw,
  Check,
  Minus,
  Plus,
} from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice !== undefined;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCart();
  };

  return (
    <div className="container-app py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8">
        <Link href="/" className="hover:text-slate-300 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-slate-300 transition-colors">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-slate-300 transition-colors capitalize"
        >
          {product.category.replace("-", " ")}
        </Link>
        <span>/</span>
        <span className="text-slate-400 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
        {/* ── IMAGE GALLERY ─────────────────────────────── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/60">
            <Image
              src={product.images[activeImage]?.url ?? product.images[0].url}
              alt={product.images[activeImage]?.alt ?? product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
            {hasDiscount && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase bg-rose-500 text-white rounded-full">
                  -{discountPct}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all
                    ${i === activeImage
                      ? "border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                      : "border-slate-700 hover:border-slate-500"}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── PRODUCT INFO ──────────────────────────────── */}
        <div>
          {/* Brand + badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-cyan-400">
              {product.brand}
            </span>
            {product.isNew && (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-cyan-500 text-slate-950 rounded-full">
                New
              </span>
            )}
            {product.isBestseller && (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-violet-600 text-white rounded-full">
                Bestseller
              </span>
            )}
          </div>

          {/* Name */}
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50 leading-tight mb-3">
            {product.name}
          </h1>

          {/* Short desc */}
          <p className="text-slate-400 text-sm mb-4">{product.shortDescription}</p>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-600"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-slate-400">
              {product.rating} ({product.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl font-black text-slate-50">
              ₦{effectivePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xl text-slate-500 line-through">
                ₦{product.price.toLocaleString()}
              </span>
            )}
            {hasDiscount && (
              <span className="text-sm font-bold text-emerald-400">
                Save ₦{(product.price - effectivePrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={`w-2 h-2 rounded-full ${
                product.stockCount > 0 ? "bg-emerald-400" : "bg-rose-500"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                product.stockCount === 0
                  ? "text-rose-400"
                  : product.stockCount <= 5
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              {product.stockCount === 0
                ? "Out of Stock"
                : product.stockCount <= 5
                ? `Only ${product.stockCount} left!`
                : `In Stock (${product.stockCount} available)`}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 my-6" />

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-slate-400 font-medium">Qty:</span>
            <div className="flex items-center gap-0 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-bold text-slate-100">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stockCount, q + 1))
                }
                className="p-2.5 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stockCount === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm
                transition-all duration-200
                ${addedToCart
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-800 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedToCart ? (
                <>
                  <Check size={16} />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stockCount === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm
                bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950
                hover:from-cyan-400 hover:to-cyan-300
                shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200"
            >
              <Zap size={16} />
              Buy Now
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { Icon: Shield,    label: "2-Year Warranty" },
              { Icon: Truck,     label: "Free Shipping" },
              { Icon: RotateCcw, label: "30-Day Returns" },
            ].map(({ Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
              >
                <Icon size={16} className="text-cyan-400" />
                <span className="text-[10px] text-slate-400 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS: Description / Specs / Reviews ─────────── */}
      <div className="mt-16 border-t border-slate-800 pt-12">
        <SpecsAndDescription product={product} />
      </div>
    </div>
  );
}

// ── Specs section (no tab state needed for MVP) ──────────────
function SpecsAndDescription({ product }: { product: Product }) {
  const [tab, setTab] = useState<"description" | "specs">("specs");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl w-fit mb-8">
        {(["specs", "description"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all
              ${tab === t
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "text-slate-400 hover:text-slate-200"}`}
          >
            {t === "specs" ? "Specifications" : "Description"}
          </button>
        ))}
      </div>

      {tab === "specs" ? (
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(product.specs).map(([key, val], i) => (
                <tr
                  key={key}
                  className={i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/20"}
                >
                  <td className="px-6 py-3.5 font-medium text-slate-400 w-40 md:w-56 align-top">
                    {key}
                  </td>
                  <td className="px-6 py-3.5 text-slate-200">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="max-w-2xl prose prose-invert prose-sm">
          <p className="text-slate-300 leading-relaxed text-base">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
