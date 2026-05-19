"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    totalItems,
    subtotal,
    closeCart,
    removeItem,
    updateQuantity,
  } = useCart();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeCart]);

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={`fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* ── Drawer panel ──────────────────────────────────── */}
      <aside
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col
          bg-slate-900 border-l border-slate-800
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-cyan-400" size={20} />
            <h2 className="text-lg font-bold text-slate-100">
              Cart
              {totalItems > 0 && (
                <span className="ml-2 text-sm text-slate-400 font-normal">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Items list ──────────────────────────────────── */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
              <ShoppingBag size={32} className="text-slate-600" />
            </div>
            <div>
              <p className="text-slate-300 font-medium">Your cart is empty</p>
              <p className="text-slate-500 text-sm mt-1">
                Add some gadgets to get started
              </p>
            </div>
            <button
              onClick={closeCart}
              className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map(({ product, quantity }) => {
                const price = product.discountPrice ?? product.price;
                const primaryImg =
                  product.images.find((i) => i.isPrimary) ?? product.images[0];
                return (
                  <div
                    key={product.id}
                    className="flex gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={closeCart}
                      className="flex-shrink-0"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-700">
                        <Image
                          src={primaryImg.url}
                          alt={primaryImg.alt}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold tracking-widest uppercase text-cyan-400/70">
                        {product.brand}
                      </p>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={closeCart}
                      >
                        <p className="text-sm font-medium text-slate-200 leading-snug line-clamp-2 hover:text-cyan-300 transition-colors">
                          {product.name}
                        </p>
                      </Link>
                      <p className="mt-1 text-sm font-bold text-slate-50">
                        ₦{(price * quantity).toLocaleString()}
                      </p>

                      {/* Quantity + remove */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(product.id, quantity - 1)
                            }
                            className="p-1 rounded hover:bg-slate-600 text-slate-300 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-slate-100">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(product.id, quantity + 1)
                            }
                            className="p-1 rounded hover:bg-slate-600 text-slate-300 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Footer / Checkout ───────────────────────── */}
            <div className="border-t border-slate-800 px-6 py-5 space-y-4">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-100 font-semibold">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Shipping</span>
                <span className="text-emerald-400 text-xs font-medium">
                  Calculated at checkout
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl
                  bg-gradient-to-r from-cyan-500 to-cyan-400
                  hover:from-cyan-400 hover:to-cyan-300
                  text-slate-950 font-bold text-sm
                  shadow-[0_0_25px_rgba(6,182,212,0.35)]
                  hover:shadow-[0_0_35px_rgba(6,182,212,0.5)]
                  transition-all duration-200"
              >
                Proceed to Checkout
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/products"
                onClick={closeCart}
                className="block text-center text-xs text-slate-500 hover:text-cyan-400 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
