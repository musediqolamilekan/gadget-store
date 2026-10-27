import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { groq } from "next-sanity";
import { revalidateSanityDocument } from "../revalidate";

export const dynamic = "force-dynamic";

// ── GET all products (admin fields) ─────────────────────────
export async function GET() {
  try {
    const products = await sanityClient.withConfig({ useCdn: false }).fetch(
      groq`*[_type == "product"] | order(_createdAt desc) {
        _id, _createdAt, _updatedAt,
        name, "slug": slug.current,
        "brand": brand->{ _id, name },
        "category": category->{ _id, title, "slug": slug.current },
        shortDescription,
        description,
        price, discountPrice, stockCount,
        isFeatured, isNew, isBestseller,
        rating, reviewCount,
        tags,
        specs[]{ _key, key, value },
        "images": images[]{
          _key, alt, isPrimary,
          "url": image.asset->url,
          "assetRef": image.asset
        },
        seoTitle, seoDescription,
        "image": images[isPrimary == true][0].image.asset->url,
        "imageUrl": images[0].image.asset->url
      }`,
      {},
      { cache: "no-store" }
    );
    return NextResponse.json({ data: products });
  } catch (error) {
    console.error("Admin GET products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ── POST create product ───────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.slug || !body.brandId || !body.categoryId || !body.price) {
      return NextResponse.json(
        { error: "name, slug, brandId, categoryId and price are required" },
        { status: 400 }
      );
    }

    const doc = {
      _type: "product",
      name: body.name,
      slug: { _type: "slug", current: body.slug },
      brand: { _type: "reference", _ref: body.brandId },
      category: { _type: "reference", _ref: body.categoryId },
      shortDescription: body.shortDescription ?? "",
      description: body.description,
      price: Number(body.price),
      discountPrice: body.discountPrice ?? undefined,
      stockCount: Number(body.stockCount ?? 0),
      isFeatured: body.isFeatured ?? false,
      isNew: body.isNew ?? false,
      isBestseller: body.isBestseller ?? false,
      rating: body.rating ?? 0,
      reviewCount: body.reviewCount ?? 0,
      tags: body.tags ?? [],
      images: body.images ?? [],
      specs: body.specs ?? [],
      ...(body.seoTitle ? { seoTitle: body.seoTitle } : {}),
      ...(body.seoDescription ? { seoDescription: body.seoDescription } : {}),
    };

    const result = await writeClient.create(doc);
    revalidateSanityDocument("product", [body.slug]);
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error("Admin POST product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// ── PATCH (update) a product ─────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { _id, ...updates } = await req.json();
    if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });

    const previousSlug = await writeClient.fetch<string | null>(
      groq`*[_id == $_id][0].slug.current`,
      { _id }
    );
    const unsetFields = Object.keys(updates).filter((field) => updates[field] === null);
    const setUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== null)
    );
    let patch = writeClient.patch(_id).set(setUpdates);
    if (unsetFields.length) patch = patch.unset(unsetFields);
    const result = await patch.commit();
    const updatedSlug =
      typeof updates.slug === "string" ? updates.slug : updates.slug?.current;
    revalidateSanityDocument(
      "product",
      [previousSlug, updatedSlug].filter((slug): slug is string => Boolean(slug))
    );
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Admin PATCH product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// ── DELETE a product ─────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });

    const slug = await writeClient.fetch<string | null>(
      groq`*[_id == $_id][0].slug.current`,
      { _id }
    );
    await writeClient.delete(_id);
    revalidateSanityDocument("product", slug ? [slug] : []);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
