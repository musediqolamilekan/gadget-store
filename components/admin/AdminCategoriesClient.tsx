"use client";

import { useCallback, useEffect, useState } from "react";
import { Grid3X3, Search, Plus, Pencil, Trash2, RefreshCw, Package, CheckCircle, XCircle } from "lucide-react";
import {
  PrimaryBtn, GhostBtn, Modal, FormField, inputCls, Toggle,
  ConfirmDeleteModal, EmptyState, SectionHeader
} from "./AdminUI";
import ImageUpload from "./ImageUpload";
import { adminRequest } from "./adminRequest";
import { useAdminToast } from "./AdminToast";

interface AdminCategory {
  _id: string; title: string; slug: string; description?: string;
  icon?: string; isFeatured: boolean; order: number;
  imageUrl?: string; productCount?: number;
  imageAssetRef?: { _type: "reference"; _ref: string } | null;
}

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
const emptyForm = {
  title: "", slug: "", description: "", icon: "", isFeatured: true, order: 99,
  imageUrl: "" as string | undefined,
  imageRef: null as { _type: "reference"; _ref: string } | null,
};

const COVER_PALETTE = [
  "from-orange-400 via-rose-500 to-rose-700",
  "from-violet-400 via-indigo-500 to-blue-700",
  "from-cyan-400 via-sky-500 to-blue-700",
  "from-emerald-400 via-teal-500 to-cyan-700",
  "from-amber-300 via-orange-500 to-rose-600",
  "from-fuchsia-400 via-purple-500 to-indigo-700",
];

export default function AdminCategoriesClient() {
  const showToast = useAdminToast();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminRequest<{ data: AdminCategory[] }>("/api/admin/categories");
      setCategories(result.data ?? []);
    } catch (error) {
      console.error("Failed to load admin categories:", error);
      showToast(error instanceof Error ? error.message : "Could not load categories", "error");
    } finally { setLoading(false); }
  }, [showToast]);
  useEffect(() => { void load(); }, [load]);

  const filtered = categories.filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c: AdminCategory) => {
    setEditId(c._id);
    setForm({
      title: c.title, slug: c.slug, description: c.description ?? "",
      icon: c.icon ?? "", isFeatured: c.isFeatured, order: c.order ?? 99,
      imageUrl: c.imageUrl ?? "", imageRef: c.imageAssetRef ?? null,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) { alert("Title and slug required"); return; }
    setSaving(true);
    try {
      const imageField = form.imageUrl && form.imageRef
        ? { image: { _type: "image", asset: form.imageRef } }
        : { image: null };

      if (editId) {
        await adminRequest("/api/admin/categories", {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: editId, title: form.title, slug: { _type: "slug", current: form.slug },
            description: form.description, icon: form.icon,
            isFeatured: form.isFeatured, order: form.order,
            ...imageField,
          }),
        });
      } else {
        await adminRequest("/api/admin/categories", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title, slug: form.slug, description: form.description,
            icon: form.icon, isFeatured: form.isFeatured, order: form.order,
            ...imageField,
          }),
        });
      }
      await load();
      setShowModal(false);
      showToast(editId ? "Category changes saved" : "Category created");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save category", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminRequest("/api/admin/categories", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: deleteTarget.id }),
      });
      setCategories((p) => p.filter((c) => c._id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast("Category deleted");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to delete category", "error");
    } finally { setDeleting(false); }
  };

  const toggleFeatured = async (cat: AdminCategory) => {
    try {
      await adminRequest("/api/admin/categories", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: cat._id, isFeatured: !cat.isFeatured }),
      });
      setCategories((p) => p.map((c) => c._id === cat._id ? { ...c, isFeatured: !c.isFeatured } : c));
      showToast("Category updated");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to update category", "error");
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <SectionHeader title="Categories" subtitle="Manage product categories and display order"
        action={
          <div className="flex gap-2">
            <GhostBtn onClick={load}><RefreshCw className="w-3.5 h-3.5" /> Refresh</GhostBtn>
            <PrimaryBtn onClick={openCreate} color="blue"><Plus className="w-4 h-4" /> New Category</PrimaryBtn>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-gradient-to-r from-bg via-bg to-bg-subtle p-3">
        <div className="flex items-center gap-2 bg-bg border border-border rounded-xl px-3 py-2.5 w-full sm:max-w-sm focus-within:border-primary-300 focus-within:ring-4 focus-within:ring-primary-500/5 transition-all">
          <Search className="w-4 h-4 text-text-faint" />
          <input type="text" placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm text-text placeholder:text-text-faint outline-none flex-1" />
        </div>
        <div className="flex items-center gap-2 px-2 text-xs font-medium text-text-muted">
          <span className="w-2 h-2 rounded-full bg-primary-500" />
          {filtered.length} {filtered.length === 1 ? "category" : "categories"}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="animate-pulse bg-bg border border-border rounded-3xl h-80" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Grid3X3} title="No categories found" subtitle={search ? "Try another search term." : "Create your first category to organize the catalog."} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((cat, idx) => (
            <article key={cat._id} className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_24px_50px_-28px_rgba(15,23,42,0.35)]">
              <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${COVER_PALETTE[idx % COVER_PALETTE.length]}`}>
                {cat.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={cat.imageUrl} alt={cat.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute -right-10 -top-14 h-48 w-48 rounded-full border border-white/20" />
                    <div className="absolute -right-2 -top-6 h-32 w-32 rounded-full border border-white/20" />
                    <Grid3X3 className="relative h-14 w-14 text-white/85 drop-shadow-md" strokeWidth={1.2} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/20" />
                <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                  <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    Order {String(cat.order).padStart(2, "0")}
                  </span>
                  <div className="flex gap-2">
                    <button aria-label={`Edit ${cat.title}`} onClick={() => openEdit(cat)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:bg-white hover:text-text">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button aria-label={`Delete ${cat.title}`} onClick={() => setDeleteTarget({ id: cat._id, name: cat.title })} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:border-danger hover:bg-danger hover:text-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-xl font-bold text-white shadow-lg backdrop-blur-md">
                      {cat.icon || <Grid3X3 className="h-5 w-5" />}
                    </div>
                    <h3 className="truncate text-xl font-black tracking-tight text-white drop-shadow">{cat.title}</h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/25 bg-black/25 px-2.5 py-1.5 text-white backdrop-blur-md">
                    <Package className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold">{cat.productCount ?? 0}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="truncate font-mono text-xs font-medium text-text-faint">/{cat.slug}</p>
                <p className="mt-2 min-h-10 text-sm leading-5 text-text-muted line-clamp-2">
                  {cat.description || "A curated collection of products in this category."}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <button onClick={() => toggleFeatured(cat)} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${cat.isFeatured ? "bg-success-bg text-success hover:bg-success/10" : "bg-bg-subtle text-text-faint hover:bg-bg-muted"}`}>
                    {cat.isFeatured ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    {cat.isFeatured ? "Visible on homepage" : "Hidden from homepage"}
                  </button>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-faint">Category</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ──────────────────────────────── */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? "Edit Category" : "New Category"}
        footer={
          <div className="flex justify-end gap-3">
            <GhostBtn onClick={() => setShowModal(false)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleSave} loading={saving} color="blue">{editId ? "Save Changes" : "Create Category"}</PrimaryBtn>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Category image */}
          <ImageUpload
            label="Category Image"
            value={form.imageUrl}
            aspectRatio="16/7"
            onChange={(r) => setForm((f) => ({ ...f, imageUrl: r?.url ?? "", imageRef: r?.assetRef ?? null }))}
          />

          <FormField label="Category Name" required>
            <input type="text" value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))}
              placeholder="e.g. Smartphones" className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Slug" required>
              <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} className={`${inputCls} font-mono`} />
            </FormField>
            <FormField label="Icon (emoji or name)">
              <input type="text" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="📱 or Smartphone" className={inputCls} />
            </FormField>
          </div>
          <FormField label="Description">
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} className={`${inputCls} resize-none`} />
          </FormField>
          <FormField label="Display Order">
            <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 99 }))} className={inputCls} />
          </FormField>
          <Toggle checked={form.isFeatured} onChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))} label="Show in featured navigation" />
        </div>
      </Modal>

      <ConfirmDeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name={deleteTarget?.name ?? ""} loading={deleting} />
    </div>
  );
}
