"use client";

/**
 * OrderShippingLabel
 * Renders a printable shipping label with:
 *  - Store logo / name
 *  - Order number (large, bold)
 *  - Barcode simulation (Code-128 style bars from order digits)
 *  - Customer + shipping address
 *  - Item summary
 *  - Total & payment method
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface OrderDetail {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: { address: string; city: string; state: string; country: string };
  items: { productName: string; brand: string; unitPrice: number; quantity: number; lineTotal: number; imageUrl?: string }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  paystackReference?: string;
  status: string;
  trackingNumber?: string;
  createdAt: string;
}

// ── Simple Code-128 style barcode SVG generator ──────────────────
// This creates a deterministic visual barcode from a string.
function generateBarcodeLines(value: string): number[] {
  const bars: number[] = [];
  // Use char codes to generate bar widths
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    // Convert to binary (8 bits) to get bar/space pattern
    for (let bit = 7; bit >= 0; bit--) {
      bars.push((code >> bit) & 1 ? 2 + ((i * 3 + bit) % 2) : 1);
    }
  }
  // Add quiet zones
  return [5, ...bars, 5];
}

function BarcodeStrip({ value }: { value: string }) {
  const bars = generateBarcodeLines(value);
  const totalWidth = bars.reduce((s, w) => s + w, 0);
  let x = 0;

  return (
    <svg width="100%" height="60" viewBox={`0 0 ${totalWidth} 60`} preserveAspectRatio="xMidYMid meet">
      {bars.map((w, i) => {
        const barX = x;
        x += w;
        return i % 2 === 0 ? (
          <rect key={i} x={barX} y={0} width={w} height={50} fill="#000" />
        ) : null;
      })}
      <text
        x={totalWidth / 2}
        y={58}
        fontSize="7"
        textAnchor="middle"
        fontFamily="monospace"
        fill="#000"
        letterSpacing="1"
      >
        {value}
      </text>
    </svg>
  );
}

// ── Print-specific styles injected into <head> ───────────────────
const PRINT_STYLE = `
@media print {
  html, body { height: auto !important; overflow: visible !important; }
  body > *:not(#holarz-print-root) { display: none !important; }
  #holarz-print-root {
    display: block !important;
    position: static !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
  }
  @page { size: A6 landscape; margin: 6mm; }
}
`;

interface Props {
  order: OrderDetail;
  onClose: () => void;
}

export default function OrderShippingLabel({ order, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  // Inject print styles
  useEffect(() => {
    setMounted(true);
    const style = document.createElement("style");
    style.id = "holarz-print-style";
    style.innerHTML = PRINT_STYLE;
    document.head.appendChild(style);
    return () => {
      document.getElementById("holarz-print-style")?.remove();
    };
  }, []);

  const fmtNaira = (n: number) => `₦${(n ?? 0).toLocaleString("en-NG")}`;
  const addr = order.shippingAddress;
  const barcodeValue = order.trackingNumber ?? order.orderNumber;
  const dateStr = new Date(order.createdAt).toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* ── Screen Modal ──────────────────────────────────── */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-bg border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="font-black text-text text-base">Shipping Label Preview</h3>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md"
              >
                🖨️ Print Label
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-text-muted text-sm hover:bg-bg-subtle transition-all"
              >
                Close
              </button>
            </div>
          </div>

          {/* Label Preview */}
          <div className="p-5">
            <div className="border-2 border-dashed border-border rounded-xl p-1 bg-white">
              <LabelContent order={order} fmtNaira={fmtNaira} barcodeValue={barcodeValue} dateStr={dateStr} addr={addr} />
            </div>
          </div>
        </div>
      </div>

      {mounted && createPortal(
        <div id="holarz-print-root" style={{ display: "none" }}>
          <LabelContent order={order} fmtNaira={fmtNaira} barcodeValue={barcodeValue} dateStr={dateStr} addr={addr} />
        </div>,
        document.body
      )}
    </>
  );
}

// ── Shared Label Content ─────────────────────────────────────────
function LabelContent({
  order, fmtNaira, barcodeValue, dateStr, addr,
}: {
  order: OrderDetail;
  fmtNaira: (n: number) => string;
  barcodeValue: string;
  dateStr: string;
  addr: OrderDetail["shippingAddress"];
}) {
  return (
    <div
      style={{
        fontFamily: "'Courier New', monospace",
        background: "#fff",
        color: "#000",
        width: "100%",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #000", paddingBottom: "8px", marginBottom: "8px" }}>
        <div>
          <div style={{ fontSize: "18px", fontWeight: "900", letterSpacing: "-0.5px" }}>
            ⚡ HOLARZ GADGETS
          </div>
          <div style={{ fontSize: "9px", color: "#555", marginTop: "2px" }}>
            holarzgadgets.com · Nigeria
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", fontWeight: "bold" }}>ORDER</div>
          <div style={{ fontSize: "22px", fontWeight: "900", letterSpacing: "1px", color: "#111" }}>
            {order.orderNumber}
          </div>
          <div style={{ fontSize: "9px", color: "#666" }}>{dateStr}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "8px" }}>
        {/* ── Ship To ───────────────────────────────────── */}
        <div style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "8px" }}>
          <div style={{ fontSize: "8px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", color: "#888", marginBottom: "4px" }}>
            SHIP TO
          </div>
          <div style={{ fontSize: "14px", fontWeight: "900" }}>{order.customerName}</div>
          {order.customerPhone && (
            <div style={{ fontSize: "11px", marginTop: "2px" }}>📱 {order.customerPhone}</div>
          )}
          <div style={{ fontSize: "10px", marginTop: "4px", color: "#333" }}>
            {addr?.address}
          </div>
          <div style={{ fontSize: "10px", color: "#333" }}>
            {addr?.city}{addr?.state ? `, ${addr.state}` : ""}
          </div>
          <div style={{ fontSize: "10px", color: "#444", fontWeight: "bold" }}>
            {addr?.country ?? "Nigeria"}
          </div>
        </div>

        {/* ── Order Info ────────────────────────────────── */}
        <div style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "8px" }}>
          <div style={{ fontSize: "8px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", color: "#888", marginBottom: "4px" }}>
            ORDER DETAILS
          </div>
          <div style={{ fontSize: "10px", marginBottom: "3px" }}>
            <span style={{ color: "#888" }}>Items: </span>
            <span style={{ fontWeight: "bold" }}>{order.items?.length ?? 0}</span>
          </div>
          <div style={{ fontSize: "10px", marginBottom: "3px" }}>
            <span style={{ color: "#888" }}>Subtotal: </span>
            <span style={{ fontWeight: "bold" }}>{fmtNaira(order.subtotal)}</span>
          </div>
          {order.shippingFee > 0 && (
            <div style={{ fontSize: "10px", marginBottom: "3px" }}>
              <span style={{ color: "#888" }}>Shipping: </span>
              <span style={{ fontWeight: "bold" }}>{fmtNaira(order.shippingFee)}</span>
            </div>
          )}
          <div style={{ fontSize: "12px", fontWeight: "900", borderTop: "1px solid #eee", marginTop: "4px", paddingTop: "4px" }}>
            TOTAL: {fmtNaira(order.total)}
          </div>
          <div style={{ fontSize: "9px", marginTop: "3px", color: "#555" }}>
            {order.paymentMethod === "paystack" ? "💳 Paid via Paystack" :
             order.paymentMethod === "whatsapp" ? "💬 WhatsApp Order" :
             "🏦 Bank Transfer"}
          </div>
          <div style={{ fontSize: "9px", color: order.paymentStatus === "paid" ? "#15803d" : "#dc2626", fontWeight: "bold", marginTop: "2px" }}>
            {order.paymentStatus.toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── Items List ───────────────────────────────────── */}
      <div style={{ border: "1px solid #eee", borderRadius: "6px", padding: "6px", marginBottom: "8px" }}>
        <div style={{ fontSize: "8px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", color: "#888", marginBottom: "4px" }}>
          ITEMS
        </div>
        {order.items?.slice(0, 5).map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", padding: "2px 0", borderBottom: i < (order.items.length - 1) && i < 4 ? "1px solid #f0f0f0" : "none" }}>
            <span style={{ flex: 1 }}>{item.quantity}× {item.productName}</span>
            <span style={{ fontWeight: "bold", marginLeft: "8px" }}>{fmtNaira(item.lineTotal)}</span>
          </div>
        ))}
        {(order.items?.length ?? 0) > 5 && (
          <div style={{ fontSize: "9px", color: "#888", marginTop: "2px" }}>
            +{order.items.length - 5} more item(s)
          </div>
        )}
      </div>

      {/* ── Barcode ──────────────────────────────────────── */}
      <div style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "8px", textAlign: "center" }}>
        <div style={{ fontSize: "8px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", color: "#888", marginBottom: "4px" }}>
          {order.trackingNumber ? "TRACKING NUMBER" : "ORDER BARCODE"}
        </div>
        <BarcodeStrip value={barcodeValue} />
        {order.paystackReference && (
          <div style={{ fontSize: "8px", color: "#888", marginTop: "4px" }}>
            Ref: {order.paystackReference}
          </div>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div style={{ marginTop: "8px", textAlign: "center", fontSize: "8px", color: "#aaa" }}>
        Thank you for shopping with HOLARZ GADGETS! • For support: contact us via our website
      </div>
    </div>
  );
}
