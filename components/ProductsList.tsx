"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { mockProducts, CATEGORIES, BRANDS } from "@/lib/data";

// ─────────────────────────────────────────────────────────────
// FILTER PANEL
// ─────────────────────────────────────────────────────────────
interface Filters {
  category: string;
  brand: string;
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
  rating: number;
}

const DEFAULT_FILTERS: Filters = {
  category: "",
  brand: "",
  priceMin: 0,
  priceMax: 5000,
  inStockOnly: false,
  rating: 0,
};

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-slate-800 pb-5 mb-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full mb-3 text-sm font-semibold text-slate-300 hover:text-slate-100 transition-colors"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function ProductsList() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const initialQuery = searchParams.get("q") ?? "";

  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    category: initialCategory,
  });
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ── Filtered + sorted products ───────────────────────────
  const results = useMemo(() => {
    let list = [...mockProducts];

    // Text search
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    // Filters
    if (filters.category) list = list.filter((p) => p.category === filters.category);
    if (filters.brand) list = list.filter((p) => p.brand === filters.brand);
    if (filters.inStockOnly) list = list.filter((p) => p.stockCount > 0);
    if (filters.rating) list = list.filter((p) => p.rating >= filters.rating);
    list = list.filter((p) => {
      const price = p.discountPrice ?? p.price;
      return price >= filters.priceMin && price <= filters.priceMax;
    });

    // Sort
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case "price-desc":
        list.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [filters, query, sortBy]);

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.brand ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (filters.priceMax < 5000 ? 1 : 0);

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  useEffect(() => {
    const category = searchParams.get("category") ?? "";
    const q = searchParams.get("q") ?? "";
    setFilters({
      ...DEFAULT_FILTERS,
      category,
    });

    setQuery(q);
    setSortBy("featured");
    setMobileFiltersOpen(false);
  }, [searchParams]);

  // ── Sidebar panel ────────────────────────────────────────
  const SidebarFilters = () => (
    <aside className="w-full lg:w-60 flex-shrink-0 space-y-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-slate-200">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-1.5">
          <button
            onClick={() => setFilters((f) => ({ ...f, category: "" }))}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
              ${!filters.category ? "bg-cyan-500/15 text-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
          >
            All Categories
          </button>
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  category: f.category === key ? "" : key,
                }))
              }
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                ${filters.category === key
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-1.5">
          {BRANDS.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <label
                className={`group flex items-center gap-3 px-3 py-2 rounded-xl border cursor-pointer transition-all duration-200
    ${filters.brand === brand
                    ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                    : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={filters.brand === brand}
                  onChange={() =>
                    setFilters((f) => ({
                      ...f,
                      brand: f.brand === brand ? "" : brand,
                    }))
                  }
                  className="sr-only"
                />

                {/* Custom Checkbox */}
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200
      ${filters.brand === brand
                      ? "border-cyan-500 bg-cyan-500"
                      : "border-slate-600 bg-slate-800 group-hover:border-slate-500"
                    }`}
                >
                  {filters.brand === brand && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5 text-slate-950"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.313a1 1 0 0 1-1.42-.004L3.29 9.204a1 1 0 1 1 1.42-1.408l4.04 4.074 6.54-6.586a1 1 0 0 1 1.414.006Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                {/* Brand Name */}
                <span
                  className={`text-sm font-medium transition-colors
      ${filters.brand === brand
                      ? "text-cyan-300"
                      : "text-slate-300 group-hover:text-slate-100"
                    }`}
                >
                  {brand}
                </span>
              </label>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>₦{filters.priceMin}</span>
            <span>₦{filters.priceMax === 5000 ? "5000+" : filters.priceMax}</span>
          </div>
          <input
            type="range"
            min={0}
            max={5000}
            step={50}
            value={filters.priceMax}
            onChange={(e) =>
              setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))
            }
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin || ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, priceMin: Number(e.target.value) }))
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax === 5000 ? "" : filters.priceMax}
              onChange={(e) =>
                setFilters((f) => ({ ...f, priceMax: Number(e.target.value) || 5000 }))
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </FilterSection>

      {/* Min rating */}
      <FilterSection title="Minimum Rating">
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setFilters((f) => ({ ...f, rating: r }))}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${filters.rating === r
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"}`}
            >
              {r === 0 ? "All" : `${r}★`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* In stock */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) =>
            setFilters((f) => ({ ...f, inStockOnly: e.target.checked }))
          }
          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/30"
        />
        <span className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
          In Stock Only
        </span>
      </label>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container-app py-10">
        {/* ── Page header ─────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-50 mb-1">
            {filters.category
              ? CATEGORIES.find((c) => c.key === filters.category)?.label ??
              "Products"
              : query
                ? `Results for "${query}"`
                : "All Products"}
          </h1>
          <p className="text-slate-500 text-sm">{results.length} products found</p>
        </div>

        {/* ── Search bar ──────────────────────────────────── */}
        <div className="mb-6 relative max-w-lg">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5
              text-sm text-slate-200 placeholder:text-slate-500
              focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex gap-8">
          {/* ── Sidebar (desktop) ─────────────────────────── */}
          <div className="hidden lg:block">
            <SidebarFilters />
          </div>

          {/* ── Main content ─────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Controls row */}
            <div className="flex items-center justify-between gap-3 mb-6">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300"
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-xs text-slate-500 hidden sm:block">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300
                    focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <Search size={24} className="text-slate-600" />
                </div>
                <p className="text-slate-300 font-semibold mb-1">No products found</p>
                <p className="text-slate-500 text-sm">
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ──────────────────────────── */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 bg-slate-900 border-r border-slate-800 z-50 p-6 overflow-y-auto lg:hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-100 text-lg">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarFilters />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full mt-4 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm"
            >
              Show {results.length} Results
            </button>
          </div>
        </>
      )}
    </div>
  );
}

