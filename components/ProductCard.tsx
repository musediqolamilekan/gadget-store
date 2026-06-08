"use client";

import Link        from "next/link";
import Image       from "next/image";
import { ShoppingCart, Star, BadgeCheck } from "lucide-react";
import type { Product } from "@/types";
import { useCart }  from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

export default function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const isCompact   = variant === "compact";

  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount    = product.discountPrice !== undefined;
  const discountPct    = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const imageUrl     =
    primaryImage?.url &&
    typeof primaryImage.url === "string" &&
    primaryImage.url.trim() !== ""
      ? primaryImage.url
      : null;

  return (
    <article
      className={`group relative flex flex-col card
        hover:shadow-card-hover hover:border-primary-200
        overflow-hidden transition-all duration-300 ease-out
        ${isCompact ? "p-3" : "p-0"}`}
    >
      {/* ── Badges ──────────────────────────────────────── */}
      <div className="absolute top-3 left-3 z-10 flex gap-1.5 flex-wrap">
        {product.isNew && (
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest
            uppercase rounded-full bg-primary-500 text-white">
            New
          </span>
        )}
        {product.isBestseller && (
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest
            uppercase rounded-full bg-accent-violet/90 text-white
            flex items-center gap-1">
            <BadgeCheck size={9} />
            Bestseller
          </span>
        )}
        {hasDiscount && (
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest
            uppercase rounded-full bg-danger text-white">
            -{discountPct}%
          </span>
        )}
      </div>

      {/* ── Product image ────────────────────────────────── */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className={`relative overflow-hidden bg-bg-muted
          ${isCompact ? "h-40 rounded-xl" : "h-52 sm:h-60"}`}>
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
            /* Fallback placeholder */
            <div className="absolute inset-0 flex flex-col items-center
              justify-center gap-2 bg-bg-muted">
              <div className="w-12 h-12 rounded-xl bg-bg-subtle
                flex items-center justify-center">
                <ShoppingCart size={20} className="text-text-faint" />
              </div>
              <span className="text-[10px] font-semibold tracking-widest
                uppercase text-text-faint">
                {product.brand}
              </span>
            </div>
          )}

          {/* Subtle gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t
            from-bg/30 via-transparent to-transparent" />
        </div>
      </Link>

      {/* ── Card body ────────────────────────────────────── */}
      <div className={`flex flex-col flex-1
        ${isCompact ? "pt-3" : "p-4 pt-3"}`}>

        {/* Brand */}
        <p className="text-[11px] font-bold tracking-[0.15em] uppercase
          text-primary-500 mb-0.5">
          {product.brand}
        </p>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className={`font-semibold text-text leading-snug
            hover:text-primary-600 transition-colors line-clamp-2
            ${isCompact ? "text-sm" : "text-base"}`}>
            {product.name}
          </h3>
        </Link>

        {/* Short description — default variant only */}
        {!isCompact && (
          <p className="mt-1 text-xs text-text-faint line-clamp-1">
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
                    : "text-border-strong"
                }
              />
            ))}
          </div>
          <span className="text-[11px] text-text-faint">
            {product.rating} ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        <div className="flex-1" />

        {/* ── Price + CTA ──────────────────────────────── */}
        <div className="flex items-end justify-between mt-3 gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`font-bold text-text
                ${isCompact ? "text-base" : "text-xl"}`}>
                ₦{effectivePrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-text-faint line-through">
                  ₦{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock status */}
            <p className={`text-[10px] mt-0.5 font-medium
              ${product.stockCount === 0
                ? "text-danger"
                : product.stockCount <= 10
                  ? "text-warning"
                  : "text-success"}`}>
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
              openCart();
            }}
            disabled={product.stockCount === 0}
            aria-label={`Add ${product.name} to cart`}
            className="flex-shrink-0 flex items-center gap-1.5
              px-3 py-2 rounded-xl btn-primary text-xs active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}