"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  FileText, Search, Plus, Pencil, Trash2, RefreshCw,
  Star, Clock, ChevronUp, ChevronDown, X
} from "lucide-react";
import {
  PrimaryBtn, GhostBtn, Badge, Modal, FormField, inputCls, Toggle,
  TableSkeleton, Pagination, ConfirmDeleteModal, EmptyState, SectionHeader
} from "./AdminUI";
import ImageUpload from "./ImageUpload";
import { adminRequest } from "./adminRequest";
import { useAdminToast } from "./AdminToast";
import { useRouter } from "next/navigation";

interface AdminPost {
  _id: string; _createdAt: string; _updatedAt: string;
  title: string; slug: string; excerpt: string; category: string;
  tags: string[]; author: string; publishedAt: string;
  featured: boolean; readingTime: number;
  coverImage?: {
    url: string;
    alt: string;
    assetRef?: { _type: "reference"; _ref: string } | null;
  } | null;
  body?: PortableTextValue[];
  seoTitle?: string; seoDescription?: string;
}
type PortableTextValue = Record<string, unknown>;

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
    _key: `paragraph${index}`,
    style: "normal",
    children: [{ _type: "span", _key: `span${index}`, text, marks: [] }],
    markDefs: [],
  }));

const CATS: Record<string, string> = {
  "phone-reviews": "Phone Reviews", "laptop-reviews": "Laptop Reviews",
  "buying-guides": "Buying Guides", "tips-tricks": "Tips & Tricks",
  "comparisons": "Comparisons", "news-deals": "News & Deals", "accessories": "Accessories",
};
const CAT_COLORS: Record<string, "blue" | "violet" | "green" | "amber" | "cyan" | "orange" | "gray"> = {
  "phone-reviews": "blue", "laptop-reviews": "violet", "buying-guides": "green",
  "tips-tricks": "amber", "comparisons": "cyan", "news-deals": "orange", "accessories": "gray",
};

type SortKey = "title" | "publishedAt" | "readingTime";
const PAGE_SIZE = 12;

// ── Slug helper ──────────────────────────────────────────────────
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

// ── Empty form ───────────────────────────────────────────────────
const emptyForm = () => ({
  title: "", slug: "", excerpt: "", category: "phone-reviews",
  author: "HolarzGadgets Team", publishedAt: new Date().toISOString().slice(0, 16),
  featured: false, readingTime: 5,
  seoTitle: "", seoDescription: "",
  tags: [] as string[], tagInput: "",
  coverImageUrl: "" as string | undefined,
  coverImageRef: null as { _type: "reference"; _ref: string } | null,
  coverImageAlt: "",
  body: "",
  bodyBlocks: [] as PortableTextValue[],
  bodyChanged: false,
});

export default function AdminPostsClient() {
  const showToast = useAdminToast();
  const router = useRouter();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("publishedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminRequest<{ data: AdminPost[] }>("/api/admin/posts");
      setPosts(result.data ?? []);
    } catch (error) {
      console.error("Failed to load admin posts:", error);
      showToast(error instanceof Error ? error.message : "Could not load blog posts", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const list = [...posts].filter((p) => {
      const s = search.toLowerCase();
      return (!search || p.title.toLowerCase().includes(s) || p.author?.toLowerCase().includes(s)) &&
        (!filterCat || p.category === filterCat) &&
        (!filterFeatured || p.featured);
    });
    list.sort((a, b) => {
      const va = a[sortKey] ?? ""; const vb = b[sortKey] ?? "";
      return (va < vb ? -1 : va > vb ? 1 : 0) * (sortDir === "asc" ? 1 : -1);
    });
    return list;
  }, [posts, search, filterCat, filterFeatured, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
    setPage(1);
  };

  const openCreate = () => { setEditId(null); setForm(emptyForm()); setShowModal(true); };
  const openEdit = (post: AdminPost) => {
    setEditId(post._id);
    setForm({
      ...emptyForm(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      category: post.category ?? "phone-reviews",
      author: post.author ?? "HolarzGadgets Team",
      publishedAt: post.publishedAt ? post.publishedAt.slice(0, 16) : new Date().toISOString().slice(0, 16),
      featured: post.featured ?? false,
      readingTime: post.readingTime ?? 5,
      tags: post.tags ?? [],
      seoTitle: post.seoTitle ?? "",
      seoDescription: post.seoDescription ?? "",
      coverImageUrl: post.coverImage?.url ?? "",
      coverImageRef: post.coverImage?.assetRef ?? null,
      coverImageAlt: post.coverImage?.alt ?? "",
      body: portableTextToText(post.body),
      bodyBlocks: post.body ?? [],
      bodyChanged: false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || form.title.length < 10 || !form.slug || !form.excerpt || !form.category || !form.body.trim()) {
      alert("A title of at least 10 characters, slug, excerpt, category, and article body are required"); return;
    }
    setSaving(true);
    try {
      // Convert plain body text to portable-text block array for Sanity
      const bodyBlocks = form.bodyChanged
        ? textToPortableText(form.body)
        : form.bodyBlocks;

      const coverImageField = form.coverImageRef
        ? {
            coverImage: {
              _type: "image",
              asset: form.coverImageRef,
              alt: form.coverImageAlt || form.title,
            },
          }
        : form.coverImageUrl
        ? {}
        : { coverImage: null };

      const payload = {
        title: form.title,
        slug: { _type: "slug", current: form.slug },
        excerpt: form.excerpt,
        category: form.category,
        author: form.author,
        publishedAt: new Date(form.publishedAt).toISOString(),
        featured: form.featured,
        readingTime: form.readingTime,
        tags: form.tags,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        body: bodyBlocks,
        ...coverImageField,
      };

      if (editId) {
        await adminRequest("/api/admin/posts", {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editId, ...payload }),
        });
      } else {
        await adminRequest("/api/admin/posts", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await load();
      router.refresh();
      setShowModal(false);
      showToast(editId ? "Blog post changes saved" : "Blog post created");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save post", "error");
    } finally { setSaving(false); }
  };

  const handleToggleFeatured = async (post: AdminPost) => {
    setTogglingId(post._id);
    try {
      await adminRequest("/api/admin/posts", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: post._id, featured: !post.featured }),
      });
      setPosts((p) => p.map((x) => x._id === post._id ? { ...x, featured: !x.featured } : x));
      showToast("Blog post updated");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to update blog post", "error");
    } finally { setTogglingId(null); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminRequest("/api/admin/posts", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: deleteTarget.id }),
      });
      setPosts((p) => p.filter((x) => x._id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast("Blog post deleted");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to delete post", "error");
    } finally { setDeleting(false); }
  };

  const addTag = () => {
    const t = form.tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !form.tags.includes(t)) setForm((f) => ({ ...f, tags: [...f.tags, t], tagInput: "" }));
    else setForm((f) => ({ ...f, tagInput: "" }));
  };

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? (sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
    : <span className="w-3 h-3 opacity-0" />;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <SectionHeader title="Blog Posts" subtitle={`${posts.length} posts · ${posts.filter((p) => p.featured).length} featured`}
        action={
          <div className="flex gap-2">
            <GhostBtn onClick={load}><RefreshCw className="w-3.5 h-3.5" /> Refresh</GhostBtn>
            <PrimaryBtn onClick={openCreate} color="green"><Plus className="w-4 h-4" /> New Post</PrimaryBtn>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-bg border border-border rounded-xl px-3 py-2 flex-1 min-w-48 max-w-xs">
          <Search className="w-3.5 h-3.5 text-text-faint flex-shrink-0" />
          <input type="text" placeholder="Search posts..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="bg-transparent text-sm text-text placeholder:text-text-faint outline-none flex-1" />
        </div>
        <select value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }} className="bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text-muted outline-none">
          <option value="">All Categories</option>
          {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button onClick={() => setFilterFeatured((f) => !f)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all ${filterFeatured ? "border-warning/30 bg-warning-bg text-warning" : "border-border bg-bg text-text-muted hover:bg-bg-subtle"}`}>
          <Star className={`w-3.5 h-3.5 ${filterFeatured ? "fill-warning" : ""}`} /> Featured only
        </button>
      </div>

      {/* Table */}
      <div className="bg-bg border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                <th className="text-left px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider">Post</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider cursor-pointer" onClick={() => handleSort("publishedAt")}>
                  <div className="flex items-center gap-1">Published <SortIcon k="publishedAt" /></div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider cursor-pointer" onClick={() => handleSort("readingTime")}>
                  <div className="flex items-center gap-1">Read <SortIcon k="readingTime" /></div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider">Featured</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <TableSkeleton rows={6} cols={6} />
              ) : paged.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={FileText} title="No posts found" /></td></tr>
              ) : (
                paged.map((post) => (
                  <tr key={post._id} className="hover:bg-bg-subtle transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-bg-muted overflow-hidden flex-shrink-0">
                          {post.coverImage?.url
                            ? <img src={post.coverImage.url} alt={post.title} className="w-full h-full object-cover" /> // eslint-disable-line
                            : <FileText className="w-4 h-4 text-text-faint m-auto mt-2.5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-text truncate max-w-[200px]">{post.title}</p>
                          <p className="text-xs text-text-faint">{post.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <Clock className="w-3 h-3" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "Draft"}
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge label={CATS[post.category] ?? post.category} color={CAT_COLORS[post.category] ?? "gray"} /></td>
                    <td className="px-4 py-3 text-xs text-text-muted">{post.readingTime} min</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleFeatured(post)} disabled={togglingId === post._id}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-all ${post.featured ? "bg-warning-bg text-warning" : "bg-bg-muted text-text-faint hover:bg-warning-bg hover:text-warning"}`}>
                        <Star className={`w-3 h-3 ${post.featured ? "fill-warning" : ""}`} />
                        {post.featured ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(post)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-primary-600 hover:bg-primary-50 transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-text hover:bg-bg-subtle transition-all text-xs font-bold">↗</a>
                        <button onClick={() => setDeleteTarget({ id: post._id, name: post.title })} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-danger hover:border-danger/30 hover:bg-danger-bg transition-all">
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
        title={editId ? "Edit Post" : "New Blog Post"}
        size="wide"
        footer={
          <div className="flex justify-end gap-3">
            <GhostBtn onClick={() => setShowModal(false)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleSave} loading={saving} color="green">{editId ? "Save Changes" : "Publish Post"}</PrimaryBtn>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Cover Image */}
          <div className="lg:col-span-2">
            <ImageUpload
              label="Cover Image"
              value={form.coverImageUrl}
              aspectRatio="16/7"
              onChange={(r) => setForm((f) => ({ ...f, coverImageUrl: r?.url ?? "", coverImageRef: r?.assetRef ?? null }))}
            />
          </div>
          {form.coverImageUrl && (
            <FormField label="Cover Image Alt Text">
              <input type="text" value={form.coverImageAlt} onChange={(e) => setForm((f) => ({ ...f, coverImageAlt: e.target.value }))} placeholder="Describe the image for accessibility" className={inputCls} />
            </FormField>
          )}

          {/* Content */}
          <FormField label="Title" required>
            <input type="text" value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))}
              placeholder="e.g. Best Phones in Nigeria 2025" className={inputCls} />
          </FormField>
          <FormField label="Slug" required>
            <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} className={`${inputCls} font-mono text-xs`} />
          </FormField>
          <FormField label="Excerpt (max 200 chars)" required>
            <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value.slice(0, 200) }))}
              rows={3} placeholder="Short summary for listing page and SEO..." className={`${inputCls} resize-none`} />
            <p className="text-[11px] text-text-faint mt-1">{form.excerpt.length}/200</p>
          </FormField>
          <div className="lg:col-span-2">
            <FormField label="Article Body">
              <textarea value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value, bodyChanged: true }))}
                rows={8} placeholder={"Write your article here.\n\nSeparate paragraphs with a blank line."}
                className={`${inputCls} resize-y font-mono text-xs leading-relaxed`} />
              <p className="text-[11px] text-text-faint mt-1">Separate paragraphs with a blank line. Saved as formatted blocks in Sanity.</p>
            </FormField>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category" required>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={`${inputCls} cursor-pointer`}>
                {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </FormField>
            <FormField label="Author">
              <input type="text" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} className={inputCls} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Published At">
              <input type="datetime-local" value={form.publishedAt} onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="Reading Time (min)">
              <input type="number" min={1} value={form.readingTime} onChange={(e) => setForm((f) => ({ ...f, readingTime: parseInt(e.target.value) || 5 }))} className={inputCls} />
            </FormField>
          </div>

          {/* Tags */}
          <FormField label="Tags">
            <div className="flex gap-2">
              <input type="text" value={form.tagInput} onChange={(e) => setForm((f) => ({ ...f, tagInput: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                placeholder="Type tag and press Enter" className={`${inputCls} flex-1`} />
              <button type="button" onClick={addTag} className="px-3 py-2 rounded-xl border border-border text-sm text-text-muted hover:bg-bg-subtle transition-all">Add</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map((t) => (
                  <span key={t} className="flex items-center gap-1 text-xs bg-bg-muted text-text-muted px-2 py-0.5 rounded-full">
                    {t}
                    <button type="button" onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))} className="text-text-faint hover:text-danger transition-colors"><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
              </div>
            )}
          </FormField>

          <Toggle checked={form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} label="Featured Post (show prominently)" />

          {/* SEO */}
          <div className="lg:col-span-2 border border-border rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-text-faint uppercase tracking-wider">SEO (optional)</p>
            <FormField label="SEO Title (max 60 chars)">
              <input type="text" value={form.seoTitle} maxLength={60} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} placeholder="Defaults to post title" className={inputCls} />
            </FormField>
            <FormField label="SEO Description (max 160 chars)">
              <textarea value={form.seoDescription} maxLength={160} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} rows={2} placeholder="Defaults to excerpt" className={`${inputCls} resize-none`} />
            </FormField>
          </div>
        </div>

      </Modal>

      <ConfirmDeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name={deleteTarget?.name ?? ""} loading={deleting} />
    </div>
  );
}
