"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Search, ShoppingCart, Menu, X,
  Smartphone, Laptop, Watch, BatteryCharging,
  Headphones, Cable, Package, Wifi,
  BookOpen, ChevronDown, type LucideIcon,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { SanityCategory } from "@/sanity/lib/fetch";

// ─────────────────────────────────────────────────────────────
// ICON MAP
// ─────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Smartphone: Smartphone,
  Laptop: Laptop,
  Watch: Watch,
  BatteryCharging: BatteryCharging,
  Headphones: Headphones,
  Cable: Cable,
};

function CategoryIcon({ name, size = 14 }: { name?: string; size?: number }) {
  const Icon = (name && ICON_MAP[name]) ? ICON_MAP[name] : Package;
  return <Icon size={size} className="text-white/50 flex-shrink-0" />;
}

const TOP_LINKS = [
  { href: "/services", label: "Services", Icon: Wifi, accent: true },
  { href: "/blog", label: "Blog", Icon: BookOpen, accent: false },
];

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.109.549 4.09 1.508 5.814L.057 23.25l5.575-1.462A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.371l-.361-.214-3.31.869.882-3.23-.235-.373A9.872 9.872 0 012.1 12c0-5.457 4.444-9.9 9.9-9.9 5.457 0 9.9 4.443 9.9 9.9 0 5.458-4.443 9.9-9.9 9.9z" />
  </svg>
);

interface NavbarProps {
  categories: SanityCategory[];
}

export default function Navbar({ categories }: NavbarProps) {
  const { totalItems, toggleCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopDropdown, setShopDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShopDropdown(false);
      }
    }
    if (shopDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shopDropdown]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  const isActive = (href: string) => pathname === href;
  const isCategoryActive = (slug: string) =>
    pathname === "/products" &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("category") === slug;

  return (
    <header className="sticky top-0 z-30 w-full">
      {/* <PromoBanner /> */}

      {/* ── Main nav — BLACK background ──────────────────────── */}
      <nav className="bg-[#111111] border-b border-white/10 shadow-[0_2px_24px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 gap-4">

            {/* ── Logo (logo.png) ─────────────────────────────── */}
            <Link href="/" className="flex items-center flex-shrink-0 group">
              <div className="h-12 w-auto flex items-center">
                <Image
                  src="/images/logo-white.png"
                  alt="HolarzGadgets"
                  width={140}
                  height={48}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </div>
            </Link>

            {/* ── Desktop search ──────────────────────────────── */}
            <form onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-lg mx-4">
              <div className="relative w-full">
                <Search size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                    text-white/40" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search phones, laptops, brands…"
                  className="w-full bg-white/10 border border-white/15 rounded-xl
                    pl-10 pr-4 py-2.5 text-sm text-white
                    placeholder:text-white/40
                    focus:outline-none focus:border-[#FF5A0A]/60
                    focus:bg-white/15 focus:ring-2 focus:ring-[#FF5A0A]/20
                    transition-all duration-200"
                />
              </div>
            </form>

            {/* ── Desktop nav links ────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-0.5">

              {/* Shop dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShopDropdown((v) => !v)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                    text-sm font-semibold transition-colors duration-150
                    ${pathname === "/products"
                      ? "text-[#FF5A0A] bg-white/5"
                      : "text-white/80 hover:text-white hover:bg-white/10"}`}
                >
                  Shop
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200
                      ${shopDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown panel */}
                {shopDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56
                    rounded-2xl bg-[#1a1a1a] border border-white/10
                    shadow-[0_8px_40px_rgba(0,0,0,0.5)] py-2 z-50">

                    <Link
                      href="/products"
                      onClick={() => setShopDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                        font-semibold text-white hover:text-[#FF5A0A]
                        hover:bg-white/5 transition-colors"
                    >
                      <Package size={14} className="text-white/40" />
                      All Products
                    </Link>

                    <div className="mx-4 my-1.5 border-t border-white/10" />

                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setShopDropdown(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5
                          text-sm font-medium transition-colors
                          ${isCategoryActive(cat.slug)
                            ? "text-[#FF5A0A] bg-white/5"
                            : "text-white/60 hover:text-white hover:bg-white/5"}`}
                      >
                        <CategoryIcon name={cat.icon} size={13} />
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-4 bg-white/15 mx-1" />

              {/* Services + Blog */}
              {TOP_LINKS.map(({ href, label, Icon, accent }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                    text-sm font-semibold transition-colors duration-150
                    ${isActive(href)
                      ? "text-[#FF5A0A] bg-white/5"
                      : accent
                        ? "text-[#FF5A0A] hover:text-[#FF5A0A] hover:bg-white/10"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <Icon size={14} />
                  {label}
                  {accent && (
                    <span className="ml-0.5 px-1.5 py-0.5 rounded-full
                      bg-[#FF5A0A]/20 text-[#FF5A0A]
                      text-[8px] font-black uppercase tracking-widest leading-none">
                      New
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="flex-1 lg:flex-none" />

            {/* ── Right actions ─────────────────────────────────── */}
            <div className="flex items-center gap-2">

              {/* WhatsApp CTA — desktop */}
              <a
                href="https://wa.me/2349055427487"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366]
                  hover:text-white border border-[#25D366]/30
                  font-bold text-xs transition-all duration-200"
              >
                {WA_ICON}
                Order Now
              </a>

              {/* Cart */}
              <button
                onClick={toggleCart}
                aria-label="Open cart"
                className="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20
                  border border-white/15 text-white/80 hover:text-white
                  transition-all duration-200"
              >
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5
                    rounded-full bg-[#FF5A0A] text-white
                    text-[10px] font-bold flex items-center justify-center
                    shadow-[0_0_8px_rgba(255,90,10,0.5)]">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                className="lg:hidden p-2.5 rounded-xl bg-white/10 hover:bg-white/20
                  border border-white/15 text-white/80 hover:text-white
                  transition-colors"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu — full-height drawer, black bg ────────── */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 top-[80px] z-40
            bg-[#111111] overflow-y-auto">
            <div className="px-4 pb-8 pt-5 space-y-5 min-h-full">

              {/* Mobile search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2
                      text-white/40" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search gadgets…"
                    className="w-full bg-white/10 border border-white/15 rounded-xl
                      pl-10 pr-4 py-3 text-sm text-white
                      placeholder:text-white/40 focus:outline-none
                      focus:border-[#FF5A0A]/60 focus:ring-2
                      focus:ring-[#FF5A0A]/20 transition-colors"
                  />
                </div>
              </form>

              {/* Services + Blog */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/services"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-3
                    rounded-xl bg-[#FF5A0A]/10 border border-[#FF5A0A]/30
                    text-sm font-bold text-[#FF5A0A] transition-all
                    hover:bg-[#FF5A0A]/20"
                >
                  <Wifi size={15} />
                  Services
                  <span className="px-1.5 py-0.5 rounded-full bg-[#FF5A0A]/20
                    text-[#FF5A0A] text-[8px] font-black
                    uppercase tracking-widest">
                    New
                  </span>
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-3
                    rounded-xl bg-white/5 border border-white/10
                    text-sm font-medium text-white/70
                    hover:text-white hover:bg-white/10 transition-all"
                >
                  <BookOpen size={15} />
                  Blog
                </Link>
              </div>

              {/* WhatsApp CTA — mobile */}
              <a
                href="https://wa.me/2349055427487"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5
                  rounded-xl bg-[#25D366] hover:bg-[#1da851]
                  text-white font-bold text-sm transition-all
                  shadow-[0_4px_16px_rgba(37,211,102,0.30)]"
              >
                {WA_ICON}
                Order on WhatsApp
              </a>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Category label */}
              <p className="text-[10px] font-bold tracking-widest uppercase
                text-white/30 px-1">
                Shop by category
              </p>

              {/* Category grid */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl
                    bg-white/5 border border-white/10 text-sm font-medium
                    text-white/70 hover:text-white hover:bg-white/10
                    hover:border-[#FF5A0A]/30 transition-all"
                >
                  <Package size={14} className="text-white/40" />
                  All Products
                </Link>

                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-xl
                      text-sm font-medium border transition-all
                      ${isCategoryActive(cat.slug)
                        ? "bg-[#FF5A0A]/10 border-[#FF5A0A]/30 text-[#FF5A0A]"
                        : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-[#FF5A0A]/30"}`}
                  >
                    <CategoryIcon name={cat.icon} size={14} />
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}