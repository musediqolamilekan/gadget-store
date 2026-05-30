"use client";

import Link        from "next/link";
import Image       from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

import type { SanityBanner } from "@/sanity/lib/types";
import { urlForString }      from "@/sanity/lib/client";

// ─────────────────────────────────────────────────────────────
// ACCENT MAP — per banner colour
// ─────────────────────────────────────────────────────────────
const ACCENT = {
  cyan: {
    badge:       "bg-cyan-500/15 text-cyan-600 border border-cyan-500/30",
    heading:     "text-cyan-500",
    btn:         "bg-cyan-500 hover:bg-cyan-600 text-white shadow-[0_4px_20px_rgb(var(--color-accent-cyan)/35%)]",
    btnOutline:  "border-cyan-500/40 text-cyan-600 hover:bg-cyan-50",
    dot:         "bg-cyan-500",
    glow:        "from-cyan-500/10 via-transparent to-violet-500/10",
    imageBorder: "border-cyan-500/20",
    statAccent:  "text-cyan-600",
  },
  violet: {
    badge:       "bg-violet-500/15 text-violet-600 border border-violet-500/30",
    heading:     "text-violet-500",
    btn:         "bg-violet-500 hover:bg-violet-600 text-white shadow-[0_4px_20px_rgb(var(--color-accent-violet)/35%)]",
    btnOutline:  "border-violet-500/40 text-violet-600 hover:bg-violet-50",
    dot:         "bg-violet-500",
    glow:        "from-violet-500/10 via-transparent to-purple-500/10",
    imageBorder: "border-violet-500/20",
    statAccent:  "text-violet-600",
  },
  amber: {
    badge:       "bg-amber-500/15 text-amber-700 border border-amber-500/30",
    heading:     "text-amber-600",
    btn:         "bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_20px_rgb(var(--color-accent-amber)/35%)]",
    btnOutline:  "border-amber-500/40 text-amber-700 hover:bg-amber-50",
    dot:         "bg-amber-500",
    glow:        "from-amber-500/10 via-transparent to-orange-500/10",
    imageBorder: "border-amber-500/20",
    statAccent:  "text-amber-600",
  },
  rose: {
    badge:       "bg-rose-500/15 text-rose-600 border border-rose-500/30",
    heading:     "text-rose-500",
    btn:         "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_20px_rgb(var(--color-accent-rose)/35%)]",
    btnOutline:  "border-rose-500/40 text-rose-600 hover:bg-rose-50",
    dot:         "bg-rose-500",
    glow:        "from-rose-500/10 via-transparent to-pink-500/10",
    imageBorder: "border-rose-500/20",
    statAccent:  "text-rose-600",
  },
  primary: {
    badge:       "bg-primary-50 text-primary-700 border border-primary-200",
    heading:     "text-primary-500",
    btn:         "bg-primary-500 hover:bg-primary-600 text-white glow-primary",
    btnOutline:  "border-primary-300 text-primary-600 hover:bg-primary-50",
    dot:         "bg-primary-500",
    glow:        "from-primary-500/8 via-transparent to-primary-300/8",
    imageBorder: "border-primary-200",
    statAccent:  "text-primary-600",
  },
} as const;

type AccentKey = keyof typeof ACCENT;

const STATS = [
  { value: "1,200+", label: "Happy Customers", Icon: Star       },
  { value: "500+",   label: "Products",         Icon: ShoppingBag },
  { value: "4.9★",   label: "Avg Rating",       Icon: Star       },
  { value: "24/7",   label: "Support",          Icon: ShoppingBag },
];

interface Props {
  banners: SanityBanner[];
  stats?:  { value: string; label: string }[];
}

// ─────────────────────────────────────────────────────────────
// SLIDE
// ─────────────────────────────────────────────────────────────
function BannerSlide({
  banner,
  a,
  active,
}: {
  banner: SanityBanner | null;
  a:      (typeof ACCENT)[AccentKey];
  active: boolean;
}) {
  const imgUrl = banner?.image
    ? urlForString(banner.image, 1200, 900, 100)
    : null;

  return (
    <AnimatePresence mode="wait">
      {active && (
        <motion.div
          key={banner?._id ?? "fallback"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{   opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center
            min-h-[320px] md:min-h-[400px]"
        >
          {/* ── Left: text ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x:   0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22,1,0.36,1] }}
          >
            {/* Badge */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1
              rounded-full text-[10px] font-black tracking-[0.15em]
              uppercase mb-5 ${a.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${a.dot}`} />
              {banner?.badgeText ?? "Limited Time Offer"}
            </span>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black
              tracking-tight text-text leading-[1.1] mb-4">
              {banner?.title ? (
                <>
                  {banner.title.split(" ").slice(0, -2).join(" ")}{" "}
                  <span className={a.heading}>
                    {banner.title.split(" ").slice(-2).join(" ")}
                  </span>
                </>
              ) : (
                <>
                  Up to{" "}
                  <span className={a.heading}>30% Off</span>
                  <br />Flagship Phones
                </>
              )}
            </h2>

            {/* Subtitle */}
            <p className="text-text-muted text-base leading-relaxed mb-8 max-w-md">
              {banner?.subtitle ??
                "Get the latest flagships at incredible prices. Free delivery on all phone orders this weekend only."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={banner?.ctaHref ?? "/products?category=phones"}
                  className={`inline-flex items-center gap-2 px-6 py-3.5
                    rounded-xl font-bold text-sm transition-all duration-200
                    ${a.btn}`}
                >
                  {banner?.ctaLabel ?? "Shop Now"}
                  <ArrowRight size={15} />
                </Link>
              </motion.div>
              <Link
                href="/products"
                className={`inline-flex items-center gap-2 px-6 py-3.5
                  rounded-xl font-semibold text-sm border
                  transition-all duration-200 text-text-muted
                  hover:bg-bg-muted border-border`}
              >
                Browse All
              </Link>
            </div>
          </motion.div>

          {/* ── Right: image or stats ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x:  0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.22,1,0.36,1] }}
            className="relative"
          >
            {imgUrl ? (
              <div className="relative">
                {/* Decorative ring */}
                <div className={`absolute -inset-3 rounded-[2rem]
                  bg-gradient-to-br ${a.glow} blur-xl`} />
                {/* Image card */}
                <div className={`relative rounded-3xl overflow-hidden
                  border-2 ${a.imageBorder} shadow-card-hover`}>
                  {/* Featured tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1.5 rounded-full text-[10px]
                      font-black tracking-widest uppercase
                      backdrop-blur-md ${a.badge}`}>
                      Featured Deal
                    </span>
                  </div>
                  <Image
                    src={imgUrl}
                    alt={banner?.title ?? "Promo Banner"}
                    width={600}
                    height={400}
                    priority
                    className="w-full h-[260px] md:h-[360px] object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t
                    from-bg/40 via-transparent to-transparent" />
                </div>
              </div>
            ) : (
              /* Stats grid fallback */
              <div className="grid grid-cols-2 gap-3">
                {STATS.map(({ value, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y:  0 }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
                    className="card p-5 text-center hover:shadow-card-hover
                      transition-shadow duration-300"
                  >
                    <p className={`text-2xl font-black ${a.statAccent}`}>
                      {value}
                    </p>
                    <p className="text-xs text-text-faint mt-1">{label}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function PromoBannerSection({ banners }: Props) {
  const safeBanners = banners?.length ? banners : [null];
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const total = safeBanners.length;

  const next = useCallback(() =>
    setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() =>
    setCurrent((c) => (c - 1 + total) % total), [total]);

  // Auto-advance
  useEffect(() => {
    if (paused || total <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, total, next]);

  const banner    = safeBanners[current];
  const accentKey = ((banner as SanityBanner | null)?.accentColor ?? "primary") as AccentKey;
  const a         = ACCENT[accentKey] ?? ACCENT.primary;

  return (
    <div
      className="relative bg-bg-subtle border-b border-border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Subtle background glow ──────────────────────── */}
      <div aria-hidden
        className={`absolute inset-0 bg-gradient-to-r ${a.glow}
          pointer-events-none transition-all duration-700`} />

      {/* ── Content ─────────────────────────────────────── */}
      <div className="container-app py-10 md:py-14 relative">
        <BannerSlide
          banner={banner as SanityBanner | null}
          a={a}
          active={true}
        />
      </div>

      {/* ── Navigation arrows ───────────────────────────── */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous banner"
            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2
              z-10 w-10 h-10 rounded-full bg-bg border border-border
              text-text-muted hover:text-text hover:border-border-strong
              shadow-card flex items-center justify-center
              transition-all duration-200"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next banner"
            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2
              z-10 w-10 h-10 rounded-full bg-bg border border-border
              text-text-muted hover:text-text hover:border-border-strong
              shadow-card flex items-center justify-center
              transition-all duration-200"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* ── Dot indicators ──────────────────────────────── */}
      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2
          flex items-center gap-1.5 z-10">
          {safeBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300
                ${i === current
                  ? `w-6 h-2 ${a.dot}`
                  : "w-2 h-2 bg-border-strong hover:bg-text-faint"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}