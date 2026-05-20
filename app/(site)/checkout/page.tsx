"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft, Lock, CheckCircle,
  Zap, Truck, MessageCircle, ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "2349055427487";
const FREE_SHIPPING_THRESHOLD = 50_000;
const SHIPPING_COST = 3_500;
const TAX_RATE = 0.075;

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "Nigeria",
};

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0, y: -20,
    transition: { duration: 0.3 }
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.06, duration: 0.35 },
  }),
};

// ─────────────────────────────────────────────────────────────
// FIELD COMPONENT
// ─────────────────────────────────────────────────────────────
function Field({
  label, name, type = "text", placeholder, value, onChange, span = 1,
}: {
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  span?: 1 | 2;
}) {
  return (
    <div className={span === 2 ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-3
          text-sm text-slate-200 placeholder:text-slate-600
          focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20
          transition-all duration-200"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [step, setStep] = useState<"form" | "processing" | "success">("form");

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + tax;

  const fmtNaira = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    await new Promise((r) => setTimeout(r, 1800));

    // Build WhatsApp message
    const orderLines = items
      .map(({ product, quantity }) => {
        const price = product.discountPrice ?? product.price;
        return `  • ${product.name} × ${quantity} — ${fmtNaira(price * quantity)}`;
      })
      .join("\n");

    const message = `
🛒 *New Order — Horlarz Gadgets*

*Customer Details*
Name:    ${formData.firstName} ${formData.lastName}
Phone:   ${formData.phone}
Email:   ${formData.email}
Address: ${formData.address}, ${formData.city}, ${formData.state}, ${formData.country}

*Order Items*
${orderLines}

*Order Summary*
Subtotal:  ${fmtNaira(subtotal)}
Shipping:  ${shippingCost === 0 ? "FREE" : fmtNaira(shippingCost)}
Tax (7.5%): ${fmtNaira(tax)}
*Total:    ${fmtNaira(total)}*

Please confirm this order and provide payment instructions. Thank you!
    `.trim();

    clearCart();
    setStep("success");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // ── Empty cart ───────────────────────────────────────────
  if (items.length === 0 && step !== "success") {
    return (
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-slate-950 flex flex-col items-center
          justify-center text-center px-4 gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
          <ShoppingBag size={28} className="text-slate-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-100">Your cart is empty</h2>
        <p className="text-slate-400">Add some gadgets before checking out.</p>
        <Link
          href="/products"
          className="mt-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950
            font-bold text-sm hover:bg-cyan-400 transition-colors"
        >
          Browse Products
        </Link>
      </motion.div>
    );
  }

  // ── Processing ───────────────────────────────────────────
  if (step === "processing") {
    return (
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-slate-950 flex flex-col items-center
          justify-center gap-6"
      >
        {/* Spinning ring */}
        <div className="relative w-20 h-20">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-cyan-500/20"
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent
              border-t-cyan-500"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={20} className="text-cyan-400" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-200 font-bold text-lg">Processing your order…</p>
          <p className="text-slate-500 text-sm mt-1">
            Preparing your WhatsApp message
          </p>
        </div>
      </motion.div>
    );
  }

  // ── Success ──────────────────────────────────────────────
  if (step === "success") {
    return (
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-slate-950 flex flex-col items-center
          justify-center text-center px-4 gap-6"
      >
        {/* Success icon */}
        <motion.div
          className="w-24 h-24 rounded-full bg-emerald-500/15 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
          >
            <CheckCircle size={52} className="text-emerald-400" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <h2 className="text-3xl font-black text-slate-50 mb-3">
            Order Submitted!
          </h2>
          <p className="text-slate-400 max-w-sm leading-relaxed mx-auto">
            Your order has been sent to WhatsApp. Our team will confirm your
            order and provide payment details shortly.
          </p>
        </motion.div>

        {/* WhatsApp reminder */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
        >
          <MessageCircle size={15} />
          Check WhatsApp to complete your order
        </motion.div>

        <motion.div
          className="flex gap-3 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700
              text-slate-300 font-semibold text-sm hover:bg-slate-700 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold
              text-sm hover:bg-cyan-400 transition-colors"
          >
            Shop More
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // ── Checkout form ────────────────────────────────────────
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-slate-950"
    >
      <div className="container-app py-10">

        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-10"
          custom={0}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/products"
            className="p-2 rounded-xl bg-slate-800 border border-slate-700
              text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-50">
              Checkout
            </h1>
            <p className="text-slate-500 text-sm">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
            <Lock size={12} className="text-emerald-400" />
            Secure order
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">

            {/* ── LEFT: Shipping form ───────────────────── */}
            <div className="space-y-6">

              {/* Shipping details */}
              <motion.section
                custom={1}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Truck size={18} className="text-cyan-400" />
                  <h2 className="font-bold text-slate-200">Delivery Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="First Name" name="firstName"
                    value={formData.firstName} onChange={handleChange}
                    placeholder="John"
                  />
                  <Field
                    label="Last Name" name="lastName"
                    value={formData.lastName} onChange={handleChange}
                    placeholder="Doe"
                  />
                  <Field
                    label="Email Address" name="email" type="email"
                    value={formData.email} onChange={handleChange}
                    placeholder="john@example.com" span={2}
                  />
                  <Field
                    label="WhatsApp / Phone" name="phone" type="tel"
                    value={formData.phone} onChange={handleChange}
                    placeholder="+234 800 000 0000" span={2}
                  />
                  <Field
                    label="Delivery Address" name="address"
                    value={formData.address} onChange={handleChange}
                    placeholder="123 Main Street" span={2}
                  />
                  <Field
                    label="City" name="city"
                    value={formData.city} onChange={handleChange}
                    placeholder="Lagos"
                  />
                  <Field
                    label="State" name="state"
                    value={formData.state} onChange={handleChange}
                    placeholder="Lagos State"
                  />
                  <Field
                    label="Country" name="country"
                    value={formData.country} onChange={handleChange}
                    span={2}
                  />
                </div>
              </motion.section>

              {/* WhatsApp notice */}
              <motion.div
                custom={2}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="flex items-start gap-3 p-4 rounded-2xl
                  bg-emerald-500/8 border border-emerald-500/20"
              >
                <MessageCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-300 mb-0.5">
                    Order via WhatsApp
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    After clicking <span className="text-slate-200 font-medium">Place Order</span>,
                    you'll be redirected to WhatsApp with your full order details.
                    Our team will confirm availability and send payment instructions within minutes.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: Order summary ──────────────────── */}
            <motion.aside
              custom={3}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 sticky top-24">
                <h2 className="font-bold text-slate-200 mb-5">Order Summary</h2>

                {/* Items list */}
                <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }, i) => {
                    const price = product.discountPrice ?? product.price;
                    const img = product.images.find((x) => x.isPrimary) ?? product.images[0];

                    // ── Image URL guard ──────────────────
                    const imgUrl =
                      img?.url && typeof img.url === "string" && img.url.trim() !== ""
                        ? img.url
                        : null;

                    return (
                      <motion.div
                        key={product.id}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex gap-3 items-center"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden
                          bg-slate-800 flex-shrink-0">
                          {imgUrl ? (
                            <Image
                              src={imgUrl}
                              alt={img?.alt ?? product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center
                              justify-center bg-slate-800">
                              <span className="text-[8px] text-slate-600
                                font-bold uppercase tracking-widest text-center px-0.5">
                                {product.brand}
                              </span>
                            </div>
                          )}
                          {/* Quantity badge */}
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full
                            bg-cyan-500 text-slate-950 text-[9px] font-bold
                            flex items-center justify-center">
                            {quantity}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-300 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">{product.brand}</p>
                        </div>

                        <p className="text-sm font-semibold text-slate-200 flex-shrink-0">
                          {fmtNaira(price * quantity)}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-t border-slate-800 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span>{fmtNaira(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-emerald-400 font-medium" : ""}>
                      {shippingCost === 0 ? "FREE" : fmtNaira(shippingCost)}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-[10px] text-slate-600">
                      Free delivery on orders over {fmtNaira(FREE_SHIPPING_THRESHOLD)}
                    </p>
                  )}
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Tax (7.5%)</span>
                    <span>{fmtNaira(tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold
                    text-slate-50 pt-2 border-t border-slate-800">
                    <span>Total</span>
                    <span className="text-gradient-cyan">{fmtNaira(total)}</span>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-4 rounded-xl font-black text-sm
                    bg-gradient-to-r from-emerald-500 to-emerald-400 text-white
                    hover:from-emerald-400 hover:to-emerald-300
                    shadow-[0_0_25px_rgba(16,185,129,0.35)]
                    hover:shadow-[0_0_40px_rgba(16,185,129,0.55)]
                    transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Place Order on WhatsApp
                </motion.button>

                {/* Lock note */}
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <Lock size={10} className="text-slate-600" />
                  <p className="text-[10px] text-slate-600">
                    Your details are safe and never stored
                  </p>
                </div>

                <p className="text-center text-[10px] text-slate-600 mt-2">
                  By placing your order, you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-slate-400">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </motion.aside>
          </div>
        </form>
      </div>
    </motion.div>
  );
}