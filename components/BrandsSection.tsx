"use client";

import Link        from "next/link";
import Image       from "next/image";
import { motion }  from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import type { SanityBrand } from "@/sanity/lib/types";

// ─────────────────────────────────────────────────────────────
// BRAND COLOUR MAP — purely decorative icon backgrounds
// These are vivid brand colours, intentionally not tokenised
// (they represent the brand identity, not the UI theme)
// ─────────────────────────────────────────────────────────────
const BRAND_STYLE: Record<string, { gradient: string }> = {
  apple:   { gradient: "from-slate-600 to-slate-800"   },
  samsung: { gradient: "from-blue-600  to-blue-800"    },
  google:  { gradient: "from-red-500   to-yellow-500"  },
  xiaomi:  { gradient: "from-orange-500 to-red-600"    },
  tecno:   { gradient: "from-cyan-500  to-teal-600"    },
  infinix: { gradient: "from-violet-500 to-purple-700" },
  anker:   { gradient: "from-emerald-500 to-green-700" },
  sony:    { gradient: "from-slate-500 to-slate-700"   },
  baseus:  { gradient: "from-amber-500 to-orange-600"  },
  oraimo:  { gradient: "from-rose-500  to-pink-700"    },
  dell:    { gradient: "from-blue-500  to-indigo-700"  },
  lenovo:  { gradient: "from-red-600   to-red-800"     },
  hp:      { gradient: "from-blue-400  to-cyan-600"    },
  asus:    { gradient: "from-teal-500  to-cyan-700"    },
  garmin:  { gradient: "from-green-500 to-emerald-700" },
  default: { gradient: "from-slate-400 to-slate-600"   },
};

const getBrandStyle = (name: string) =>
  BRAND_STYLE[name.toLowerCase()] ?? BRAND_STYLE.default;

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const cardVariants = {
  hidden:  { opacity: 0, scale: 0.88, y: 16 },
  visible: (i: number) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─────────────────────────────────────────────────────────────
// BRAND ICON
// ─────────────────────────────────────────────────────────────
function BrandIcon({
  brand,
  style,
}: {
  brand: SanityBrand;
  style: ReturnType<typeof getBrandStyle>;
}) {
  const hasLogo =
    typeof brand.logoUrl === "string" &&
    brand.logoUrl.trim() !== "" &&
    brand.logoUrl.startsWith("https://");

  if (hasLogo) {
    return (
      // White bg so logos with transparent backgrounds look clean on any theme
      <div className="w-12 h-12 rounded-xl bg-white flex items-center
        justify-center overflow-hidden shadow-card border border-border-subtle">
        <Image
          src={brand.logoUrl!}
          alt={`${brand.name} logo`}
          width={40}
          height={40}
          className="object-contain w-10 h-10"
        />
      </div>
    );
  }

  return (
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.gradient}
      flex items-center justify-center shadow-card`}>
      <span className="text-white font-black text-lg leading-none">
        {brand.name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
interface Props {
  brands: SanityBrand[];
}

export default function BrandsSection({ brands }: Props) {
  const withLogo    = brands.filter(
    (b) =>
      typeof b.logoUrl === "string" &&
      b.logoUrl.trim() !== "" &&
      b.logoUrl.startsWith("https://")
  );
  const withoutLogo = brands.filter(
    (b) =>
      !(typeof b.logoUrl === "string" &&
        b.logoUrl.trim() !== "" &&
        b.logoUrl.startsWith("https://"))
  );

  const display = [...withLogo, ...withoutLogo].slice(0, 8);

  if (display.length === 0) return null;

  return (
    <section className="section-padding bg-bg">
      <div className="container-app">

        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold tracking-widest uppercase
              text-primary-500 mb-2">
              Top Brands
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text">
              Shop by{" "}
              <span className="text-gradient-primary">Brand</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-sm
                text-text-muted hover:text-primary-500 transition-colors"
            >
              All products <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* ── Brand grid ──────────────────────────────── */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {display.map((brand, i) => {
            const style = getBrandStyle(brand.name);
            return (
              <motion.div
                key={brand._id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <Link
                  href={`/products?brand=${encodeURIComponent(brand.name)}`}
                  className="group flex flex-col items-center gap-3 p-4
                    rounded-2xl card hover:shadow-card-hover
                    hover:border-primary-200 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <BrandIcon brand={brand} style={style} />
                  </motion.div>

                  <span className="text-xs font-bold text-text-muted
                    group-hover:text-text transition-colors text-center
                    tracking-wide">
                    {brand.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}

          {/* More brands card */}
          <motion.div
            custom={display.length}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <Link
              href="/products"
              className="group flex flex-col items-center gap-3 p-4
                rounded-2xl border border-dashed border-border
                hover:border-primary-400 hover:bg-primary-50
                transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-bg-muted
                flex items-center justify-center
                group-hover:bg-primary-100 transition-colors duration-300">
                <Package
                  size={20}
                  className="text-text-faint group-hover:text-primary-500
                    transition-colors"
                />
              </div>
              <span className="text-xs font-bold text-text-faint
                group-hover:text-primary-600 transition-colors text-center">
                {brands.length > display.length
                  ? `+${brands.length - display.length} more`
                  : "All Products"}
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-text-faint mt-6 sm:hidden"
        >
          Tap a brand to browse its products
        </motion.p>
      </div>
    </section>
  );
}