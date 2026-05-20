"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, BadgeCheck } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

export default function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const { addItem } = useCart();
  const isCompact = variant === "compact";

  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice !== undefined;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];

  // ── Guard: image URL must be a non-empty string ──────────
  const imageUrl =
    primaryImage?.url && typeof primaryImage.url === "string" && primaryImage.url.trim() !== ""
      ? primaryImage.url
      : null;

  return (
    <article
      className={`group relative flex flex-col bg-slate-900/60 border border-slate-800
        rounded-2xl overflow-hidden
        hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]
        transition-all duration-300 ease-out
        ${isCompact ? "p-3" : "p-0"}`}
    >
      {/* ── Badges ────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 z-10 flex gap-1.5 flex-wrap">
        {product.isNew && (
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase
            bg-cyan-500 text-slate-950 rounded-full">
            New
          </span>
        )}
        {product.isBestseller && (
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase
            bg-violet-600 text-white rounded-full flex items-center gap-1">
            <BadgeCheck size={9} />
            Bestseller
          </span>
        )}
        {hasDiscount && (
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase
            bg-rose-500 text-white rounded-full">
            -{discountPct}%
          </span>
        )}
      </div>

      {/* ── Product image ─────────────────────────────────── */}
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className={`relative overflow-hidden bg-slate-800/50
            ${isCompact ? "h-40 rounded-xl" : "h-52 sm:h-60"}`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={primaryImage?.alt ?? product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-105
                transition-transform duration-500 ease-out"
            />
          ) : (
            // ── Fallback when no image is uploaded yet ─────
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2
              bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="w-12 h-12 rounded-xl bg-slate-700/60 flex items-center justify-center">
                <ShoppingCart size={20} className="text-slate-500" />
              </div>
              <span className="text-[10px] font-semibold tracking-widest uppercase
                text-slate-600">
                {product.brand}
              </span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40
            via-transparent to-transparent" />
        </div>
      </Link>

      {/* ── Card body ─────────────────────────────────────── */}
      <div className={`flex flex-col flex-1 ${isCompact ? "pt-3" : "p-4 pt-3"}`}>

        {/* Brand */}
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase
          text-cyan-400/80 mb-0.5">
          {product.brand}
        </p>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3
            className={`font-semibold text-slate-100 leading-snug hover:text-cyan-300
              transition-colors line-clamp-2
              ${isCompact ? "text-sm" : "text-base"}`}
          >
            {product.name}
          </h3>
        </Link>

        {/* Short description */}
        {!isCompact && (
          <p className="mt-1 text-xs text-slate-400 line-clamp-1">
            {product.shortDescription}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-600"
                }
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-400">
            {product.rating} ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        <div className="flex-1" />

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-3 gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`font-bold text-slate-50 ${isCompact ? "text-base" : "text-xl"}`}>
                ₦{effectivePrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-500 line-through">
                  ₦{product.price.toLocaleString()}
                </span>
              )}
            </div>
            <p className={`text-[10px] mt-0.5 ${product.stockCount === 0
                ? "text-rose-500"
                : product.stockCount <= 10
                  ? "text-rose-400"
                  : "text-emerald-400/80"
              }`}>
              {product.stockCount === 0
                ? "Out of Stock"
                : product.stockCount <= 10
                  ? `Only ${product.stockCount} left`
                  : "In Stock"}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            disabled={product.stockCount === 0}
            aria-label={`Add ${product.name} to cart`}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl
              bg-cyan-500 hover:bg-cyan-400 active:scale-95
              text-slate-950 font-semibold text-xs
              transition-all duration-200
              shadow-[0_0_15px_rgba(6,182,212,0.3)]
              hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <ShoppingCart size={14} />
            {!isCompact && <span>Add</span>}
          </button>
        </div>
      </div>
    </article>
  );
}