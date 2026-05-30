import Link from "next/link";
import {
  ArrowRight,
  Smartphone, Laptop, Watch,
  BatteryCharging, Headphones, Cable,
  Shield, Truck, RotateCcw, Headset,
  Zap, Package, type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";

import ProductCard from "@/components/ProductCard";
import NewsletterForm from "@/components/NewsletterForm";
import PromoBannerSection from "@/components/PromoBannerSection";
import BrandsSectionServer from "@/components/BrandsSectionServer";
import {
  FadeUp, FadeInOnMount, StaggerGrid, StaggerItem,
} from "@/components/animations";
import {
  getFeaturedProducts,
  getBestsellerProducts,
  getFeaturedCategories,
  getActiveBanners,
} from "@/sanity/lib/fetch";
import type { SanityCategory } from "@/sanity/lib/fetch";
import SocialLinks from "@/components/SocialLinks";

// ─────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title:
    "HolarzGadgets | Original Phones, Laptops & Gadgets in Ekiti, Nigeria",
  description:
    "Shop 100% original phones, laptops, smartwatches, earbuds, power banks and accessories at HolarzGadgets — Ekiti's most trusted gadget store. Fast delivery across Ekiti State and Nigeria.",
};

// ─────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone: Smartphone,
  Laptop: Laptop,
  Watch: Watch,
  BatteryCharging: BatteryCharging,
  Headphones: Headphones,
  Cable: Cable,
};

// Category gradient keeps its own palette — these are purely
// decorative icon backgrounds, not UI chrome, so they stay vivid
const CATEGORY_GRADIENTS: Record<string, string> = {
  phones: "from-cyan-500 to-blue-600",
  laptops: "from-violet-500 to-purple-700",
  smartwatches: "from-emerald-500 to-teal-600",
  "power-banks": "from-amber-500 to-orange-600",
  earbuds: "from-rose-500 to-pink-600",
  accessories: "from-slate-400 to-slate-600",
};

const TRUST_BADGES = [
  { Icon: Shield, title: "100% Original", desc: "Guaranteed authentic" },
  { Icon: Truck, title: "Free Shipping", desc: "Orders over ₦50,000" },
  { Icon: RotateCcw, title: "7-Day Returns", desc: "Hassle-free" },
  { Icon: Headset, title: "WhatsApp Support", desc: "Mon–Sat, 8am–8pm" },
];

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default async function HomePage() {
  const [featured, bestsellers, categories, banners] = await Promise.all([
    getFeaturedProducts(),
    getBestsellerProducts(),
    getFeaturedCategories(),
    getActiveBanners(),
  ]);

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
          "Ado-Ekiti", "Ikere-Ekiti", "Ikole-Ekiti",
          "Ilawe-Ekiti", "Ekiti State", "Lagos", "Abuja", "Nigeria",
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

      {/* ══ HERO BANNER — full-width, no extra bg wrapper ══ */}
      <PromoBannerSection banners={banners} />

      {/* ══ TRUST BADGES ═════════════════════════════════ */}
      <section className="border-b border-border bg-bg">
        <div className="container-app py-8">
          <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ Icon, title, desc }) => (
              <StaggerItem key={title}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50
                    flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">{title}</p>
                    <p className="text-xs text-text-faint">{desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ══ BRANDS ═══════════════════════════════════════ */}
      <BrandsSectionServer />

      {/* ══ CATEGORIES ═══════════════════════════════════ */}
      <section className="section-padding bg-bg-subtle">
        <div className="container-app">
          <div className="flex items-end justify-between mb-10">
            <FadeUp>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase
                  text-primary-500 mb-2">
                  Browse By Category
                </p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text">
                  What are you{" "}
                  <span className="text-gradient-primary">looking for?</span>
                </h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-2 text-sm
                  text-text-muted hover:text-primary-500 transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </FadeUp>
          </div>

          <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat: SanityCategory) => {
              const Icon = cat.icon && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : Package;
              const gradient = CATEGORY_GRADIENTS[cat.slug] ?? "from-slate-400 to-slate-600";
              return (
                <StaggerItem key={cat._id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="group flex flex-col items-center gap-3 p-4
                      rounded-2xl card hover:shadow-card-hover
                      hover:border-primary-200 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br
                      ${gradient} flex items-center justify-center shadow-lg
                      group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-text-muted
                      group-hover:text-text transition-colors text-center">
                      {cat.title}
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ════════════════════════════ */}
      <section className="section-padding bg-bg">
        <div className="container-app">
          <div className="flex items-end justify-between mb-10">
            <FadeUp>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase
                  text-primary-500 mb-2">
                  Editor&apos;s Picks
                </p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text">
                  Featured{" "}
                  <span className="text-gradient-primary">Gadgets</span>
                </h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-2 text-sm
                  text-text-muted hover:text-primary-500 transition-colors"
              >
                See all <ArrowRight size={14} />
              </Link>
            </FadeUp>
          </div>

          <StaggerGrid
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              xl:grid-cols-4 gap-4"
          >
            {featured.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ══ BESTSELLERS ══════════════════════════════════ */}
      <section className="section-padding bg-bg-subtle">
        <div className="container-app">
          <div className="flex items-end justify-between mb-10">
            <FadeUp>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase
                  text-primary-500 mb-2">
                  Customer Favourites
                </p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text">
                  Top{" "}
                  <span className="text-gradient-primary">Bestsellers</span>
                </h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-2 text-sm
                  text-text-muted hover:text-primary-500 transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </FadeUp>
          </div>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestsellers.map((product, i) => (
              <StaggerItem key={product.id}>
                <ProductCard
                  product={product}
                  variant={i < 2 ? "default" : "compact"}
                />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ══ CONNECT WITH US ══════════════════════════════ */}
      <section className="section-padding border-t border-border bg-bg">
        <FadeUp>
          <div className="container-app">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text mb-3">
                Connect with us
              </h2>
              <p className="text-text-muted max-w-md mx-auto">
                Follow us on social media, join our community, or find us in Ado-Ekiti.
              </p>
            </div>

            <SocialLinks />
          </div>
        </FadeUp>
      </section>
    </>
  );
}