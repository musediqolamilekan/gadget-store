"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Shield, Truck, RotateCcw, Minus, Plus,
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

// WhatsApp SVG — shared between CTAs
const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.109.549 4.09 1.508 5.814L.057 23.25l5.575-1.462A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.371l-.361-.214-3.31.869.882-3.23-.235-.373A9.872 9.872 0 012.1 12c0-5.457 4.444-9.9 9.9-9.9 5.457 0 9.9 4.443 9.9 9.9 0 5.458-4.443 9.9-9.9 9.9z" />
  </svg>
);

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
  const { addItem } = useCart();
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

  const waMessage = encodeURIComponent(
    `Hello HolarzGadgets 👋\n\nI'm interested in:\n*${product.name}*\nPrice: ₦${effectivePrice.toLocaleString()}\n\nPlease confirm availability and delivery details. Thank you!`
  );

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
            className="flex gap-3 mb-8"
            variants={itemVariants}
          >
            {/* WhatsApp */}
            <motion.a
              href={`https://wa.me/2349055427487?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2
                py-3.5 rounded-xl font-bold text-sm text-white
                bg-accent-green hover:opacity-90
                shadow-[0_4px_20px_rgb(var(--color-accent-green)/30%)]
                transition-all duration-200"
            >
              <WaIcon />
              Chat on WhatsApp
            </motion.a>

            {/* Call */}
            <motion.a
              href="tel:+2349055427487"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2
                py-3.5 rounded-xl font-bold text-sm btn-outline"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="w-4 h-4 flex-shrink-0">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
              </svg>
              Call Us
            </motion.a>
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