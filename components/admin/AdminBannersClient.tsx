"use client";

import { useCallback, useEffect, useState } from "react";
import { Image as ImageIcon, Plus, Pencil, Trash2, RefreshCw, ToggleLeft, ToggleRight, ArrowUpDown } from "lucide-react";
import {
  PrimaryBtn, GhostBtn, Modal, FormField, inputCls, Toggle,
  ConfirmDeleteModal, EmptyState, SectionHeader, Badge
} from "./AdminUI";
import ImageUpload from "./ImageUpload";
import { adminRequest } from "./adminRequest";
import { useAdminToast } from "./AdminToast";

interface AdminBanner {
  _id: string; title: string; subtitle?: string; badgeText?: string;
  ctaLabel: string; ctaHref: string; accentColor: string;
  isActive: boolean; order: number; imageUrl?: string;
  imageAssetRef?: { _type: "reference"; _ref: string } | null;
}

const emptyForm = {
  title: "", subtitle: "", badgeText: "", ctaLabel: "Shop Now",
  ctaHref: "", accentColor: "cyan", isActive: true, order: 1,
  imageUrl: "" as string | undefined,
  imageRef: null as { _type: "reference"; _ref: string } | null,
};

const ACCENT_COLORS = [
  { label: "Cyan",   value: "cyan",   cls: "bg-cyan-50 border-cyan-200 text-cyan-600"       },
  { label: "Violet", value: "violet", cls: "bg-violet-50 border-violet-200 text-violet-600" },
  { label: "Amber",  value: "amber",  cls: "bg-amber-50 border-amber-200 text-warning"      },
  { label: "Rose",   value: "rose",   cls: "bg-rose-50 border-rose-200 text-rose-500"        },
];

const ACCENT_DOT: Record<string, string> = {
  cyan: "bg-cyan-500", violet: "bg-violet-500", amber: "bg-warning", rose: "bg-rose-500",
};

export default function AdminBannersClient() {
  const showToast = useAdminToast();
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminRequest<{ data: AdminBanner[] }>("/api/admin/banners");
      setBanners(result.data ?? []);
    } catch (error) {
      console.error("Failed to load admin banners:", error);
      showToast(error instanceof Error ? error.message : "Could not load banners", "error");
    } finally { setLoading(false); }
  }, [showToast]);
  useEffect(() => { void load(); }, [load]);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (b: AdminBanner) => {
    setEditId(b._id);
    setForm({
      title: b.title, subtitle: b.subtitle ?? "", badgeText: b.badgeText ?? "",
      ctaLabel: b.ctaLabel, ctaHref: b.ctaHref, accentColor: b.accentColor,
      isActive: b.isActive, order: b.order,
      imageUrl: b.imageUrl ?? "", imageRef: b.imageAssetRef ?? null,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.ctaHref) { alert("Headline and button link are required"); return; }
    setSaving(true);
    try {
      // Build image patch object for Sanity
      const imageField = form.imageUrl && form.imageRef
        ? { image: { _type: "image", asset: form.imageRef } }
        : { image: null };

      if (editId) {
        await adminRequest("/api/admin/banners", {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: editId, title: form.title, subtitle: form.subtitle,
            badgeText: form.badgeText, ctaLabel: form.ctaLabel, ctaHref: form.ctaHref,
            accentColor: form.accentColor, isActive: form.isActive, order: form.order,
            ...imageField,
          }),
        });
      } else {
        await adminRequest("/api/admin/banners", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title, subtitle: form.subtitle, badgeText: form.badgeText,
            ctaLabel: form.ctaLabel, ctaHref: form.ctaHref, accentColor: form.accentColor,
            isActive: form.isActive, order: form.order,
            ...imageField,
          }),
        });
      }
      await load();
      setShowModal(false);
      showToast(editId ? "Banner changes saved" : "Banner created");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save banner", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminRequest("/api/admin/banners", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: deleteTarget.id }),
      });
      setBanners((p) => p.filter((b) => b._id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast("Banner deleted");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to delete banner", "error");
    } finally { setDeleting(false); }
  };

  const toggleActive = async (b: AdminBanner) => {
    try {
      await adminRequest("/api/admin/banners", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: b._id, isActive: !b.isActive }),
      });
      setBanners((p) => p.map((x) => x._id === b._id ? { ...x, isActive: !x.isActive } : x));
      showToast("Banner updated");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to update banner", "error");
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <SectionHeader title="Promotional Banners"
        subtitle={`${banners.length} banners · ${banners.filter((b) => b.isActive).length} active`}
        action={
          <div className="flex gap-2">
            <GhostBtn onClick={load}><RefreshCw className="w-3.5 h-3.5" /> Refresh</GhostBtn>
            <PrimaryBtn onClick={openCreate} color="red"><Plus className="w-4 h-4" /> New Banner</PrimaryBtn>
          </div>
        }
      />

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="animate-pulse bg-bg border border-border rounded-2xl h-24" />)}</div>
      ) : banners.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No banners yet" subtitle="Create your first promotional banner" />
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => {
            const dot = ACCENT_DOT[banner.accentColor] ?? "bg-primary-500";
            return (
              <div key={banner._id} className="group bg-bg border border-border rounded-2xl overflow-hidden hover:shadow-sm hover:border-border-strong transition-all duration-200">
                <div className="flex items-center gap-4 p-4">
                  {/* Image thumb */}
                  <div className="w-16 h-12 rounded-lg bg-bg-muted overflow-hidden flex-shrink-0">
                    {banner.imageUrl
                      ? <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" /> // eslint-disable-line
                      : <ImageIcon className="w-5 h-5 text-text-faint m-auto mt-3.5" />}
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 text-text-faint">
                    <ArrowUpDown className="w-3 h-3" />
                    <span className="text-[10px] font-bold">#{banner.order}</span>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {banner.badgeText && <span className="text-[10px] bg-bg-muted text-text-faint px-1.5 py-0.5 rounded-full">{banner.badgeText}</span>}
                      <Badge label={banner.isActive ? "Active" : "Inactive"} color={banner.isActive ? "green" : "gray"} />
                    </div>
                    <p className="font-bold text-text">{banner.title}</p>
                    {banner.subtitle && <p className="text-xs text-text-muted truncate">{banner.subtitle}</p>}
                    <p className="text-xs text-text-faint mt-1 font-mono">{banner.ctaLabel} → {banner.ctaHref}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => toggleActive(banner)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${banner.isActive ? "border-success/30 bg-success-bg text-success hover:opacity-80" : "border-border bg-bg-subtle text-text-muted hover:bg-bg-muted"}`}>
                      {banner.isActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                      {banner.isActive ? "On" : "Off"}
                    </button>
                    <button onClick={() => openEdit(banner)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-text hover:bg-bg-subtle transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget({ id: banner._id, name: banner.title })} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-danger hover:border-danger/30 hover:bg-danger-bg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create / Edit Modal ──────────────────────────────── */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? "Edit Banner" : "New Banner"}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <GhostBtn onClick={() => setShowModal(false)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleSave} loading={saving} color="red">{editId ? "Save Changes" : "Create Banner"}</PrimaryBtn>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Image */}
          <ImageUpload
            label="Background / Hero Image"
            value={form.imageUrl}
            aspectRatio="16/6"
            onChange={(r) => setForm((f) => ({ ...f, imageUrl: r?.url ?? "", imageRef: r?.assetRef ?? null }))}
          />

          <FormField label="Headline" required>
            <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. The Future of Sound" className={inputCls} />
          </FormField>
          <FormField label="Subtitle">
            <input type="text" value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} placeholder="Supporting description" className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Badge Text">
              <input type="text" value={form.badgeText} onChange={(e) => setForm((f) => ({ ...f, badgeText: e.target.value }))} placeholder="Limited Time Offer" className={inputCls} />
            </FormField>
            <FormField label="Display Order">
              <input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 1 }))} className={inputCls} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Button Label">
              <input type="text" value={form.ctaLabel} onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))} placeholder="Shop Now" className={inputCls} />
            </FormField>
            <FormField label="Button Link" required>
              <input type="text" value={form.ctaHref} onChange={(e) => setForm((f) => ({ ...f, ctaHref: e.target.value }))} placeholder="/products?category=phones" className={`${inputCls} font-mono`} />
            </FormField>
          </div>
          <FormField label="Accent Color">
            <div className="flex gap-2">
              {ACCENT_COLORS.map(({ label, value, cls }) => (
                <button key={value} type="button" onClick={() => setForm((f) => ({ ...f, accentColor: value }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${form.accentColor === value ? cls : "border-border text-text-muted bg-bg hover:bg-bg-subtle"}`}>
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${ACCENT_DOT[value]}`} />{label}
                </button>
              ))}
            </div>
          </FormField>
          <Toggle checked={form.isActive} onChange={(v) => setForm((f) => ({ ...f, isActive: v }))} label="Active (show on homepage)" />
        </div>
      </Modal>

      <ConfirmDeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name={deleteTarget?.name ?? ""} loading={deleting} />
    </div>
  );
}
