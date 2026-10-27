"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft, Lock, CheckCircle, Zap, Truck,
  ShoppingBag, CreditCard, AlertCircle, Package,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/types";

// ── Types ───────────────────────────────────────────────────────
interface FormData {
  firstName: string; lastName: string;
  email: string; phone: string;
  address: string; city: string;
  state: string; country: string;
}
const INITIAL_FORM: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", city: "", state: "", country: "Nigeria",
};

// ── Animation Variants ──────────────────────────────────────────
const pageVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.3 } },
};
const sectionVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
};

// ── Field Component ─────────────────────────────────────────────
function Field({
  label, name, type = "text", placeholder, value, onChange, span = 1, required = true,
}: {
  label: string; name: keyof FormData; type?: string; placeholder?: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  span?: 1 | 2; required?: boolean;
}) {
  return (
    <div className={span === 2 ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-semibold text-text-muted mb-1.5">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="w-full bg-bg-subtle border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-500/20 transition-all duration-200"
      />
    </div>
  );
}

// ── Paystack inline popup ───────────────────────────────────────
declare global {
  interface Window {
    PaystackPop: {
      setup(opts: {
        key: string; email: string; amount: number; currency?: string;
        ref: string; metadata?: Record<string, unknown>;
        callback: (res: { reference: string; status: string }) => void;
        onClose: () => void;
      }): { openIframe(): void };
    };
  }
}

// ── Page ────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [step, setStep] = useState<"form" | "processing" | "success" | "error">("form");
  const [orderNumber, setOrderNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [paystackReady, setPaystackReady] = useState(false);

  // Load Paystack script
  useEffect(() => {
    if (document.querySelector('script[src*="paystack"]')) { setPaystackReady(true); return; }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => setPaystackReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("holarz_buy_now");
      if (raw) setBuyNowItem(JSON.parse(raw) as CartItem);
    } catch {}
  }, []);

  const activeItems = buyNowItem ? [buyNowItem] : items;
  const subtotal = activeItems.reduce((acc, { product, quantity }) => acc + (product.discountPrice ?? product.price) * quantity, 0);
  const total = subtotal; // shipping calculated separately

  const fmtNaira = (n: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  // ── Save Order to Sanity after payment success ─────────────────
  const saveOrder = useCallback(async (paystackRef: string) => {
    setStep("processing");
    try {
      const payload = {
        reference: paystackRef,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
        items: activeItems.map(({ product, quantity }) => ({
          productId: product.id,
          productName: product.name,
          productSlug: typeof product.slug === "string" ? product.slug : (product.slug as { current: string })?.current ?? "",
          brand: product.brand ?? "",
          category: product.category ?? "",
          imageUrl: product.images?.find((x) => x.isPrimary)?.url ?? product.images?.[0]?.url ?? "",
          unitPrice: product.discountPrice ?? product.price,
          quantity,
          lineTotal: (product.discountPrice ?? product.price) * quantity,
        })),
        subtotal,
        shippingFee: 0,
        total,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setOrderNumber(data.orderNumber);
        if (buyNowItem) {
          try { sessionStorage.removeItem("holarz_buy_now"); } catch {}
        } else {
          clearCart();
        }
        setStep("success");
      } else {
        setErrorMsg(data.error ?? "Payment was received but order creation failed. Contact support with ref: " + paystackRef);
        setStep("error");
      }
    } catch {
      setErrorMsg("Network error while saving order. Please contact support with ref: " + paystackRef);
      setStep("error");
    }
  }, [formData, activeItems, subtotal, total, buyNowItem, clearCart]);

  // ── Launch Paystack popup ──────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paystackReady || !window.PaystackPop) {
      alert("Payment system is loading, please try again in a moment.");
      return;
    }

    const ref = `HLZ-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
      email: formData.email,
      amount: Math.round(total * 100), // kobo
      currency: "NGN",
      ref,
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: `${formData.firstName} ${formData.lastName}` },
          { display_name: "Phone", variable_name: "phone", value: formData.phone },
          { display_name: "Delivery Address", variable_name: "address", value: `${formData.address}, ${formData.city}, ${formData.state}` },
        ],
      },
      callback: (response) => {
        if (response.status === "success") {
          saveOrder(response.reference);
        } else {
          setErrorMsg("Payment was not completed. Please try again.");
          setStep("error");
        }
      },
      onClose: () => {
        // User closed popup — stay on form
      },
    });

    handler.openIframe();
  };

  // ── Empty Cart ─────────────────────────────────────────────────
  if (activeItems.length === 0 && step !== "success") {
    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible"
        className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-4 gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-bg-muted flex items-center justify-center">
          <ShoppingBag size={28} className="text-text-faint" />
        </div>
        <h2 className="text-2xl font-black text-text">Your cart is empty</h2>
        <p className="text-text-muted">Add some gadgets before checking out.</p>
        <Link href="/products" className="mt-2 btn-primary text-sm px-6 py-3">Browse Products</Link>
      </motion.div>
    );
  }

  // ── Processing ─────────────────────────────────────────────────
  if (step === "processing") {
    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible"
        className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6"
      >
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-border" />
          <motion.div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500"
            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={20} className="text-primary-500" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-text font-bold text-lg">Confirming your payment…</p>
          <p className="text-text-muted text-sm mt-1">Saving your order to our system</p>
        </div>
      </motion.div>
    );
  }

  // ── Success ────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible"
        className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-4 gap-6"
      >
        <motion.div className="w-24 h-24 rounded-full bg-success-bg flex items-center justify-center"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
        >
          <CheckCircle size={52} className="text-success" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="text-3xl font-black text-text mb-2">Order Confirmed! 🎉</h2>
          {orderNumber && (
            <p className="text-lg font-mono font-bold text-primary-500 mb-3">{orderNumber}</p>
          )}
          <p className="text-text-muted max-w-sm leading-relaxed mx-auto">
            Your payment was successful and your order has been placed. We&apos;ll send a confirmation soon and dispatch your items promptly.
          </p>
        </motion.div>
        <motion.div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-success-bg border border-success/20 text-success text-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <Package size={15} />
          Your order is now being processed
        </motion.div>
        <motion.div className="flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Link href="/" className="px-6 py-3 rounded-xl btn-outline font-semibold text-sm">Back to Home</Link>
          <Link href="/products" className="px-6 py-3 rounded-xl btn-primary text-sm">Shop More</Link>
        </motion.div>
      </motion.div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────
  if (step === "error") {
    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible"
        className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-4 gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-danger-bg flex items-center justify-center">
          <AlertCircle size={32} className="text-danger" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-text mb-2">Something went wrong</h2>
          <p className="text-text-muted max-w-sm mx-auto text-sm leading-relaxed">{errorMsg}</p>
        </div>
        <button onClick={() => setStep("form")} className="px-6 py-3 rounded-xl btn-primary text-sm">Try Again</button>
      </motion.div>
    );
  }

  // ── Checkout Form ──────────────────────────────────────────────
  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="min-h-screen bg-bg">
      <div className="container-app py-10">
        {/* Header */}
        <motion.div className="flex items-center gap-4 mb-10" custom={0} variants={sectionVariants} initial="hidden" animate="visible">
          <Link href="/products" className="p-2 rounded-xl bg-bg-muted border border-border text-text-muted hover:text-text transition-colors">
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-text">Checkout</h1>
            <p className="text-text-faint text-sm">{activeItems.length} {activeItems.length === 1 ? "item" : "items"}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-text-faint">
            <Lock size={12} className="text-success" />
            Secured by Paystack
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* LEFT: Shipping form */}
            <div className="space-y-6">
              <motion.section custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Truck size={18} className="text-primary-500" />
                  <h2 className="font-bold text-text">Delivery Details</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name"       name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
                  <Field label="Last Name"        name="lastName"  value={formData.lastName}  onChange={handleChange} placeholder="Doe" />
                  <Field label="Email Address"    name="email"     value={formData.email}     onChange={handleChange} type="email"  placeholder="john@example.com"   span={2} />
                  <Field label="WhatsApp / Phone" name="phone"     value={formData.phone}     onChange={handleChange} type="tel"    placeholder="+234 800 000 0000" span={2} />
                  <Field label="Delivery Address" name="address"   value={formData.address}   onChange={handleChange} placeholder="123 Main Street"          span={2} />
                  <Field label="City"             name="city"      value={formData.city}      onChange={handleChange} placeholder="Lagos" />
                  <Field label="State"            name="state"     value={formData.state}     onChange={handleChange} placeholder="Lagos State" />
                  <Field label="Country"          name="country"   value={formData.country}   onChange={handleChange} span={2} />
                </div>
              </motion.section>

              {/* Paystack notice */}
              <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible"
                className="flex items-start gap-3 p-4 rounded-2xl bg-primary-50 border border-primary-200/50"
              >
                <CreditCard size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-primary-600 mb-0.5">Secure Online Payment</p>
                  <p className="text-xs text-text-muted leading-relaxed">
                    You&apos;ll be taken to <span className="text-text font-medium">Paystack</span>&apos;s secure payment page to complete your purchase. We accept cards, bank transfers, and USSD.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Order summary */}
            <motion.aside custom={3} variants={sectionVariants} initial="hidden" animate="visible">
              <div className="card p-5 sticky top-24">
                <h2 className="font-bold text-text mb-5">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
                  {activeItems.map(({ product, quantity }) => {
                    const price = product.discountPrice ?? product.price;
                    const img   = product.images?.find((x) => x.isPrimary) ?? product.images?.[0];
                    const imgUrl = img?.url && typeof img.url === "string" && img.url.trim() !== "" ? img.url : null;
                    return (
                      <div key={product.id} className="flex gap-3 items-center">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-bg-muted flex-shrink-0">
                          {imgUrl ? (
                            <Image src={imgUrl} alt={img?.alt ?? product.name} fill sizes="48px" className="object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[8px] text-text-faint font-bold uppercase tracking-widest text-center px-0.5">{product.brand}</span>
                            </div>
                          )}
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-500 text-white text-[9px] font-bold flex items-center justify-center">{quantity}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text line-clamp-1">{product.name}</p>
                          <p className="text-xs text-text-faint">{product.brand}</p>
                        </div>
                        <p className="text-sm font-semibold text-text flex-shrink-0">{fmtNaira(price * quantity)}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-t border-border pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Subtotal</span><span>{fmtNaira(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>Delivery</span>
                    <span className="text-success font-medium">Calculated after order</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-text pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-gradient-primary">{fmtNaira(total)}</span>
                  </div>
                </div>

                {/* Paystack button */}
                <motion.button
                  type="submit"
                  disabled={!paystackReady}
                  whileHover={{ scale: paystackReady ? 1.02 : 1 }}
                  whileTap={{ scale: paystackReady ? 0.98 : 1 }}
                  className="w-full mt-6 py-4 rounded-xl font-black text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:opacity-90 shadow-lg shadow-primary-500/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {paystackReady ? (
                    <><CreditCard size={16} /> Pay {fmtNaira(total)} Securely</>
                  ) : (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Loading Payment…</>
                  )}
                </motion.button>

                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <Lock size={10} className="text-text-faint" />
                  <p className="text-[10px] text-text-faint">256-bit SSL · Secured by Paystack</p>
                </div>
              </div>
            </motion.aside>
          </div>
        </form>
      </div>
    </motion.div>
  );
}