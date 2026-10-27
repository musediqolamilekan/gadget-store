"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  ShoppingBag, Search, Plus, Pencil, Trash2,
  Star, AlertTriangle, CheckCircle,
  ChevronUp, ChevronDown, RefreshCw, X, Upload
} from "lucide-react";
import {
  PrimaryBtn, GhostBtn, Badge, Modal, FormField, inputCls,
  Toggle, TableSkeleton, Pagination, ConfirmDeleteModal, EmptyState, SectionHeader
} from "./AdminUI";
import ImageUpload from "./ImageUpload";
import { adminRequest } from "./adminRequest";
import { useAdminToast } from "./AdminToast";
import { useRouter } from "next/navigation";

interface AdminProduct {
  _id: string; _createdAt: string; name: string; slug: string;
  brand?: { _id: string; name: string };
  category?: { _id: string; title: string; slug: string };
  shortDescription?: string;
  price: number; discountPrice?: number; stockCount: number;
  isFeatured: boolean; isNew: boolean; isBestseller: boolean;
  rating: number; reviewCount: number;
  image?: string; imageUrl?: string; tags?: string[];
  images?: {
    _key?: string;
    url?: string;
    assetRef?: { _type: "reference"; _ref: string };
    alt?: string;
    isPrimary?: boolean;
  }[];
  specs?: { _key?: string; key: string; value: string }[];
  description?: PortableTextValue[];
  seoTitle?: string; seoDescription?: string;
}

interface Ref { _id: string; name?: string; title?: string; slug?: string }
type PortableTextValue = Record<string, unknown>;

type SortKey = "name" | "price" | "stockCount" | "rating";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 15;

// ── Helpers ───────────────────────────────────────────────────
const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
const fmtNaira = (n: number) => `₦${(n ?? 0).toLocaleString("en-NG")}`;

function StockBadge({ count }: { count: number }) {
  if (count === 0) return <Badge label="Out of stock" color="red" />;
  if (count <= 5) return <span className="flex items-center gap-1 text-xs text-warning"><AlertTriangle className="w-3 h-3" />{count}</span>;
  return <span className="flex items-center gap-1 text-xs text-success"><CheckCircle className="w-3 h-3" />{count}</span>;
}

// ── Product image slot (for multi-image upload) ──────────────
interface ImageSlot {
  id: string; // temp id for UI key
  _key?: string;
  url?: string;
  assetRef?: { _type: "reference"; _ref: string };
  alt: string;
  isPrimary: boolean;
}

const emptyForm = () => ({
  name: "", slug: "", brandId: "", categoryId: "", shortDescription: "",
  price: "", discountPrice: "", stockCount: "0",
  isFeatured: false, isNew: false, isBestseller: false,
  rating: "0", reviewCount: "0",
  tags: [] as string[], tagInput: "",
  seoTitle: "", seoDescription: "",
  description: "", descriptionBlocks: [] as PortableTextValue[], descriptionChanged: false,
  specs: [] as { key: string; value: string }[],
  images: [] as ImageSlot[],
});

const portableTextToText = (blocks: PortableTextValue[] = []) =>
  blocks
    .filter((block) => block._type === "block")
    .map((block) => {
      const children = block.children;
      return Array.isArray(children)
        ? children.map((child) =>
            child && typeof child === "object" && "text" in child
              ? String(child.text ?? "")
              : ""
          ).join("")
        : "";
    })
    .filter(Boolean)
    .join("\n\n");

const textToPortableText = (value: string): PortableTextValue[] =>
  value.split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean).map((text, index) => ({
    _type: "block",
    _key: `description${index}`,
    style: "normal",
    children: [{ _type: "span", _key: `descriptionSpan${index}`, text, marks: [] }],
    markDefs: [],
  }));

export default function AdminProductsClient() {
  const showToast = useAdminToast();
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [brands, setBrands] = useState<Ref[]>([]);
  const [categories, setCategories] = useState<Ref[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStock, setFilterStock] = useState<"all" | "in" | "low" | "out">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [prod, br, cat] = await Promise.all([
        adminRequest<{ data: AdminProduct[] }>("/api/admin/products"),
        adminRequest<{ data: Ref[] }>("/api/admin/brands"),
        adminRequest<{ data: Ref[] }>("/api/admin/categories"),
      ]);
      setProducts(prod.data ?? []);
      setBrands(br.data ?? []);
      setCategories(cat.data ?? []);
    } catch (error) {
      console.error("Failed to load admin product data:", error);
      showToast(error instanceof Error ? error.message : "Could not load products", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const list = [...products].filter((p) => {
      const s = search.toLowerCase();
      const matchS = !search || p.name.toLowerCase().includes(s) || p.brand?.name?.toLowerCase().includes(s);
      const matchC = !filterCat || p.category?.title === filterCat;
      const matchK = filterStock === "all" ? true
        : filterStock === "out" ? p.stockCount === 0
        : filterStock === "low" ? p.stockCount > 0 && p.stockCount <= 5
        : p.stockCount > 5;
      return matchS && matchC && matchK;
    });
    list.sort((a, b) => {
      const va = a[sortKey]; const vb = b[sortKey];
      return ((va < vb ? -1 : va > vb ? 1 : 0)) * (sortDir === "asc" ? 1 : -1);
    });
    return list;
  }, [products, search, filterCat, filterStock, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => { setEditId(null); setForm(emptyForm()); setShowModal(true); };
  const openEdit = (p: AdminProduct) => {
    setEditId(p._id);
    setForm({
      ...emptyForm(),
      name: p.name, slug: p.slug,
      brandId: p.brand?._id ?? "", categoryId: p.category?._id ?? "",
      shortDescription: p.shortDescription ?? "",
      price: String(p.price), discountPrice: p.discountPrice ? String(p.discountPrice) : "",
      stockCount: String(p.stockCount),
      isFeatured: p.isFeatured, isNew: p.isNew, isBestseller: p.isBestseller,
      rating: String(p.rating), reviewCount: String(p.reviewCount),
      tags: p.tags ?? [],
      description: portableTextToText(p.description),
      descriptionBlocks: p.description ?? [],
      descriptionChanged: false,
      specs: (p.specs ?? []).map(({ key, value }) => ({ key, value })),
      seoTitle: p.seoTitle ?? "",
      seoDescription: p.seoDescription ?? "",
      images: (p.images ?? []).map((image, index) => ({
        id: image._key ?? `existing-${index}`,
        _key: image._key,
        url: image.url,
        assetRef: image.assetRef,
        alt: image.alt ?? "",
        isPrimary: image.isPrimary ?? false,
      })),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.brandId || !form.categoryId || !form.shortDescription || !form.price || !form.description.trim() || !form.images.length || form.images.some((image) => !image.assetRef)) {
      alert("Name, slug, brand, category, short description, price, description, and an uploaded image are required"); return;
    }
    setSaving(true);
    try {
      // Build Sanity images array
      const primaryIndex = Math.max(0, form.images.findIndex((img) => img.isPrimary));
      const sanityImages = form.images.map((img, idx) => ({
          _type: "object",
            _key: img._key ?? `img${idx}`,
            image: { _type: "image", asset: img.assetRef },
            alt: img.alt || form.name,
            isPrimary: idx === primaryIndex,
      }));

      // Build specs array
      const sanitySpecs = form.specs.filter((s) => s.key && s.value).map((s, i) => ({
        _type: "object", _key: `spec${i}`, key: s.key, value: s.value,
      }));

      const payload = {
        name: form.name,
        slug: form.slug,
        brandId: form.brandId,
        categoryId: form.categoryId,
        shortDescription: form.shortDescription,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
        stockCount: Number(form.stockCount),
        isFeatured: form.isFeatured,
        isNew: form.isNew,
        isBestseller: form.isBestseller,
        rating: Number(form.rating),
        reviewCount: Number(form.reviewCount),
        tags: form.tags,
        images: sanityImages,
        specs: sanitySpecs,
        description: form.descriptionChanged
          ? textToPortableText(form.description)
          : form.descriptionBlocks,
        seoTitle: form.seoTitle || null,
        seoDescription: form.seoDescription || null,
      };

      if (editId) {
        await adminRequest("/api/admin/products", {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id: editId,
            name: form.name,
            slug: { _type: "slug", current: form.slug },
            brand: { _type: "reference", _ref: form.brandId },
            category: { _type: "reference", _ref: form.categoryId },
            shortDescription: form.shortDescription,
            price: Number(form.price),
            discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
            stockCount: Number(form.stockCount),
            isFeatured: form.isFeatured, isNew: form.isNew, isBestseller: form.isBestseller,
            rating: Number(form.rating), reviewCount: Number(form.reviewCount),
            tags: form.tags,
            images: sanityImages,
            specs: sanitySpecs,
            description: payload.description,
            seoTitle: payload.seoTitle,
            seoDescription: payload.seoDescription,
          }),
        });
      } else {
        await adminRequest("/api/admin/products", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await load();
      router.refresh();
      setShowModal(false);
      showToast(editId ? "Product changes saved" : "Product created");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save product", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminRequest("/api/admin/products", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: deleteTarget.id }),
      });
      setProducts((p) => p.filter((x) => x._id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast("Product deleted");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to delete product", "error");
    } finally { setDeleting(false); }
  };

  const toggleFlag = async (id: string, flag: "isFeatured" | "isNew" | "isBestseller", cur: boolean) => {
    try {
      await adminRequest("/api/admin/products", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, [flag]: !cur }),
      });
      setProducts((p) => p.map((x) => x._id === id ? { ...x, [flag]: !cur } : x));
      showToast("Product updated");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to update product", "error");
    }
  };

  const handleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
    setPage(1);
  };

  const addImageSlot = () => {
    setForm((f) => ({
      ...f,
      images: [...f.images, { id: `img-${Date.now()}`, alt: "", isPrimary: f.images.length === 0 }],
    }));
  };

  const updateImageSlot = (id: string, patch: Partial<ImageSlot>) => {
    setForm((f) => ({ ...f, images: f.images.map((img) => img.id === id ? { ...img, ...patch } : img) }));
  };

  const removeImageSlot = (id: string) => {
    setForm((f) => {
      const imgs = f.images.filter((img) => img.id !== id);
      // ensure one primary
      if (imgs.length > 0 && !imgs.some((i) => i.isPrimary)) imgs[0].isPrimary = true;
      return { ...f, images: imgs };
    });
  };

  const setPrimary = (id: string) => {
    setForm((f) => ({ ...f, images: f.images.map((img) => ({ ...img, isPrimary: img.id === id })) }));
  };

  const addTag = () => {
    const t = form.tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t], tagInput: "" }));
    else setForm((f) => ({ ...f, tagInput: "" }));
  };

  const addSpec = () => setForm((f) => ({ ...f, specs: [...f.specs, { key: "", value: "" }] }));
  const updateSpec = (i: number, field: "key" | "value", val: string) => {
    setForm((f) => { const s = [...f.specs]; s[i] = { ...s[i], [field]: val }; return { ...f, specs: s }; });
  };
  const removeSpec = (i: number) => setForm((f) => ({ ...f, specs: f.specs.filter((_, idx) => idx !== i) }));

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
    : <span className="w-3 h-3 opacity-0" />;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <SectionHeader title="Products" subtitle={`${products.length} products`}
        action={
          <div className="flex gap-2">
            <GhostBtn onClick={load}><RefreshCw className="w-3.5 h-3.5" /> Refresh</GhostBtn>
            <PrimaryBtn onClick={openCreate}><Plus className="w-4 h-4" /> New Product</PrimaryBtn>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-bg border border-border rounded-xl px-3 py-2 flex-1 min-w-48 max-w-xs">
          <Search className="w-3.5 h-3.5 text-text-faint flex-shrink-0" />
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="bg-transparent text-sm text-text placeholder:text-text-faint outline-none flex-1" />
        </div>
        <select value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }} className="bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text-muted outline-none">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c.title ?? c.name}>{c.title ?? c.name}</option>)}
        </select>
        <select value={filterStock} onChange={(e) => { setFilterStock(e.target.value as typeof filterStock); setPage(1); }} className="bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text-muted outline-none">
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock (≤5)</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-bg border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                <th className="text-left px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">Product <SortIcon k="name" /></div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider">Brand / Cat</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider cursor-pointer" onClick={() => handleSort("price")}>
                  <div className="flex items-center gap-1">Price <SortIcon k="price" /></div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider cursor-pointer" onClick={() => handleSort("stockCount")}>
                  <div className="flex items-center gap-1">Stock <SortIcon k="stockCount" /></div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider">Flags</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <TableSkeleton rows={8} cols={6} />
              ) : paged.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={ShoppingBag} title="No products found" /></td></tr>
              ) : (
                paged.map((product) => (
                  <tr key={product._id} className="hover:bg-bg-subtle transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-bg-muted overflow-hidden flex-shrink-0">
                          {(product.image || product.imageUrl)
                            ? <img src={product.image ?? product.imageUrl} alt={product.name} className="w-full h-full object-cover" /> // eslint-disable-line
                            : <ShoppingBag className="w-4 h-4 text-text-faint m-auto mt-3" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-text truncate max-w-[180px]">{product.name}</p>
                          <p className="text-xs text-text-faint font-mono truncate max-w-[180px]">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-text font-medium">{product.brand?.name ?? "—"}</p>
                      <p className="text-xs text-text-faint">{product.category?.title ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-text text-xs">{fmtNaira(product.discountPrice ?? product.price)}</p>
                      {product.discountPrice && <p className="text-[11px] text-text-faint line-through">{fmtNaira(product.price)}</p>}
                    </td>
                    <td className="px-4 py-3"><StockBadge count={product.stockCount} /></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {product.isFeatured && <Badge label="Featured" color="amber" />}
                        {product.isNew && <Badge label="New" color="green" />}
                        {product.isBestseller && <Badge label="Bestseller" color="violet" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(product)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-primary-600 hover:bg-primary-50 transition-all" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => toggleFlag(product._id, "isFeatured", product.isFeatured)} className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all ${product.isFeatured ? "border-warning/30 bg-warning-bg text-warning" : "border-border text-text-faint hover:text-warning hover:bg-warning-bg"}`} title="Toggle featured">
                          <Star className={`w-3.5 h-3.5 ${product.isFeatured ? "fill-warning" : ""}`} />
                        </button>
                        <button onClick={() => setDeleteTarget({ id: product._id, name: product.name })} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-danger hover:border-danger/30 hover:bg-danger-bg transition-all" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </div>

      {/* ── Create / Edit Modal ──────────────────────────────── */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? "Edit Product" : "New Product"}
        size="wide"
        footer={
          <div className="flex justify-end gap-3">
            <GhostBtn onClick={() => setShowModal(false)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleSave} loading={saving}>{editId ? "Save Changes" : "Create Product"}</PrimaryBtn>
          </div>
        }
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* ── Product Images ─────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-text-muted">Product Images</p>
              <button type="button" onClick={addImageSlot} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border text-text-muted hover:bg-bg-subtle transition-all">
                <Upload className="w-3 h-3" /> Add Image
              </button>
            </div>
            {form.images.length === 0 && (
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary-300 transition-all" onClick={addImageSlot}>
                <Upload className="w-6 h-6 text-text-faint mx-auto mb-1" />
                <p className="text-xs text-text-faint">Click to add product images</p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {form.images.map((img, idx) => (
                <div key={img.id} className={`relative border-2 rounded-xl overflow-hidden transition-all ${img.isPrimary ? "border-primary-400" : "border-border"}`}>
                  <ImageUpload
                    label=""
                    value={img.url}
                    aspectRatio="1/1"
                    onChange={(r) => updateImageSlot(img.id, { url: r?.url, assetRef: r?.assetRef ?? undefined })}
                  />
                  <div className="p-2 space-y-1.5">
                    <input type="text" placeholder="Alt text" value={img.alt}
                      onChange={(e) => updateImageSlot(img.id, { alt: e.target.value })}
                      className="w-full text-xs bg-bg-subtle border border-border rounded-lg px-2 py-1 outline-none text-text placeholder:text-text-faint" />
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => setPrimary(img.id)}
                        className={`text-[11px] px-2 py-0.5 rounded-full transition-all ${img.isPrimary ? "bg-primary-50 text-primary-600 font-semibold" : "text-text-faint hover:text-primary-600"}`}>
                        {img.isPrimary ? "✓ Primary" : "Set primary"}
                      </button>
                      <button type="button" onClick={() => removeImageSlot(img.id)} className="text-text-faint hover:text-danger transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {idx === 0 && <div className="absolute top-1 left-1 bg-primary-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">#1</div>}
                </div>
              ))}
            </div>
          </div>

          {/* ── Basic Info ─────────────────────────────────── */}
          <div className="border border-border rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-text-faint uppercase tracking-wider">Basic Info</p>
            <FormField label="Product Name" required>
              <input type="text" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))}
                placeholder="e.g. iPhone 15 Pro Max" className={inputCls} />
            </FormField>
            <FormField label="Slug" required>
              <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} className={`${inputCls} font-mono text-xs`} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Brand" required>
                <select value={form.brandId} onChange={(e) => setForm((f) => ({ ...f, brandId: e.target.value }))} className={`${inputCls} cursor-pointer`}>
                  <option value="">Select brand…</option>
                  {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </FormField>
              <FormField label="Category" required>
                <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} className={`${inputCls} cursor-pointer`}>
                  <option value="">Select category…</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.title ?? c.name}</option>)}
                </select>
              </FormField>
            </div>
            <FormField label="Short Description (max 120 chars)" required>
              <input type="text" value={form.shortDescription} maxLength={120}
                onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
                placeholder={'e.g. 6.7" AMOLED · A18 Pro · 200MP'} className={inputCls} />
            </FormField>
            <FormField label="Full Description" required>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value, descriptionChanged: true }))}
                rows={6}
                placeholder="Write the full product description. Separate paragraphs with a blank line."
                className={`${inputCls} resize-y`}
              />
            </FormField>
          </div>

          {/* ── Pricing & Stock ─────────────────────────────── */}
          <div className="border border-border rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-text-faint uppercase tracking-wider">Pricing & Stock</p>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Price (₦)" required>
                <input type="number" value={form.price} min={0} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={inputCls} />
              </FormField>
              <FormField label="Discount Price (₦)">
                <input type="number" value={form.discountPrice} min={0} onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))} placeholder="Leave blank for none" className={inputCls} />
              </FormField>
              <FormField label="Stock Count">
                <input type="number" value={form.stockCount} min={0} onChange={(e) => setForm((f) => ({ ...f, stockCount: e.target.value }))} className={inputCls} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Rating (0–5)">
                <input type="number" value={form.rating} min={0} max={5} step={0.1} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className={inputCls} />
              </FormField>
              <FormField label="Review Count">
                <input type="number" value={form.reviewCount} min={0} onChange={(e) => setForm((f) => ({ ...f, reviewCount: e.target.value }))} className={inputCls} />
              </FormField>
            </div>
            <div className="flex flex-wrap gap-4">
              <Toggle checked={form.isFeatured} onChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))} label="Featured" />
              <Toggle checked={form.isNew} onChange={(v) => setForm((f) => ({ ...f, isNew: v }))} label="New Arrival" />
              <Toggle checked={form.isBestseller} onChange={(v) => setForm((f) => ({ ...f, isBestseller: v }))} label="Bestseller" />
            </div>
          </div>

          {/* ── Tags ────────────────────────────────────────── */}
          <FormField label="Tags">
            <div className="flex gap-2">
              <input type="text" value={form.tagInput}
                onChange={(e) => setForm((f) => ({ ...f, tagInput: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                placeholder="Type tag + Enter" className={`${inputCls} flex-1`} />
              <button type="button" onClick={addTag} className="px-3 py-2 rounded-xl border border-border text-sm text-text-muted hover:bg-bg-subtle transition-all">Add</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map((t) => (
                  <span key={t} className="flex items-center gap-1 text-xs bg-bg-muted text-text-muted px-2 py-0.5 rounded-full">
                    {t}
                    <button type="button" onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))} className="text-text-faint hover:text-danger"><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
              </div>
            )}
          </FormField>

          {/* ── Specifications ──────────────────────────────── */}
          <div className="border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-text-faint uppercase tracking-wider">Specifications</p>
              <button type="button" onClick={addSpec} className="text-xs px-3 py-1.5 rounded-lg border border-border text-text-muted hover:bg-bg-subtle transition-all">+ Add Row</button>
            </div>
            {form.specs.map((spec, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" value={spec.key} onChange={(e) => updateSpec(i, "key", e.target.value)} placeholder="e.g. Display" className={`${inputCls} flex-1`} />
                <input type="text" value={spec.value} onChange={(e) => updateSpec(i, "value", e.target.value)} placeholder="e.g. 6.7&quot; AMOLED 120Hz" className={`${inputCls} flex-1`} />
                <button type="button" onClick={() => removeSpec(i)} className="text-text-faint hover:text-danger flex-shrink-0"><X className="w-4 h-4" /></button>
              </div>
            ))}
            {form.specs.length === 0 && <p className="text-xs text-text-faint text-center py-2">No specs added yet</p>}
          </div>

          {/* ── SEO ─────────────────────────────────────────── */}
          <div className="border border-border rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-text-faint uppercase tracking-wider">SEO (optional)</p>
            <FormField label="SEO Title (max 60 chars)">
              <input type="text" value={form.seoTitle} maxLength={60} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} placeholder="Defaults to product name" className={inputCls} />
            </FormField>
            <FormField label="SEO Description (max 160 chars)">
              <textarea value={form.seoDescription} maxLength={160} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} rows={2} placeholder="Defaults to short description" className={`${inputCls} resize-none`} />
            </FormField>
          </div>
        </div>

      </Modal>

      <ConfirmDeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name={deleteTarget?.name ?? ""} loading={deleting} />
    </div>
  );
}
