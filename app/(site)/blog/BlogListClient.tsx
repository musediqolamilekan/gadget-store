"use client";

import { useState, useMemo, useEffect } from "react";
import Link          from "next/link";
import Image         from "next/image";
import { Clock, BookOpen, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SanityPost } from "@/sanity/lib/fetch";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const POSTS_PER_PAGE = 9;

const CATEGORIES = [
  { value: "all",             label: "All"           },
  { value: "phone-reviews",   label: "Phone Reviews" },
  { value: "laptop-reviews",  label: "Laptop Reviews"},
  { value: "buying-guides",   label: "Buying Guides" },
  { value: "comparisons",     label: "Comparisons"   },
  { value: "tips-tricks",     label: "Tips & Tricks" },
  { value: "news-deals",      label: "News & Deals"  },
  { value: "accessories",     label: "Accessories"   },
];

const CATEGORY_LABELS: Record<string, string> = {
  "phone-reviews":  "Phone Reviews",
  "laptop-reviews": "Laptop Reviews",
  "buying-guides":  "Buying Guides",
  "tips-tricks":    "Tips & Tricks",
  "comparisons":    "Comparisons",
  "news-deals":     "News & Deals",
  "accessories":    "Accessories",
};

// Light-mode safe tints — readable on white cards
const CATEGORY_COLORS: Record<string, string> = {
  "phone-reviews":  "bg-cyan-50    text-cyan-700    border border-cyan-200",
  "laptop-reviews": "bg-violet-50  text-violet-700  border border-violet-200",
  "buying-guides":  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "tips-tricks":    "bg-amber-50   text-amber-700   border border-amber-200",
  "comparisons":    "bg-rose-50    text-rose-700    border border-rose-200",
  "news-deals":     "bg-orange-50  text-orange-700  border border-orange-200",
  "accessories":    "bg-bg-muted   text-text-muted  border border-border",
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric", month: "long", year: "numeric",
  });

const categoryBadge = (c: string) => CATEGORY_LABELS[c] ?? c;
const categoryColor = (c: string) =>
  CATEGORY_COLORS[c] ?? "bg-bg-muted text-text-muted border border-border";

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const gridVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

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
    bg-bg border-border text-text-muted hover:bg-bg-muted hover:text-text`;

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
              border transition-all duration-200
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
export default function BlogListClient({ posts }: { posts: SanityPost[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage,    setCurrentPage]    = useState(1);

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [posts, activeCategory]
  );

  const totalPages    = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginatedPosts = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [activeCategory]);

  return (
    <div>
      {/* ── Category filter pills ───────────────────── */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border
              transition-all duration-200
              ${activeCategory === value
                ? "bg-primary-500 text-white border-primary-500 glow-primary-sm"
                : "bg-bg border-border text-text-muted hover:border-border-strong hover:text-text"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Grid ────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{   opacity: 0 }}
            className="py-20 text-center"
          >
            <BookOpen size={32} className="text-text-faint mx-auto mb-3" />
            <p className="text-text-muted font-medium mb-3">
              No articles in this category yet.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="text-sm text-primary-500 hover:text-primary-600
                font-semibold transition-colors"
            >
              View all articles
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={activeCategory}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {paginatedPosts.map((post) => {
              const imgUrl = post.coverImage?.url ?? null;
              return (
                <motion.article
                  key={post._id}
                  variants={cardVariants}
                  className="group flex flex-col rounded-2xl overflow-hidden
                    card hover:shadow-card-hover hover:border-primary-200
                    transition-all duration-300"
                >
                  {/* Cover image */}
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-44 bg-bg-muted overflow-hidden">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={post.coverImage?.alt ?? post.title}
                          fill
                          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105
                            transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center
                          justify-center bg-bg-muted">
                          <BookOpen size={28} className="text-text-faint" />
                        </div>
                      )}
                      {/* Subtle bottom fade */}
                      <div className="absolute inset-0 bg-gradient-to-t
                        from-bg/30 via-transparent to-transparent" />
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Category badge */}
                    <span className={`self-start px-2.5 py-1 rounded-full
                      text-[10px] font-bold uppercase tracking-widest mb-3
                      ${categoryColor(post.category)}`}>
                      {categoryBadge(post.category)}
                    </span>

                    {/* Title */}
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-base font-bold text-text
                        leading-snug hover:text-primary-600 transition-colors
                        line-clamp-2 mb-2">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-xs text-text-muted leading-relaxed
                      line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center justify-between mt-4 pt-4
                      border-t border-border">
                      <div className="flex items-center gap-2 text-[11px]
                        text-text-faint">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {post.readingTime}m
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-1 text-[11px]
                          font-bold text-primary-500
                          hover:text-primary-600 transition-colors
                          group-hover:gap-2"
                      >
                        Read <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      />
    </div>
  );
}