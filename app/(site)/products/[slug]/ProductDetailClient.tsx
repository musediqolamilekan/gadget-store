"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Zap, Star, Shield, Truck, RotateCcw, Minus, Plus,
} from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";

// ─────────────────────────────────────────────────────────────
// PORTABLE TEXT
// ─────────────────────────────────────────────────────────────
const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-text-muted leading-relaxed text-base mb-4">{children}</p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-lg font-bold text-text mt-6 mb-2">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-base font-semibold text-text mt-4 mb-1">{children}</h4>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-text">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-text-muted">{children}</em>
    ),
  },
};

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};
const imageVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};
const thumbnailVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.35 },
  }),
};

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
interface Props {
  product: Product;
  portableDescription: unknown[];
}

export default function ProductDetailClient({
  product, portableDescription,
}: Props) {
  const { addItem, openCart } = useCart();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice !== undefined;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const activeImg = product.images[activeImage] ?? product.images[0];
  const activeUrl =
    activeImg?.url && activeImg.url.trim() !== "" ? activeImg.url : null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    openCart();
  };

  const handleBuyNow = () => {
    try {
      sessionStorage.setItem("holarz_buy_now", JSON.stringify({ product, quantity }));
    } catch {}
    router.push("/checkout");
  };

  return (
    <div className="container-app py-10">

      {/* ── Breadcrumb ──────────────────────────────────── */}
      <motion.nav
        className="flex items-center gap-2 text-xs text-text-faint mb-8 flex-wrap"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/" className="hover:text-text transition-colors">Home</Link>
        <span className="text-border-strong">/</span>
        <Link href="/products" className="hover:text-text transition-colors">Products</Link>
        <span className="text-border-strong">/</span>
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-text transition-colors capitalize"
        >
          {product.category.replace(/-/g, " ")}
        </Link>
        <span className="text-border-strong">/</span>
        <span className="text-text-muted line-clamp-1">{product.name}</span>
      </motion.nav>

      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

        {/* ── IMAGE GALLERY ────────────────────────────── */}
        <div className="space-y-3">

          {/* Main image */}
          <motion.div
            className="relative aspect-square rounded-2xl overflow-hidden
              bg-bg-muted border border-border"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {activeUrl ? (
                <motion.div
                  key={activeUrl}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                >
                  <Image
                    src={activeUrl}
                    alt={activeImg?.alt ?? product.name}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    priority
                    className="object-cover"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="absolute inset-0 flex items-center justify-center
                    bg-bg-muted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-text-faint text-sm">{product.brand}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Discount badge */}
            {hasDiscount && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 text-xs font-bold tracking-widest
                  uppercase bg-danger text-white rounded-full">
                  -{discountPct}% OFF
                </span>
              </div>
            )}
          </motion.div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img, i) => {
                const thumbUrl = img?.url && img.url.trim() !== "" ? img.url : null;
                return (
                  <motion.button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    custom={i}
                    variants={thumbnailVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden
                      flex-shrink-0 border-2 transition-all
                      ${i === activeImage
                        ? "border-primary-500 shadow-[0_0_10px_rgb(var(--color-primary-500)/30%)]"
                        : "border-border hover:border-border-strong"}`}
                  >
                    {thumbUrl ? (
                      <Image
                        src={thumbUrl}
                        alt={img.alt ?? product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-bg-muted" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── PRODUCT INFO ─────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Brand + badges */}
          <motion.div
            className="flex items-center gap-2 mb-2 flex-wrap"
            variants={itemVariants}
          >
            <span className="text-xs font-bold tracking-[0.15em] uppercase
              text-primary-500">
              {product.brand}
            </span>
            {product.isNew && (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest
                uppercase bg-primary-500 text-white rounded-full">
                New
              </span>
            )}
            {product.isBestseller && (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest
                uppercase bg-accent-violet text-white rounded-full">
                Bestseller
              </span>
            )}
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-3xl md:text-4xl font-black tracking-tight text-text
              leading-tight mb-3"
            variants={itemVariants}
          >
            {product.name}
          </motion.h1>

          {/* Short description */}
          <motion.p
            className="text-text-muted text-sm mb-4"
            variants={itemVariants}
          >
            {product.shortDescription}
          </motion.p>

          {/* Rating */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            variants={itemVariants}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-border-strong"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-text-muted">
              {product.rating} ({product.reviewCount.toLocaleString()} reviews)
            </span>
          </motion.div>

          {/* Price */}
          <motion.div
            className="flex items-baseline gap-3 mb-2"
            variants={itemVariants}
          >
            <span className="text-4xl font-black text-text">
              ₦{effectivePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-text-faint line-through">
                  ₦{product.price.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-success">
                  Save ₦{(product.price - effectivePrice).toLocaleString()}
                </span>
              </>
            )}
          </motion.div>

          {/* Stock status */}
          <motion.div
            className="flex items-center gap-2 mb-6"
            variants={itemVariants}
          >
            <motion.div
              className={`w-2 h-2 rounded-full
                ${product.stockCount > 0 ? "bg-success" : "bg-danger"}`}
              animate={product.stockCount > 0 ? { scale: [1, 1.3, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className={`text-sm font-medium
              ${product.stockCount === 0
                ? "text-danger"
                : product.stockCount <= 5
                  ? "text-warning"
                  : "text-success"}`}
            >
              {product.stockCount === 0
                ? "Out of Stock"
                : product.stockCount <= 5
                  ? `Only ${product.stockCount} left!`
                  : `In Stock (${product.stockCount} available)`}
            </span>
          </motion.div>

          <motion.div
            className="border-t border-border my-6"
            variants={itemVariants}
          />

          {/* Quantity */}
          <motion.div
            className="flex items-center gap-4 mb-6"
            variants={itemVariants}
          >
            <span className="text-sm text-text-muted font-medium">Qty:</span>
            <div className="flex items-center bg-bg border border-border
              rounded-xl overflow-hidden shadow-card">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-bg-muted text-text-muted
                  hover:text-text transition-colors"
              >
                <Minus size={14} />
              </button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={quantity}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="w-10 text-center text-sm font-bold text-text"
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stockCount, q + 1))
                }
                className="p-2.5 hover:bg-bg-muted text-text-muted
                  hover:text-text transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 mb-8"
            variants={itemVariants}
          >
            {/* Add to Cart */}
            <motion.button
              onClick={handleAddToCart}
              disabled={product.stockCount === 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2
                py-3.5 rounded-xl font-bold text-sm
                bg-bg border-2 border-primary-500 text-primary-500
                hover:bg-primary-50
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </motion.button>

            {/* Buy Now */}
            <motion.button
              onClick={handleBuyNow}
              disabled={product.stockCount === 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2
                py-3.5 rounded-xl font-bold text-sm
                bg-primary-500 hover:bg-primary-400 text-text-onprimary
                shadow-glow-primary
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200"
            >
              <Zap size={16} />
              Buy Now
            </motion.button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="grid grid-cols-3 gap-3"
            variants={itemVariants}
          >
            {[
              { Icon: Shield, label: "100% Original" },
              { Icon: Truck, label: "Free Shipping" },
              { Icon: RotateCcw, label: "7-Day Returns" },
            ].map(({ Icon, label }) => (
              <motion.div
                key={label}
                whileHover={{ y: -2 }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl
                  card hover:border-primary-200 transition-colors"
              >
                <Icon size={16} className="text-primary-500" />
                <span className="text-[10px] text-text-muted text-center">
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── SPECS / DESCRIPTION TABS ─────────────────────── */}
      <motion.div
        className="mt-16 border-t border-border pt-12"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SpecsAndDescription
          product={product}
          portableDescription={portableDescription}
        />
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SPECS + DESCRIPTION TABS
// ─────────────────────────────────────────────────────────────
function SpecsAndDescription({
  product, portableDescription,
}: {
  product: Product;
  portableDescription: unknown[];
}) {
  const [tab, setTab] = useState<"specs" | "description">("specs");

  const hasSpecs = Object.keys(product.specs).length > 0;
  const hasDescription =
    Array.isArray(portableDescription) && portableDescription.length > 0;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-bg-muted rounded-xl w-fit mb-8
        border border-border">
        {(["specs", "description"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative px-5 py-2 rounded-lg text-sm font-semibold
              capitalize transition-colors"
          >
            {tab === t && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg bg-primary-500
                  shadow-[0_0_15px_rgb(var(--color-primary-500)/30%)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className={`relative z-10 transition-colors
              ${tab === t
                ? "text-white"
                : "text-text-muted hover:text-text"}`}
            >
              {t === "specs" ? "Specifications" : "Description"}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "specs" ? (
          <motion.div
            key="specs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {hasSpecs ? (
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], i) => (
                      <motion.tr
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        className={i % 2 === 0 ? "bg-bg-subtle" : "bg-bg"}
                      >
                        <td className="px-6 py-3.5 font-medium text-text-muted
                          w-40 md:w-56 align-top border-r border-border">
                          {key}
                        </td>
                        <td className="px-6 py-3.5 text-text">{val}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-text-faint text-sm">
                No specifications available.
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="description"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl"
          >
            {hasDescription ? (
              <PortableText
                value={portableDescription as Parameters<typeof PortableText>[0]["value"]}
                components={ptComponents}
              />
            ) : product.description ? (
              <p className="text-text-muted leading-relaxed text-base">
                {product.description}
              </p>
            ) : (
              <p className="text-text-faint text-sm">No description available.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}