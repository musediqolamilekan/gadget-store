import { defineField, defineType } from "sanity";
import { Tag } from "lucide-react";

export const brandSchema = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  icon: Tag,

  fields: [
    defineField({
      name: "name",
      title: "Brand Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "country",
      title: "Country of Origin",
      type: "string",
    }),
    defineField({
      name: "website",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Brand?",
      type: "boolean",
      initialValue: false,
    }),
  ],

  preview: {
    select: { title: "name", media: "logo", subtitle: "country" },
  },
});
