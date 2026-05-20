"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal, X, ChevronDown, ChevronUp,
  Search, ChevronLeft, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";
import type { SanityCategory } from "@/sanity/lib/fetch";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const MAX_PRICE = 4_000_000;
const PRODUCTS_PER_PAGE = 12;

// ─────────────────────────────────────────────────────────────
// NAIRA FORMATTER
// ─────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

// ─────────────────────────────────────────────────────────────
// TYPES
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
  priceMax: MAX_PRICE,
  inStockOnly: false,
  rating: 0,
};

interface ProductsClientProps {
  allProducts: Product[];
  allBrands: string[];
  allCategories: SanityCategory[];
}

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
  exit: {},
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as number[] },
  },
  exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.2 } },
};

const fadeVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2 } },
};

const sidebarVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0, opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as number[] },
  },
};

// ─────────────────────────────────────────────────────────────
// FILTER SECTION
// ─────────────────────────────────────────────────────────────
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
        className="flex items-center justify-between w-full mb-3 text-sm
          font-semibold text-slate-300 hover:text-slate-100 transition-colors"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("…");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <motion.div
      className="flex items-center justify-center gap-1.5 mt-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
          bg-slate-800 border border-slate-700 text-slate-300
          hover:bg-slate-700 hover:text-slate-100
          disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft size={14} /> Prev
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ell-${i}`} className="px-2 text-slate-500 text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200
              ${currentPage === p
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
          bg-slate-800 border border-slate-700 text-slate-300
          hover:bg-slate-700 hover:text-slate-100
          disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next <ChevronRight size={14} />
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ProductsClient({
  allProducts,
  allBrands,
  allCategories,
}: ProductsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category") ?? "";
  const initialQuery = searchParams.get("q") ?? "";
  const initialPage = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    category: initialCategory,
  });
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync URL params → state on navigation
  useEffect(() => {
    setFilters({ ...DEFAULT_FILTERS, category: searchParams.get("category") ?? "" });
    setQuery(searchParams.get("q") ?? "");
    setSortBy("featured");
    setCurrentPage(Math.max(1, Number(searchParams.get("page") ?? "1")));
    setMobileFiltersOpen(false);
  }, [searchParams]);

  // Reset to page 1 whenever filters / query / sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, query, sortBy]);

  // ── Filtered + sorted list ───────────────────────────────
  const allResults = useMemo(() => {
    let list = [...allProducts];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (filters.category) list = list.filter((p) => p.category === filters.category);
    if (filters.brand) list = list.filter((p) => p.brand === filters.brand);
    if (filters.inStockOnly) list = list.filter((p) => p.stockCount > 0);
    if (filters.rating) list = list.filter((p) => p.rating >= filters.rating);

    list = list.filter((p) => {
      const price = p.discountPrice ?? p.price;
      return price >= filters.priceMin && price <= filters.priceMax;
    });

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
  }, [allProducts, filters, query, sortBy]);

  // ── Pagination derived values ────────────────────────────
  const totalPages = Math.ceil(allResults.length / PRODUCTS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const pageResults = allResults.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.brand ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (filters.priceMax < MAX_PRICE ? 1 : 0);

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const activeCategoryTitle =
    allCategories.find((c) => c.slug === filters.category)?.title ?? "Products";

  // ── Sidebar ──────────────────────────────────────────────
  const SidebarFilters = () => (
    <motion.aside
      className="w-full lg:w-60 flex-shrink-0"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-slate-200">Filters</h2>
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.button
              onClick={resetFilters}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Clear all ({activeFilterCount})
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="space-y-1">
          <button
            onClick={() => setFilters((f) => ({ ...f, category: "" }))}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
              ${!filters.category
                ? "bg-cyan-500/15 text-cyan-400"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
          >
            All Categories
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat._id}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  category: f.category === cat.slug ? "" : cat.slug,
                }))
              }
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors
                ${filters.category === cat.slug
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"}`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-1.5">
          {allBrands.map((brand) => (
            <label
              key={brand}
              className={`group flex items-center gap-3 px-3 py-2 rounded-xl border cursor-pointer
                transition-all duration-200
                ${filters.brand === brand
                  ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70"}`}
            >
              <input
                type="checkbox"
                checked={filters.brand === brand}
                onChange={() =>
                  setFilters((f) => ({ ...f, brand: f.brand === brand ? "" : brand }))
                }
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center
                  flex-shrink-0 transition-all duration-200
                  ${filters.brand === brand
                    ? "border-cyan-500 bg-cyan-500"
                    : "border-slate-600 bg-slate-800 group-hover:border-slate-500"}`}
              >
                {filters.brand === brand && (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-slate-950">
                    <path
                      fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.313a1 1 0 0 1-1.42-.004L3.29 9.204a1 1 0 1 1 1.42-1.408l4.04 4.074 6.54-6.586a1 1 0 0 1 1.414.006Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors
                  ${filters.brand === brand
                    ? "text-cyan-300"
                    : "text-slate-300 group-hover:text-slate-100"}`}
              >
                {brand}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{fmt(filters.priceMin)}</span>
            <span>
              {filters.priceMax >= MAX_PRICE ? `${fmt(MAX_PRICE)}+` : fmt(filters.priceMax)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={MAX_PRICE}
            step={50_000}
            value={filters.priceMax}
            onChange={(e) =>
              setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))
            }
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-[10px] text-slate-500 mb-1">Min (₦)</p>
              <input
                type="number"
                placeholder="0"
                value={filters.priceMin || ""}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, priceMin: Number(e.target.value) }))
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5
                  text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-500 mb-1">Max (₦)</p>
              <input
                type="number"
                placeholder={MAX_PRICE.toString()}
                value={filters.priceMax >= MAX_PRICE ? "" : filters.priceMax}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    priceMax: Number(e.target.value) || MAX_PRICE,
                  }))
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5
                  text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
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

      {/* In Stock */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) =>
            setFilters((f) => ({ ...f, inStockOnly: e.target.checked }))
          }
          className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500
            focus:ring-cyan-500/30"
        />
        <span className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
          In Stock Only
        </span>
      </label>
    </motion.aside>
  );

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container-app py-10">

        {/* Page header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="text-3xl font-black tracking-tight text-slate-50 mb-1">
            {filters.category
              ? activeCategoryTitle
              : query
                ? `Results for "${query}"`
                : "All Products"}
          </h1>
          <p className="text-slate-500 text-sm">
            {allResults.length} product{allResults.length !== 1 ? "s" : ""} found
            {totalPages > 1 && (
              <span className="ml-1 text-slate-600">
                · page {safeCurrentPage} of {totalPages}
              </span>
            )}
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-6 relative max-w-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands…"
            className="w-full bg-slate-800/70 border border-slate-700 rounded-xl
              pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500
              focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <div className="hidden lg:block">
            <SidebarFilters />
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">

            {/* Controls */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-slate-800 border border-slate-700 text-sm text-slate-300"
              >
                <SlidersHorizontal size={14} />
                Filters
                <AnimatePresence>
                  {activeFilterCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950
                        text-[10px] font-bold flex items-center justify-center"
                    >
                      {activeFilterCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <label className="text-xs text-slate-500 hidden sm:block">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2
                    text-sm text-slate-300 focus:outline-none focus:border-cyan-500
                    transition-colors cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>
              </div>
            </div>

            {/* Grid with AnimatePresence for page transitions */}
            <AnimatePresence mode="wait">
              {pageResults.length === 0 ? (
                <motion.div
                  key="empty"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center
                    justify-center mb-4">
                    <Search size={24} className="text-slate-600" />
                  </div>
                  <p className="text-slate-300 font-semibold mb-1">No products found</p>
                  <p className="text-slate-500 text-sm">
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700
                      text-sm text-slate-300 transition-colors"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${safeCurrentPage}-${filters.category}-${filters.brand}-${sortBy}`}
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {pageResults.map((product) => (
                    <motion.div key={product.id} variants={cardVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 w-80 bg-slate-900 border-r border-slate-800
                z-50 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-100 text-lg">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarFilters />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400
                  text-slate-950 font-bold text-sm transition-colors"
              >
                Show {allResults.length} Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}