import { notFound }     from "next/navigation";
import type { Metadata } from "next";
import Link              from "next/link";
import Image             from "next/image";
import { PortableText }  from "@portabletext/react";
import {
  Clock, ChevronRight, ArrowLeft,
  MessageCircle, Tag, Share2, BookOpen,
} from "lucide-react";
import {
  getPostBySlug,
  getRelatedPosts,
  getAllPostSlugs,
} from "@/sanity/lib/fetch";
import RelatedPosts from "./RelatedPosts";

interface Props { params: { slug: string } }

// ─────────────────────────────────────────────────────────────
// STATIC PARAMS
// ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

// ─────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };
  const imgUrl = post.coverImage?.url ?? undefined;
  return {
    title:       post.seoTitle ?? `${post.title} | HolarzGadgets Blog`,
    description: post.seoDescription ?? post.excerpt,
    keywords:    post.tags,
    alternates:  { canonical: `https://horlarzgadgets.com/blog/${post.slug}` },
    openGraph: {
      title:         post.seoTitle ?? post.title,
      description:   post.seoDescription ?? post.excerpt,
      url:           `https://horlarzgadgets.com/blog/${post.slug}`,
      siteName:      "HolarzGadgets",
      locale:        "en_NG",
      type:          "article",
      publishedTime: post.publishedAt,
      images:        imgUrl ? [{ url: imgUrl }] : [],
    },
  };
}

// ─────────────────────────────────────────────────────────────
// PORTABLE TEXT COMPONENTS
// ─────────────────────────────────────────────────────────────
const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-text-muted leading-relaxed text-base mb-5">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl font-black text-text mt-10 mb-4 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl font-bold text-text mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-lg font-semibold text-text mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-primary-400 pl-5 py-1 my-6
        bg-primary-50 rounded-r-xl text-text-muted italic text-base">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-text">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-text-muted">{children}</em>
    ),
    underline: ({ children }: { children?: React.ReactNode }) => (
      <span className="underline">{children}</span>
    ),
    link: ({
      value, children,
    }: {
      value?: { href: string; blank?: boolean };
      children?: React.ReactNode;
    }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-primary-600 hover:text-primary-500 underline transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({
      value,
    }: {
      value: { asset: { url: string }; alt?: string; caption?: string };
    }) => (
      <figure className="my-8">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden
          bg-bg-muted border border-border">
          <Image
            src={value.asset?.url ?? ""}
            alt={value.alt ?? ""}
            fill
            className="object-cover"
          />
        </div>
        {value.caption && (
          <figcaption className="text-xs text-text-faint text-center mt-2">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
};

// ─────────────────────────────────────────────────────────────
// CATEGORY COLOURS — light-mode tints
// ─────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  "phone-reviews":  "bg-cyan-50    text-cyan-700    border border-cyan-200",
  "laptop-reviews": "bg-violet-50  text-violet-700  border border-violet-200",
  "buying-guides":  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "tips-tricks":    "bg-amber-50   text-amber-700   border border-amber-200",
  "comparisons":    "bg-rose-50    text-rose-700    border border-rose-200",
  "news-deals":     "bg-orange-50  text-orange-700  border border-orange-200",
  "accessories":    "bg-bg-muted   text-text-muted  border border-border",
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

const catColor = (c: string) =>
  CATEGORY_COLORS[c] ?? "bg-bg-muted text-text-muted border border-border";
const catLabel = (c: string) => CATEGORY_LABELS[c] ?? c;

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.category, post.slug);
  const imgUrl  = post.coverImage?.url ?? null;

  const jsonLd = {
    "@context":     "https://schema.org",
    "@type":        "BlogPosting",
    headline:       post.title,
    description:    post.excerpt,
    datePublished:  post.publishedAt,
    dateModified:   post.publishedAt,
    url:            `https://horlarzgadgets.com/blog/${post.slug}`,
    image:          imgUrl ?? undefined,
    inLanguage:     "en-NG",
    author:   { "@type": "Organization", name: "HolarzGadgets", url: "https://horlarzgadgets.com" },
    publisher:{ "@type": "Organization", name: "HolarzGadgets", url: "https://horlarzgadgets.com" },
    keywords: post.tags?.join(", "),
    isPartOf: { "@id": "https://horlarzgadgets.com/blog" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-bg">

        {/* ── Hero cover image ────────────────────────── */}
        {imgUrl && (
          <div className="relative w-full h-64 md:h-96 bg-bg-muted overflow-hidden">
            <Image
              src={imgUrl}
              alt={post.coverImage?.alt ?? post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* Fade to page bg at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t
              from-bg via-bg/30 to-transparent" />
          </div>
        )}

        {/* ── Article ─────────────────────────────────── */}
        <div className="container-app py-10">
          <div className="max-w-2xl mx-auto">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-text-faint mb-8">
              <Link href="/"     className="hover:text-text transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/blog" className="hover:text-text transition-colors">Blog</Link>
              <ChevronRight size={12} />
              <span className="text-text-muted line-clamp-1">{post.title}</span>
            </nav>

            {/* Category + meta */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold
                uppercase tracking-widest ${catColor(post.category)}`}>
                {catLabel(post.category)}
              </span>
              <span className="flex items-center gap-1 text-xs text-text-faint">
                <Clock size={11} /> {post.readingTime} min read
              </span>
              <span className="text-xs text-text-faint">
                {new Date(post.publishedAt).toLocaleDateString("en-NG", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </div>

            {/* Inline cover (when no full-bleed hero) */}
            {!imgUrl && (
              <div className="w-full mb-8">
                <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden
                  card">
                  <div className="absolute inset-0 bg-bg-muted flex items-center
                    justify-center">
                    <BookOpen size={48} className="text-text-faint" />
                  </div>
                </div>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black tracking-tight
              text-text leading-tight mb-4">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-text-muted text-base leading-relaxed mb-8
              pb-8 border-b border-border">
              {post.excerpt}
            </p>

            {/* Body */}
            {Array.isArray(post.body) && post.body.length > 0 ? (
              <div className="mb-12 prose-like">
                <PortableText
                  value={post.body as Parameters<typeof PortableText>[0]["value"]}
                  components={ptComponents}
                />
              </div>
            ) : (
              <div className="mb-12 p-6 rounded-2xl bg-primary-50 border
                border-primary-100 text-center">
                <BookOpen size={28} className="text-primary-400 mx-auto mb-3" />
                <p className="text-text-muted text-sm">
                  Full article coming soon.
                </p>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-10
                pb-10 border-b border-border">
                <Tag size={13} className="text-text-faint" />
                {post.tags.map((tag) => (
                  <span key={tag}
                    className="px-2.5 py-1 rounded-full text-[11px]
                      bg-bg-muted border border-border text-text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share + CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out this article from HolarzGadgets: ${post.title} — https://horlarzgadgets.com/blog/${post.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3
                  rounded-xl bg-accent-green hover:opacity-90
                  text-white font-bold text-sm transition-all"
              >
                <Share2 size={14} /> Share on WhatsApp
              </a>

              <a
                href="https://wa.me/2349055427487"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3
                  rounded-xl btn-primary text-sm"
              >
                <MessageCircle size={14} /> Ask us about this
              </a>

              <Link
                href="/blog"
                className="flex items-center justify-center gap-2 px-5 py-3
                  rounded-xl btn-outline text-sm"
              >
                <ArrowLeft size={13} /> All Articles
              </Link>
            </div>
          </div>
        </div>

        {/* ── Related posts ───────────────────────────── */}
        {related.length > 0 && (
          <section className="border-t border-border bg-bg-subtle">
            <div className="container-app py-14">
              <p className="text-xs font-bold tracking-widest uppercase
                text-primary-500 mb-2">
                Keep Reading
              </p>
              <h2 className="text-2xl font-black text-text mb-8">
                Related Articles
              </h2>
              <RelatedPosts posts={related} />
            </div>
          </section>
        )}
      </div>
    </>
  );
}