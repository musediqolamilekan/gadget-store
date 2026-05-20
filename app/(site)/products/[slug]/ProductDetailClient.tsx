"use client";

import { useState }      from "react";
import Image             from "next/image";
import Link              from "next/link";
import { PortableText }  from "@portabletext/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Zap, Star, Shield,
  Truck, RotateCcw, Check, Minus, Plus,
} from "lucide-react";
import { Product }    from "@/types";
import { useCart }    from "@/context/CartContext";

// ─────────────────────────────────────────────────────────────
// PORTABLE TEXT COMPONENTS
// ─────────────────────────────────────────────────────────────
const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-slate-300 leading-relaxed text-base mb-4">{children}</p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-lg font-bold text-slate-100 mt-6 mb-2">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-base font-semibold text-slate-200 mt-4 mb-1">{children}</h4>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-slate-100">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-slate-300">{children}</em>
    ),
  },
};

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const imageVariants = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const thumbnailVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.35 },
  }),
};

// ─────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────
interface Props {
  product:             Product;
  portableDescription: unknown[];   // Portable Text blocks from Sanity
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ProductDetailClient({ product, portableDescription }: Props) {
  const { addItem, openCart } = useCart();
  const [activeImage,   setActiveImage]   = useState(0);
  const [quantity,      setQuantity]      = useState(1);
  const [addedToCart,   setAddedToCart]   = useState(false);

  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount    = product.discountPrice !== undefined;
  const discountPct    = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  // Safe image URL guard
  const activeImg = product.images[activeImage] ?? product.images[0];
  const activeUrl =
    activeImg?.url && activeImg.url.trim() !== "" ? activeImg.url : null;

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

      {/* ── Breadcrumb ────────────────────────────────────── */}
      <motion.nav
        className="flex items-center gap-2 text-xs text-slate-500 mb-8 flex-wrap"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/"        className="hover:text-slate-300 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-slate-300 transition-colors">Products</Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-slate-300 transition-colors capitalize"
        >
          {product.category.replace(/-/g, " ")}
        </Link>
        <span>/</span>
        <span className="text-slate-400 line-clamp-1">{product.name}</span>
      </motion.nav>

      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

        {/* ── IMAGE GALLERY ───────────────────────────────── */}
        <div className="space-y-3">
          {/* Main image */}
          <motion.div
            className="relative aspect-square rounded-2xl overflow-hidden
              bg-slate-800/50 border border-slate-700/60"
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
                  animate={{ opacity: 1, scale: 1   }}
                  exit={{   opacity: 0, scale: 0.97 }}
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
                    bg-gradient-to-br from-slate-800 to-slate-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-slate-600 text-sm">{product.brand}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {hasDiscount && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 text-xs font-bold tracking-widest
                  uppercase bg-rose-500 text-white rounded-full">
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
                        ? "border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                        : "border-slate-700 hover:border-slate-500"}`}
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
                      <div className="absolute inset-0 bg-slate-800" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── PRODUCT INFO ─────────────────────────────────── */}
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
            <span className="text-xs font-bold tracking-[0.15em] uppercase text-cyan-400">
              {product.brand}
            </span>
            {product.isNew && (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest
                uppercase bg-cyan-500 text-slate-950 rounded-full">
                New
              </span>
            )}
            {product.isBestseller && (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest
                uppercase bg-violet-600 text-white rounded-full">
                Bestseller
              </span>
            )}
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-3xl md:text-4xl font-black tracking-tight text-slate-50
              leading-tight mb-3"
            variants={itemVariants}
          >
            {product.name}
          </motion.h1>

          {/* Short description */}
          <motion.p
            className="text-slate-400 text-sm mb-4"
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
                      : "text-slate-600"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-slate-400">
              {product.rating} ({product.reviewCount.toLocaleString()} reviews)
            </span>
          </motion.div>

          {/* Price */}
          <motion.div
            className="flex items-baseline gap-3 mb-2"
            variants={itemVariants}
          >
            <span className="text-4xl font-black text-slate-50">
              ₦{effectivePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-slate-500 line-through">
                  ₦{product.price.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  Save ₦{(product.price - effectivePrice).toLocaleString()}
                </span>
              </>
            )}
          </motion.div>

          {/* Stock */}
          <motion.div
            className="flex items-center gap-2 mb-6"
            variants={itemVariants}
          >
            <motion.div
              className={`w-2 h-2 rounded-full ${
                product.stockCount > 0 ? "bg-emerald-400" : "bg-rose-500"
              }`}
              animate={product.stockCount > 0 ? { scale: [1, 1.3, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className={`text-sm font-medium ${
              product.stockCount === 0
                ? "text-rose-400"
                : product.stockCount <= 5
                  ? "text-amber-400"
                  : "text-emerald-400"
            }`}>
              {product.stockCount === 0
                ? "Out of Stock"
                : product.stockCount <= 5
                  ? `Only ${product.stockCount} left!`
                  : `In Stock (${product.stockCount} available)`}
            </span>
          </motion.div>

          <motion.div
            className="border-t border-slate-800 my-6"
            variants={itemVariants}
          />

          {/* Quantity */}
          <motion.div
            className="flex items-center gap-4 mb-6"
            variants={itemVariants}
          >
            <span className="text-sm text-slate-400 font-medium">Qty:</span>
            <div className="flex items-center bg-slate-800 rounded-xl
              border border-slate-700 overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Minus size={14} />
              </button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={quantity}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y:  0 }}
                  exit={{   opacity: 0, y:  8 }}
                  transition={{ duration: 0.15 }}
                  className="w-10 text-center text-sm font-bold text-slate-100"
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                className="p-2.5 hover:bg-slate-700 text-slate-300 transition-colors"
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
            <motion.button
              onClick={handleAddToCart}
              disabled={product.stockCount === 0}
              whileHover={{ scale: product.stockCount > 0 ? 1.02 : 1 }}
              whileTap={{   scale: product.stockCount > 0 ? 0.97 : 1 }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5
                rounded-xl font-bold text-sm transition-all duration-200
                ${addedToCart
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-800 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span
                    key="added"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1   }}
                    exit={{   opacity: 0, scale: 0.8 }}
                  >
                    <Check size={16} /> Added to Cart!
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1   }}
                    exit={{   opacity: 0, scale: 0.8 }}
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              onClick={handleBuyNow}
              disabled={product.stockCount === 0}
              whileHover={{ scale: product.stockCount > 0 ? 1.02 : 1 }}
              whileTap={{   scale: product.stockCount > 0 ? 0.97 : 1 }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5
                rounded-xl font-bold text-sm
                bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950
                hover:from-cyan-400 hover:to-cyan-300
                shadow-[0_0_25px_rgba(6,182,212,0.4)]
                hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200"
            >
              <Zap size={16} /> Buy Now
            </motion.button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="grid grid-cols-3 gap-3"
            variants={itemVariants}
          >
            {[
              { Icon: Shield,    label: "2-Year Warranty" },
              { Icon: Truck,     label: "Free Shipping"   },
              { Icon: RotateCcw, label: "30-Day Returns"  },
            ].map(({ Icon, label }) => (
              <motion.div
                key={label}
                whileHover={{ y: -2 }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl
                  bg-slate-800/50 border border-slate-700/50 transition-colors
                  hover:border-cyan-500/30"
              >
                <Icon size={16} className="text-cyan-400" />
                <span className="text-[10px] text-slate-400 text-center">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── SPECS / DESCRIPTION TABS ─────────────────────── */}
      <motion.div
        className="mt-16 border-t border-slate-800 pt-12"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SpecsAndDescription product={product} portableDescription={portableDescription} />
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SPECS + DESCRIPTION TABS
// ─────────────────────────────────────────────────────────────
function SpecsAndDescription({
  product,
  portableDescription,
}: {
  product:             Product;
  portableDescription: unknown[];
}) {
  const [tab, setTab] = useState<"specs" | "description">("specs");

  const hasSpecs       = Object.keys(product.specs).length > 0;
  const hasDescription =
    Array.isArray(portableDescription) && portableDescription.length > 0;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl w-fit mb-8">
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
                className="absolute inset-0 rounded-lg bg-cyan-500
                  shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors ${
                tab === t ? "text-slate-950" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t === "specs" ? "Specifications" : "Description"}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === "specs" ? (
          <motion.div
            key="specs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{   opacity: 0, y: -8  }}
            transition={{ duration: 0.3 }}
          >
            {hasSpecs ? (
              <div className="overflow-hidden rounded-2xl border border-slate-800">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], i) => (
                      <motion.tr
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0   }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        className={i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/20"}
                      >
                        <td className="px-6 py-3.5 font-medium text-slate-400
                          w-40 md:w-56 align-top">
                          {key}
                        </td>
                        <td className="px-6 py-3.5 text-slate-200">{val}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No specifications available.</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="description"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{   opacity: 0, y: -8  }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl"
          >
            {hasDescription ? (
              <PortableText
                value={portableDescription as Parameters<typeof PortableText>[0]["value"]}
                components={ptComponents}
              />
            ) : product.description ? (
              <p className="text-slate-300 leading-relaxed text-base">
                {product.description}
              </p>
            ) : (
              <p className="text-slate-500 text-sm">No description available.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}