import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Smartphone, Laptop, Watch,
  BatteryCharging, Headphones, Cable,
  Shield, Truck, RotateCcw, Headset,
  Zap, Package, type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";

import ProductCard from "@/components/ProductCard";
import HeroSearch from "@/components/HeroSearch";
import NewsletterForm from "@/components/NewsletterForm";
import {
  FadeUp, FadeInOnMount, StaggerGrid,
  StaggerItem, SlideInLeft, SlideInRight,
} from "@/components/animations";
import {
  getFeaturedProducts,
  getBestsellerProducts,
  getFeaturedCategories,
  getActiveBanners,
} from "@/sanity/lib/fetch";
import type { SanityCategory } from "@/sanity/lib/fetch";
import { SanityBanner } from "@/sanity/lib/types";

// ─────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "HolarzGadgets – Premium Gadgets & Tech in Nigeria",
  description:
    "Shop the latest phones, laptops, smartwatches, earbuds, power banks, and accessories. Premium gadgets at the best prices in Nigeria.",
};

// ─────────────────────────────────────────────────────────────
// STATIC UI DATA  (doesn't need CMS)
// ─────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone: Smartphone,
  Laptop: Laptop,
  Watch: Watch,
  BatteryCharging: BatteryCharging,
  Headphones: Headphones,
  Cable: Cable,
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  phones: "from-cyan-500 to-blue-600",
  laptops: "from-violet-500 to-purple-700",
  smartwatches: "from-emerald-500 to-teal-600",
  "power-banks": "from-amber-500 to-orange-600",
  earbuds: "from-rose-500 to-pink-600",
  accessories: "from-slate-400 to-slate-600",
};

const TRUST_BADGES = [
  { Icon: Shield, title: "2-Year Warranty", desc: "On all products" },
  { Icon: Truck, title: "Free Shipping", desc: "Orders over ₦50,000" },
  { Icon: RotateCcw, title: "30-Day Returns", desc: "Hassle-free" },
  { Icon: Headset, title: "24/7 Support", desc: "Always here for you" },
];

const STATS = [
  { value: "200+", label: "Premium Brands" },
  { value: "10K+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "24/7", label: "Expert Support" },
];

// ─────────────────────────────────────────────────────────────
// PAGE  (Server Component — all fetches run in parallel)
// ─────────────────────────────────────────────────────────────
export default async function HomePage() {
  const [featured, bestsellers, categories, banners] = await Promise.all([
    getFeaturedProducts(),
    getBestsellerProducts(),
    getFeaturedCategories(),
    getActiveBanners(),
  ]);

  // Active banner (first one) — falls back to static copy
  const promoBanner: SanityBanner | null = banners[0] ?? null;

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://horlarzgadgets.com/#website",
        url: "https://horlarzgadgets.com",
        name: "HolarzGadgets",
        description: "Ekiti's #1 online gadget store — original phones, laptops, smartwatches, earbuds and accessories delivered across Nigeria.",
        inLanguage: "en-NG",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://horlarzgadgets.com/products?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://horlarzgadgets.com/#business",
        name: "HolarzGadgets",
        url: "https://horlarzgadgets.com",
        telephone: "+2349055427487",
        email: "holarzgadgets@gmail.com",
        description: "HolarzGadgets is Ekiti State's most trusted online store for 100% original smartphones, laptops, smartwatches, power banks, earbuds and accessories. Based in Ado-Ekiti, delivering across Nigeria.",
        foundingDate: "2023",
        founder: { "@type": "Person", name: "Oyewole Sheriffdeen" },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ado-Ekiti",
          addressRegion: "Ekiti State",
          addressCountry: "NG",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 7.6234,
          longitude: 5.2214,
        },
        areaServed: [
          "Ado-Ekiti", "Ikere-Ekiti", "Ikole-Ekiti", "Ilawe-Ekiti",
          "Ekiti State", "Lagos", "Abuja", "Nigeria",
        ],
        priceRange: "₦₦",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "08:00",
          closes: "20:00",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "1200",
          bestRating: "5",
        },
        sameAs: ["https://wa.me/2349055427487"],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Ambient blobs */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative container-app pt-20 pb-24 md:pt-32 md:pb-36">
          <div className="max-w-3xl mx-auto text-center">

            {/* Eyebrow badge */}
            <FadeInOnMount delay={0.05}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-cyan-500/10 border border-cyan-500/20 text-cyan-400
                text-xs font-semibold tracking-widest uppercase mb-6">
                <Zap size={11} className="fill-cyan-400" />
                New arrivals every week
              </div>
            </FadeInOnMount>

            {/* Headline */}
            <FadeInOnMount delay={0.15}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black
    tracking-tighter leading-[1.05] text-slate-50 mb-6">
                Ekiti&apos;s home for{" "}
                <span className="text-gradient-volt">premium gadgets</span>
              </h1>
            </FadeInOnMount>

            {/* Sub */}
            <FadeInOnMount delay={0.25}>
              <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
                Shop 100% original phones, laptops, smartwatches, earbuds and accessories —
                trusted by over 1,200 customers across Ekiti State and Nigeria.
              </p>
            </FadeInOnMount>

            {/* Search */}
            <FadeInOnMount delay={0.35}>
              <HeroSearch />
            </FadeInOnMount>

            {/* Quick search terms */}
            <FadeInOnMount delay={0.45}>
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {["iPhone 16", "MacBook M4", "AirPods Pro", "Galaxy S25", "Galaxy Watch"].map((term) => (
                  <Link
                    key={term}
                    href={`/products?q=${encodeURIComponent(term)}`}
                    className="px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700/50
                      text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40
                      transition-all duration-200"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </FadeInOnMount>
          </div>

          {featured.length >= 3 && (
            <StaggerGrid className="mt-16 grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {featured.slice(0, 3).map((product, i) => {
                const img = product.images.find((x) => x.isPrimary) ?? product.images[0];
                if (!img?.url) return null;

                return (
                  <StaggerItem key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      className={`relative overflow-hidden rounded-2xl border border-slate-800/80
              hover:border-cyan-500/50 transition-all duration-300 group block
              ${i === 1 ? "aspect-square" : "aspect-[3/4]"}`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt ?? product.name}
                        fill
                        sizes="(max-width:640px) 33vw, 200px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
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
                  </StaggerItem>
                );
              })}
            </StaggerGrid>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TRUST BADGES
      ══════════════════════════════════════════════════ */}
      <section className="bg-slate-900/50 border-y border-slate-800/60">
        <div className="container-app py-8">
          <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ Icon, title, desc }) => (
              <StaggerItem key={title}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{title}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CATEGORIES GRID  — from Sanity
      ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-slate-950">
        <div className="container-app">
          <div className="flex items-end justify-between mb-10">
            <FadeUp>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-cyan-400/80 mb-2">
                  Browse By Category
                </p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50">
                  What are you<br />
                  <span className="text-gradient-cyan">looking for?</span>
                </h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </FadeUp>
          </div>

          <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat: SanityCategory) => {
              const Icon = (cat.icon && ICON_MAP[cat.icon]) ? ICON_MAP[cat.icon] : Package;
              const gradient = CATEGORY_GRADIENTS[cat.slug] ?? "from-slate-500 to-slate-700";
              return (
                <StaggerItem key={cat._id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="group flex flex-col items-center gap-3 p-4 rounded-2xl
                      bg-slate-900/60 border border-slate-800/80
                      hover:border-slate-600 hover:bg-slate-800/60
                      transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient}
                      flex items-center justify-center shadow-lg
                      group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-300
                      group-hover:text-slate-100 transition-colors text-center">
                      {cat.title}
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED PRODUCTS  — from Sanity
      ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-slate-950">
        <div className="container-app">
          <div className="flex items-end justify-between mb-10">
            <FadeUp>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-violet-400/80 mb-2">
                  Editor's Picks
                </p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50">
                  Featured <span className="text-gradient-volt">Gadgets</span>
                </h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
              >
                See all <ArrowRight size={14} />
              </Link>
            </FadeUp>
          </div>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featured.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PROMO BANNER  — from Sanity (fallback to static)
      ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-slate-950">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-3xl
            bg-gradient-to-br from-cyan-900/40 via-slate-900 to-violet-900/40
            border border-cyan-500/20 p-8 md:p-14">

            {/* Blobs */}
            <div aria-hidden className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl" />
            </div>

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <SlideInLeft>
                <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20
                  text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">
                  {promoBanner?.badgeText ?? "Limited Time Offer"}
                </span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50 mb-4">
                  {promoBanner?.title ?? (
                    <>
                      Up to <span className="text-gradient-cyan">30% Off</span>
                      <br />Flagship Phones
                    </>
                  )}
                </h2>
                <p className="text-slate-400 mb-6">
                  {promoBanner?.subtitle ??
                    "Get the latest flagships at incredible prices. Free delivery on all phone orders this weekend only."}
                </p>
                <Link
                  href={promoBanner?.ctaHref ?? "/products?category=phones"}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                    bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold
                    shadow-[0_0_25px_rgba(6,182,212,0.4)]
                    hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]
                    transition-all duration-200"
                >
                  {promoBanner?.ctaLabel ?? "Shop Phones"} <ArrowRight size={16} />
                </Link>
              </SlideInLeft>

              <SlideInRight>
                <div className="grid grid-cols-2 gap-4">
                  {STATS.map(({ value, label }) => (
                    <div
                      key={label}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/50 text-center"
                    >
                      <p className="text-2xl font-black text-gradient-cyan">{value}</p>
                      <p className="text-xs text-slate-500 mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </SlideInRight>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BESTSELLERS  — from Sanity
      ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-slate-950">
        <div className="container-app">
          <div className="flex items-end justify-between mb-10">
            <FadeUp>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-amber-400/80 mb-2">
                  Customer Favorites
                </p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50">
                  Top <span className="text-amber-400">Bestsellers</span>
                </h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </FadeUp>
          </div>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestsellers.map((product, i) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} variant={i < 2 ? "default" : "compact"} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-slate-900/30 border-t border-slate-800/60">
        <FadeUp>
          <div className="container-app text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
              bg-gradient-to-br from-cyan-500 to-violet-600 mb-6
              shadow-[0_0_30px_rgba(6,182,212,0.4)]">
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
        </FadeUp>
      </section>
    </>
  );
}