import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { groq } from "next-sanity";
import { revalidateSanityDocument } from "../revalidate";

export const dynamic = "force-dynamic";

// ── GET all posts ────────────────────────────────────────────
export async function GET() {
  try {
    const posts = await sanityClient.withConfig({ useCdn: false }).fetch(
      groq`*[_type == "post"] | order(publishedAt desc) {
        _id, _createdAt, _updatedAt,
        title, "slug": slug.current,
        excerpt, category, tags, author,
        publishedAt, featured, readingTime, body,
        seoTitle, seoDescription,
        "coverImage": {
          "url": coverImage.asset->url,
          "alt": coverImage.alt,
          "assetRef": coverImage.asset
        }
      }`,
      {},
      { cache: "no-store" }
    );
    return NextResponse.json({ data: posts });
  } catch {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// ── POST create post ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.slug || !body.excerpt || !body.category) {
      return NextResponse.json({ error: "title, slug, excerpt and category are required" }, { status: 400 });
    }

    const doc = {
      _type: "post",
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      category: body.category,
      author: body.author ?? "HolarzGadgets Team",
      publishedAt: body.publishedAt ?? new Date().toISOString(),
      featured: body.featured ?? false,
      readingTime: body.readingTime ?? 5,
      tags: body.tags ?? [],
      body: body.body ?? [],
      ...(body.coverImage ? { coverImage: body.coverImage } : {}),
      ...(body.seoTitle ? { seoTitle: body.seoTitle } : {}),
      ...(body.seoDescription ? { seoDescription: body.seoDescription } : {}),
    };

    const result = await writeClient.create(doc);
    revalidateSanityDocument("post");
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (err) {
    console.error("Create post error:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

// ── PATCH update post ────────────────────────────────────────
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
    revalidateSanityDocument("post");
    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// ── DELETE post ──────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    await writeClient.delete(_id);
    revalidateSanityDocument("post");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
