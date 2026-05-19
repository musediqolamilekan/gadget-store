"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Zap, BadgeCheck } from "lucide-react";
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

  return (
    <article
      className={`group relative flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden
        hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]
        transition-all duration-300 ease-out
        ${isCompact ? "p-3" : "p-0"}`}
    >
      {/* ── Badge row ─────────────────────────────────────── */}
      <div className="absolute top-3 left-3 z-10 flex gap-1.5 flex-wrap">
        {product.isNew && (
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-cyan-500 text-slate-950 rounded-full">
            New
          </span>
        )}
        {product.isBestseller && (
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-violet-600 text-white rounded-full flex items-center gap-1">
            <BadgeCheck size={9} />
            Bestseller
          </span>
        )}
        {hasDiscount && (
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-rose-500 text-white rounded-full">
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
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
        </div>
      </Link>

      {/* ── Card body ─────────────────────────────────────── */}
      <div className={`flex flex-col flex-1 ${isCompact ? "pt-3" : "p-4 pt-3"}`}>
        {/* Brand */}
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-cyan-400/80 mb-0.5">
          {product.brand}
        </p>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3
            className={`font-semibold text-slate-100 leading-snug hover:text-cyan-300 transition-colors line-clamp-2
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + CTA ─────────────────────────────────────── */}
        <div className="flex items-end justify-between mt-3 gap-2">
          {/* Pricing */}
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className={`font-bold text-slate-50 ${isCompact ? "text-base" : "text-xl"}`}
              >
                ₦{effectivePrice.toLocaleString()}
              </span>

              {hasDiscount && (
                <span className="text-xs text-slate-500 line-through">
                  ₦{product.price.toLocaleString()}
                </span>
              )}
            </div>
            {/* Stock */}
            <p
              className={`text-[10px] mt-0.5 ${product.stockCount <= 10
                  ? "text-rose-400"
                  : "text-emerald-400/80"
                }`}
            >
              {product.stockCount <= 10
                ? `Only ${product.stockCount} left`
                : "In Stock"}
            </p>
          </div>

          {/* Add to cart */}
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            aria-label={`Add ${product.name} to cart`}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl
              bg-cyan-500 hover:bg-cyan-400 active:scale-95
              text-slate-950 font-semibold text-xs
              transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]
              hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
          >
            <ShoppingCart size={14} />
            {!isCompact && <span>Add</span>}
          </button>
        </div>
      </div>
    </article>
  );
}
