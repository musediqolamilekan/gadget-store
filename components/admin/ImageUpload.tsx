"use client";

/**
 * ImageUpload – reusable image picker that uploads to Sanity via /api/admin/upload
 *
 * Props:
 *   value      – current image URL (to show preview)
 *   onChange   – called with { assetRef, url } on successful upload, or null on remove
 *   label      – field label
 *   aspectRatio – css aspect-ratio string e.g. "16/9" | "1/1" | "4/3"
 */

import { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface UploadResult {
  assetRef: { _type: "reference"; _ref: string };
  url: string;
}

interface Props {
  value?: string | null;
  onChange: (result: UploadResult | null) => void;
  label?: string;
  aspectRatio?: string;
  accept?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  aspectRatio = "16/9",
  accept = "image/jpeg,image/png,image/webp,image/gif,image/avif",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange({ assetRef: data.assetRef, url: data.url });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError("File must be under 10 MB"); return; }
    upload(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    e.currentTarget.value = "";
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-1.5">
      {label && <p className="text-xs font-semibold text-text-muted">{label}</p>}

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onInputChange}
      />

      {value ? (
        /* ── Preview ──────────────────────────────────────── */
        <div className="relative group rounded-xl overflow-hidden border border-border bg-bg-muted"
          style={{ aspectRatio }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-black text-xs font-semibold hover:bg-white transition-all"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Replace
            </button>
            <button
              type="button"
              onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = ""; }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs font-semibold hover:bg-red-500 transition-all"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        /* ── Drop Zone ────────────────────────────────────── */
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all
            ${dragOver ? "border-primary-400 bg-primary-50" : "border-border hover:border-primary-300 hover:bg-bg-subtle"}
            ${uploading ? "pointer-events-none opacity-60" : ""}`}
          style={{ aspectRatio, minHeight: "120px" }}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
              <p className="text-xs text-text-muted">Uploading…</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-bg-muted flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-text-faint" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-text-muted">Click or drag & drop</p>
                <p className="text-[11px] text-text-faint mt-0.5">JPEG, PNG, WebP · max 10 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-danger flex items-center gap-1"><X className="w-3 h-3" />{error}</p>}
    </div>
  );
}
