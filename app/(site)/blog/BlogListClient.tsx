"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, BookOpen, ArrowRight, ChevronLeft, ChevronRight, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SanityPost } from "@/sanity/lib/fetch";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "phone-reviews", label: "Phone Reviews" },
  { value: "laptop-reviews", label: "Laptop Reviews" },
  { value: "buying-guides", label: "Buying Guides" },
  { value: "comparisons", label: "Comparisons" },
  { value: "tips-tricks", label: "Tips & Tricks" },
  { value: "news-deals", label: "News & Deals" },
  { value: "accessories", label: "Accessories" },
];


const CATEGORY_LABELS: Record<string, string> = {
  "phone-reviews": "Phone Reviews",
  "laptop-reviews": "Laptop Reviews",
  "buying-guides": "Buying Guides",
  "tips-tricks": "Tips & Tricks",
  "comparisons": "Comparisons",
  "news-deals": "News & Deals",
  "accessories": "Accessories",
};

const CATEGORY_COLORS: Record<string, string> = {
  "phone-reviews": "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  "laptop-reviews": "bg-violet-500/15 text-violet-400 border-violet-500/20",
  "buying-guides": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "tips-tricks": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  "comparisons": "bg-rose-500/15 text-rose-400 border-rose-500/20",
  "news-deals": "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "accessories": "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function categoryBadge(category: string) {
  return CATEGORY_LABELS[category] ?? category;
}

function categoryColor(category: string) {
  return (
    CATEGORY_COLORS[category] ??
    "bg-slate-500/15 text-slate-400 border-slate-500/20"
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

interface Props {
  posts: SanityPost[];
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
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
    ) {
      pages.push(i);
    }

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
        <ChevronLeft size={14} />
        Prev
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 text-slate-500 text-sm select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200
              ${currentPage === p
                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
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
        Next
        <ChevronRight size={14} />
      </button>
    </motion.div>
  );
}

export default function BlogListClient({
  posts
}: Props) {
  const POSTS_PER_PAGE = 9;

  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [posts, activeCategory]
  );

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);

  const paginatedPosts = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  return (
    <div>
      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border
              transition-all duration-200
              ${activeCategory === value
                ? "bg-cyan-500 text-slate-950 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 text-center"
          >
            <BookOpen size={32} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No articles in this category yet.</p>
            <button
              onClick={() => setActiveCategory("all")}
              className="mt-3 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
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
                    bg-slate-900/60 border border-slate-800
                    hover:border-slate-600
                    hover:shadow-[0_0_25px_rgba(6,182,212,0.08)]
                    transition-all duration-300"
                >
                  {/* Cover */}
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative h-44 bg-slate-800 overflow-hidden">
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
                          justify-center bg-gradient-to-br from-slate-800
                          to-slate-900">
                          <BookOpen size={28} className="text-slate-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t
                        from-slate-950/50 via-transparent to-transparent" />
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5">
                    <span className={`self-start px-2.5 py-1 rounded-full
                      text-[10px] font-bold uppercase tracking-widest border mb-3
                      ${categoryColor(post.category)}`}>
                      {categoryBadge(post.category)}
                    </span>

                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-base font-bold text-slate-100 leading-snug
                        hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-slate-500 leading-relaxed
                      line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4
                      border-t border-slate-800/60">
                      <div className="flex items-center gap-2 text-[11px]
                        text-slate-600">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {post.readingTime}m
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-1 text-[11px] font-semibold
                          text-cyan-400 hover:text-cyan-300 transition-colors
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

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        }}
      />
    </div>
  );
}