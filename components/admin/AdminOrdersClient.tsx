"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ShoppingCart, Search, RefreshCw, Eye,
  Package, Clock, CheckCircle, XCircle, Truck,
  DollarSign, X, Printer
} from "lucide-react";
import {
  Badge, Modal, FormField, inputCls, TableSkeleton,
  Pagination, EmptyState, GhostBtn, PrimaryBtn, SectionHeader
} from "./AdminUI";
import OrderShippingLabel from "./OrderShippingLabel";
import { adminRequest } from "./adminRequest";
import { useAdminToast } from "./AdminToast";
import { useRouter } from "next/navigation";

interface AdminOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  paystackReference?: string;
  createdAt: string;
  paidAt?: string;
  itemCount: number;
}

interface OrderDetail {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: { address: string; city: string; state: string; country: string };
  items: {
    productId?: string;
    productName: string;
    productSlug?: string;
    brand: string;
    category?: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    imageUrl?: string;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  paystackReference?: string;
  paystackTransactionId?: string;
  paidAt?: string;
  status: string;
  trackingNumber?: string;
  deliveryNote?: string;
  createdAt: string;
}

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  paystack: "Paystack",
  whatsapp: "WhatsApp / Manual",
  bank_transfer: "Bank Transfer",
};

const STATUS_CONFIG: Record<string, { color: "amber" | "green" | "blue" | "violet" | "gray" | "red" | "cyan"; icon: React.ElementType }> = {
  pending:    { color: "amber",  icon: Clock        },
  confirmed:  { color: "green",  icon: CheckCircle  },
  processing: { color: "blue",   icon: RefreshCw    },
  shipped:    { color: "violet", icon: Truck        },
  delivered:  { color: "green",  icon: Package      },
  cancelled:  { color: "red",    icon: XCircle      },
};

const PAY_CONFIG: Record<string, "green" | "red" | "amber" | "gray"> = {
  paid: "green", failed: "red", pending: "amber", refunded: "gray",
};

const fmtNaira = (n: number) => `₦${(n ?? 0).toLocaleString("en-NG")}`;
const fmtDate = (s: string) => new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
const fmtDateTime = (s: string) => new Date(s).toLocaleString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const PAGE_SIZE = 15;

export default function AdminOrdersClient() {
  const showToast = useAdminToast();
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");

  const [detailOrder, setDetailOrder] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [printOrder, setPrintOrder] = useState<OrderDetail | null>(null);
  const [printLoading, setPrintLoading] = useState(false);

  const [editStatus, setEditStatus] = useState<{
    id: string;
    status: string;
    paymentStatus: string;
    tracking: string;
    note: string;
    hasDetails: boolean;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async (p = page) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(p), limit: String(PAGE_SIZE),
      ...(filterStatus  ? { status:        filterStatus  } : {}),
      ...(filterPayment ? { paymentStatus: filterPayment } : {}),
    });
    try {
      const result = await adminRequest<{ data: AdminOrder[]; total: number }>(`/api/orders?${params}`);
      setOrders(result.data ?? []);
      setTotalCount(result.total ?? 0);
    } catch (error) {
      console.error("Failed to load orders:", error);
      showToast(error instanceof Error ? error.message : "Could not load orders", "error");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    void load(page);
    const refreshOnFocus = () => { void load(page); };
    window.addEventListener("focus", refreshOnFocus);
    return () => window.removeEventListener("focus", refreshOnFocus);
  }, [page, filterStatus, filterPayment]); // eslint-disable-line

  // Client-side search on loaded page
  const filtered = useMemo(() => {
    if (!search) return orders;
    const s = search.toLowerCase();
    return orders.filter((o) =>
      o.orderNumber.toLowerCase().includes(s) ||
      o.customerName.toLowerCase().includes(s) ||
      o.customerEmail.toLowerCase().includes(s)
    );
  }, [orders, search]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    setDetailOrder(null);
    try {
      const data = await adminRequest<{ data: OrderDetail }>(`/api/orders/${id}`);
      setDetailOrder(data.data);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to load order detail", "error");
    }
    finally { setDetailLoading(false); }
  };

  const openPrint = async (id: string) => {
    setPrintLoading(true);
    setPrintOrder(null);
    try {
      const data = await adminRequest<{ data: OrderDetail }>(`/api/orders/${id}`);
      setPrintOrder(data.data);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to load order for printing", "error");
    }
    finally { setPrintLoading(false); }
  };

  const openEditStatus = (
    order: Pick<AdminOrder, "_id" | "status" | "paymentStatus"> &
      Partial<Pick<OrderDetail, "trackingNumber" | "deliveryNote">>
  ) => {
    setEditStatus({
      id: order._id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      tracking: order.trackingNumber ?? "",
      note: order.deliveryNote ?? "",
      hasDetails: "trackingNumber" in order || "deliveryNote" in order,
    });
  };

  const handleSaveStatus = async () => {
    if (!editStatus) return;
    setSaving(true);
    try {
      const updates: {
        _id: string;
        status: string;
        paymentStatus: string;
        trackingNumber?: string | null;
        deliveryNote?: string | null;
      } = {
        _id: editStatus.id,
        status: editStatus.status,
        paymentStatus: editStatus.paymentStatus,
      };
      if (editStatus.hasDetails || editStatus.tracking) {
        updates.trackingNumber = editStatus.tracking || null;
      }
      if (editStatus.hasDetails || editStatus.note) {
        updates.deliveryNote = editStatus.note || null;
      }

      await adminRequest("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      setOrders((prev) => prev.map((o) => o._id === editStatus.id
        ? { ...o, status: editStatus.status, paymentStatus: editStatus.paymentStatus }
        : o));
      if (detailOrder?._id === editStatus.id) {
        setDetailOrder((d) => d ? {
          ...d,
          status: editStatus.status,
          paymentStatus: editStatus.paymentStatus,
          trackingNumber: editStatus.tracking || undefined,
          deliveryNote: editStatus.note || undefined,
        } : d);
      }
      await load(page);
      router.refresh();
      setEditStatus(null);
      showToast("Order updated");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to update order", "error");
    }
    finally { setSaving(false); }
  };

  // Revenue summary from current page
  const pageRevenue = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <SectionHeader
        title="Orders"
        subtitle={`${totalCount} total orders`}
        action={
          <div className="flex gap-2">
            <GhostBtn onClick={() => load(page)}><RefreshCw className="w-3.5 h-3.5" /> Refresh</GhostBtn>
          </div>
        }
      />

      {/* Revenue bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Orders", value: totalCount, color: "bg-violet-50 text-violet-600" },
          { label: "Pending",     value: orders.filter(o => o.status === "pending").length,   color: "bg-warning-bg text-warning" },
          { label: "Delivered",   value: orders.filter(o => o.status === "delivered").length, color: "bg-success-bg text-success" },
          { label: "Page Revenue",value: fmtNaira(pageRevenue), color: "bg-primary-50 text-primary-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl border border-border px-4 py-3 flex items-center gap-3 bg-bg`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${color}`}>
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-lg font-black text-text">{value}</div>
              <div className="text-xs text-text-faint">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-bg border border-border rounded-xl px-3 py-2 flex-1 min-w-48 max-w-xs">
          <Search className="w-3.5 h-3.5 text-text-faint flex-shrink-0" />
          <input type="text" placeholder="Search order, customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm text-text placeholder:text-text-faint outline-none flex-1" />
        </div>

        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text-muted outline-none cursor-pointer">
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>

        <select value={filterPayment} onChange={(e) => { setFilterPayment(e.target.value); setPage(1); }} className="bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text-muted outline-none cursor-pointer">
          <option value="">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Unpaid</option>
          <option value="failed">Failed</option>
        </select>

        {(filterStatus || filterPayment) && (
          <button onClick={() => { setFilterStatus(""); setFilterPayment(""); setPage(1); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs text-text-muted hover:bg-bg-subtle transition-all">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-bg border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                {["Order", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <TableSkeleton rows={8} cols={8} />
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}><EmptyState icon={ShoppingCart} title="No orders found" subtitle="Orders will appear here once customers place them" /></td></tr>
              ) : (
                filtered.map((order) => {
                  const StatusIcon = STATUS_CONFIG[order.status]?.icon ?? Clock;
                  return (
                    <tr key={order._id} className="hover:bg-bg-subtle transition-colors group">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-primary-600">{order.orderNumber}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-text">{order.customerName}</p>
                        <p className="text-xs text-text-faint truncate max-w-[140px]">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-text-muted text-xs">{order.itemCount} item{order.itemCount !== 1 ? "s" : ""}</td>
                      <td className="px-4 py-3 font-bold text-text">{fmtNaira(order.total)}</td>
                      <td className="px-4 py-3">
                        <Badge label={order.paymentStatus} color={PAY_CONFIG[order.paymentStatus] ?? "gray"} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <StatusIcon className="w-3 h-3 text-text-faint" />
                          <Badge label={order.status} color={STATUS_CONFIG[order.status]?.color ?? "gray"} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-faint whitespace-nowrap">{fmtDate(order.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openDetail(order._id)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-text hover:bg-bg-subtle transition-all" title="View details">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openEditStatus(order)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-primary-600 hover:bg-primary-50 transition-all" title="Update status">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openPrint(order._id)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-violet-600 hover:bg-violet-50 transition-all" title="Print shipping label">
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPage={(p) => { setPage(p); load(p); }} />
      </div>

      {/* Order Detail Modal */}
      <Modal
        open={!!detailOrder || detailLoading}
        onClose={() => setDetailOrder(null)}
        title={detailOrder ? `Order ${detailOrder.orderNumber}` : "Loading..."}
        size="xl"
        footer={detailOrder && (
          <div className="flex flex-wrap justify-end gap-3">
            <GhostBtn onClick={() => setDetailOrder(null)}>Close</GhostBtn>
            <GhostBtn onClick={() => { const order = detailOrder; setDetailOrder(null); openPrint(order._id); }}>
              <Printer className="w-3.5 h-3.5" /> Print Label
            </GhostBtn>
            <PrimaryBtn onClick={() => { setDetailOrder(null); openEditStatus(detailOrder); }}>
              Update Status
            </PrimaryBtn>
          </div>
        )}
      >
        {detailLoading ? (
          <div className="py-10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : detailOrder ? (
          <div className="space-y-5">
            {/* Status + payment */}
            <div className="flex flex-wrap gap-2 items-center">
              <Badge label={detailOrder.status} color={STATUS_CONFIG[detailOrder.status]?.color ?? "gray"} />
              <Badge label={`Payment: ${detailOrder.paymentStatus}`} color={PAY_CONFIG[detailOrder.paymentStatus] ?? "gray"} />
              <Badge label={PAYMENT_METHOD_LABELS[detailOrder.paymentMethod] ?? detailOrder.paymentMethod} color="gray" />
              {detailOrder.paystackReference && (
                <span className="text-xs font-mono text-text-faint bg-bg-subtle px-2 py-0.5 rounded-lg">Ref: {detailOrder.paystackReference}</span>
              )}
              {detailOrder.paystackTransactionId && (
                <span className="text-xs font-mono text-text-faint bg-bg-subtle px-2 py-0.5 rounded-lg">Transaction: {detailOrder.paystackTransactionId}</span>
              )}
              {detailOrder.paidAt && (
                <span className="text-xs text-text-faint">Paid {fmtDateTime(detailOrder.paidAt)}</span>
              )}
            </div>

            {/* 2 columns: customer + shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-subtle border border-border rounded-xl p-4">
                <p className="text-xs font-bold text-text-faint uppercase tracking-wider mb-2">Customer</p>
                <p className="font-semibold text-text">{detailOrder.customerName}</p>
                <p className="text-sm text-text-muted">{detailOrder.customerEmail}</p>
                {detailOrder.customerPhone && <p className="text-sm text-text-muted">{detailOrder.customerPhone}</p>}
                <p className="text-xs text-text-faint mt-2">{fmtDateTime(detailOrder.createdAt)}</p>
              </div>
              <div className="bg-bg-subtle border border-border rounded-xl p-4">
                <p className="text-xs font-bold text-text-faint uppercase tracking-wider mb-2">Ship To</p>
                {detailOrder.shippingAddress ? (
                  <>
                    <p className="text-sm text-text">{detailOrder.shippingAddress.address}</p>
                    <p className="text-sm text-text-muted">{detailOrder.shippingAddress.city}, {detailOrder.shippingAddress.state}</p>
                    <p className="text-sm text-text-muted">{detailOrder.shippingAddress.country}</p>
                  </>
                ) : <p className="text-sm text-text-faint">—</p>}
                {detailOrder.trackingNumber && (
                  <p className="text-xs text-primary-500 font-mono mt-2">Tracking: {detailOrder.trackingNumber}</p>
                )}
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-xs font-bold text-text-faint uppercase tracking-wider mb-2">Items</p>
              <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                {detailOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-lg bg-bg-muted overflow-hidden flex-shrink-0">
                      {item.imageUrl ? <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" /> : <Package className="w-4 h-4 text-text-faint m-auto mt-2.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text">{item.productName}</p>
                      <p className="text-xs text-text-faint">
                        {[item.brand, item.category].filter(Boolean).join(" · ")}
                      </p>
                      {(item.productId || item.productSlug) && (
                        <p className="text-[10px] text-text-faint font-mono">
                          {[item.productId, item.productSlug].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-text">{fmtNaira(item.lineTotal)}</p>
                      <p className="text-xs text-text-faint">{fmtNaira(item.unitPrice)} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-3 bg-bg-subtle flex flex-col gap-1">
                  <div className="flex justify-between text-xs text-text-muted"><span>Subtotal</span><span>{fmtNaira(detailOrder.subtotal)}</span></div>
                  <div className="flex justify-between text-xs text-text-muted"><span>Shipping</span><span>{detailOrder.shippingFee ? fmtNaira(detailOrder.shippingFee) : "Free"}</span></div>
                  <div className="flex justify-between text-sm font-black text-text border-t border-border pt-1 mt-1"><span>Total</span><span>{fmtNaira(detailOrder.total)}</span></div>
                </div>
              </div>
            </div>

            {detailOrder.deliveryNote && (
              <div className="bg-bg-subtle border border-border rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-text-faint uppercase tracking-wider mb-1">Delivery Note</p>
                <p className="text-sm text-text-muted">{detailOrder.deliveryNote}</p>
              </div>
            )}

          </div>
        ) : null}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        open={!!editStatus}
        onClose={() => setEditStatus(null)}
        title="Update Order Status"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <GhostBtn onClick={() => setEditStatus(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleSaveStatus} loading={saving}>Save</PrimaryBtn>
          </div>
        }
      >
        {editStatus && (
          <div className="space-y-4">
            <FormField label="Order Status">
              <select value={editStatus.status} onChange={(e) => setEditStatus((s) => s ? { ...s, status: e.target.value } : s)} className={inputCls}>
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Payment Status">
              <select value={editStatus.paymentStatus} onChange={(e) => setEditStatus((s) => s ? { ...s, paymentStatus: e.target.value } : s)} className={inputCls}>
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status} className="capitalize">{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Tracking Number (optional)">
              <input type="text" value={editStatus.tracking} onChange={(e) => setEditStatus((s) => s ? { ...s, tracking: e.target.value } : s)} placeholder="e.g. GIG-12345678" className={inputCls} />
            </FormField>
            <FormField label="Internal Note (optional)">
              <textarea value={editStatus.note} onChange={(e) => setEditStatus((s) => s ? { ...s, note: e.target.value } : s)} rows={2} placeholder="Dispatch details, reason..." className={`${inputCls} resize-none`} />
            </FormField>
          </div>
        )}
      </Modal>

      {/* Print loading indicator */}
      {printLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-bg border border-border rounded-2xl p-8 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-sm text-text-muted">Loading label…</p>
          </div>
        </div>
      )}

      {/* Shipping Label */}
      {printOrder && (
        <OrderShippingLabel order={printOrder} onClose={() => setPrintOrder(null)} />
      )}
    </div>
  );
}
