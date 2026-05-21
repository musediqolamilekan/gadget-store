"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import type { SanityBanner } from "@/sanity/lib/types";
import { urlForString } from "@/sanity/lib/client";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ACCENT = {
  cyan: {
    outer: "from-cyan-900/40 via-slate-900 to-violet-900/40",
    border: "border-cyan-500/20",
    blob1: "bg-cyan-500/10",
    blob2: "bg-violet-600/10",
    badge: "bg-cyan-500/20 text-cyan-400",
    title: "text-cyan-400",
    btn: "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]",
  },

  violet: {
    outer: "from-violet-900/40 via-slate-900 to-purple-900/40",
    border: "border-violet-500/20",
    blob1: "bg-violet-500/10",
    blob2: "bg-purple-600/10",
    badge: "bg-violet-500/20 text-violet-400",
    title: "text-violet-400",
    btn: "bg-violet-500 hover:bg-violet-400 shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)]",
  },

  amber: {
    outer: "from-amber-900/30 via-slate-900 to-orange-900/30",
    border: "border-amber-500/20",
    blob1: "bg-amber-500/10",
    blob2: "bg-orange-600/10",
    badge: "bg-amber-500/20 text-amber-400",
    title: "text-amber-400",
    btn: "bg-amber-500 hover:bg-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)]",
  },

  rose: {
    outer: "from-rose-900/30 via-slate-900 to-pink-900/30",
    border: "border-rose-500/20",
    blob1: "bg-rose-500/10",
    blob2: "bg-pink-600/10",
    badge: "bg-rose-500/20 text-rose-400",
    title: "text-rose-400",
    btn: "bg-rose-500 hover:bg-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.4)] hover:shadow-[0_0_40px_rgba(244,63,94,0.6)]",
  },
} as const;

type AccentKey = keyof typeof ACCENT;

const STATS = [
  { value: "1,200+", label: "Happy Customers" },
  { value: "500+", label: "Products" },
  { value: "4.9★", label: "Average Rating" },
  { value: "24/7", label: "Expert Support" },
];

interface Props {
  banners: SanityBanner[];
}

export default function PromoBanner({ banners }: Props) {
  const safeBanners = banners?.length ? banners : [null];

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        spaceBetween={24}
        loop={safeBanners.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={{
          nextEl: ".promo-next",
          prevEl: ".promo-prev",
        }}
        className="promo-banner-swiper"
      >
        {safeBanners.map((banner: SanityBanner | null, index) => {
          const accentKey = (banner?.accentColor ??
            "cyan") as AccentKey;

          const a = ACCENT[accentKey] ?? ACCENT.cyan;

          return (
            <SwiperSlide key={banner?._id ?? index}>
              <div
                className={`relative overflow-hidden rounded-3xl
                bg-gradient-to-br ${a.outer}
                border ${a.border} p-8 md:p-14`}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                >
                  <div
                    className={`absolute top-0 right-0 w-72 h-72 rounded-full
                    ${a.blob1} blur-3xl`}
                  />

                  <div
                    className={`absolute bottom-0 left-0 w-72 h-72 rounded-full
                    ${a.blob2} blur-3xl`}
                  />
                </div>
                <div className="relative grid md:grid-cols-2 gap-10 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs
                      font-bold tracking-widest uppercase mb-4 ${a.badge}`}
                    >
                      {banner?.badgeText ?? "Limited Time Offer"}
                    </span>

                    <h2
                      className="text-3xl md:text-5xl font-black tracking-tight
                      text-slate-50 mb-4 leading-tight"
                    >
                      {banner?.title ? (
                        <>
                          {banner.title
                            .split(" ")
                            .slice(0, -2)
                            .join(" ")}{" "}
                          <span className={a.title}>
                            {banner.title
                              .split(" ")
                              .slice(-2)
                              .join(" ")}
                          </span>
                        </>
                      ) : (
                        <>
                          Up to{" "}
                          <span className={a.title}>
                            30% Off
                          </span>
                          <br />
                          Flagship Phones
                        </>
                      )}
                    </h2>

                    <p className="text-slate-400 mb-8 leading-relaxed max-w-xl">
                      {banner?.subtitle ??
                        "Get the latest flagships at incredible prices. Free delivery on all phone orders this weekend only."}
                    </p>

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link
                        href={
                          banner?.ctaHref ??
                          "/products?category=phones"
                        }
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl
                        text-slate-950 font-bold transition-all duration-200 ${a.btn}`}
                      >
                        {banner?.ctaLabel ?? "Shop Phones"}
                        <ArrowRight size={16} />
                      </Link>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {banner?.image ? (
                      <div className="relative">
                        <div
                          className="relative h-[320px] md:h-[420px]
                          rounded-3xl overflow-hidden border border-slate-800"
                        >
                          <Image
                            src={urlForString(
                              banner.image,
                              1200,
                              900,
                              100
                            )}
                            alt={banner.title ?? "Promo Banner"}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                          />

                          <div
                            className="absolute inset-0 bg-gradient-to-t
                            from-slate-950/60 via-transparent to-transparent"
                          />

                          <div className="absolute top-4 left-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold
                              uppercase tracking-widest backdrop-blur-md ${a.badge}`}
                            >
                              Featured Deal
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {STATS.map(({ value, label }, i) => (
                          <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              delay: i * 0.08,
                              duration: 0.4,
                            }}
                            className="p-5 rounded-2xl bg-slate-900/60 border
                            border-slate-700/50 text-center"
                          >
                            <p
                              className={`text-2xl font-black ${a.title}`}
                            >
                              {value}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              {label}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <button
        className="promo-prev absolute left-3 md:left-5 top-1/2
        -translate-y-1/2 z-50 w-11 h-11 rounded-full
        bg-slate-900/80 border border-slate-700
        text-slate-200 backdrop-blur-md
        hover:bg-slate-800 transition-all duration-200
        flex items-center justify-center"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        className="promo-next absolute right-3 md:right-5 top-1/2
        -translate-y-1/2 z-50 w-11 h-11 rounded-full
        bg-slate-900/80 border border-slate-700
        text-slate-200 backdrop-blur-md
        hover:bg-slate-800 transition-all duration-200
        flex items-center justify-center"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}