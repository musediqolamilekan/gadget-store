import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import {
  Clock, ChevronRight, ArrowLeft,
  MessageCircle, Tag, Share2,
  BookOpen,
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
    title: post.seoTitle ?? `${post.title} | HolarzGadgets Blog`,
    description: post.seoDescription ?? post.excerpt,
    keywords: post.tags,
    alternates: { canonical: `https://horlarzgadgets.com/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      url: `https://horlarzgadgets.com/blog/${post.slug}`,
      siteName: "HolarzGadgets",
      locale: "en_NG",
      type: "article",
      publishedTime: post.publishedAt,
      images: imgUrl ? [{ url: imgUrl }] : [],
    },
  };
}

// ─────────────────────────────────────────────────────────────
// PORTABLE TEXT COMPONENTS
// ─────────────────────────────────────────────────────────────
const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-slate-300 leading-relaxed text-base mb-5">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl font-black text-slate-50 mt-10 mb-4 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl font-bold text-slate-100 mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-lg font-semibold text-slate-200 mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-cyan-500 pl-5 py-1 my-6
        text-slate-400 italic text-base">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-slate-100">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-slate-300">{children}</em>
    ),
    underline: ({ children }: { children?: React.ReactNode }) => (
      <span className="underline">{children}</span>
    ),
    link: ({ value, children }: { value?: { href: string; blank?: boolean }; children?: React.ReactNode }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: { asset: { url: string }; alt?: string; caption?: string } }) => (
      <figure className="my-8">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden
          bg-slate-800">
          <Image
            src={value.asset?.url ?? ""}
            alt={value.alt ?? ""}
            fill
            className="object-cover"
          />
        </div>
        {value.caption && (
          <figcaption className="text-xs text-slate-500 text-center mt-2">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
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

const CATEGORY_LABELS: Record<string, string> = {
  "phone-reviews": "Phone Reviews",
  "laptop-reviews": "Laptop Reviews",
  "buying-guides": "Buying Guides",
  "tips-tricks": "Tips & Tricks",
  "comparisons": "Comparisons",
  "news-deals": "News & Deals",
  "accessories": "Accessories",
};

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.category, post.slug);
  const imgUrl = post.coverImage?.url ?? null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `https://horlarzgadgets.com/blog/${post.slug}`,
    image: imgUrl ?? undefined,
    inLanguage: "en-NG",
    author: {
      "@type": "Organization",
      name: "HolarzGadgets",
      url: "https://horlarzgadgets.com",
    },
    publisher: {
      "@type": "Organization",
      name: "HolarzGadgets",
      url: "https://horlarzgadgets.com",
    },
    keywords: post.tags?.join(", "),
    isPartOf: { "@id": "https://horlarzgadgets.com/blog" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-950">

        {/* ── Cover image ─────────────────────────────── */}
        {imgUrl && (
          <div className="relative w-full h-64 md:h-96 bg-slate-800 overflow-hidden">
            <Image
              src={imgUrl}
              alt={post.coverImage?.alt ?? post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t
              from-slate-950 via-slate-950/40 to-transparent" />
          </div>
        )}

        {/* ── Article ─────────────────────────────────── */}
        <div className="container-app py-10">
          <div className="max-w-2xl mx-auto">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-slate-500 mb-8">
              <Link href="/" className="hover:text-slate-300 transition-colors">
                Home
              </Link>
              <ChevronRight size={12} />
              <Link href="/blog" className="hover:text-slate-300 transition-colors">
                Blog
              </Link>
              <ChevronRight size={12} />
              <span className="text-slate-400 line-clamp-1">{post.title}</span>
            </nav>

            {/* Category + meta */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold
                uppercase tracking-widest border
                ${CATEGORY_COLORS[post.category] ?? "bg-slate-500/15 text-slate-400 border-slate-500/20"}`}>
                {CATEGORY_LABELS[post.category] ?? post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={11} /> {post.readingTime} min read
              </span>
              <span className="text-xs text-slate-500">
                {new Date(post.publishedAt).toLocaleDateString("en-NG", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </div>
            <div className="w-full max-w-3xl mx-auto mb-8">
              <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden border border-slate-800">
                {post.coverImage?.url ? (
                  <Image
                    src={post.coverImage?.url ?? ''}
                    alt={post.coverImage?.alt ?? post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 900px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-gradient-to-br
          from-slate-800 to-slate-900 flex items-center justify-center"
                  >
                    <BookOpen size={48} className="text-slate-600" />
                  </div>
                )}
                <div
                  className="absolute inset-0 bg-gradient-to-t
        from-slate-950 via-slate-950/40 to-transparent"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
          bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  >
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black tracking-tight
              text-slate-50 leading-tight mb-4">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-slate-400 text-base leading-relaxed mb-8
              pb-8 border-b border-slate-800">
              {post.excerpt}
            </p>

            {/* Body */}
            {Array.isArray(post.body) && post.body.length > 0 ? (
              <div className="mb-12">
                <PortableText
                  value={post.body as Parameters<typeof PortableText>[0]["value"]}
                  components={ptComponents}
                />
              </div>
            ) : (
              <p className="text-slate-500 text-sm mb-12">
                Full article coming soon.
              </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-10
                pb-10 border-b border-slate-800">
                <Tag size={13} className="text-slate-600" />
                {post.tags.map((tag) => (
                  <span key={tag}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-slate-800
                      border border-slate-700 text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share + CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out this article from HolarzGadgets: ${post.title} — https://horlarzgadgets.com/blog/${post.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3
                  rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white
                  font-bold text-sm transition-colors"
              >
                <Share2 size={14} /> Share on WhatsApp
              </a>
              <a
                href="https://wa.me/2349055427487"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3
                  rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700
                  text-slate-200 font-bold text-sm transition-colors"
              >
                <MessageCircle size={14} /> Ask us about this
              </a>
              <Link
                href="/blog"
                className="flex items-center justify-center gap-2 px-5 py-3
                  rounded-xl bg-slate-800/60 border border-slate-700/50
                  text-slate-400 text-sm font-medium hover:text-slate-200
                  transition-colors"
              >
                <ArrowLeft size={13} /> All Articles
              </Link>
            </div>
          </div>
        </div>

        {/* ── Related posts ───────────────────────────── */}
        {related.length > 0 && (
          <section className="border-t border-slate-800/60">
            <div className="container-app py-14">
              <h2 className="text-2xl font-black text-slate-50 mb-8">
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