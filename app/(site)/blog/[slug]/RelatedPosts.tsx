"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { SanityPost } from "@/sanity/lib/fetch";

// Light-mode tints — consistent with blog/page.tsx and BlogListClient
const CATEGORY_COLORS: Record<string, string> = {
  "phone-reviews": "bg-cyan-50    text-cyan-700    border border-cyan-200",
  "laptop-reviews": "bg-violet-50  text-violet-700  border border-violet-200",
  "buying-guides": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "tips-tricks": "bg-amber-50   text-amber-700   border border-amber-200",
  "comparisons": "bg-rose-50    text-rose-700    border border-rose-200",
  "news-deals": "bg-orange-50  text-orange-700  border border-orange-200",
  "accessories": "bg-bg-muted   text-text-muted  border border-border",
};

const CATEGORY_LABELS: Record<string, string> = {
  "phone-reviews": "Phone Reviews",
  "laptop-reviews": "Laptop Reviews",
  "buying-guides": "Buying Guides",
  "tips-tricks": "Tips & Tricks",
  "comparisons": "Comparisons",
  "news-deals": "News & Deals",
  "accessories": "Accessories",
};

const catColor = (c: string) =>
  CATEGORY_COLORS[c] ?? "bg-bg-muted text-text-muted border border-border";
const catLabel = (c: string) => CATEGORY_LABELS[c] ?? c;

export default function RelatedPosts({ posts }: { posts: SanityPost[] }) {
  return (
    <div className="grid sm:grid-cols-3 gap-5">
      {posts.map((post, i) => {
        const imgUrl = post.coverImage?.url ?? null;
        return (
          <motion.article
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="group flex flex-col rounded-2xl overflow-hidden
              card hover:shadow-card-hover hover:border-primary-200
              transition-all duration-300"
          >
            {/* Cover */}
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative h-40 bg-bg-muted overflow-hidden">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={post.coverImage?.alt ?? post.title}
                    fill
                    sizes="(max-width:640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105
                      transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center
                    justify-center bg-bg-muted">
                    <BookOpen size={24} className="text-text-faint" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t
                  from-bg/30 via-transparent to-transparent" />
              </div>
            </Link>

            {/* Body */}
            <div className="flex flex-col flex-1 p-4">
              <span className={`self-start px-2 py-0.5 rounded-full
                text-[9px] font-bold uppercase tracking-widest mb-2
                ${catColor(post.category)}`}>
                {catLabel(post.category)}
              </span>

              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-sm font-bold text-text leading-snug
                  hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
              </Link>

              <div className="flex items-center justify-between mt-auto pt-3
                border-t border-border">
                <span className="flex items-center gap-1 text-[10px]
                  text-text-faint">
                  <Clock size={9} /> {post.readingTime}m read
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-1 text-[10px] font-bold
                    text-primary-500 hover:text-primary-600 transition-colors"
                >
                  Read <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}