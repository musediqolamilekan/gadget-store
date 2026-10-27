import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { groq } from "next-sanity";
import { revalidateSanityDocument } from "../revalidate";

export const dynamic = "force-dynamic";

// ── GET all banners ──────────────────────────────────────────
export async function GET() {
  try {
    const banners = await sanityClient.withConfig({ useCdn: false }).fetch(
      groq`*[_type == "banner"] | order(order asc) {
        _id, _createdAt, _updatedAt,
        title, subtitle, badgeText,
        ctaLabel, ctaHref, accentColor,
        isActive, order,
        "imageUrl": image.asset->url,
        "imageAssetRef": image.asset
      }`,
      {},
      { cache: "no-store" }
    );
    return NextResponse.json({ data: banners });
  } catch {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

// ── POST create banner ───────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const doc = {
      _type: "banner",
      title: body.title,
      subtitle: body.subtitle,
      badgeText: body.badgeText,
      ctaLabel: body.ctaLabel ?? "Shop Now",
      ctaHref: body.ctaHref,
      accentColor: body.accentColor ?? "cyan",
      isActive: body.isActive ?? true,
      order: body.order ?? 1,
      ...(body.image ? { image: body.image } : {}),
    };
    const result = await writeClient.create(doc);
    revalidateSanityDocument("banner");
    return NextResponse.json({ data: result }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}

// ── PATCH update banner ──────────────────────────────────────
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
    revalidateSanityDocument("banner");
    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

// ── DELETE banner ────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    await writeClient.delete(_id);
    revalidateSanityDocument("banner");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
