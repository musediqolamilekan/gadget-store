"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  CreditCard,
  Lock,
  CheckCircle,
  Zap,
  Truck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

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
  postalCode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
  cardName: string;
}

const INITIAL_FORM: FormData = {
  firstName: "", lastName: "",
  email: "", phone: "",
  address: "", city: "",
  state: "", country: "Nigeria",
  postalCode: "", cardNumber: "",
  cardExpiry: "", cardCVC: "",
  cardName: "",
};

// ─────────────────────────────────────────────────────────────
// FIELD COMPONENT
// ─────────────────────────────────────────────────────────────
function Field({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  span = 1,
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
          transition-all"
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

  const shippingCost = subtotal >= 99 ? 0 : 9.99;
  const tax = subtotal * 0.075;
  const total = subtotal + shippingCost + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show processing state
    setStep("processing");

    // Optional delay so the user sees the processing animation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Build order items
    const orderItems = items
      .map(({ product, quantity }) => {
        const price = product.discountPrice ?? product.price;

        return `• ${product.name} x${quantity} - ₦${(
          price * quantity
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      })
      .join("\n");

    const message = `
Hello Holarz Gadgets,

I would like to place an order.

Name: ${formData.firstName} ${formData.lastName}
Phone: ${formData.phone}
Email: ${formData.email}
Address: ${formData.address}, ${formData.city}, ${formData.state}

Order Details:
${orderItems}

Total: ₦${total.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}
`.trim();

    const phoneNumber = "2347047257462";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    setStep("success");
    clearCart();

    window.open(whatsappUrl, "_blank");
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4 gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
          <Zap size={28} className="text-slate-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-100">Your cart is empty</h2>
        <p className="text-slate-400">Add some gadgets before checking out.</p>
        <Link
          href="/products"
          className="mt-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
        <p className="text-slate-300 font-semibold text-lg">Processing your order…</p>
        <p className="text-slate-500 text-sm">Please don't close this window.</p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4 gap-5">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center">
          <CheckCircle size={48} className="text-emerald-400" />
        </div>

        <h2 className="text-3xl font-black text-slate-50">
          Order Submitted Successfully!
        </h2>

        <p className="text-slate-400 max-w-sm leading-relaxed">
          Thank you for your order. Our team has received your request and will
          contact you shortly to confirm payment and delivery details.
        </p>

        <div className="flex gap-3 mt-2">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-700 transition-colors"
          >
            Back to Home
          </Link>

          <Link
            href="/products"
            className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-colors"
          >
            Shop More
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container-app py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/products"
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-50">Checkout</h1>
            <p className="text-slate-500 text-sm">{items.length} items</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
            <Lock size={12} className="text-emerald-400" />
            Secure & encrypted
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* ── Left: Forms ─────────────────────────────── */}
            <div className="space-y-8">
              {/* Shipping details */}
              <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Truck size={18} className="text-cyan-400" />
                  <h2 className="font-bold text-slate-200">Shipping Details</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
                  <Field label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                  <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" span={2} />
                  <Field label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+234 800 000 0000" span={2} />
                  <Field label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main Street" span={2} />
                  <Field label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Lagos" />
                  <Field label="State / Region" name="state" value={formData.state} onChange={handleChange} placeholder="Lagos State" />
                  <Field label="Country" name="country" value={formData.country} onChange={handleChange} />
                  <Field label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="100001" />
                </div>
              </section>

              {/* Payment details */}
              {/* Bank Details */}
              <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard size={18} className="text-cyan-400" />
                  <h2 className="font-bold text-slate-200">Bank Details</h2>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                    Transfer
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Bank Name</span>
                    <span className="font-semibold text-slate-100">Opay</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Account Name</span>
                    <span className="font-semibold text-slate-100">Holarz Gadgets</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Account Number</span>
                    <span className="font-black text-xl tracking-wider text-cyan-400">
                      8134567890
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                  After clicking <span className="text-slate-300 font-semibold">Place Order</span>,
                  you will be redirected to WhatsApp to confirm your order and receive payment instructions.
                </p>
              </section>
            </div>

            {/* ── Right: Order summary ─────────────────────── */}
            <aside className="space-y-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 sticky top-24">
                <h2 className="font-bold text-slate-200 mb-5">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                  {items.map(({ product, quantity }) => {
                    const price = product.discountPrice ?? product.price;
                    const img = product.images.find((i) => i.isPrimary) ?? product.images[0];
                    return (
                      <div key={product.id} className="flex gap-3 items-center">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                          <Image src={img.url} alt={img.alt} fill sizes="48px" className="object-cover" />
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-bold flex items-center justify-center">
                            {quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-300 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">{product.brand}</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-200 flex-shrink-0">
                          ₦{(price * quantity).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-t border-slate-800 pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span>
                      ₦
                      {subtotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-emerald-400" : ""}>
                      {shippingCost === 0
                        ? "FREE"
                        : `₦${shippingCost.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Tax (7.5%)</span>
                    <span>₦{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-50 pt-2 border-t border-slate-800">
                    <span>Total</span>
                    <span className="text-gradient-cyan">₦{total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full mt-6 py-4 rounded-xl font-black text-sm
                    bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950
                    hover:from-cyan-400 hover:to-cyan-300
                    shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]
                    transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Lock size={14} />
                  Place Order — ₦{total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </button>

                <p className="text-center text-[10px] text-slate-600 mt-3">
                  By placing your order, you agree to our{" "}
                  <Link href="/terms" className="underline hover:text-slate-400">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}
