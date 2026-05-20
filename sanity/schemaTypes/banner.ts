import { defineField, defineType } from "sanity";
import { Image } from "lucide-react";

export const bannerSchema = defineType({
  name: "banner",
  title: "Promotional Banner",
  type: "document",
  icon: Image,

  fields: [
    defineField({
      name: "title",
      title: "Banner Headline",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle / Body Text",
      type: "string",
    }),
    defineField({
      name: "badgeText",
      title: "Badge Label",
      description: "Small label above the headline e.g. 'Limited Time Offer'",
      type: "string",
    }),
    defineField({
      name: "ctaLabel",
      title: "Button Label",
      type: "string",
      initialValue: "Shop Now",
    }),
    defineField({
      name: "ctaHref",
      title: "Button Link",
      type: "string",
      description: "Internal path e.g. /products?category=phones",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Background / Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "accentColor",
      title: "Accent Color",
      type: "string",
      options: {
        list: [
          { title: "Cyan",   value: "cyan"   },
          { title: "Violet", value: "violet" },
          { title: "Amber",  value: "amber"  },
          { title: "Rose",   value: "rose"   },
        ],
        layout: "radio",
      },
      initialValue: "cyan",
    }),
    defineField({
      name: "isActive",
      title: "Active?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 1,
    }),
  ],

  preview: {
    select: {
      title:    "title",
      subtitle: "ctaHref",
      media:    "image",
      active:   "isActive",
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title: `${active ? "✅" : "⏸"} ${title}`,
        subtitle,
        media,
      };
    },
  },
});
