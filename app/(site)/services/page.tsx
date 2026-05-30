"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight, Zap, MessageCircle,
  Wifi, Phone, Tv, Globe,
  CheckCircle, ArrowRight, Shield, Clock, Star,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// WHATSAPP
// ─────────────────────────────────────────────────────────────
const WA = "2349055427487";
const wa = (msg: string) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(msg.trim())}`;

// ─────────────────────────────────────────────────────────────
// SERVICE DATA
// The vivid gradient/glow values here are intentional brand
// identity colours for each service — not UI chrome — so they
// stay hardcoded rather than using UI tokens.
// ─────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "data",
    Icon: Wifi,
    title: "Data Bundles",
    tagline: "Affordable data for every Nigerian network",
    accentFrom: "#06B6D4",
    gradientClass: "from-cyan-500 to-blue-600",
    glowColor: "rgba(6,182,212,0.2)",
    borderClass: "border-cyan-200",
    bgClass: "bg-cyan-50",
    labelClass: "text-cyan-700 bg-cyan-50 border border-cyan-200",
    networks: ["MTN", "Airtel", "Glo", "9mobile"],
    features: [
      "500MB to 100GB bundles",
      "Daily, weekly & monthly plans",
      "SME data available",
      "Instant activation",
    ],
    packages: [
      { label: "1GB", price: "₦300" },
      { label: "2GB", price: "₦500" },
      { label: "5GB", price: "₦1,200" },
      { label: "10GB", price: "₦2,200" },
      { label: "20GB", price: "₦4,000" },
      { label: "50GB", price: "₦8,500" },
    ],
    waMessage: `Hello HolarzGadgets 👋\n\nI want to buy DATA:\n\nNetwork: [MTN / Airtel / Glo / 9mobile]\nBundle Size: [e.g. 5GB]\nPhone Number: \nDuration: [Daily / Weekly / Monthly]\n\nPlease confirm price and process. Thank you!`,
    cta: "Buy Data",
  },
  {
    id: "airtime",
    Icon: Phone,
    title: "Airtime Top-Up",
    tagline: "Instant recharge for any Nigerian number",
    accentFrom: "#10B981",
    gradientClass: "from-emerald-500 to-teal-600",
    glowColor: "rgba(16,185,129,0.2)",
    borderClass: "border-emerald-200",
    bgClass: "bg-emerald-50",
    labelClass: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    networks: ["MTN", "Airtel", "Glo", "9mobile"],
    features: [
      "₦50 to ₦50,000 top-up",
      "Instant credit delivery",
      "Third-party recharge",
      "Bulk airtime for businesses",
    ],
    packages: [
      { label: "₦100", price: "₦100" },
      { label: "₦200", price: "₦200" },
      { label: "₦500", price: "₦500" },
      { label: "₦1,000", price: "₦1,000" },
      { label: "₦2,000", price: "₦2,000" },
      { label: "Custom", price: "Any ₦" },
    ],
    waMessage: `Hello HolarzGadgets 👋\n\nI want to buy AIRTIME:\n\nNetwork: [MTN / Airtel / Glo / 9mobile]\nAmount: ₦\nPhone Number to recharge: \n\nPlease confirm and process. Thank you!`,
    cta: "Buy Airtime",
  },
  {
    id: "dstv",
    Icon: Tv,
    title: "DSTV Subscription",
    tagline: "Renew DSTV & GOtv — no queues, instant activation",
    accentFrom: "#7C3AED",
    gradientClass: "from-violet-500 to-purple-700",
    glowColor: "rgba(124,58,237,0.2)",
    borderClass: "border-violet-200",
    bgClass: "bg-violet-50",
    labelClass: "text-violet-700 bg-violet-50 border border-violet-200",
    networks: ["DSTV", "GOtv"],
    features: [
      "All packages supported",
      "Instant activation",
      "Same official price",
      "No queues, no stress",
    ],
    packages: [
      { label: "Padi", price: "₦2,950" },
      { label: "Yanga", price: "₦4,615" },
      { label: "Confam", price: "₦7,900" },
      { label: "Compact", price: "₦15,700" },
      { label: "Compact+", price: "₦25,000" },
      { label: "Premium", price: "₦37,000" },
    ],
    waMessage: `Hello HolarzGadgets 👋\n\nI want to renew my DSTV / GOtv subscription:\n\nDecoder Type: [DSTV / GOtv]\nPackage: [Padi / Yanga / Confam / Compact / Compact+ / Premium]\nSmartcard / IUC Number: \nAccount Name (optional): \n\nPlease confirm price and process. Thank you!`,
    cta: "Renew Now",
  },
  {
    id: "google-numbers",
    Icon: Globe,
    title: "US / Google Voice Numbers",
    tagline: "Real US +1 numbers for business & app verification",
    accentFrom: "#F59E0B",
    gradientClass: "from-amber-500 to-orange-600",
    glowColor: "rgba(245,158,11,0.2)",
    borderClass: "border-amber-200",
    bgClass: "bg-amber-50",
    labelClass: "text-amber-700 bg-amber-50 border border-amber-200",
    networks: ["Google Voice", "US Numbers"],
    features: [
      "Real US (+1) phone numbers",
      "Works for WhatsApp Business",
      "Verify Fiverr, Upwork & more",
      "Receive SMS & calls",
    ],
    packages: [
      { label: "Basic", price: "Chat us" },
      { label: "Business", price: "Chat us" },
      { label: "Verified", price: "Chat us" },
      { label: "Bulk", price: "Chat us" },
    ],
    waMessage: `Hello HolarzGadgets 👋\n\nI'm interested in a Google Voice / US Number.\n\nPurpose: [WhatsApp Business / App Verification / Other]\nQuantity: [1 / More]\n\nPlease send me available options and pricing. Thank you!`,
    cta: "Get a US Number",
  },
];

const TRUST = [
  { Icon: Zap, label: "Instant delivery", sub: "Most orders in minutes" },
  { Icon: Shield, label: "100% reliable", sub: "Trusted by 1,200+ customers" },
  { Icon: Clock, label: "Mon–Sat 8am–8pm", sub: "Always available" },
  { Icon: Star, label: "4.9★ rated", sub: "Best service in Ekiti" },
];

// Network pill colours — brand identity, not UI tokens
const NETWORK_COLORS: Record<string, string> = {
  MTN: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Airtel: "bg-red-50    text-red-700    border border-red-200",
  Glo: "bg-green-50  text-green-700  border border-green-200",
  "9mobile": "bg-lime-50   text-lime-700   border border-lime-200",
  DSTV: "bg-blue-50   text-blue-700   border border-blue-200",
  GOtv: "bg-orange-50 text-orange-700 border border-orange-200",
  "Google Voice": "bg-cyan-50   text-cyan-700   border border-cyan-200",
  "US Numbers": "bg-bg-muted  text-text-muted border border-border",
};

// ─────────────────────────────────────────────────────────────
// ANIMATIONS
// ─────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─────────────────────────────────────────────────────────────
// SERVICE CARD
// ─────────────────────────────────────────────────────────────
function ServiceCard({ service, i }: { service: typeof SERVICES[0]; i: number }) {
  const { Icon } = service;
  return (
    <motion.article
      custom={i}
      variants={fadeUp}
      whileHover={{ y: -6, boxShadow: `0 32px 80px ${service.glowColor}` }}
      transition={{ duration: 0.3 }}
      className={`group relative flex flex-col rounded-3xl overflow-hidden
        card hover:border-${service.borderClass}
        transition-colors duration-300`}
      id={service.id}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${service.gradientClass}`} />

      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br
            ${service.gradientClass} flex items-center justify-center
            group-hover:scale-110 transition-transform duration-300`}
            style={{ boxShadow: `0 0 24px ${service.glowColor}` }}
          >
            <Icon size={26} className="text-white" />
          </div>

          <div className="flex flex-wrap gap-1 justify-end max-w-[140px]">
            {service.networks.map((n) => (
              <span key={n}
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold
                  uppercase tracking-widest
                  ${NETWORK_COLORS[n] ?? "bg-bg-muted text-text-muted border border-border"}`}>
                {n}
              </span>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-black text-text tracking-tight mb-1">
          {service.title}
        </h2>
        <p className="text-text-muted text-sm leading-relaxed">
          {service.tagline}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-6 my-5 border-t border-border" />

      {/* Features */}
      <div className="px-6 mb-5">
        <p className="text-[9px] font-bold tracking-[0.18em] uppercase
          text-text-faint mb-3">
          What&apos;s included
        </p>
        <ul className="space-y-2">
          {service.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-text-muted">
              <CheckCircle size={13} className="flex-shrink-0"
                style={{ color: service.accentFrom }} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing grid */}
      <div className="px-6 mb-6">
        <p className="text-[9px] font-bold tracking-[0.18em] uppercase
          text-text-faint mb-3">
          Popular options
        </p>
        <div className="grid grid-cols-3 gap-2">
          {service.packages.map(({ label, price }) => (
            <div key={label}
              className={`rounded-xl p-2.5 text-center border
                ${service.bgClass} ${service.borderClass}`}>
              <p className="text-xs font-bold text-text leading-none mb-1">
                {label}
              </p>
              <p className="text-[10px] font-semibold"
                style={{ color: service.accentFrom }}>
                {price}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      {/* CTA */}
      <div className="px-6 pb-6">
        <motion.a
          href={wa(service.waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`flex items-center justify-center gap-2.5 w-full py-4
            rounded-2xl font-bold text-sm text-white
            bg-gradient-to-r ${service.gradientClass}
            transition-all duration-200`}
          style={{ boxShadow: `0 0 24px ${service.glowColor}` }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 flex-shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.109.549 4.09 1.508 5.814L.057 23.25l5.575-1.462A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.371l-.361-.214-3.31.869.882-3.23-.235-.373A9.872 9.872 0 012.1 12c0-5.457 4.444-9.9 9.9-9.9 5.457 0 9.9 4.443 9.9 9.9 0 5.458-4.443 9.9-9.9 9.9z" />
          </svg>
          {service.cta} on WhatsApp
          <ArrowRight size={14} />
        </motion.a>
      </div>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-bg">

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className="bg-bg-subtle border-b border-border">
        <div className="container-app py-16">

          {/* Breadcrumb */}
          <motion.nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-text-faint mb-10"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/" className="hover:text-text transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-text-muted">Services</span>
          </motion.nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-primary-50 border border-primary-200 text-primary-600
                  text-xs font-semibold tracking-widest uppercase mb-6"
              >
                <Zap size={11} className="fill-primary-500" />
                Digital Services
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-black
                  tracking-tighter leading-[1.05] text-text mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                Beyond gadgets —{" "}
                <span className="text-gradient-primary">digital services</span>{" "}
                that work
              </motion.h1>

              <motion.p
                className="text-text-muted text-lg leading-relaxed mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                Data, airtime, DSTV renewals and US numbers — all handled via
                WhatsApp. Order in seconds, delivered in minutes.
              </motion.p>

              {/* Quick-jump pills */}
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {SERVICES.map((s) => {
                  const { Icon } = s;
                  return (
                    <a key={s.id} href={`#${s.id}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl
                        text-xs font-semibold border transition-all duration-200
                        hover:scale-105 ${s.labelClass}`}>
                      <Icon size={13} />
                      {s.title}
                    </a>
                  );
                })}
              </motion.div>
            </div>

            {/* Right — trust badges */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {TRUST.map(({ Icon, label, sub }, i) => (
                <motion.div
                  key={label}
                  custom={i}
                  variants={fadeUp}
                  className="flex items-center gap-3 p-4 rounded-2xl card"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-50
                    flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">{label}</p>
                    <p className="text-[11px] text-text-faint">{sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ SERVICE CARDS ═════════════════════════════════ */}
      <section className="container-app py-16">
        <motion.div
          className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} service={s} i={i} />
          ))}
        </motion.div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════ */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="container-app py-16">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold tracking-widest uppercase
              text-primary-500 mb-2">
              Super simple
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-text">
              Order in 3 steps
            </h2>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                Icon: Wifi, step: "01", title: "Pick a service",
                desc: "Tap the WhatsApp button on the service you need.",
                accent: "text-accent-cyan", bg: "bg-cyan-50"
              },
              {
                Icon: MessageCircle, step: "02", title: "Send your details",
                desc: "The message is pre-written — just fill in your number and plan.",
                accent: "text-accent-violet", bg: "bg-violet-50"
              },
              {
                Icon: Zap, step: "03", title: "Delivered instantly",
                desc: "We process and deliver within minutes of payment confirmation.",
                accent: "text-success", bg: "bg-emerald-50"
              },
            ].map(({ Icon, step, title, desc, accent, bg }, i) => (
              <motion.div
                key={step}
                custom={i}
                variants={fadeUp}
                className="relative p-6 rounded-2xl card overflow-hidden"
              >
                {/* Ghost step number */}
                <span className="absolute -bottom-2 -right-2 text-7xl font-black
                  text-border select-none leading-none">
                  {step}
                </span>
                <div className={`relative w-11 h-11 rounded-xl ${bg}
                  flex items-center justify-center mb-4`}>
                  <Icon size={20} className={accent} />
                </div>
                <h3 className="relative font-bold text-text mb-2">{title}</h3>
                <p className="relative text-sm text-text-muted leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ BOTTOM CTA ════════════════════════════════════ */}
      <section className="container-app py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl
            bg-gradient-to-br from-success-bg via-bg-subtle to-primary-50
            border border-border p-8 md:p-14"
        >
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-black text-text mb-3">
                Not sure what you need?
              </h2>
              <p className="text-text-muted leading-relaxed">
                Chat us on WhatsApp and we will help you pick the right plan,
                package, or number — no stress, no waiting.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <motion.a
                href={wa("Hello HolarzGadgets 👋\n\nI need help with a digital service. Can you assist me?")}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2
                  px-7 py-4 rounded-xl bg-accent-green hover:opacity-90
                  text-white font-bold text-sm
                  shadow-[0_0_25px_rgb(var(--color-accent-green)/30%)]
                  transition-all duration-200"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </motion.a>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2
                  px-7 py-4 rounded-xl btn-outline text-sm"
              >
                Browse Gadgets
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}