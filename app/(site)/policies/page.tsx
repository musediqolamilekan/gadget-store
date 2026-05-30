"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck, RotateCcw, ShieldCheck,
  ChevronRight, MessageCircle,
  CheckCircle, XCircle, Clock, MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// JSON-LD
// ─────────────────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://horlarzgadgets.com/policies",
  url: "https://horlarzgadgets.com/policies",
  name: "Shipping, Returns & Warranty — HolarzGadgets",
  isPartOf: { "@id": "https://horlarzgadgets.com/#business" },
  inLanguage: "en-NG",
};

// ─────────────────────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "shipping", label: "Shipping", Icon: Truck },
  { id: "returns", label: "Returns", Icon: RotateCcw },
  { id: "warranty", label: "Warranty", Icon: ShieldCheck },
] as const;
type TabId = typeof TABS[number]["id"];

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const DELIVERY_ZONES = [
  { zone: "Ado-Ekiti (same city)", time: "Same day – Next day", fee: "Free ≥ ₦50,000 · ₦1,500 below", color: "emerald" },
  { zone: "Ekiti State (other towns)", time: "1 – 2 business days", fee: "Free ≥ ₦50,000 · ₦2,500 below", color: "cyan" },
  { zone: "Lagos, Abuja, Ibadan", time: "1 – 3 business days", fee: "Free ≥ ₦50,000 · ₦3,500 below", color: "violet" },
  { zone: "Rest of Nigeria", time: "2 – 5 business days", fee: "Free ≥ ₦50,000 · ₦3,500 below", color: "amber" },
];

// Light-mode zone colours
const ZONE_CARD: Record<string, string> = {
  emerald: "border-emerald-200 bg-emerald-50",
  cyan: "border-cyan-200    bg-cyan-50",
  violet: "border-violet-200  bg-violet-50",
  amber: "border-amber-200   bg-amber-50",
};
const ZONE_DOT: Record<string, string> = {
  emerald: "bg-emerald-500",
  cyan: "bg-cyan-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
};

const RETURNABLE = [
  "Item arrived defective or not working",
  "Item is significantly different from the description",
  "Wrong item delivered",
  "Item arrived physically damaged",
];
const NOT_RETURNABLE = [
  "Change of mind (no defect)",
  "Physical damage caused by the buyer",
  "Items without original packaging or accessories",
  "Software or digital products",
  "Items reported after 7 days of delivery",
];
const RETURN_STEPS = [
  {
    step: "1", title: "Contact us on WhatsApp",
    desc: "Send a message to +234 905 542 7487 within 7 days of receiving your order. Include your order details and a photo or video of the issue."
  },
  {
    step: "2", title: "Get return approval",
    desc: "Our team reviews your request within 24 hours and approves valid returns. We will send you the return address and instructions."
  },
  {
    step: "3", title: "Ship the item back",
    desc: "Package the item securely in its original box with all accessories and ship it to us. We recommend using a traceable courier."
  },
  {
    step: "4", title: "Receive refund or swap",
    desc: "Once we receive and inspect the item (within 2 business days), we process your refund or send a replacement. Refunds reflect within 3–5 business days."
  },
];

const WARRANTY_COVERAGE = [
  { item: "All products", duration: "6 months seller warranty (minimum)" },
  { item: "Apple products", duration: "1 year manufacturer + 6 months seller" },
  { item: "Samsung Galaxy", duration: "1 year manufacturer + 6 months seller" },
  { item: "Laptops (major brands)", duration: "1 year manufacturer + 6 months seller" },
  { item: "Accessories & cables", duration: "3 months seller warranty" },
  { item: "Power banks", duration: "6 months seller warranty" },
];
const WARRANTY_COVERED = [
  "Manufacturing defects",
  "Battery failure (normal use)",
  "Screen defects not caused by impact",
  "Charging port failure (normal use)",
  "Software issues on brand-new devices",
];
const WARRANTY_NOT_COVERED = [
  "Physical damage — drops, cracks, bends",
  "Liquid damage (water, sweat, rain)",
  "Damage from unauthorised repair",
  "Damage from misuse or wrong charger",
  "Normal wear and tear (scratches, etc.)",
];

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const tabContent = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// ─────────────────────────────────────────────────────────────
// SECTION TITLE
// ─────────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, title, subtitle, gradient }: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  gradient: string;
}) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient}
        flex items-center justify-center flex-shrink-0 shadow-card`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-black tracking-tight text-text mb-1">
          {title}
        </h2>
        <p className="text-text-muted text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SHIPPING TAB
// ─────────────────────────────────────────────────────────────
function ShippingTab() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">
      <SectionTitle
        icon={Truck}
        title="Shipping Policy"
        subtitle="We deliver gadgets to every corner of Nigeria — fast and reliably."
        gradient="from-cyan-500 to-blue-600"
      />

      {/* Free shipping callout */}
      <motion.div variants={fadeUp}
        className="flex items-center gap-3 p-4 rounded-xl
          bg-success-bg border border-success/20">
        <CheckCircle size={18} className="text-success flex-shrink-0" />
        <p className="text-sm text-success font-medium">
          Free delivery on all orders above <strong>₦50,000</strong> — anywhere in Nigeria.
        </p>
      </motion.div>

      {/* Delivery zones */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-bold text-text uppercase tracking-widest mb-4">
          Delivery Zones & Timeframes
        </h3>
        <div className="space-y-3">
          {DELIVERY_ZONES.map(({ zone, time, fee, color }) => (
            <div key={zone}
              className={`flex flex-col sm:flex-row sm:items-center gap-3
                p-4 rounded-xl border ${ZONE_CARD[color]}`}>
              <div className="flex items-center gap-2.5 sm:w-56 flex-shrink-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ZONE_DOT[color]}`} />
                <span className="text-sm font-semibold text-text">{zone}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 sm:w-44">
                <Clock size={13} className="text-text-faint" />
                <span className="text-xs text-text-muted">{time}</span>
              </div>
              <span className="text-xs text-text-faint">{fee}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-bold text-text uppercase tracking-widest mb-4">
          How Delivery Works
        </h3>
        <div className="space-y-3 text-sm text-text-muted leading-relaxed">
          <p>After placing your order, you will be redirected to WhatsApp to confirm your order details. Once payment is confirmed, we dispatch within <strong className="text-text">1 business day</strong>.</p>
          <p>You will receive a WhatsApp message with tracking details or courier contact once your order has been picked up. Our courier partners include Gig Logistics, DHL, and local dispatch riders for Ado-Ekiti orders.</p>
          <p>Delivery times may be affected by public holidays, adverse weather, or courier delays beyond our control. We will always communicate any delays proactively.</p>
        </div>
      </motion.div>

      {/* Location note */}
      <motion.div variants={fadeUp}
        className="flex items-start gap-3 p-4 rounded-xl card">
        <MapPin size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-text-muted">
          We are based in <strong className="text-text">Ado-Ekiti, Ekiti State</strong>.
          Customers in Ikere-Ekiti, Ikole-Ekiti, Ilawe-Ekiti, Aramoko-Ekiti, and other
          Ekiti towns can expect delivery within 1–2 business days.
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// RETURNS TAB
// ─────────────────────────────────────────────────────────────
function ReturnsTab() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">
      <SectionTitle
        icon={RotateCcw}
        title="Returns & Refunds"
        subtitle="7-day return window. No hassle. Customer satisfaction guaranteed."
        gradient="from-violet-500 to-purple-700"
      />

      <motion.div variants={fadeUp}
        className="flex items-center gap-3 p-4 rounded-xl
          bg-violet-50 border border-violet-200">
        <Clock size={18} className="text-violet-600 flex-shrink-0" />
        <p className="text-sm text-violet-700 font-medium">
          You have <strong>7 days</strong> from delivery to request a return or refund.
        </p>
      </motion.div>

      {/* Eligible / Not eligible */}
      <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-success-bg border border-success/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-success" />
            <h3 className="text-sm font-bold text-success">Eligible for Return</h3>
          </div>
          <ul className="space-y-2.5">
            {RETURNABLE.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                <span className="text-xs text-text-muted leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 rounded-xl bg-danger-bg border border-danger/20">
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={16} className="text-danger" />
            <h3 className="text-sm font-bold text-danger">Not Eligible for Return</h3>
          </div>
          <ul className="space-y-2.5">
            {NOT_RETURNABLE.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 flex-shrink-0" />
                <span className="text-xs text-text-muted leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Return steps */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-bold text-text uppercase tracking-widest mb-5">
          How to Return an Item
        </h3>
        <div className="space-y-4">
          {RETURN_STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-50 border
                border-violet-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-black text-violet-600">{step}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text mb-1">{title}</p>
                <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Refund note */}
      <motion.div variants={fadeUp}
        className="p-4 rounded-xl card text-sm text-text-muted leading-relaxed">
        <strong className="text-text">Refunds</strong> are issued via bank transfer to
        the account used for payment. Processing takes 3–5 business days after the returned
        item is received and inspected. We will notify you via WhatsApp at every stage.
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// WARRANTY TAB
// ─────────────────────────────────────────────────────────────
function WarrantyTab() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">
      <SectionTitle
        icon={ShieldCheck}
        title="Warranty Policy"
        subtitle="Every product comes with a seller warranty in addition to manufacturer coverage."
        gradient="from-emerald-500 to-teal-600"
      />

      <motion.div variants={fadeUp}
        className="flex items-center gap-3 p-4 rounded-xl
          bg-success-bg border border-success/20">
        <ShieldCheck size={18} className="text-success flex-shrink-0" />
        <p className="text-sm text-success font-medium">
          All products carry a minimum <strong>6-month seller warranty</strong> from
          HolarzGadgets, in addition to any manufacturer warranty.
        </p>
      </motion.div>

      {/* Coverage table */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-bold text-text uppercase tracking-widest mb-4">
          Warranty Duration by Product
        </h3>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-subtle border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-bold
                  uppercase tracking-widest text-text-muted">
                  Product Type
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold
                  uppercase tracking-widest text-text-muted">
                  Coverage
                </th>
              </tr>
            </thead>
            <tbody>
              {WARRANTY_COVERAGE.map(({ item, duration }, i) => (
                <tr key={item}
                  className={i % 2 === 0 ? "bg-bg" : "bg-bg-subtle"}>
                  <td className="px-5 py-3.5 text-text font-medium">{item}</td>
                  <td className="px-5 py-3.5 text-text-muted">{duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Covered / Not covered */}
      <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-success-bg border border-success/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-success" />
            <h3 className="text-sm font-bold text-success">Covered</h3>
          </div>
          <ul className="space-y-2.5">
            {WARRANTY_COVERED.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                <span className="text-xs text-text-muted leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 rounded-xl bg-danger-bg border border-danger/20">
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={16} className="text-danger" />
            <h3 className="text-sm font-bold text-danger">Not Covered</h3>
          </div>
          <ul className="space-y-2.5">
            {WARRANTY_NOT_COVERED.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 flex-shrink-0" />
                <span className="text-xs text-text-muted leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* How to claim */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-bold text-text uppercase tracking-widest mb-4">
          How to Make a Warranty Claim
        </h3>
        <div className="space-y-3 text-sm text-text-muted leading-relaxed">
          <p>Contact us on WhatsApp at{" "}
            <a href="https://wa.me/2349055427487"
              className="text-primary-600 hover:text-primary-500 transition-colors font-semibold">
              +234 905 542 7487
            </a>{" "}
            with your order reference, a description of the issue, and photos or a video
            of the defect. Our team responds within 24 hours.</p>
          <p>For Apple and Samsung products with service centres in Nigeria, we will guide
            you through the official manufacturer warranty process and liaise on your behalf
            where possible.</p>
          <p>Warranty claims must be submitted within the warranty period. Products must not
            have been tampered with or repaired by an unauthorised technician.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("shipping");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-bg">

        {/* ── HERO ──────────────────────────────────────── */}
        <section className="bg-bg-subtle border-b border-border">
          <div className="container-app py-14">
            <motion.nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-text-faint mb-8"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link href="/" className="hover:text-text transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-text-muted">Policies</span>
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl md:text-4xl font-black tracking-tight
                text-text mb-3">
                Shipping, Returns & Warranty
              </h1>
              <p className="text-text-muted text-sm leading-relaxed">
                At <strong className="text-text">HolarzGadgets</strong>, buying online
                should be risk-free. Read our clear, no-nonsense policies below — or{" "}
                <a
                  href="https://wa.me/2349055427487"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-500 transition-colors font-semibold"
                >
                  chat us on WhatsApp
                </a>{" "}
                if you have questions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── CONTENT ───────────────────────────────────── */}
        <div className="container-app py-12">
          <div className="max-w-3xl mx-auto">

            {/* Tab bar */}
            <motion.div
              className="flex gap-1 p-1 bg-bg-muted rounded-2xl mb-10
                border border-border w-fit"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="relative flex items-center gap-2 px-5 py-2.5
                    rounded-xl text-sm font-semibold transition-colors"
                >
                  {activeTab === id && (
                    <motion.div
                      layoutId="activePolicy"
                      className="absolute inset-0 rounded-xl bg-primary-500
                        shadow-[0_0_15px_rgb(var(--color-primary-500)/30%)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={14}
                    className={`relative z-10 transition-colors
                      ${activeTab === id ? "text-white" : "text-text-muted"}`}
                  />
                  <span className={`relative z-10 transition-colors
                    ${activeTab === id
                      ? "text-white"
                      : "text-text-muted hover:text-text"}`}>
                    {label}
                  </span>
                </button>
              ))}
            </motion.div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabContent}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {activeTab === "shipping" && <ShippingTab />}
                {activeTab === "returns" && <ReturnsTab />}
                {activeTab === "warranty" && <WarrantyTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────── */}
        <section className="container-app pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto rounded-3xl bg-bg-subtle
              border border-border p-8 text-center"
          >
            <h2 className="text-xl font-black text-text mb-2">
              Have a question about your order?
            </h2>
            <p className="text-text-muted text-sm mb-6">
              Our team replies within minutes on WhatsApp — Monday to Saturday, 8am – 8pm WAT.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <motion.a
                href="https://wa.me/2349055427487?text=Hello%20HolarzGadgets%2C%20I%20have%20a%20question%20about%20your%20policies."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                  bg-accent-green hover:opacity-90 text-white font-bold text-sm
                  transition-all duration-200"
              >
                <MessageCircle size={15} />
                Chat on WhatsApp
              </motion.a>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3
                  rounded-xl btn-outline text-sm font-bold"
              >
                Browse Products
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
}