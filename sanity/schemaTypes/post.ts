import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";

export const postSchema = defineType({
  name:  "post",
  title: "Blog Post",
  type:  "document",
  icon:  FileText,

  groups: [
    { name: "content", title: "Content",    default: true },
    { name: "seo",     title: "SEO"                       },
    { name: "meta",    title: "Meta"                       },
  ],

  fields: [
    // ── CONTENT ─────────────────────────────────────────
    defineField({
      name:  "title",
      title: "Title",
      type:  "string",
      group: "content",
      validation: (r) => r.required().min(10).max(100),
    }),
    defineField({
      name:    "slug",
      title:   "Slug",
      type:    "slug",
      group:   "content",
      options: { source: "title", maxLength: 100 },
      validation: (r) => r.required(),
    }),
    defineField({
      name:  "excerpt",
      title: "Excerpt",
      description: "Short summary shown on listing page and used as SEO description",
      type:  "text",
      rows:  3,
      group: "content",
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name:  "coverImage",
      title: "Cover Image",
      type:  "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name:  "alt",
          title: "Alt Text",
          type:  "string",
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name:  "body",
      title: "Article Body",
      type:  "array",
      group: "content",
      of: [
        {
          type:   "block",
          styles: [
            { title: "Normal",  value: "normal" },
            { title: "H2",      value: "h2"     },
            { title: "H3",      value: "h3"     },
            { title: "H4",      value: "h4"     },
            { title: "Quote",   value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold",          value: "strong" },
              { title: "Italic",        value: "em"     },
              { title: "Underline",     value: "underline" },
            ],
            annotations: [
              {
                name:   "link",
                type:   "object",
                title:  "Link",
                fields: [
                  defineField({ name: "href", type: "url", title: "URL" }),
                  defineField({ name: "blank", type: "boolean", title: "Open in new tab" }),
                ],
              },
            ],
          },
        },
        {
          type:  "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt",     type: "string", title: "Alt Text" }),
            defineField({ name: "caption", type: "string", title: "Caption"  }),
          ],
        },
      ],
      validation: (r) => r.required(),
    }),

    // ── META ────────────────────────────────────────────
    defineField({
      name:  "category",
      title: "Category",
      type:  "string",
      group: "meta",
      options: {
        list: [
          { title: "Phone Reviews",       value: "phone-reviews"       },
          { title: "Laptop Reviews",      value: "laptop-reviews"      },
          { title: "Buying Guides",       value: "buying-guides"       },
          { title: "Tips & Tricks",       value: "tips-tricks"         },
          { title: "Comparisons",         value: "comparisons"         },
          { title: "News & Deals",        value: "news-deals"          },
          { title: "Accessories",         value: "accessories"         },
        ],
        layout: "dropdown",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name:  "tags",
      title: "Tags",
      type:  "array",
      group: "meta",
      of:    [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name:  "author",
      title: "Author",
      type:  "string",
      group: "meta",
      initialValue: "HolarzGadgets Team",
    }),
    defineField({
      name:        "publishedAt",
      title:       "Published At",
      type:        "datetime",
      group:       "meta",
      initialValue: () => new Date().toISOString(),
      validation:  (r) => r.required(),
    }),
    defineField({
      name:  "featured",
      title: "Featured Post?",
      description: "Show prominently on the blog homepage",
      type:  "boolean",
      group: "meta",
      initialValue: false,
    }),
    defineField({
      name:  "readingTime",
      title: "Reading Time (minutes)",
      type:  "number",
      group: "meta",
      initialValue: 5,
    }),

    // ── SEO ─────────────────────────────────────────────
    defineField({
      name:  "seoTitle",
      title: "SEO Title",
      description: "Overrides the post title in search results (max 60 chars)",
      type:  "string",
      group: "seo",
      validation: (r) => r.max(60),
    }),
    defineField({
      name:  "seoDescription",
      title: "SEO Description",
      description: "Overrides excerpt in search results (max 160 chars)",
      type:  "text",
      rows:  3,
      group: "seo",
      validation: (r) => r.max(160),
    }),
  ],

  preview: {
    select: {
      title:     "title",
      subtitle:  "category",
      media:     "coverImage",
      published: "publishedAt",
    },
    prepare({ title, subtitle, media, published }) {
      const date = published
        ? new Date(published).toLocaleDateString("en-NG", {
            day: "numeric", month: "short", year: "numeric",
          })
        : "Draft";
      return { title, subtitle: `${subtitle} · ${date}`, media };
    },
  },

  orderings: [
    {
      title: "Newest First",
      name:  "publishedDesc",
      by:    [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Oldest First",
      name:  "publishedAsc",
      by:    [{ field: "publishedAt", direction: "asc" }],
    },
  ],
});