import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/sanity/lib/fetch";

export const runtime = "edge";
export const alt = "HolarzGadgets Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_COLORS: Record<string, string> = {
    "phone-reviews": "#06B6D4",
    "laptop-reviews": "#7C3AED",
    "buying-guides": "#10B981",
    "tips-tricks": "#F59E0B",
    "comparisons": "#F43F5E",
    "news-deals": "#F97316",
    "accessories": "#64748B",
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

export default async function BlogPostOGImage({
    params,
}: {
    params: { slug: string };
}) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        return new ImageResponse(
            (
                <div style={{
                    width: "100%", height: "100%", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    background: "#0F172A", fontFamily: "sans-serif",
                    color: "#94A3B8", fontSize: 32
                }}>
                    HolarzGadgets Blog
                </div>
            ),
            { ...size }
        );
    }

    const accent = CATEGORY_COLORS[post.category] ?? "#06B6D4";
    const label = CATEGORY_LABELS[post.category] ?? post.category;

    return new ImageResponse(
        (
            <div style={{
                width: "100%", height: "100%", display: "flex",
                flexDirection: "column", background: "#0F172A",
                fontFamily: "sans-serif", position: "relative", overflow: "hidden"
            }}>

                {/* Grid */}
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
                    backgroundSize: "40px 40px"
                }} />

                {/* Accent glow */}
                <div style={{
                    position: "absolute", top: -100, right: -100,
                    width: 500, height: 500, borderRadius: "50%",
                    background: `radial-gradient(circle, ${accent}22, transparent 70%)`,
                    filter: "blur(60px)"
                }} />

                {/* Content */}
                <div style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    justifyContent: "space-between", padding: "56px 64px",
                    position: "relative", zIndex: 1
                }}>

                    {/* Top */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 10,
                            background: "linear-gradient(135deg,#06B6D4,#7C3AED)",
                            display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: 22,
                            boxShadow: "0 0 20px rgba(6,182,212,0.4)"
                        }}>
                            ⚡
                        </div>
                        <span style={{ color: "#94A3B8", fontSize: 18, fontWeight: 600 }}>
                            HolarzGadgets Blog
                        </span>
                        <div style={{
                            marginLeft: "auto", padding: "6px 16px",
                            borderRadius: 999, background: `${accent}22`,
                            border: `1px solid ${accent}44`,
                            color: accent, fontSize: 14, fontWeight: 700,
                            letterSpacing: 1, textTransform: "uppercase"
                        }}>
                            {label}
                        </div>
                    </div>

                    {/* Title */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <h1 style={{
                            color: "#F1F5F9",
                            fontSize: post.title.length > 60 ? 40 : 52,
                            fontWeight: 900, lineHeight: 1.15, margin: 0,
                            letterSpacing: -1, maxWidth: 900
                        }}>
                            {post.title}
                        </h1>
                        <p style={{
                            color: "#64748B", fontSize: 20, margin: 0,
                            lineHeight: 1.5, maxWidth: 800
                        }}>
                            {post.excerpt?.slice(0, 120)}
                            {(post.excerpt?.length ?? 0) > 120 ? "…" : ""}
                        </p>
                    </div>

                    {/* Bottom */}
                    <div style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <span style={{ color: "#475569", fontSize: 16 }}>
                                {new Date(post.publishedAt).toLocaleDateString("en-NG", {
                                    day: "numeric", month: "long", year: "numeric",
                                })}
                            </span>
                            <span style={{ color: "#334155" }}>·</span>
                            <span style={{ color: "#475569", fontSize: 16 }}>
                                {post.readingTime} min read
                            </span>
                        </div>
                        <span style={{ color: "#475569", fontSize: 15 }}>
                            horlarzgadgets.com/blog
                        </span>
                    </div>
                </div>

                {/* Bottom accent bar */}
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, #06B6D4, ${accent}, #7C3AED)`
                }} />
            </div>
        ),
        { ...size }
    );
}