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
  "@type":    "WebPage",
  "@id":      "https://horlarzgadgets.com/policies",
  url:        "https://horlarzgadgets.com/policies",
  name:       "Shipping, Returns & Warranty — HolarzGadgets",
  isPartOf:   { "@id": "https://horlarzgadgets.com/#business" },
  about: [
    { "@type": "ShippingDeliveryTime",
      description: "Delivery to Ado-Ekiti: same-day or next-day. Ekiti State: 1–2 days. Nigeria: 1–5 days." },
    { "@type": "MerchantReturnPolicy",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays:   7,
      returnMethod:         "https://schema.org/ReturnByMail",
      refundType:           "https://schema.org/FullRefund" },
  ],
  inLanguage:    "en-NG",
  datePublished: "2024-01-01",
  dateModified:  "2025-01-01",
};

// ─────────────────────────────────────────────────────────────
// TABS CONFIG
// ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "shipping",  label: "Shipping",  Icon: Truck        },
  { id: "returns",   label: "Returns",   Icon: RotateCcw    },
  { id: "warranty",  label: "Warranty",  Icon: ShieldCheck  },
] as const;

type TabId = typeof TABS[number]["id"];

// ─────────────────────────────────────────────────────────────
// SHIPPING DATA
// ─────────────────────────────────────────────────────────────
const DELIVERY_ZONES = [
  {
    zone:    "Ado-Ekiti (same city)",
    time:    "Same day – Next day",
    fee:     "Free on orders ≥ ₦50,000 · ₦1,500 below",
    color:   "emerald",
  },
  {
    zone:    "Ekiti State (other towns)",
    time:    "1 – 2 business days",
    fee:     "Free on orders ≥ ₦50,000 · ₦2,500 below",
    color:   "cyan",
  },
  {
    zone:    "Lagos, Abuja, Ibadan",
    time:    "1 – 3 business days",
    fee:     "Free on orders ≥ ₦50,000 · ₦3,500 below",
    color:   "violet",
  },
  {
    zone:    "Rest of Nigeria",
    time:    "2 – 5 business days",
    fee:     "Free on orders ≥ ₦50,000 · ₦3,500 below",
    color:   "amber",
  },
];

const ZONE_COLOR: Record<string, string> = {
  emerald: "border-emerald-500/30 bg-emerald-500/5",
  cyan:    "border-cyan-500/30    bg-cyan-500/5",
  violet:  "border-violet-500/30  bg-violet-500/5",
  amber:   "border-amber-500/30   bg-amber-500/5",
};

const ZONE_DOT: Record<string, string> = {
  emerald: "bg-emerald-400",
  cyan:    "bg-cyan-400",
  violet:  "bg-violet-400",
  amber:   "bg-amber-400",
};

// ─────────────────────────────────────────────────────────────
// RETURNS DATA
// ─────────────────────────────────────────────────────────────
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
  { step: "1", title: "Contact us on WhatsApp",   desc: "Send a message to +234 905 542 7487 within 7 days of receiving your order. Include your order details and a photo or video of the issue." },
  { step: "2", title: "Get return approval",       desc: "Our team reviews your request within 24 hours and approves valid returns. We will send you the return address and instructions." },
  { step: "3", title: "Ship the item back",        desc: "Package the item securely in its original box with all accessories and ship it to us. We recommend using a traceable courier." },
  { step: "4", title: "Receive refund or swap",    desc: "Once we receive and inspect the item (within 2 business days), we process your refund or send a replacement. Refunds reflect within 3–5 business days." },
];

// ─────────────────────────────────────────────────────────────
// WARRANTY DATA
// ─────────────────────────────────────────────────────────────
const WARRANTY_COVERAGE = [
  { item: "All products",          duration: "6 months seller warranty (minimum)" },
  { item: "Apple products",        duration: "1 year manufacturer + 6 months seller" },
  { item: "Samsung Galaxy",        duration: "1 year manufacturer + 6 months seller" },
  { item: "Laptops (major brands)", duration: "1 year manufacturer + 6 months seller" },
  { item: "Accessories & cables",  duration: "3 months seller warranty" },
  { item: "Power banks",           duration: "6 months seller warranty" },
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
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const tabContent = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2  } },
};

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, title, subtitle, color }: {
  icon:     React.ElementType;
  title:    string;
  subtitle: string;
  color:    string;
}) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center
        justify-center flex-shrink-0`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-50 mb-1">
          {title}
        </h2>
        <p className="text-slate-400 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SHIPPING TAB
// ─────────────────────────────────────────────────────────────
function ShippingTab() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <SectionTitle
        icon={Truck}
        title="Shipping Policy"
        subtitle="We deliver gadgets to every corner of Nigeria — fast and reliably."
        color="bg-gradient-to-br from-cyan-500 to-blue-600"
      />

      {/* Free shipping callout */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 p-4 rounded-xl
          bg-emerald-500/10 border border-emerald-500/20"
      >
        <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
        <p className="text-sm text-emerald-300 font-medium">
          Free delivery on all orders above{" "}
          <strong>₦50,000</strong> — anywhere in Nigeria.
        </p>
      </motion.div>

      {/* Delivery zones */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase
          tracking-widest">
          Delivery Zones & Timeframes
        </h3>
        <div className="space-y-3">
          {DELIVERY_ZONES.map(({ zone, time, fee, color }) => (
            <div
              key={zone}
              className={`flex flex-col sm:flex-row sm:items-center gap-3
                p-4 rounded-xl border ${ZONE_COLOR[color]}`}
            >
              <div className="flex items-center gap-2.5 sm:w-56 flex-shrink-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ZONE_DOT[color]}`} />
                <span className="text-sm font-semibold text-slate-200">{zone}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 sm:w-44">
                <Clock size={13} className="text-slate-500" />
                <span className="text-xs text-slate-400">{time}</span>
              </div>
              <span className="text-xs text-slate-500">{fee}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase
          tracking-widest">
          How Delivery Works
        </h3>
        <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
          <p>
            After placing your order on our website, you will be redirected to
            WhatsApp to confirm your order details. Once payment is confirmed,
            we dispatch your order within{" "}
            <strong className="text-slate-200">1 business day</strong>.
          </p>
          <p>
            You will receive a WhatsApp message with your tracking details or
            courier contact once your order has been picked up. Our courier
            partners include Gig Logistics, DHL, and local dispatch riders
            for Ado-Ekiti orders.
          </p>
          <p>
            Delivery times may be affected by public holidays, adverse weather,
            or courier delays beyond our control. We will always communicate
            any delays proactively.
          </p>
        </div>
      </motion.div>

      {/* Location note */}
      <motion.div
        variants={fadeUp}
        className="flex items-start gap-3 p-4 rounded-xl
          bg-slate-800/50 border border-slate-700/50"
      >
        <MapPin size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-slate-400">
          We are based in{" "}
          <strong className="text-slate-200">Ado-Ekiti, Ekiti State</strong>.
          Customers in Ikere-Ekiti, Ikole-Ekiti, Ilawe-Ekiti, Aramoko-Ekiti,
          and other Ekiti towns can expect delivery within 1–2 business days.
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
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <SectionTitle
        icon={RotateCcw}
        title="Returns & Refunds"
        subtitle="7-day return window. No hassle. Customer satisfaction guaranteed."
        color="bg-gradient-to-br from-violet-500 to-purple-700"
      />

      {/* Return window callout */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 p-4 rounded-xl
          bg-violet-500/10 border border-violet-500/20"
      >
        <Clock size={18} className="text-violet-400 flex-shrink-0" />
        <p className="text-sm text-violet-300 font-medium">
          You have <strong>7 days</strong> from the date of delivery to request
          a return or refund.
        </p>
      </motion.div>

      {/* What can / cannot be returned */}
      <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
        {/* Can return */}
        <div className="p-5 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-300">
              Eligible for Return
            </h3>
          </div>
          <ul className="space-y-2.5">
            {RETURNABLE.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400
                  mt-1.5 flex-shrink-0" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cannot return */}
        <div className="p-5 rounded-xl bg-rose-500/8 border border-rose-500/20">
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={16} className="text-rose-400" />
            <h3 className="text-sm font-bold text-rose-300">
              Not Eligible for Return
            </h3>
          </div>
          <ul className="space-y-2.5">
            {NOT_RETURNABLE.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400
                  mt-1.5 flex-shrink-0" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Return process */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-bold text-slate-300 mb-5 uppercase
          tracking-widest">
          How to Return an Item
        </h3>
        <div className="space-y-4">
          {RETURN_STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 border
                border-violet-500/30 flex items-center justify-center
                flex-shrink-0 mt-0.5">
                <span className="text-xs font-black text-violet-400">
                  {step}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200 mb-1">
                  {title}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Refund note */}
      <motion.div
        variants={fadeUp}
        className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50
          text-sm text-slate-400 leading-relaxed"
      >
        <strong className="text-slate-200">Refunds</strong> are issued via
        bank transfer to the account you used for payment. Processing takes
        3–5 business days after the returned item is received and inspected.
        We will notify you via WhatsApp at every stage.
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// WARRANTY TAB
// ─────────────────────────────────────────────────────────────
function WarrantyTab() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <SectionTitle
        icon={ShieldCheck}
        title="Warranty Policy"
        subtitle="Every product we sell comes with a seller warranty in addition to manufacturer coverage."
        color="bg-gradient-to-br from-emerald-500 to-teal-600"
      />

      {/* Warranty callout */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 p-4 rounded-xl
          bg-emerald-500/10 border border-emerald-500/20"
      >
        <ShieldCheck size={18} className="text-emerald-400 flex-shrink-0" />
        <p className="text-sm text-emerald-300 font-medium">
          All products carry a minimum{" "}
          <strong>6-month seller warranty</strong> from HolarzGadgets, in
          addition to any manufacturer warranty.
        </p>
      </motion.div>

      {/* Coverage table */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase
          tracking-widest">
          Warranty Duration by Product
        </h3>
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-700">
                <th className="text-left px-5 py-3 text-xs font-bold
                  uppercase tracking-widest text-slate-400">
                  Product Type
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold
                  uppercase tracking-widest text-slate-400">
                  Coverage
                </th>
              </tr>
            </thead>
            <tbody>
              {WARRANTY_COVERAGE.map(({ item, duration }, i) => (
                <tr
                  key={item}
                  className={i % 2 === 0 ? "bg-slate-900/40" : "bg-slate-800/20"}
                >
                  <td className="px-5 py-3.5 text-slate-300 font-medium">
                    {item}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* What is / isn't covered */}
      <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-emerald-300">Covered</h3>
          </div>
          <ul className="space-y-2.5">
            {WARRANTY_COVERED.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400
                  mt-1.5 flex-shrink-0" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-xl bg-rose-500/8 border border-rose-500/20">
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={16} className="text-rose-400" />
            <h3 className="text-sm font-bold text-rose-300">Not Covered</h3>
          </div>
          <ul className="space-y-2.5">
            {WARRANTY_NOT_COVERED.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400
                  mt-1.5 flex-shrink-0" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* How to claim */}
      <motion.div variants={fadeUp}>
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase
          tracking-widest">
          How to Make a Warranty Claim
        </h3>
        <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
          <p>
            Contact us on WhatsApp at{" "}
            <a
              href="https://wa.me/2349055427487"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              +234 905 542 7487
            </a>{" "}
            with your order reference, a description of the issue, and photos or
            a video of the defect. Our team responds within 24 hours.
          </p>
          <p>
            For Apple and Samsung products with service centres in Nigeria, we
            will guide you through the official manufacturer warranty process
            and liaise on your behalf where possible.
          </p>
          <p>
            Warranty claims must be submitted within the warranty period.
            Products must not have been tampered with or repaired by an
            unauthorised technician.
          </p>
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

      <div className="min-h-screen bg-slate-950">

        {/* ── HERO ────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-slate-900/50
          border-b border-slate-800/60">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full
              bg-cyan-500/5 blur-3xl" />
          </div>

          <div className="container-app py-14 relative">
            {/* Breadcrumb */}
            <motion.nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-slate-500 mb-8"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1,  y:  0 }}
              transition={{ duration: 0.4 }}
            >
              <Link href="/" className="hover:text-slate-300 transition-colors">
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="text-slate-400">Policies</span>
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1,  y:  0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl md:text-4xl font-black tracking-tight
                text-slate-50 mb-3">
                Shipping, Returns & Warranty
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                At <strong className="text-slate-200">HolarzGadgets</strong>,
                we believe buying online should be risk-free. Read our clear,
                no-nonsense policies below — or{" "}
                <a
                  href="https://wa.me/2349055427487"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors
                    font-medium"
                >
                  chat us on WhatsApp
                </a>{" "}
                if you have questions.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── MAIN CONTENT ────────────────────────────── */}
        <div className="container-app py-12">
          <div className="max-w-3xl mx-auto">

            {/* Tab bar */}
            <motion.div
              className="flex gap-1 p-1 bg-slate-800/50 rounded-2xl mb-10
                border border-slate-700/50 w-fit"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1,  y:  0 }}
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
                      className="absolute inset-0 rounded-xl bg-cyan-500
                        shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      transition={{
                        type:      "spring",
                        stiffness: 400,
                        damping:   30,
                      }}
                    />
                  )}
                  <Icon
                    size={14}
                    className={`relative z-10 transition-colors ${
                      activeTab === id ? "text-slate-950" : "text-slate-400"
                    }`}
                  />
                  <span
                    className={`relative z-10 transition-colors ${
                      activeTab === id
                        ? "text-slate-950"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
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
                {activeTab === "returns"  && <ReturnsTab  />}
                {activeTab === "warranty" && <WarrantyTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────── */}
        <section className="container-app pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0  }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl
              bg-gradient-to-br from-cyan-900/30 via-slate-900 to-emerald-900/30
              border border-cyan-500/20 p-8 text-center"
          >
            <div aria-hidden className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full
                bg-cyan-500/8 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full
                bg-emerald-500/8 blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-xl font-black text-slate-50 mb-2">
                Have a question about your order?
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Our team replies within minutes on WhatsApp — Monday to Saturday,
                8am – 8pm WAT.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <motion.a
                  href="https://wa.me/2349055427487?text=Hello%20HolarzGadgets%2C%20I%20have%20a%20question%20about%20your%20policies."
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{   scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                    bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm
                    shadow-[0_0_20px_rgba(16,185,129,0.35)]
                    transition-all duration-200"
                >
                  <MessageCircle size={15} />
                  Chat on WhatsApp
                </motion.a>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{   scale: 0.97 }}
                >
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                      bg-slate-800 hover:bg-slate-700 border border-slate-700
                      text-slate-200 font-bold text-sm transition-colors"
                  >
                    Browse Products
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
}