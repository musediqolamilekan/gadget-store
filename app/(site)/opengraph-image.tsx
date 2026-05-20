import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HolarzGadgets — Ekiti's #1 Gadget Store";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0F172A",
                    position: "relative",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Grid pattern */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Cyan glow top-left */}
                <div
                    style={{
                        position: "absolute",
                        top: -100,
                        left: -100,
                        width: 500,
                        height: 500,
                        borderRadius: "50%",
                        background: "rgba(6,182,212,0.12)",
                        filter: "blur(80px)",
                    }}
                />

                {/* Violet glow bottom-right */}
                <div
                    style={{
                        position: "absolute",
                        bottom: -100,
                        right: -100,
                        width: 400,
                        height: 400,
                        borderRadius: "50%",
                        background: "rgba(124,58,237,0.12)",
                        filter: "blur(80px)",
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 24,
                        padding: "0 60px",
                        textAlign: "center",
                    }}
                >
                    {/* Logo icon */}
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: 16,
                            background: "linear-gradient(135deg, #06B6D4, #7C3AED)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 32,
                            boxShadow: "0 0 40px rgba(6,182,212,0.5)",
                        }}
                    >
                        ⚡
                    </div>

                    {/* Brand name */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
                        <span style={{ color: "#F1F5F9", fontSize: 56, fontWeight: 900, letterSpacing: -2 }}>
                            Holarz
                        </span>
                        <span style={{ color: "#06B6D4", fontSize: 56, fontWeight: 900, letterSpacing: -2 }}>
                            Gadgets
                        </span>
                    </div>

                    {/* Tagline */}
                    <p style={{ color: "#94A3B8", fontSize: 24, margin: 0, lineHeight: 1.4, maxWidth: 700 }}>
                        Ekiti&apos;s #1 Online Store for Original Phones, Laptops,
                        Smartwatches &amp; Accessories
                    </p>

                    {/* Location badge */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "10px 24px",
                            borderRadius: 999,
                            border: "1px solid rgba(6,182,212,0.3)",
                            background: "rgba(6,182,212,0.1)",
                            color: "#06B6D4",
                            fontSize: 16,
                            fontWeight: 600,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                        }}
                    >
                        📍 Ado-Ekiti, Nigeria · Delivering Nationwide
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}