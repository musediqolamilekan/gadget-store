import { defineField, defineType } from "sanity";
import { ShoppingCart } from "lucide-react";

export const orderSchema = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: ShoppingCart,

  groups: [
    { name: "customer", title: "Customer Info", default: true },
    { name: "items", title: "Order Items" },
    { name: "payment", title: "Payment" },
    { name: "fulfillment", title: "Fulfillment" },
  ],

  fields: [
    // ── ORDER IDENTITY ───────────────────────────────────────
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      group: "customer",
      description: "Auto-generated unique order ID e.g. HLZ-20260001",
      validation: (r) => r.required(),
    }),

    // ── CUSTOMER INFO ────────────────────────────────────────
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      group: "customer",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "customerEmail",
      title: "Email",
      type: "string",
      group: "customer",
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: "customerPhone",
      title: "Phone",
      type: "string",
      group: "customer",
    }),

    // ── SHIPPING ADDRESS ─────────────────────────────────────
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      group: "customer",
      fields: [
        defineField({ name: "address", title: "Street Address", type: "string" }),
        defineField({ name: "city",    title: "City",           type: "string" }),
        defineField({ name: "state",   title: "State",          type: "string" }),
        defineField({ name: "country", title: "Country",        type: "string", initialValue: "Nigeria" }),
      ],
    }),

    // ── ORDER ITEMS ──────────────────────────────────────────
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      group: "items",
      of: [
        {
          type: "object",
          name: "orderItem",
          fields: [
            defineField({ name: "productId",   title: "Product ID",   type: "string" }),
            defineField({ name: "productName", title: "Product Name", type: "string" }),
            defineField({ name: "productSlug", title: "Product Slug", type: "string" }),
            defineField({ name: "brand",       title: "Brand",        type: "string" }),
            defineField({ name: "category",    title: "Category",     type: "string" }),
            defineField({ name: "imageUrl",    title: "Image URL",    type: "string" }),
            defineField({ name: "unitPrice",   title: "Unit Price (₦)", type: "number" }),
            defineField({ name: "quantity",    title: "Quantity",     type: "number" }),
            defineField({ name: "lineTotal",   title: "Line Total (₦)", type: "number" }),
          ],
          preview: {
            select: { title: "productName", subtitle: "lineTotal" },
            prepare({ title, subtitle }) {
              return { title, subtitle: `₦${subtitle?.toLocaleString("en-NG") ?? "—"}` };
            },
          },
        },
      ],
      validation: (r) => r.required().min(1),
    }),

    // ── PRICING ──────────────────────────────────────────────
    defineField({
      name: "subtotal",
      title: "Subtotal (₦)",
      type: "number",
      group: "payment",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "shippingFee",
      title: "Shipping Fee (₦)",
      type: "number",
      group: "payment",
      initialValue: 0,
    }),
    defineField({
      name: "total",
      title: "Total (₦)",
      type: "number",
      group: "payment",
      validation: (r) => r.required().positive(),
    }),

    // ── PAYMENT ──────────────────────────────────────────────
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      group: "payment",
      options: {
        list: [
          { title: "Paystack", value: "paystack" },
          { title: "WhatsApp / Manual", value: "whatsapp" },
          { title: "Bank Transfer", value: "bank_transfer" },
        ],
        layout: "radio",
      },
      initialValue: "paystack",
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      group: "payment",
      options: {
        list: [
          { title: "Pending",   value: "pending"   },
          { title: "Paid",      value: "paid"       },
          { title: "Failed",    value: "failed"     },
          { title: "Refunded",  value: "refunded"   },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),
    defineField({
      name: "paystackReference",
      title: "Paystack Reference",
      type: "string",
      group: "payment",
      description: "Transaction reference from Paystack",
    }),
    defineField({
      name: "paystackTransactionId",
      title: "Paystack Transaction ID",
      type: "string",
      group: "payment",
    }),
    defineField({
      name: "paidAt",
      title: "Paid At",
      type: "datetime",
      group: "payment",
    }),

    // ── FULFILLMENT ──────────────────────────────────────────
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      group: "fulfillment",
      options: {
        list: [
          { title: "Pending",    value: "pending"    },
          { title: "Confirmed",  value: "confirmed"  },
          { title: "Processing", value: "processing" },
          { title: "Shipped",    value: "shipped"    },
          { title: "Delivered",  value: "delivered"  },
          { title: "Cancelled",  value: "cancelled"  },
        ],
        layout: "dropdown",
      },
      initialValue: "pending",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "trackingNumber",
      title: "Tracking Number",
      type: "string",
      group: "fulfillment",
    }),
    defineField({
      name: "deliveryNote",
      title: "Delivery Note",
      type: "text",
      rows: 3,
      group: "fulfillment",
    }),
    defineField({
      name: "createdAt",
      title: "Ordered At",
      type: "datetime",
      group: "customer",
      initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: {
      title: "orderNumber",
      subtitle: "customerName",
      status: "status",
      total: "total",
      paymentStatus: "paymentStatus",
    },
    prepare({ title, subtitle, status, total, paymentStatus }) {
      const statusEmoji: Record<string, string> = {
        pending: "⏳", confirmed: "✅", processing: "⚙️",
        shipped: "🚚", delivered: "📦", cancelled: "❌",
      };
      const payEmoji = paymentStatus === "paid" ? "💳" : "⏸";
      return {
        title: `${statusEmoji[status] ?? "•"} ${title}`,
        subtitle: `${subtitle} · ₦${total?.toLocaleString("en-NG")} · ${payEmoji}`,
      };
    },
  },

  orderings: [
    {
      title: "Newest First",
      name: "newest",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Highest Value",
      name: "totalDesc",
      by: [{ field: "total", direction: "desc" }],
    },
  ],
});
