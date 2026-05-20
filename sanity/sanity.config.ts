import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool    } from "@sanity/vision";
import { media         } from "sanity-plugin-media";
import { schema        } from "../sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name:    "horlarz-gadgets",
  title:   "Horlarz Gadgets — Studio",
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("🛒 Products")
              .schemaType("product")
              .child(S.documentTypeList("product").title("All Products")),

            S.listItem()
              .title("🏷 Brands")
              .schemaType("brand")
              .child(S.documentTypeList("brand").title("All Brands")),

            S.listItem()
              .title("📂 Categories")
              .schemaType("category")
              .child(S.documentTypeList("category").title("All Categories")),

            S.divider(),

            S.listItem()
              .title("📣 Promo Banners")
              .schemaType("banner")
              .child(S.documentTypeList("banner").title("Banners")),
          ]),
    }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
    media(),
  ],

  schema: { types: schema.types },
});