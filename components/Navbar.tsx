"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Zap, Search, ShoppingCart, Menu, X,
  Smartphone, Laptop, Watch, BatteryCharging,
  Headphones, Cable, Package, type LucideIcon,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { SanityCategory } from "@/sanity/lib/fetch";
import PromoBanner from "./PromoBanner";

// ─────────────────────────────────────────────────────────────
// ICON MAP  — maps the icon string stored in Sanity → Lucide component
// ─────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone:      Smartphone,
  Laptop:          Laptop,
  Watch:           Watch,
  BatteryCharging: BatteryCharging,
  Headphones:      Headphones,
  Cable:           Cable,
};

function CategoryIcon({ name, size = 14 }: { name?: string; size?: number }) {
  const Icon = (name && ICON_MAP[name]) ? ICON_MAP[name] : Package;
  return <Icon size={size} className="text-slate-500 flex-shrink-0" />;
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
interface NavbarProps {
  categories: SanityCategory[];
}

export default function Navbar({ categories }: NavbarProps) {
  const { totalItems, toggleCart } = useCart();
  const pathname    = usePathname();
  const router      = useRouter();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  // Helper — is this category currently active?
  const isActive = (slug: string) =>
    pathname === `/products` &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("category") === slug;

  return (
    <header className="sticky top-0 z-30 w-full">

     <PromoBanner />

      {/* ── Main nav ──────────────────────────────────────── */}
      <nav className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600
                flex items-center justify-center
                shadow-[0_0_15px_rgba(6,182,212,0.4)]
                group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-shadow">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-50">
                Holarz<span className="text-cyan-400">Gadgets</span>
              </span>
            </Link>

            {/* Desktop search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
              <div className="relative w-full">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gadgets, brands, models…"
                  className="w-full bg-slate-800/70 border border-slate-700/80 rounded-xl
                    pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500
                    focus:outline-none focus:border-cyan-500 focus:bg-slate-800
                    focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
                />
              </div>
            </form>

            {/* Desktop nav links — driven by Sanity categories */}
            <div className="hidden lg:flex items-center gap-1">
              {categories.map((cat) => {
                const href    = `/products?category=${cat.slug}`;
                const active  = isActive(cat.slug);
                return (
                  <Link
                    key={cat._id}
                    href={href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${active
                        ? "text-cyan-400 bg-cyan-500/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
                  >
                    {cat.title}
                  </Link>
                );
              })}
            </div>

            <div className="flex-1 lg:flex-none" />

            {/* Cart */}
            <button
              onClick={toggleCart}
              aria-label="Open cart"
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700
                border border-slate-700/60 text-slate-300 hover:text-slate-100
                transition-all duration-200"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
                  bg-cyan-500 text-slate-950 text-[10px] font-bold
                  flex items-center justify-center
                  shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="lg:hidden p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700
                border border-slate-700/60 text-slate-300 transition-colors"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950/95
            backdrop-blur-xl px-4 pb-4 space-y-3">

            {/* Mobile search */}
            <form onSubmit={handleSearch} className="pt-4">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gadgets…"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl
                    pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500
                    focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </form>

            {/* Mobile category grid — driven by Sanity */}
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                    bg-slate-800/60 border border-slate-700/50
                    text-sm font-medium text-slate-300
                    hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                >
                  <CategoryIcon name={cat.icon} size={14} />
                  {cat.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}