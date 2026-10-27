"use client";

import { useCallback, useEffect, useState } from "react";
import { Tag, Search, Plus, Pencil, Trash2, RefreshCw, Globe, MapPin, CheckCircle, XCircle } from "lucide-react";
import {
  PrimaryBtn, GhostBtn, Modal, FormField, inputCls, Toggle,
  ConfirmDeleteModal, EmptyState, SectionHeader
} from "./AdminUI";
import ImageUpload from "./ImageUpload";
import { adminRequest } from "./adminRequest";
import { useAdminToast } from "./AdminToast";

interface AdminBrand {
  _id: string; name: string; slug: string; description?: string;
  country?: string; website?: string; isFeatured: boolean; logoUrl?: string;
  logoAssetRef?: { _type: "reference"; _ref: string } | null;
}

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const emptyForm = {
  name: "", slug: "", description: "", country: "", website: "", isFeatured: false,
  logoUrl: "" as string | undefined,
  logoRef: null as { _type: "reference"; _ref: string } | null,
};

export default function AdminBrandsClient() {
  const showToast = useAdminToast();
  const [brands, setBrands] = useState<AdminBrand[]>([]);
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
      const result = await adminRequest<{ data: AdminBrand[] }>("/api/admin/brands");
      setBrands(result.data ?? []);
    } catch (error) {
      console.error("Failed to load admin brands:", error);
      showToast(error instanceof Error ? error.message : "Could not load brands", "error");
    } finally { setLoading(false); }
  }, [showToast]);
  useEffect(() => { void load(); }, [load]);

  const filtered = brands.filter((b) => !search || b.name.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (b: AdminBrand) => {
    setEditId(b._id);
    setForm({
      name: b.name, slug: b.slug, description: b.description ?? "",
      country: b.country ?? "", website: b.website ?? "", isFeatured: b.isFeatured,
      logoUrl: b.logoUrl ?? "", logoRef: b.logoAssetRef ?? null,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { alert("Name and slug are required"); return; }
    setSaving(true);
    try {
      const logoField = form.logoUrl && form.logoRef
        ? { logo: { _type: "image", asset: form.logoRef } }
        : { logo: null };

      if (editId) {
        await adminRequest("/api/admin/brands", {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: editId,
            name: form.name, slug: { _type: "slug", current: form.slug },
            description: form.description, country: form.country,
            website: form.website, isFeatured: form.isFeatured,
            ...logoField,
          }),
        });
      } else {
        await adminRequest("/api/admin/brands", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name, slug: form.slug, description: form.description,
            country: form.country, website: form.website, isFeatured: form.isFeatured,
            ...logoField,
          }),
        });
      }
      await load();
      setShowModal(false);
      showToast(editId ? "Brand changes saved" : "Brand created");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save brand", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminRequest("/api/admin/brands", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: deleteTarget.id }),
      });
      setBrands((p) => p.filter((b) => b._id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast("Brand deleted");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to delete brand", "error");
    } finally { setDeleting(false); }
  };

  const toggleFeatured = async (b: AdminBrand) => {
    try {
      await adminRequest("/api/admin/brands", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: b._id, isFeatured: !b.isFeatured }),
      });
      setBrands((p) => p.map((x) => x._id === b._id ? { ...x, isFeatured: !x.isFeatured } : x));
      showToast("Brand updated");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to update brand", "error");
    }
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <SectionHeader title="Brands" subtitle={`${brands.length} brands registered`}
        action={
          <div className="flex gap-2">
            <GhostBtn onClick={load}><RefreshCw className="w-3.5 h-3.5" /> Refresh</GhostBtn>
            <PrimaryBtn onClick={openCreate} color="violet"><Plus className="w-4 h-4" /> New Brand</PrimaryBtn>
          </div>
        }
      />

      <div className="flex items-center gap-2 bg-bg border border-border rounded-xl px-3 py-2 max-w-xs">
        <Search className="w-3.5 h-3.5 text-text-faint" />
        <input type="text" placeholder="Search brands..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm text-text placeholder:text-text-faint outline-none flex-1" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="animate-pulse bg-bg border border-border rounded-2xl h-36" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Tag} title="No brands found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((brand) => (
            <div key={brand._id} className="group bg-bg border border-border rounded-2xl p-4 hover:shadow-md hover:border-border-strong transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-bg-muted overflow-hidden flex items-center justify-center flex-shrink-0 border border-border">
                  {brand.logoUrl
                    ? <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain p-1" /> // eslint-disable-line
                    : <Tag className="w-5 h-5 text-text-faint" />}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(brand)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-text hover:bg-bg-subtle transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteTarget({ id: brand._id, name: brand.name })} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-danger hover:border-danger/30 hover:bg-danger-bg transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-text">{brand.name}</h3>
              <p className="text-xs text-text-faint font-mono mt-0.5">{brand.slug}</p>
              {brand.description && <p className="text-xs text-text-muted mt-1 line-clamp-2">{brand.description}</p>}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {brand.country && <span className="flex items-center gap-1 text-xs text-text-faint"><MapPin className="w-3 h-3" />{brand.country}</span>}
                {brand.website && <a href={brand.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary-500 hover:underline"><Globe className="w-3 h-3" />Site</a>}
              </div>
              <button onClick={() => toggleFeatured(brand)} className={`mt-3 flex items-center gap-1.5 text-xs px-2 py-1 rounded-full transition-all ${brand.isFeatured ? "bg-primary-50 text-primary-600" : "bg-bg-muted text-text-faint hover:bg-bg-subtle"}`}>
                {brand.isFeatured ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {brand.isFeatured ? "Featured" : "Not Featured"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ──────────────────────────────── */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? "Edit Brand" : "New Brand"}
        footer={
          <div className="flex justify-end gap-3">
            <GhostBtn onClick={() => setShowModal(false)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleSave} loading={saving} color="violet">{editId ? "Save Changes" : "Create Brand"}</PrimaryBtn>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Logo upload */}
          <ImageUpload
            label="Brand Logo"
            value={form.logoUrl}
            aspectRatio="1/1"
            onChange={(r) => setForm((f) => ({ ...f, logoUrl: r?.url ?? "", logoRef: r?.assetRef ?? null }))}
          />

          <FormField label="Brand Name" required>
            <input type="text" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))}
              placeholder="e.g. Apple" className={inputCls} />
          </FormField>
          <FormField label="Slug" required>
            <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} className={`${inputCls} font-mono`} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Country">
              <input type="text" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} placeholder="Nigeria" className={inputCls} />
            </FormField>
            <FormField label="Website">
              <input type="url" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://..." className={inputCls} />
            </FormField>
          </div>
          <FormField label="Description">
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className={`${inputCls} resize-none`} />
          </FormField>
          <Toggle checked={form.isFeatured} onChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))} label="Featured Brand" />
        </div>
      </Modal>

      <ConfirmDeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name={deleteTarget?.name ?? ""} loading={deleting} />
    </div>
  );
}
