import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Smartphone,
  Laptop,
  Watch,
  BatteryCharging,
  Headphones,
  Cable,
  Shield,
  Truck,
  RotateCcw,
  Headset,
  Zap,
  Star,
} from "lucide-react";
import type { Metadata } from "next";

import ProductCard from "@/components/ProductCard";
import {
  getFeaturedProducts,
  getBestsellerProducts,
  CATEGORIES,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "HolarzGadgets – Premium Gadgets & Tech",
};

// ─────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  phones:       { Icon: Smartphone,     gradient: "from-cyan-500 to-blue-600" },
  laptops:      { Icon: Laptop,         gradient: "from-violet-500 to-purple-700" },
  smartwatches: { Icon: Watch,          gradient: "from-emerald-500 to-teal-600" },
  "power-banks":{ Icon: BatteryCharging,gradient: "from-amber-500 to-orange-600" },
  earbuds:      { Icon: Headphones,     gradient: "from-rose-500 to-pink-600" },
  accessories:  { Icon: Cable,          gradient: "from-slate-400 to-slate-600" },
} as const;

const TRUST_BADGES = [
  { Icon: Shield,    title: "2-Year Warranty",    desc: "On all products" },
  { Icon: Truck,     title: "Free Shipping",       desc: "Orders over $99" },
  { Icon: RotateCcw, title: "30-Day Returns",      desc: "Hassle-free" },
  { Icon: Headset,   title: "24/7 Support",         desc: "Always here for you" },
];

// ─────────────────────────────────────────────────────────────
// PAGE COMPONENT (Server Component)
// ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const featuredProducts   = getFeaturedProducts();
  const bestsellerProducts = getBestsellerProducts();

  return (
    <>
      {/* ════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Ambient blobs */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative container-app pt-20 pb-24 md:pt-32 md:pb-36">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-6">
              <Zap size={11} className="fill-cyan-400" />
              New arrivals every week
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-slate-50 mb-6">
              The future of{" "}
              <span className="text-gradient-volt">
                tech
              </span>{" "}
              is here.
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Discover phones, laptops, smartwatches, and more — curated for
              those who demand the best from their gadgets.
            </p>

            {/* Search bar (client component for interactivity) */}
            <HeroSearch />

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {["iPhone", "MacBook", "AirPods", "Samsung Galaxy", "Nothing Phone"].map(
                (term) => (
                  <Link
                    key={term}
                    href={`/products?q=${encodeURIComponent(term)}`}
                    className="px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700/50
                      text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40
                      transition-all duration-200"
                  >
                    {term}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Hero product showcase */}
          <div className="mt-16 grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {featuredProducts.slice(0, 3).map((product, i) => {
              const img =
                product.images.find((x) => x.isPrimary) ?? product.images[0];
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className={`relative overflow-hidden rounded-2xl border border-slate-800/80
                    hover:border-cyan-500/50 transition-all duration-300 group
                    ${i === 1 ? "row-span-1 aspect-square" : "aspect-[3/4]"}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 33vw, 200px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-[9px] font-bold tracking-widest uppercase text-cyan-400">
                      {product.brand}
                    </p>
                    <p className="text-xs font-semibold text-slate-100 line-clamp-1">
                      {product.name}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TRUST BADGES
      ════════════════════════════════════════════════════ */}
      <section className="bg-slate-900/50 border-y border-slate-800/60">
        <div className="container-app py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{title}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CATEGORIES GRID
      ════════════════════════════════════════════════════ */}
      <section className="section-padding bg-slate-950">
        <div className="container-app">
          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-cyan-400/80 mb-2">
                Browse By Category
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50">
                What are you<br />
                <span className="text-gradient-cyan">looking for?</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map(({ key, label }) => {
              const { Icon, gradient } =
                CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS];
              return (
                <Link
                  key={key}
                  href={`/products?category=${key}`}
                  className="group flex flex-col items-center gap-3 p-4 rounded-2xl
                    bg-slate-900/60 border border-slate-800/80
                    hover:border-slate-600 hover:bg-slate-800/60
                    transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient}
                      flex items-center justify-center
                      shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-slate-100 transition-colors text-center">
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════════════════════ */}
      <section className="section-padding bg-slate-950">
        <div className="container-app">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-violet-400/80 mb-2">
                Editor's Picks
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50">
                Featured <span className="text-gradient-volt">Gadgets</span>
              </h2>
            </div>
            <Link
              href="/products?featured=true"
              className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              See all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PROMO BANNER
      ════════════════════════════════════════════════════ */}
      <section className="section-padding bg-slate-950">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900/40 via-slate-900 to-violet-900/40 border border-cyan-500/20 p-8 md:p-14">
            {/* Decorative blobs */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl" />
            </div>

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">
                  Limited Time Offer
                </span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50 mb-4">
                  Up to{" "}
                  <span className="text-gradient-cyan">30% Off</span>
                  <br />
                  Flagship Phones
                </h2>
                <p className="text-slate-400 mb-6">
                  Get the latest flagships at incredible prices. Free overnight
                  shipping on all phone orders this weekend only.
                </p>
                <Link
                  href="/products?category=phones"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                    bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold
                    shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]
                    transition-all duration-200"
                >
                  Shop Phones <ArrowRight size={16} />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "200+", label: "Premium Brands" },
                  { value: "10K+", label: "Happy Customers" },
                  { value: "4.9★", label: "Average Rating" },
                  { value: "24/7", label: "Expert Support" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/50 text-center"
                  >
                    <p className="text-2xl font-black text-slate-50 text-gradient-cyan">
                      {value}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          BESTSELLERS
      ════════════════════════════════════════════════════ */}
      <section className="section-padding bg-slate-950">
        <div className="container-app">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-amber-400/80 mb-2">
                Customer Favorites
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50">
                Top <span className="text-amber-400">Bestsellers</span>
              </h2>
            </div>
            <Link
              href="/products?bestseller=true"
              className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestsellerProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                variant={i < 2 ? "default" : "compact"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          NEWSLETTER / CTA SECTION
      ════════════════════════════════════════════════════ */}
      <section className="section-padding bg-slate-900/30 border-t border-slate-800/60">
        <div className="container-app text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Zap size={24} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50 mb-4">
            Stay in the loop
          </h2>
          <p className="text-slate-400 mb-8">
            Get early access to new releases, exclusive deals, and tech
            reviews — delivered to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

// ── Newsletter form (client island) ──────────────────────────
import NewsletterForm from "@/components/NewsletterForm";
import HeroSearch from '@/components/HeroSearch';
