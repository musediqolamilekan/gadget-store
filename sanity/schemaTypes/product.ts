import { defineField, defineType } from "sanity";
import { ShoppingBag } from "lucide-react";

export const productSchema = defineType({
    name: "product",
    title: "Product",
    type: "document",
    icon: ShoppingBag,

    groups: [
        { name: "basic", title: "Basic Info", default: true },
        { name: "media", title: "Images & Media" },
        { name: "pricing", title: "Pricing & Stock" },
        { name: "specs", title: "Specifications" },
        { name: "seo", title: "SEO & Metadata" },
    ],

    fields: [
        // ── BASIC INFO ──────────────────────────────────────────
        defineField({
            name: "name",
            title: "Product Name",
            type: "string",
            group: "basic",
            validation: (r) => r.required().min(3).max(120),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            group: "basic",
            options: { source: "name", maxLength: 100 },
            validation: (r) => r.required(),
        }),
        defineField({
            name: "brand",
            title: "Brand",
            type: "reference",
            to: [{ type: "brand" }],
            group: "basic",
            validation: (r) => r.required(),
        }),
        defineField({
            name: "category",
            title: "Category",
            type: "reference",
            to: [{ type: "category" }],
            group: "basic",
            validation: (r) => r.required(),
        }),
        defineField({
            name: "shortDescription",
            title: "Short Description",
            description: "One-line spec summary shown on product cards (e.g. '6.7\" AMOLED · A18 Pro · 200MP')",
            type: "string",
            group: "basic",
            validation: (r) => r.required().max(120),
        }),
        defineField({
            name: "description",
            title: "Full Description",
            type: "array",
            group: "basic",
            of: [
                {
                    type: "block",
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "H3", value: "h3" },
                        { title: "H4", value: "h4" },
                    ],
                    marks: {
                        decorators: [
                            { title: "Bold", value: "strong" },
                            { title: "Italic", value: "em" },
                        ],
                    },
                },
            ],
            validation: (r) => r.required(),
        }),
        defineField({
            name: "tags",
            title: "Tags",
            type: "array",
            group: "basic",
            of: [{ type: "string" }],
            options: { layout: "tags" },
        }),

        // ── MEDIA ───────────────────────────────────────────────
        defineField({
            name: "images",
            title: "Product Images",
            type: "array",
            group: "media",
            of: [
                {
                    type: "object",
                    name: "productImage",
                    fields: [
                        defineField({
                            name: "image",
                            title: "Image",
                            type: "image",
                            options: { hotspot: true },
                            validation: (r) => r.required(),
                        }),
                        defineField({
                            name: "alt",
                            title: "Alt Text",
                            type: "string",
                            validation: (r) => r.required(),
                        }),
                        defineField({
                            name: "isPrimary",
                            title: "Primary Image?",
                            type: "boolean",
                            initialValue: false,
                        }),
                    ],
                    preview: {
                        select: { title: "alt", media: "image" },
                    },
                },
            ],
            validation: (r) => r.required().min(1),
        }),

        // ── PRICING & STOCK ─────────────────────────────────────
        defineField({
            name: "price",
            title: "Price (₦)",
            type: "number",
            group: "pricing",
            validation: (r) => r.required().positive(),
        }),
        defineField({
            name: "discountPrice",
            title: "Discount Price (₦)",
            description: "Leave blank if no discount",
            type: "number",
            group: "pricing",
            validation: (r) =>
                r.custom((discountPrice, ctx) => {
                    const price = (ctx.document as { price?: number })?.price;
                    if (discountPrice && price && discountPrice >= price) {
                        return "Discount price must be less than the original price";
                    }
                    return true;
                }),
        }),
        defineField({
            name: "stockCount",
            title: "Stock Count",
            type: "number",
            group: "pricing",
            initialValue: 0,
            validation: (r) => r.required().min(0).integer(),
        }),
        defineField({
            name: "isFeatured",
            title: "Featured Product?",
            description: "Show on homepage featured section",
            type: "boolean",
            group: "pricing",
            initialValue: false,
        }),
        defineField({
            name: "isNew",
            title: "New Arrival?",
            description: "Shows a 'New' badge on product card",
            type: "boolean",
            group: "pricing",
            initialValue: false,
        }),
        defineField({
            name: "isBestseller",
            title: "Bestseller?",
            description: "Shows a 'Bestseller' badge on product card",
            type: "boolean",
            group: "pricing",
            initialValue: false,
        }),

        // ── SPECIFICATIONS ──────────────────────────────────────
        defineField({
            name: "specs",
            title: "Specifications",
            description: "Key-value pairs for the specs table on the product detail page",
            type: "array",
            group: "specs",
            of: [
                {
                    type: "object",
                    name: "specItem",
                    fields: [
                        defineField({
                            name: "key",
                            title: "Spec Name",
                            type: "string",
                            placeholder: "e.g. Display, Processor, Battery",
                            validation: (r) => r.required(),
                        }),
                        defineField({
                            name: "value",
                            title: "Spec Value",
                            type: "string",
                            placeholder: "e.g. 6.7\" AMOLED 120Hz",
                            validation: (r) => r.required(),
                        }),
                    ],
                    preview: {
                        select: { title: "key", subtitle: "value" },
                    },
                },
            ],
        }),

        // ── RATINGS (managed externally / seeded) ───────────────
        defineField({
            name: "rating",
            title: "Rating (0–5)",
            type: "number",
            group: "basic",
            initialValue: 0,
            validation: (r) => r.min(0).max(5).precision(1),
        }),
        defineField({
            name: "reviewCount",
            title: "Review Count",
            type: "number",
            group: "basic",
            initialValue: 0,
            validation: (r) => r.min(0).integer(),
        }),

        // ── SEO ─────────────────────────────────────────────────
        defineField({
            name: "seoTitle",
            title: "SEO Title",
            description: "Defaults to product name if left blank",
            type: "string",
            group: "seo",
            validation: (r) => r.max(60),
        }),
        defineField({
            name: "seoDescription",
            title: "SEO Description",
            description: "Defaults to short description if left blank",
            type: "text",
            rows: 3,
            group: "seo",
            validation: (r) => r.max(160),
        }),
    ],

    // ── Studio preview ────────────────────────────────────────
    preview: {
        select: {
            title: "name",
            subtitle: "category",
            media: "images.0.image",
            price: "price",
            discount: "discountPrice",
        },
        prepare({ title, subtitle, media, price, discount }) {
            const display = discount
                ? `₦${discount.toLocaleString("en-NG")} (was ₦${price.toLocaleString("en-NG")})`
                : `₦${price?.toLocaleString("en-NG") ?? "—"}`;
            return {
                title,
                subtitle: `${subtitle} · ${display}`,
                media,
            };
        },
    },

    orderings: [
        {
            title: "Price: Low → High",
            name: "priceAsc",
            by: [{ field: "price", direction: "asc" }],
        },
        {
            title: "Price: High → Low",
            name: "priceDesc",
            by: [{ field: "price", direction: "desc" }],
        },
        {
            title: "Name A–Z",
            name: "nameAsc",
            by: [{ field: "name", direction: "asc" }],
        },
        {
            title: "Newest First",
            name: "newest",
            by: [{ field: "_createdAt", direction: "desc" }],
        },
    ],
});