"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X, ShoppingBag, Minus, Plus, Trash2, ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0 },
};

const drawerVariants = {
  hidden:  { x: "100%" },
  visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit:    { x: "100%", transition: { duration: 0.25, ease: "easeIn" } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: 20  },
  visible: { opacity: 1, x: 0,
    transition: { type: "spring", stiffness: 300, damping: 28 } },
  exit:    { opacity: 0, x: -20, height: 0, marginBottom: 0, padding: 0,
    transition: { duration: 0.25 } },
};

const listVariants = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const emptyVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1,    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function CartDrawer() {
  const {
    items, isOpen, totalItems, subtotal,
    closeCart, removeItem, updateQuantity,
  } = useCart();

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ────────────────────────────────── */}
          <motion.div
            key="backdrop"
            aria-hidden="true"
            onClick={closeCart}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40"
          />

          {/* ── Drawer ──────────────────────────────────── */}
          <motion.aside
            key="drawer"
            aria-label="Shopping cart"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col
              bg-slate-900 border-l border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-cyan-400" size={20} />
                <h2 className="text-lg font-bold text-slate-100">
                  Cart
                  <AnimatePresence mode="wait">
                    {totalItems > 0 && (
                      <motion.span
                        key={totalItems}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1   }}
                        exit={{   opacity: 0, scale: 0.7 }}
                        className="ml-2 text-sm text-slate-400 font-normal"
                      >
                        ({totalItems} {totalItems === 1 ? "item" : "items"})
                      </motion.span>
                    )}
                  </AnimatePresence>
                </h2>
              </div>
              <motion.button
                onClick={closeCart}
                aria-label="Close cart"
                whileHover={{ scale: 1.1 }}
                whileTap={{   scale: 0.9 }}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400
                  hover:text-slate-200 transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* ── Body ──────────────────────────────────── */}
            <AnimatePresence mode="wait">

              {/* Empty state */}
              {items.length === 0 ? (
                <motion.div
                  key="empty"
                  variants={emptyVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex-1 flex flex-col items-center justify-center
                    gap-4 text-center px-8"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-slate-800
                      flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <ShoppingBag size={32} className="text-slate-600" />
                  </motion.div>
                  <div>
                    <p className="text-slate-300 font-medium">Your cart is empty</p>
                    <p className="text-slate-500 text-sm mt-1">
                      Add some gadgets to get started
                    </p>
                  </div>
                  <motion.button
                    onClick={closeCart}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{   scale: 0.97 }}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400
                      text-slate-950 font-semibold text-sm transition-colors"
                  >
                    Continue Shopping
                  </motion.button>
                </motion.div>

              ) : (
                // Items + footer
                <motion.div
                  key="items"
                  className="flex flex-col flex-1 min-h-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{   opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Scrollable list */}
                  <motion.div
                    className="flex-1 overflow-y-auto px-6 py-4 space-y-3"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <AnimatePresence initial={false}>
                      {items.map(({ product, quantity }) => {
                        const price      = product.discountPrice ?? product.price;
                        const primaryImg =
                          product.images.find((i) => i.isPrimary) ?? product.images[0];

                        // ── Image URL guard ──────────────────
                        const imgUrl =
                          primaryImg?.url &&
                          typeof primaryImg.url === "string" &&
                          primaryImg.url.trim() !== ""
                            ? primaryImg.url
                            : null;

                        return (
                          <motion.div
                            key={product.id}
                            layout
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex gap-4 p-3 rounded-xl
                              bg-slate-800/50 border border-slate-700/50"
                          >
                            {/* Thumbnail */}
                            <Link
                              href={`/products/${product.slug}`}
                              onClick={closeCart}
                              className="flex-shrink-0"
                            >
                              <div className="relative w-20 h-20 rounded-lg
                                overflow-hidden bg-slate-700">
                                {imgUrl ? (
                                  <Image
                                    src={imgUrl}
                                    alt={primaryImg?.alt ?? product.name}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                  />
                                ) : (
                                  // Fallback when no image
                                  <div className="absolute inset-0 flex items-center
                                    justify-center bg-slate-800">
                                    <span className="text-[9px] text-slate-500
                                      font-bold uppercase tracking-widest text-center px-1">
                                      {product.brand}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </Link>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-semibold tracking-widest
                                uppercase text-cyan-400/70">
                                {product.brand}
                              </p>
                              <Link
                                href={`/products/${product.slug}`}
                                onClick={closeCart}
                              >
                                <p className="text-sm font-medium text-slate-200
                                  leading-snug line-clamp-2 hover:text-cyan-300
                                  transition-colors">
                                  {product.name}
                                </p>
                              </Link>

                              {/* Animated price */}
                              <AnimatePresence mode="wait">
                                <motion.p
                                  key={`${product.id}-${quantity}`}
                                  initial={{ opacity: 0, y: -6 }}
                                  animate={{ opacity: 1, y:  0 }}
                                  exit={{   opacity: 0, y:  6 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-1 text-sm font-bold text-slate-50"
                                >
                                  ₦{(price * quantity).toLocaleString()}
                                </motion.p>
                              </AnimatePresence>

                              {/* Quantity controls */}
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1
                                  bg-slate-700 rounded-lg p-0.5">
                                  <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => updateQuantity(product.id, quantity - 1)}
                                    className="p-1 rounded hover:bg-slate-600
                                      text-slate-300 transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={12} />
                                  </motion.button>

                                  <AnimatePresence mode="wait">
                                    <motion.span
                                      key={quantity}
                                      initial={{ opacity: 0, y: -6 }}
                                      animate={{ opacity: 1, y:  0 }}
                                      exit={{   opacity: 0, y:  6 }}
                                      transition={{ duration: 0.15 }}
                                      className="w-6 text-center text-sm
                                        font-semibold text-slate-100"
                                    >
                                      {quantity}
                                    </motion.span>
                                  </AnimatePresence>

                                  <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => updateQuantity(product.id, quantity + 1)}
                                    className="p-1 rounded hover:bg-slate-600
                                      text-slate-300 transition-colors"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={12} />
                                  </motion.button>
                                </div>

                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{   scale: 0.9 }}
                                  onClick={() => removeItem(product.id)}
                                  className="p-1.5 rounded-lg hover:bg-rose-500/20
                                    text-slate-500 hover:text-rose-400 transition-colors"
                                  aria-label="Remove item"
                                >
                                  <Trash2 size={13} />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>

                  {/* ── Footer ──────────────────────────── */}
                  <motion.div
                    className="border-t border-slate-800 px-6 py-5 space-y-4"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0  }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                  >
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Subtotal</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={subtotal}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y:  0 }}
                          exit={{   opacity: 0, y:  6 }}
                          transition={{ duration: 0.2 }}
                          className="text-slate-100 font-semibold"
                        >
                          ₦{subtotal.toLocaleString()}
                        </motion.span>
                      </AnimatePresence>
                    </div>

                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Shipping</span>
                      <span className="text-emerald-400 text-xs font-medium">
                        Calculated at checkout
                      </span>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{   scale: 0.99 }}
                    >
                      <Link
                        href="/checkout"
                        onClick={closeCart}
                        className="flex items-center justify-center gap-2 w-full py-3.5
                          rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400
                          hover:from-cyan-400 hover:to-cyan-300
                          text-slate-950 font-bold text-sm
                          shadow-[0_0_25px_rgba(6,182,212,0.35)]
                          hover:shadow-[0_0_35px_rgba(6,182,212,0.5)]
                          transition-all duration-200"
                      >
                        Proceed to Checkout
                        <ArrowRight size={15} />
                      </Link>
                    </motion.div>

                    <Link
                      href="/products"
                      onClick={closeCart}
                      className="block text-center text-xs text-slate-500
                        hover:text-cyan-400 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}