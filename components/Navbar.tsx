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
import PromoBanner from "./PromoBanner";

// ─────────────────────────────────────────────────────────────
// ICON MAP
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
  return <Icon size={size} className="text-text-faint flex-shrink-0" />;
}

const TOP_LINKS = [
  { href: "/services", label: "Services", Icon: Wifi,     accent: true  },
  { href: "/blog",     label: "Blog",     Icon: BookOpen, accent: false },
];

const WA_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.109.549 4.09 1.508 5.814L.057 23.25l5.575-1.462A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.371l-.361-.214-3.31.869.882-3.23-.235-.373A9.872 9.872 0 012.1 12c0-5.457 4.444-9.9 9.9-9.9 5.457 0 9.9 4.443 9.9 9.9 0 5.458-4.443 9.9-9.9 9.9z"/>
  </svg>
);

interface NavbarProps {
  categories: SanityCategory[];
}

export default function Navbar({ categories }: NavbarProps) {
  const { totalItems, toggleCart } = useCart();
  const pathname  = usePathname();
  const router    = useRouter();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [shopDropdown, setShopDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click — more reliable than onBlur
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  const isActive        = (href: string) => pathname === href;
  const isCategoryActive = (slug: string) =>
    pathname === "/products" &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("category") === slug;

  return (
    <header className="sticky top-0 z-30 w-full">
      {/* <PromoBanner /> */}

      {/* ── Main nav ─────────────────────────────────────── */}
      <nav className="bg-bg border-b border-border shadow-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20 gap-4">

            {/* ── Logo ────────────────────────────────────── */}
            <Link href="/" className="flex items-center flex-shrink-0 group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0
                ring-1 ring-border group-hover:ring-primary-400
                transition-all duration-200">
                <Image
                  src="/images/logo.jpeg"
                  alt="HolarzGadgets"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </Link>

            {/* ── Desktop search ──────────────────────────── */}
            <form onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-lg mx-4">
              <div className="relative w-full">
                <Search size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                    text-text-faint" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search phones, laptops, brands…"
                  className="w-full bg-bg-subtle border border-border rounded-xl
                    pl-10 pr-4 py-2.5 text-sm text-text
                    placeholder:text-text-faint
                    focus:outline-none focus:border-primary-400
                    focus:bg-bg focus:ring-2 focus:ring-primary-500/15
                    transition-all duration-200"
                />
              </div>
            </form>

            {/* ── Desktop nav ─────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-0.5">

              {/* Shop dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShopDropdown((v) => !v)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                    text-sm font-semibold transition-colors duration-150
                    ${pathname === "/products"
                      ? "text-primary-600 bg-primary-50"
                      : "text-text-muted hover:text-text hover:bg-bg-muted"}`}
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
                    rounded-2xl bg-bg border border-border
                    shadow-[0_8px_40px_rgba(0,0,0,0.12)] py-2 z-50">

                    <Link
                      href="/products"
                      onClick={() => setShopDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm
                        font-semibold text-text hover:text-primary-600
                        hover:bg-primary-50 transition-colors"
                    >
                      <Package size={14} className="text-text-faint" />
                      All Products
                    </Link>

                    <div className="mx-4 my-1.5 border-t border-border-subtle" />

                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setShopDropdown(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5
                          text-sm font-medium transition-colors
                          ${isCategoryActive(cat.slug)
                            ? "text-primary-600 bg-primary-50"
                            : "text-text-muted hover:text-text hover:bg-bg-subtle"}`}
                      >
                        <CategoryIcon name={cat.icon} size={13} />
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-4 bg-border mx-1" />

              {/* Services + Blog */}
              {TOP_LINKS.map(({ href, label, Icon, accent }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg
                    text-sm font-semibold transition-colors duration-150
                    ${isActive(href)
                      ? "text-primary-600 bg-primary-50"
                      : accent
                        ? "text-primary-500 hover:text-primary-600 hover:bg-primary-50"
                        : "text-text-muted hover:text-text hover:bg-bg-muted"
                    }`}
                >
                  <Icon size={14} />
                  {label}
                  {accent && (
                    <span className="ml-0.5 px-1.5 py-0.5 rounded-full
                      bg-primary-100 text-primary-600
                      text-[8px] font-black uppercase tracking-widest leading-none">
                      New
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="flex-1 lg:flex-none" />

            {/* ── Right actions ─────────────────────────────── */}
            <div className="flex items-center gap-2">

              {/* WhatsApp CTA — desktop */}
              <a
                href="https://wa.me/2349055427487"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-accent-green/10 hover:bg-accent-green text-accent-green
                  hover:text-white border border-accent-green/30
                  font-bold text-xs transition-all duration-200"
              >
                {WA_ICON}
                Order Now
              </a>

              {/* Cart */}
              <button
                onClick={toggleCart}
                aria-label="Open cart"
                className="relative p-2.5 rounded-xl bg-bg-muted hover:bg-bg-subtle
                  border border-border text-text-muted hover:text-text
                  transition-all duration-200"
              >
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5
                    rounded-full bg-primary-500 text-text-inverse
                    text-[10px] font-bold flex items-center justify-center
                    glow-primary-sm">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                className="lg:hidden p-2.5 rounded-xl bg-bg-muted hover:bg-bg-subtle
                  border border-border text-text-muted transition-colors"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-bg
            px-4 pb-5 space-y-4">

            {/* Mobile search */}
            <form onSubmit={handleSearch} className="pt-4">
              <div className="relative">
                <Search size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2
                    text-text-faint" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gadgets…"
                  className="w-full bg-bg-subtle border border-border rounded-xl
                    pl-10 pr-4 py-2.5 text-sm text-text
                    placeholder:text-text-faint focus:outline-none
                    focus:border-primary-400 focus:ring-2
                    focus:ring-primary-500/15 transition-colors"
                />
              </div>
            </form>

            {/* Services + Blog */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/services"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-3
                  rounded-xl bg-primary-50 border border-primary-200
                  text-sm font-bold text-primary-600 transition-all"
              >
                <Wifi size={15} />
                Services
                <span className="px-1.5 py-0.5 rounded-full bg-primary-100
                  text-primary-600 text-[8px] font-black
                  uppercase tracking-widest">
                  New
                </span>
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-3
                  rounded-xl bg-bg-muted border border-border
                  text-sm font-medium text-text-muted
                  hover:text-text transition-all"
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
              className="flex items-center justify-center gap-2 w-full py-3
                rounded-xl bg-success hover:opacity-90
                text-text-inverse font-bold text-sm transition-all"
            >
              {WA_ICON}
              Order on WhatsApp
            </a>

            {/* Category label */}
            <p className="text-[10px] font-bold tracking-widest uppercase
              text-text-faint px-1">
              Shop by category
            </p>

            {/* Category grid */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                  bg-bg-subtle border border-border text-sm font-medium
                  text-text-muted hover:text-primary-600
                  hover:border-primary-200 transition-all"
              >
                <Package size={14} className="text-text-faint" />
                All Products
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                    bg-bg-subtle border border-border text-sm font-medium
                    text-text-muted hover:text-primary-600
                    hover:border-primary-200 transition-all"
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