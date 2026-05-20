import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag, BookOpen, ChevronRight } from "lucide-react";
import { getAllPosts } from "@/sanity/lib/fetch";
import type { SanityPost } from "@/sanity/lib/fetch";
import BlogListClient from "./BlogListClient";

// ─────────────────────────────────────────────────────────────
// SEO
// ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Blog | HolarzGadgets — Gadget Reviews & Buying Guides",
  description:
    "Read expert gadget reviews, buying guides, and tech tips from HolarzGadgets — Ekiti's most trusted gadget store. Find the best phones, laptops and accessories in Nigeria.",
  keywords: [
    "best phones Nigeria 2025",
    "gadget reviews Ekiti",
    "phone buying guide Nigeria",
    "laptop reviews Nigeria",
    "HolarzGadgets blog",
    "tech tips Nigeria",
  ],
  alternates: { canonical: "https://horlarzgadgets.com/blog" },
  openGraph: {
    title: "Blog | HolarzGadgets — Gadget Reviews & Buying Guides for Nigeria",
    description: "Expert reviews and buying guides to help you choose the best gadgets in Nigeria.",
    url: "https://horlarzgadgets.com/blog",
    siteName: "HolarzGadgets",
    locale: "en_NG",
    type: "website",
  },
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// FEATURED POST CARD
// ─────────────────────────────────────────────────────────────
function FeaturedCard({ post }: { post: SanityPost }) {
  const imgUrl = post.coverImage?.url ?? null;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden
        bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40
        transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-56 md:h-full bg-slate-800 overflow-hidden">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={post.coverImage?.alt ?? post.title}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform
              duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen size={40} className="text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60
          via-transparent to-transparent md:bg-gradient-to-r" />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold
              uppercase tracking-widest border
              ${categoryColor(post.category)}`}>
              {categoryBadge(post.category)}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest
              font-semibold">
              Featured
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-50
            leading-snug mb-3 group-hover:text-cyan-300 transition-colors">
            {post.title}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{formatDate(post.publishedAt)}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {post.readingTime} min read
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold
            text-cyan-400 group-hover:gap-2 transition-all">
            Read <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default async function BlogPage() {
  const posts = await getAllPosts();
  const featured = posts.filter((p) => p.featured).slice(0, 1);
  const rest = posts.filter((p) => !p.featured || posts.indexOf(p) > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://horlarzgadgets.com/blog",
    url: "https://horlarzgadgets.com/blog",
    name: "HolarzGadgets Blog",
    description: "Gadget reviews, buying guides and tech tips for Nigeria",
    publisher: { "@id": "https://horlarzgadgets.com/#business" },
    inLanguage: "en-NG",
    blogPost: posts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      datePublished: p.publishedAt,
      url: `https://horlarzgadgets.com/blog/${p.slug}`,
      author: {
        "@type": "Organization",
        name: "HolarzGadgets",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-950">

        {/* ── Hero ──────────────────────────────────── */}
        <section className="relative overflow-hidden bg-slate-900/50
          border-b border-slate-800/60">
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full
              bg-cyan-500/5 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full
              bg-violet-500/5 blur-3xl" />
          </div>

          <div className="container-app py-14 relative">
            <nav aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-slate-500 mb-8">
              <Link href="/" className="hover:text-slate-300 transition-colors">
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="text-slate-400">Blog</span>
            </nav>

            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase
                  text-cyan-400/80 mb-2">
                  HolarzGadgets Blog
                </p>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight
                  text-slate-50 mb-2">
                  Gadget Reviews &{" "}
                  <span className="text-gradient-cyan">Buying Guides</span>
                </h1>
                <p className="text-slate-400 text-sm">
                  Expert tips to help you buy the best gadgets in Nigeria
                  — written for Ekiti and beyond.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <BookOpen size={13} />
                {posts.length} articles
              </div>
            </div>
          </div>
        </section>

        <div className="container-app py-12">
          {featured.length > 0 && (
            <div className="mb-12">
              <FeaturedCard post={featured[0]} />
            </div>
          )}
          <BlogListClient posts={rest} />
        </div>
      </div>
    </>
  );
}