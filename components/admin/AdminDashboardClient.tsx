"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, Tag, Image, FileText, ShoppingCart,
  TrendingUp, Package, Star, AlertTriangle, CheckCircle, XCircle,
  ArrowRight, DollarSign, Activity
} from "lucide-react";
import { StatCard } from "./AdminUI";
import { adminRequest } from "./adminRequest";

interface Stats {
  totalProducts: number; totalBrands: number;
  totalBanners: number; totalPosts: number; featuredProducts: number;
  newArrivals: number; bestsellers: number; activeBanners: number;
  outOfStock: number; lowStock: number; avgRating: number;
  totalStock: number; totalReviews: number;
  totalOrders: number; pendingOrders: number; deliveredOrders: number;
  cancelledOrders: number; paidOrders: number;
  totalRevenue: number; monthRevenue: number; lastMonthRevenue: number;
  avgOrderValue: number;
  recentOrders: { _id: string; orderNumber: string; customerName: string; total: number; status: string; paymentStatus: string; createdAt: string; itemCount: number }[];
  recentProducts: { _id: string; name: string; price: number; stockCount: number; image?: string; category?: string; isFeatured: boolean; isNew: boolean }[];
  categoryBreakdown: { title: string; count: number }[];
  recentPosts: { _id: string; title: string; category: string; publishedAt: string; coverUrl?: string }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "text-warning bg-warning-bg",
  confirmed: "text-success bg-success-bg",
  processing: "text-blue-600 bg-blue-50",
  shipped: "text-violet-600 bg-violet-50",
  delivered: "text-success bg-success-bg",
  cancelled: "text-danger bg-danger-bg",
};

const fmtNaira = (n: number) =>
  n != null ? `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 0 })}` : "₦—";

function SkeletonCard() {
  return <div className="bg-bg border border-border rounded-2xl p-4 animate-pulse h-24" />;
}

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminRequest<{ data: Stats }>("/api/admin/stats");
      setStats(result.data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [load]);

  const revenueGrowth = stats && stats.lastMonthRevenue
    ? Math.round(((stats.monthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100)
    : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Revenue row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : stats ? (
          <>
            <StatCard
              label="Total Revenue"
              value={fmtNaira(stats.totalRevenue ?? 0)}
              icon={DollarSign}
              iconBg="bg-primary-50 text-primary-500"
            />
            <StatCard
              label="This Month"
              value={fmtNaira(stats.monthRevenue ?? 0)}
              icon={TrendingUp}
              iconBg="bg-success-bg text-success"
              change={revenueGrowth !== null ? { value: revenueGrowth, label: "vs last month" } : undefined}
            />
            <StatCard
              label="Total Orders"
              value={stats.totalOrders ?? 0}
              icon={ShoppingCart}
              iconBg="bg-violet-50 text-violet-600"
              sublabel={`${stats.paidOrders ?? 0} paid`}
            />
            <StatCard
              label="Avg Order Value"
              value={fmtNaira(stats.avgOrderValue ?? 0)}
              icon={Activity}
              iconBg="bg-amber-50 text-warning"
            />
          </>
        ) : null}
      </div>

      {/* Content stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : stats ? (
          [
            { label: "Products",   value: stats.totalProducts,  icon: ShoppingBag, iconBg: "bg-primary-50 text-primary-500",  href: "/admin/products"   },
            { label: "Brands",     value: stats.totalBrands,    icon: Tag,         iconBg: "bg-violet-50 text-violet-600",    href: "/admin/brands"     },
            { label: "Banners",    value: stats.totalBanners,   icon: Image,       iconBg: "bg-rose-50 text-rose-500",        href: "/admin/banners"    },
            { label: "Posts",      value: stats.totalPosts,     icon: FileText,    iconBg: "bg-emerald-50 text-emerald-600",  href: "/admin/posts"      },
            { label: "Reviews",    value: stats.totalReviews?.toLocaleString() ?? "0", icon: Star, iconBg: "bg-amber-50 text-warning", href: "/admin/products", sublabel: `${stats.avgRating?.toFixed(1)} ★ avg` },
          ].map((s) => (
            <Link key={s.label} href={s.href}>
              <StatCard {...s} />
            </Link>
          ))
        ) : null}
      </div>

      {/* Orders + Inventory row */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Order Status */}
          <div className="bg-bg border border-border rounded-2xl p-4">
            <h3 className="text-xs font-bold text-text-faint uppercase tracking-wider mb-3">Order Status</h3>
            <div className="space-y-2.5">
              {[
                { label: "Pending",   value: stats.pendingOrders,    color: "bg-warning" },
                { label: "Delivered", value: stats.deliveredOrders,  color: "bg-success" },
                { label: "Cancelled", value: stats.cancelledOrders,  color: "bg-danger"  },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
                  <span className="text-sm text-text-muted flex-1">{label}</span>
                  <span className="text-sm font-bold text-text">{value ?? 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Health */}
          <div className="bg-bg border border-border rounded-2xl p-4">
            <h3 className="text-xs font-bold text-text-faint uppercase tracking-wider mb-3">Inventory Health</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-sm text-text-muted flex-1">In Stock</span>
                <span className="text-sm font-bold text-text">{(stats.totalProducts ?? 0) - (stats.outOfStock ?? 0) - (stats.lowStock ?? 0)}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
                <span className="text-sm text-text-muted flex-1">Low Stock (≤5)</span>
                <span className="text-sm font-bold text-warning">{stats.lowStock ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-danger flex-shrink-0" />
                <span className="text-sm text-text-muted flex-1">Out of Stock</span>
                <span className="text-sm font-bold text-danger">{stats.outOfStock ?? 0}</span>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-text-faint">Total units</span>
                <span className="font-bold text-text">{stats.totalStock?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-bg border border-border rounded-2xl p-4">
            <h3 className="text-xs font-bold text-text-faint uppercase tracking-wider mb-3">Products by Category</h3>
            <div className="space-y-2">
              {stats.categoryBreakdown?.slice(0, 5).map((cat) => {
                const max = Math.max(...(stats.categoryBreakdown?.map((c) => c.count) ?? [1]), 1);
                const pct = (cat.count / max) * 100;
                return (
                  <div key={cat.title}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-muted truncate">{cat.title}</span>
                      <span className="text-text font-semibold ml-2">{cat.count}</span>
                    </div>
                    <div className="h-1.5 bg-bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders + Recent Products */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Orders */}
          <div className="bg-bg border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-violet-500" />
                <h3 className="text-sm font-bold text-text">Recent Orders</h3>
              </div>
              <Link href="/admin/orders" className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1 font-medium transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {stats.recentOrders?.length ? stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-subtle transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text">{order.orderNumber}</p>
                    <p className="text-xs text-text-faint truncate">{order.customerName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-text">{fmtNaira(order.total)}</p>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-bg-muted text-text-faint"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="px-4 py-10 text-center text-text-faint text-sm">No orders yet</div>
              )}
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-bg border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary-500" />
                <h3 className="text-sm font-bold text-text">Recent Products</h3>
              </div>
              <Link href="/admin/products" className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1 font-medium transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {stats.recentProducts?.map((p) => (
                <div key={p._id} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-subtle transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-bg-muted overflow-hidden flex-shrink-0">
                    {p.image
                      ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      : <ShoppingBag className="w-4 h-4 text-text-faint m-auto mt-2.5" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{p.name}</p>
                    <p className="text-xs text-text-faint">{p.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-text">₦{p.price?.toLocaleString("en-NG")}</p>
                    <p className={`text-xs ${p.stockCount === 0 ? "text-danger" : p.stockCount <= 5 ? "text-warning" : "text-success"}`}>
                      {p.stockCount === 0 ? "Out" : `${p.stockCount} units`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
