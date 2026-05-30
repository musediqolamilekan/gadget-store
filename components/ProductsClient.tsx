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
const MAX_PRICE        = 4_000_000;
const PRODUCTS_PER_PAGE = 12;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style:                 "currency",
    currency:              "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Filters {
  category:    string;
  brand:       string;
  priceMin:    number;
  priceMax:    number;
  inStockOnly: boolean;
  rating:      number;
}

const DEFAULT_FILTERS: Filters = {
  category:    "",
  brand:       "",
  priceMin:    0,
  priceMax:    MAX_PRICE,
  inStockOnly: false,
  rating:      0,
};

interface ProductsClientProps {
  allProducts:   Product[];
  allBrands:     string[];
  allCategories: SanityCategory[];
}

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const gridVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } },
  exit:    {},
};
const cardVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as number[] } },
  exit:    { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.2 } },
};
const fadeVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit:    { opacity: 0, y: 8, transition: { duration: 0.2 } },
};
const sidebarVariants = {
  hidden:  { x: -20, opacity: 0 },
  visible: { x: 0,   opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as number[] } },
};

// ─────────────────────────────────────────────────────────────
// FILTER SECTION
// ─────────────────────────────────────────────────────────────
function FilterSection({
  title, children,
}: {
  title:    string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border pb-5 mb-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full mb-3
          text-sm font-semibold text-text hover:text-text-muted
          transition-colors"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{   height: 0, opacity: 0 }}
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
function Pagination({
  currentPage, totalPages, onPageChange,
}: {
  currentPage:  number;
  totalPages:   number;
  onPageChange: (page: number) => void;
}) {
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

  const btnBase = `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm
    font-medium border transition-all duration-200
    disabled:opacity-40 disabled:cursor-not-allowed
    bg-bg border-border text-text-muted
    hover:bg-bg-muted hover:text-text`;

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
        className={btnBase}
      >
        <ChevronLeft size={14} /> Prev
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ell-${i}`}
            className="px-2 text-text-faint text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold
              transition-all duration-200 border
              ${currentPage === p
                ? "bg-primary-500 text-white border-primary-500 glow-primary-sm"
                : "bg-bg border-border text-text-muted hover:bg-bg-muted hover:text-text"}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={btnBase}
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
  allProducts, allBrands, allCategories,
}: ProductsClientProps) {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const initialCategory = searchParams.get("category") ?? "";
  const initialBrand    = searchParams.get("brand")    ?? "";
  const initialQuery    = searchParams.get("q")        ?? "";
  const initialPage     = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    category: initialCategory,
    brand:    initialBrand,
  });
  const [query,             setQuery]             = useState(initialQuery);
  const [sortBy,            setSortBy]            = useState("featured");
  const [currentPage,       setCurrentPage]       = useState(initialPage);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setFilters({
      ...DEFAULT_FILTERS,
      category: searchParams.get("category") ?? "",
      brand:    searchParams.get("brand")    ?? "",
    });
    setQuery(searchParams.get("q") ?? "");
    setSortBy("featured");
    setCurrentPage(Math.max(1, Number(searchParams.get("page") ?? "1")));
    setMobileFiltersOpen(false);
  }, [searchParams]);

  useEffect(() => { setCurrentPage(1); }, [filters, query, sortBy]);

  const allResults = useMemo(() => {
    let list = [...allProducts];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }
    if (filters.category)   list = list.filter((p) => p.category === filters.category);
    if (filters.brand)      list = list.filter((p) => p.brand === filters.brand);
    if (filters.inStockOnly) list = list.filter((p) => p.stockCount > 0);
    if (filters.rating)     list = list.filter((p) => p.rating >= filters.rating);
    list = list.filter((p) => {
      const price = p.discountPrice ?? p.price;
      return price >= filters.priceMin && price <= filters.priceMax;
    });
    switch (sortBy) {
      case "price-asc":  list.sort((a,b)=>(a.discountPrice??a.price)-(b.discountPrice??b.price)); break;
      case "price-desc": list.sort((a,b)=>(b.discountPrice??b.price)-(a.discountPrice??a.price)); break;
      case "rating":     list.sort((a,b)=>b.rating-a.rating); break;
      case "newest":     list.sort((a,b)=>(b.isNew?1:0)-(a.isNew?1:0)); break;
      default:           list.sort((a,b)=>(b.isFeatured?1:0)-(a.isFeatured?1:0));
    }
    return list;
  }, [allProducts, filters, query, sortBy]);

  const totalPages      = Math.ceil(allResults.length / PRODUCTS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex      = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const pageResults     = allResults.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  // ── Push filter changes to URL so the browser back button works ──
  const updateURL = useCallback((newFilters: Filters, newQuery: string) => {
    const params = new URLSearchParams();
    if (newFilters.category)                  params.set("category",  newFilters.category);
    if (newFilters.brand)                     params.set("brand",     newFilters.brand);
    if (newQuery.trim())                      params.set("q",         newQuery.trim());
    if (newFilters.priceMax < MAX_PRICE)      params.set("priceMax",  String(newFilters.priceMax));
    if (newFilters.priceMin > 0)              params.set("priceMin",  String(newFilters.priceMin));
    if (newFilters.inStockOnly)               params.set("inStock",   "1");
    if (newFilters.rating)                    params.set("rating",    String(newFilters.rating));
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }, [router]);

  // Wrapper so every filter change also updates the URL
  const applyFilter = useCallback((updater: (f: Filters) => Filters) => {
    setFilters((prev) => {
      const next = updater(prev);
      updateURL(next, query);
      return next;
    });
  }, [query, updateURL]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const activeFilterCount =
    (filters.category   ? 1 : 0) +
    (filters.brand      ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.rating     ? 1 : 0) +
    (filters.priceMax < MAX_PRICE ? 1 : 0);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setQuery("");
    router.replace("?", { scroll: false });
  };

  const activeCategoryTitle =
    allCategories.find((c) => c.slug === filters.category)?.title ?? "Products";

  // ── Sidebar ────────────────────────────────────────────
  const SidebarFilters = () => (
    <motion.aside
      className="w-full lg:w-60 flex-shrink-0"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-text">Filters</h2>
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.button
              onClick={resetFilters}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{   opacity: 0, scale: 0.8 }}
              className="text-xs text-primary-500 hover:text-primary-600
                transition-colors font-semibold"
            >
              Clear all ({activeFilterCount})
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Category ───────────────────────────────────── */}
      <FilterSection title="Category">
        <div className="space-y-1">
          <button
            onClick={() => applyFilter((f) => ({ ...f, category: "" }))}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg
              transition-colors
              ${!filters.category
                ? "bg-primary-50 text-primary-600 font-semibold"
                : "text-text-muted hover:text-text hover:bg-bg-muted"}`}
          >
            All Categories
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat._id}
              onClick={() =>
                applyFilter((f) => ({
                  ...f,
                  category: f.category === cat.slug ? "" : cat.slug,
                }))
              }
              className={`w-full text-left text-sm px-3 py-2 rounded-lg
                transition-colors
                ${filters.category === cat.slug
                  ? "bg-primary-50 text-primary-600 font-semibold"
                  : "text-text-muted hover:text-text hover:bg-bg-muted"}`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── Brand ──────────────────────────────────────── */}
      <FilterSection title="Brand">
        <div className="space-y-1.5">
          {allBrands.map((brand) => (
            <label
              key={brand}
              className={`group flex items-center gap-3 px-3 py-2
                rounded-xl border cursor-pointer transition-all duration-200
                ${filters.brand === brand
                  ? "border-primary-400 bg-primary-50"
                  : "border-border bg-bg hover:border-border-strong hover:bg-bg-subtle"}`}
            >
              <input
                type="checkbox"
                checked={filters.brand === brand}
                onChange={() =>
                  applyFilter((f) => ({ ...f, brand: f.brand === brand ? "" : brand }))
                }
                className="sr-only"
              />
              {/* Custom checkbox */}
              <div className={`w-5 h-5 rounded-md border flex items-center
                justify-center flex-shrink-0 transition-all duration-200
                ${filters.brand === brand
                  ? "border-primary-500 bg-primary-500"
                  : "border-border-strong bg-bg group-hover:border-primary-300"}`}
              >
                {filters.brand === brand && (
                  <svg viewBox="0 0 20 20" fill="white" className="w-3.5 h-3.5">
                    <path fillRule="evenodd"
                      d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.313a1 1 0 0 1-1.42-.004L3.29 9.204a1 1 0 1 1 1.42-1.408l4.04 4.074 6.54-6.586a1 1 0 0 1 1.414.006Z"
                      clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium transition-colors
                ${filters.brand === brand
                  ? "text-primary-700"
                  : "text-text-muted group-hover:text-text"}`}
              >
                {brand}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* ── Price Range ─────────────────────────────────── */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center justify-between
            text-xs text-text-muted">
            <span>{fmt(filters.priceMin)}</span>
            <span>
              {filters.priceMax >= MAX_PRICE
                ? `${fmt(MAX_PRICE)}+`
                : fmt(filters.priceMax)}
            </span>
          </div>
          <input
            type="range"
            min={0} max={MAX_PRICE} step={50_000}
            value={filters.priceMax}
            onChange={(e) =>
              applyFilter((f) => ({ ...f, priceMax: Number(e.target.value) }))
            }
            className="w-full accent-primary-500 cursor-pointer"
          />
          <div className="flex gap-2">
            {[
              { key: "priceMin", label: "Min (₦)", placeholder: "0",
                value: filters.priceMin || "" },
              { key: "priceMax", label: "Max (₦)", placeholder: MAX_PRICE.toString(),
                value: filters.priceMax >= MAX_PRICE ? "" : filters.priceMax },
            ].map(({ key, label, placeholder, value }) => (
              <div key={key} className="flex-1">
                <p className="text-[10px] text-text-faint mb-1">{label}</p>
                <input
                  type="number"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) =>
                    applyFilter((f) => ({
                      ...f,
                      [key]: key === "priceMax"
                        ? Number(e.target.value) || MAX_PRICE
                        : Number(e.target.value),
                    }))
                  }
                  className="w-full bg-bg border border-border rounded-lg
                    px-2 py-1.5 text-xs text-text
                    focus:outline-none focus:border-primary-400
                    focus:ring-1 focus:ring-primary-500/20"
                />
              </div>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* ── Rating ─────────────────────────────────────── */}
      <FilterSection title="Minimum Rating">
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => applyFilter((f) => ({ ...f, rating: r }))}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold
                border transition-colors
                ${filters.rating === r
                  ? "bg-primary-50 text-primary-600 border-primary-300"
                  : "bg-bg text-text-muted border-border hover:border-border-strong"}`}
            >
              {r === 0 ? "All" : `${r}★`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── In Stock ───────────────────────────────────── */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) =>
            applyFilter((f) => ({ ...f, inStockOnly: e.target.checked }))
          }
          className="w-4 h-4 rounded border-border-strong
            accent-primary-500 focus:ring-primary-500/20"
        />
        <span className="text-sm text-text-muted hover:text-text transition-colors">
          In Stock Only
        </span>
      </label>
    </motion.aside>
  );

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg">
      <div className="container-app py-10">

        {/* Page header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="text-3xl font-black tracking-tight text-text mb-1">
            {filters.category
              ? activeCategoryTitle
              : query
                ? `Results for "${query}"`
                : "All Products"}
          </h1>
          <p className="text-text-muted text-sm">
            {allResults.length} product{allResults.length !== 1 ? "s" : ""} found
            {totalPages > 1 && (
              <span className="ml-1 text-text-faint">
                · page {safeCurrentPage} of {totalPages}
              </span>
            )}
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          className="mb-6 relative max-w-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Search size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              updateURL(filters, e.target.value);
            }}
            placeholder="Search products, brands…"
            className="w-full bg-bg-subtle border border-border rounded-xl
              pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-faint
              focus:outline-none focus:border-primary-400
              focus:ring-2 focus:ring-primary-500/15 transition-colors"
          />
        </motion.div>

        <div className="flex gap-8">

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <SidebarFilters />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Controls bar */}
            <div className="flex items-center justify-between gap-3 mb-6">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl
                  bg-bg border border-border text-sm text-text-muted
                  hover:bg-bg-subtle transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filters
                <AnimatePresence>
                  {activeFilterCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{   scale: 0 }}
                      className="w-5 h-5 rounded-full bg-primary-500 text-white
                        text-[10px] font-bold flex items-center justify-center"
                    >
                      {activeFilterCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Sort */}
              <div className="flex items-center gap-2 ml-auto">
                <label className="text-xs text-text-faint hidden sm:block">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-bg border border-border rounded-xl px-3 py-2
                    text-sm text-text-muted focus:outline-none
                    focus:border-primary-400 transition-colors cursor-pointer"
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
            <AnimatePresence mode="wait">
              {pageResults.length === 0 ? (
                <motion.div
                  key="empty"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col items-center justify-center
                    py-24 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-bg-muted
                    flex items-center justify-center mb-4">
                    <Search size={24} className="text-text-faint" />
                  </div>
                  <p className="text-text font-semibold mb-1">
                    No products found
                  </p>
                  <p className="text-text-muted text-sm">
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 rounded-xl btn-outline text-sm"
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
              exit={{   opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-bg-inverse/60 backdrop-blur-sm
                z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{   x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 w-80 bg-bg border-r border-border
                z-50 p-6 overflow-y-auto lg:hidden shadow-card-hover"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-text text-lg">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-lg hover:bg-bg-muted text-text-muted
                    transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <SidebarFilters />

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-4 py-3 rounded-xl btn-primary text-sm"
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