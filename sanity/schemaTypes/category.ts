import { defineField, defineType } from "sanity";
import { Tag } from "lucide-react";

export const categorySchema = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: Tag,

  fields: [
    defineField({
      name: "title",
      title: "Category Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "icon",
      title: "Icon Name",
      description: "Lucide icon name e.g. Smartphone, Laptop, Watch",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "isFeatured",
      title: "Show on Homepage?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 99,
    }),
  ],

  preview: {
    select: {
      title:    "title",
      subtitle: "slug.current",
      media:    "image",
    },
  },

  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});