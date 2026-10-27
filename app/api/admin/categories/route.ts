import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { groq } from "next-sanity";
import { revalidateSanityDocument } from "../revalidate";

export const dynamic = "force-dynamic";

// ── GET all categories ───────────────────────────────────────
export async function GET() {
  try {
    const categories = await sanityClient.withConfig({ useCdn: false }).fetch(
      groq`*[_type == "category"] | order(order asc) {
        _id, _createdAt, _updatedAt,
        title, "slug": slug.current,
        description, icon, isFeatured, order,
        "imageUrl": image.asset->url,
        "imageAssetRef": image.asset,
        "productCount": count(*[_type == "product" && references(^._id)])
      }`,
      {},
      { cache: "no-store" }
    );
    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// ── POST create category ─────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const doc = {
      _type: "category",
      title: body.title,
      slug: { _type: "slug", current: body.slug },
      description: body.description,
      icon: body.icon,
      isFeatured: body.isFeatured ?? true,
      order: body.order ?? 99,
      ...(body.image ? { image: body.image } : {}),
    };
    const result = await writeClient.create(doc);
    revalidateSanityDocument("category");
    return NextResponse.json({ data: result }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

// ── PATCH update category ────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { _id, ...updates } = await req.json();
    if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    const unsetFields = Object.keys(updates).filter((field) => updates[field] === null);
    const setUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== null)
    );
    let patch = writeClient.patch(_id).set(setUpdates);
    if (unsetFields.length) patch = patch.unset(unsetFields);
    const result = await patch.commit();
    revalidateSanityDocument("category");
    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// ── DELETE category ──────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    await writeClient.delete(_id);
    revalidateSanityDocument("category");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
