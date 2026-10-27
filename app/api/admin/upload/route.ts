import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";

/**
 * POST /api/admin/upload
 * Accepts a multipart/form-data with a single "file" field.
 * Uploads the image to Sanity Assets and returns the asset _id and URL.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type. Use JPEG, PNG, WebP, GIF or AVIF." }, { status: 400 });
    }

    const MAX_MB = 10;
    if (file.size > MAX_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File exceeds ${MAX_MB}MB limit` }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const asset = await writeClient.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return NextResponse.json({
      _id: asset._id,
      url: asset.url,
      assetRef: { _type: "reference", _ref: asset._id },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
