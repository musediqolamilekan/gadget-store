import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { groq } from "next-sanity";
import { revalidateSanityDocument } from "../revalidate";

export const dynamic = "force-dynamic";

// ── GET all brands ───────────────────────────────────────────
export async function GET() {
  try {
    const brands = await sanityClient.withConfig({ useCdn: false }).fetch(
      groq`*[_type == "brand"] | order(name asc) {
        _id, _createdAt, _updatedAt,
        name, "slug": slug.current,
        description, country, website, isFeatured,
        "logoUrl": logo.asset->url,
        "logoAssetRef": logo.asset
      }`,
      {},
      { cache: "no-store" }
    );
    return NextResponse.json({ data: brands });
  } catch {
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

// ── POST create brand ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const doc = {
      _type: "brand",
      name: body.name,
      slug: { _type: "slug", current: body.slug },
      description: body.description,
      country: body.country,
      website: body.website,
      isFeatured: body.isFeatured ?? false,
      ...(body.logo ? { logo: body.logo } : {}),
    };
    const result = await writeClient.create(doc);
    revalidateSanityDocument("brand");
    return NextResponse.json({ data: result }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}

// ── PATCH update brand ───────────────────────────────────────
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
    revalidateSanityDocument("brand");
    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

// ── DELETE brand ─────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    await writeClient.delete(_id);
    revalidateSanityDocument("brand");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
