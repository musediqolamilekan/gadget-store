import { type SchemaTypeDefinition } from "sanity";
import { productSchema } from "./product";
import { brandSchema } from "./brand";
import { categorySchema } from "./category";
import { bannerSchema } from "./banner";
import { postSchema } from "./post";


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    productSchema,
    brandSchema,
    categorySchema,
    bannerSchema,
    postSchema,
  ],
};