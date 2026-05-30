import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, BookOpen, ChevronRight } from "lucide-react";
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

// Light-mode safe category colours — tinted bg on white
const CATEGORY_COLORS: Record<string, string> = {
  "phone-reviews": "bg-cyan-50    text-cyan-700    border border-cyan-200",
  "laptop-reviews": "bg-violet-50  text-violet-700  border border-violet-200",
  "buying-guides": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "tips-tricks": "bg-amber-50   text-amber-700   border border-amber-200",
  "comparisons": "bg-rose-50    text-rose-700    border border-rose-200",
  "news-deals": "bg-orange-50  text-orange-700  border border-orange-200",
  "accessories": "bg-bg-muted   text-text-muted  border border-border",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const categoryBadge = (c: string) => CATEGORY_LABELS[c] ?? c;
const categoryColor = (c: string) =>
  CATEGORY_COLORS[c] ?? "bg-bg-muted text-text-muted border border-border";

// ─────────────────────────────────────────────────────────────
// FEATURED POST CARD
// ─────────────────────────────────────────────────────────────
function FeaturedCard({ post }: { post: SanityPost }) {
  const imgUrl = post.coverImage?.url ?? null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden
        card hover:shadow-card-hover hover:border-primary-200
        transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-56 md:h-full bg-bg-muted overflow-hidden">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={post.coverImage?.alt ?? post.title}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105
              transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen size={40} className="text-text-faint" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t
          from-bg/40 via-transparent to-transparent
          md:bg-gradient-to-r md:from-transparent md:to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col justify-between bg-bg">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold
              uppercase tracking-widest ${categoryColor(post.category)}`}>
              {categoryBadge(post.category)}
            </span>
            <span className="text-[10px] text-primary-500 uppercase
              tracking-widest font-bold">
              Featured
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-text
            leading-snug mb-3 group-hover:text-primary-600 transition-colors">
            {post.title}
          </h2>

          <p className="text-text-muted text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-3 text-xs text-text-faint">
            <span>{formatDate(post.publishedAt)}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {post.readingTime} min read
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold
            text-primary-500 group-hover:gap-2 transition-all">
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
      author: { "@type": "Organization", name: "HolarzGadgets" },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-bg">

        {/* ── Hero header ─────────────────────────────── */}
        <section className="bg-bg-subtle border-b border-border">
          <div className="container-app py-14">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-text-faint mb-8">
              <Link href="/" className="hover:text-text transition-colors">
                Home
              </Link>
              <ChevronRight size={12} />
              <span className="text-text-muted">Blog</span>
            </nav>

            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase
                  text-primary-500 mb-2">
                  HolarzGadgets Blog
                </p>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight
                  text-text mb-2">
                  Gadget Reviews &{" "}
                  <span className="text-gradient-primary">Buying Guides</span>
                </h1>
                <p className="text-text-muted text-sm max-w-lg">
                  Expert tips to help you buy the best gadgets in Nigeria
                  — written for Ekiti and beyond.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-text-faint
                bg-bg border border-border rounded-xl px-3 py-2">
                <BookOpen size={13} className="text-primary-500" />
                {posts.length} articles
              </div>
            </div>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────── */}
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