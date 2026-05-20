"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { SanityPost } from "@/sanity/lib/fetch";

const CATEGORY_COLORS: Record<string, string> = {
  "phone-reviews":  "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  "laptop-reviews": "bg-violet-500/15 text-violet-400 border-violet-500/20",
  "buying-guides":  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "tips-tricks":    "bg-amber-500/15 text-amber-400 border-amber-500/20",
  "comparisons":    "bg-rose-500/15 text-rose-400 border-rose-500/20",
  "news-deals":     "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "accessories":    "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

const CATEGORY_LABELS: Record<string, string> = {
  "phone-reviews":  "Phone Reviews",
  "laptop-reviews": "Laptop Reviews",
  "buying-guides":  "Buying Guides",
  "tips-tricks":    "Tips & Tricks",
  "comparisons":    "Comparisons",
  "news-deals":     "News & Deals",
  "accessories":    "Accessories",
};

export default function RelatedPosts({ posts }: { posts: SanityPost[] }) {
  return (
    <div className="grid sm:grid-cols-3 gap-5">
      {posts.map((post, i) => {
        const imgUrl = post.coverImage?.url ?? null;
        return (
          <motion.article
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="group flex flex-col rounded-2xl overflow-hidden
              bg-slate-900/60 border border-slate-800
              hover:border-slate-600 transition-all duration-300"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative h-40 bg-slate-800 overflow-hidden">
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
                    justify-center">
                    <BookOpen size={24} className="text-slate-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t
                  from-slate-950/50 via-transparent to-transparent" />
              </div>
            </Link>

            <div className="flex flex-col flex-1 p-4">
              <span className={`self-start px-2 py-0.5 rounded-full text-[9px]
                font-bold uppercase tracking-widest border mb-2
                ${CATEGORY_COLORS[post.category] ?? "bg-slate-500/15 text-slate-400 border-slate-500/20"}`}>
                {CATEGORY_LABELS[post.category] ?? post.category}
              </span>

              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-sm font-bold text-slate-200 leading-snug
                  hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
              </Link>

              <div className="flex items-center justify-between mt-auto pt-3
                border-t border-slate-800/60">
                <span className="flex items-center gap-1 text-[10px]
                  text-slate-600">
                  <Clock size={9} /> {post.readingTime}m read
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-1 text-[10px] font-semibold
                    text-cyan-400 hover:text-cyan-300 transition-colors"
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