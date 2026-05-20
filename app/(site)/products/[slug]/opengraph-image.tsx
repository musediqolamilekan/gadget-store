import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/sanity/lib/fetch";

export const runtime = "edge";
export const alt = "HolarzGadgets Product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ─────────────────────────────────────────────────────────────
// NAIRA FORMATTER
// ─────────────────────────────────────────────────────────────
const fmt = (n: number) =>
    new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(n);

// ─────────────────────────────────────────────────────────────
// CATEGORY → ACCENT COLOR
// ─────────────────────────────────────────────────────────────
const CATEGORY_COLOR: Record<string, { from: string; to: string }> = {
    phones: { from: "#06B6D4", to: "#2563EB" },
    laptops: { from: "#7C3AED", to: "#6D28D9" },
    smartwatches: { from: "#10B981", to: "#0D9488" },
    "power-banks": { from: "#F59E0B", to: "#EA580C" },
    earbuds: { from: "#F43F5E", to: "#DB2777" },
    accessories: { from: "#64748B", to: "#475569" },
};

// ─────────────────────────────────────────────────────────────
// IMAGE
// ─────────────────────────────────────────────────────────────
export default async function ProductOGImage({
    params,
}: {
    params: { slug: string };
}) {
    const data = await getProductBySlug(params.slug);

    // ── Fallback if product not found ──────────────────────
    if (!data) {
        return new ImageResponse(
            (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#0F172A",
                        fontFamily: "sans-serif",
                        color: "#94A3B8",
                        fontSize: 32,
                    }}
                >
                    HolarzGadgets
                </div>
            ),
            { ...size }
        );
    }

    const effectivePrice = data.discountPrice ?? data.price;
    const hasDiscount = data.discountPrice !== undefined;
    const discountPct = hasDiscount
        ? Math.round(((data.price - data.discountPrice!) / data.price) * 100)
        : 0;

    const brandName =
        typeof data.brand === "object"
            ? (data.brand as { name: string }).name
            : String(data.brand ?? "");

    const categorySlug =
        typeof data.category === "object"
            ? (data.category as { slug: string }).slug
            : String(data.category ?? "phones");

    const accent = CATEGORY_COLOR[categorySlug] ?? CATEGORY_COLOR.phones;

    // Try to get a valid image URL from Sanity
    const productImageUrl =
        data.images?.[0]?.url &&
            typeof data.images[0].url === "string" &&
            data.images[0].url.startsWith("https://")
            ? data.images[0].url
            : null;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    background: "#0F172A",
                    fontFamily: "sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* ── Grid pattern ────────────────────────────── */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* ── Accent glow top-right ────────────────────── */}
                <div
                    style={{
                        position: "absolute",
                        top: -120,
                        right: -120,
                        width: 480,
                        height: 480,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${accent.from}22, transparent 70%)`,
                        filter: "blur(60px)",
                    }}
                />

                {/* ── Cyan glow bottom-left ────────────────────── */}
                <div
                    style={{
                        position: "absolute",
                        bottom: -80,
                        left: -80,
                        width: 360,
                        height: 360,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, #06B6D422, transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />

                {/* ── Left: Product info ───────────────────────── */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "56px 48px",
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    {/* Top — brand + store name */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {/* Logo */}
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 10,
                                background: `linear-gradient(135deg, #06B6D4, #7C3AED)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 22,
                                boxShadow: "0 0 20px rgba(6,182,212,0.4)",
                            }}
                        >
                            ⚡
                        </div>
                        <span
                            style={{
                                color: "#94A3B8",
                                fontSize: 18,
                                fontWeight: 600,
                            }}
                        >
                            HolarzGadgets
                        </span>

                        {/* Discount badge */}
                        {hasDiscount && (
                            <div
                                style={{
                                    marginLeft: "auto",
                                    padding: "6px 16px",
                                    borderRadius: 999,
                                    background: "#EF4444",
                                    color: "#fff",
                                    fontSize: 16,
                                    fontWeight: 800,
                                    letterSpacing: 1,
                                }}
                            >
                                -{discountPct}% OFF
                            </div>
                        )}
                    </div>

                    {/* Middle — product name + brand */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* Brand */}
                        <span
                            style={{
                                color: accent.from,
                                fontSize: 16,
                                fontWeight: 700,
                                letterSpacing: 3,
                                textTransform: "uppercase",
                            }}
                        >
                            {brandName}
                        </span>

                        {/* Product name */}
                        <h1
                            style={{
                                color: "#F1F5F9",
                                fontSize: data.name.length > 30 ? 42 : 52,
                                fontWeight: 900,
                                lineHeight: 1.1,
                                margin: 0,
                                letterSpacing: -1,
                            }}
                        >
                            {data.name}
                        </h1>

                        {/* Short description */}
                        <p
                            style={{
                                color: "#64748B",
                                fontSize: 18,
                                margin: 0,
                                lineHeight: 1.4,
                                maxWidth: 480,
                            }}
                        >
                            {data.shortDescription}
                        </p>
                    </div>

                    {/* Bottom — price + store info */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                        }}
                    >
                        {/* Pricing */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                                <span
                                    style={{
                                        color: "#F1F5F9",
                                        fontSize: 48,
                                        fontWeight: 900,
                                        letterSpacing: -1,
                                    }}
                                >
                                    {fmt(effectivePrice)}
                                </span>
                                {hasDiscount && (
                                    <span
                                        style={{
                                            color: "#64748B",
                                            fontSize: 26,
                                            fontWeight: 600,
                                            textDecoration: "line-through",
                                        }}
                                    >
                                        {fmt(data.price)}
                                    </span>
                                )}
                            </div>

                            {/* Stock */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: data.stockCount > 0 ? "#10B981" : "#EF4444",
                                    }}
                                />
                                <span style={{ color: data.stockCount > 0 ? "#10B981" : "#EF4444", fontSize: 15, fontWeight: 600 }}>
                                    {data.stockCount > 0 ? `In Stock · ${data.stockCount} units` : "Out of Stock"}
                                </span>
                            </div>
                        </div>

                        {/* Rating */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                            <div style={{ display: "flex", gap: 4 }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            color: i < Math.floor(data.rating) ? "#FBBF24" : "#334155",
                                            fontSize: 22,
                                        }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span style={{ color: "#64748B", fontSize: 14 }}>
                                {data.rating} · {data.reviewCount.toLocaleString()} reviews
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Right: Product image ─────────────────────── */}
                <div
                    style={{
                        width: 420,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        flexShrink: 0,
                    }}
                >
                    {/* Accent background panel */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: `linear-gradient(135deg, ${accent.from}15, ${accent.to}08)`,
                            borderLeft: `1px solid ${accent.from}20`,
                        }}
                    />

                    {productImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={productImageUrl}
                            alt={data.name}
                            style={{
                                width: 340,
                                height: 340,
                                objectFit: "cover",
                                borderRadius: 24,
                                position: "relative",
                                zIndex: 1,
                                boxShadow: `0 0 60px ${accent.from}30`,
                            }}
                        />
                    ) : (
                        /* Fallback — styled product name card */
                        <div
                            style={{
                                width: 300,
                                height: 300,
                                borderRadius: 24,
                                background: `linear-gradient(135deg, ${accent.from}20, ${accent.to}10)`,
                                border: `1px solid ${accent.from}30`,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 12,
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            <span style={{ fontSize: 64 }}>
                                {categorySlug === "phones" ? "📱" :
                                    categorySlug === "laptops" ? "💻" :
                                        categorySlug === "smartwatches" ? "⌚" :
                                            categorySlug === "power-banks" ? "🔋" :
                                                categorySlug === "earbuds" ? "🎧" : "🔌"}
                            </span>
                            <span
                                style={{
                                    color: "#94A3B8",
                                    fontSize: 16,
                                    fontWeight: 600,
                                    textAlign: "center",
                                    padding: "0 20px",
                                }}
                            >
                                {brandName}
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Bottom bar ───────────────────────────────── */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, #06B6D4, ${accent.from}, #7C3AED)`,
                    }}
                />
            </div>
        ),
        { ...size }
    );
}