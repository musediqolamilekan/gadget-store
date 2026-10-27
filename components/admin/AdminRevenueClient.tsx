"use client";

import { useEffect, useState, useCallback } from "react";
import {
  TrendingUp, DollarSign, ShoppingCart, Users,
  BarChart2, RefreshCw, CreditCard, ArrowUpRight,
  ArrowDownRight, Package
} from "lucide-react";
import { SectionHeader, GhostBtn } from "./AdminUI";

// ── Helpers ──────────────────────────────────────────────────────
const fmtNaira = (n: number) =>
  `₦${(n ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "short" });

interface DayData { date: string; revenue: number; orders: number }
interface MonthData { label: string; revenue: number; orders: number }
interface TopCustomer { name: string; email: string; revenue: number; orders: number }
interface RevenueData {
  totalRevenue: number;
  monthRevenue: number;
  lastMonthRevenue: number;
  avgOrderValue: number;
  totalOrders: number;
  dailyData: DayData[];
  monthlyData: MonthData[];
  paymentMethods: Record<string, { revenue: number; count: number }>;
  topCustomers: TopCustomer[];
  recentOrders: { _id: string; orderNumber: string; customerName: string; total: number; status: string; createdAt: string }[];
}

// ── Mini Bar Chart ────────────────────────────────────────────────
function MiniBarChart({ data, valueKey, color }: {
  data: { [key: string]: number | string }[];
  valueKey: string;
  color: string;
}) {
  const values = data.map((d) => Number(d[valueKey]) || 0);
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-0.5 h-20 w-full">
      {data.map((d, i) => {
        const pct = (Number(d[valueKey]) / max) * 100;
        return (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all duration-500 min-w-0 group relative"
            style={{ height: `${Math.max(pct, 2)}%`, background: color }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] bg-bg-inverse text-bg px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              {typeof d[valueKey] === "number" && d[valueKey] > 1000
                ? fmtNaira(d[valueKey] as number)
                : String(d[valueKey])}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────
function RevStatCard({ label, value, icon: Icon, iconBg, change, sublabel }: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  change?: number | null;
  sublabel?: string;
}) {
  return (
    <div className="bg-bg border border-border rounded-2xl p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== null && change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${change >= 0 ? "bg-success-bg text-success" : "bg-danger-bg text-danger"}`}>
            {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-black text-text tracking-tight">{value}</div>
      <div className="text-xs font-medium text-text-muted mt-1">{label}</div>
      {sublabel && <div className="text-xs text-text-faint mt-0.5">{sublabel}</div>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function AdminRevenueClient() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState("30");
  const [view, setView] = useState<"daily" | "monthly">("daily");

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/admin/revenue?range=${range}`, { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Failed to fetch revenue data");
        setData(result.data);
      })
      .catch((cause: unknown) => {
        setData(null);
        setError(cause instanceof Error ? cause.message : "Failed to fetch revenue data");
      })
      .finally(() => setLoading(false));
  }, [range]);

  useEffect(() => {
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [load]);

  const growthPct =
    data?.lastMonthRevenue
      ? Math.round(((data.monthRevenue - data.lastMonthRevenue) / data.lastMonthRevenue) * 100)
      : null;

  const chartData = view === "daily"
    ? (data?.dailyData ?? []).map((d) => ({ label: fmtDate(d.date), revenue: d.revenue, orders: d.orders }))
    : (data?.monthlyData ?? []).map((d) => ({ label: d.label, revenue: d.revenue, orders: d.orders }));

  const payMethods = data?.paymentMethods ?? {};
  const totalPayRev = Object.values(payMethods).reduce((s, m) => s + m.revenue, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="Revenue"
        subtitle="Financial overview and earnings analytics"
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-bg border border-border rounded-xl overflow-hidden">
              {["7", "30", "90"].map((d) => (
                <button
                  key={d}
                  onClick={() => setRange(d)}
                  className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                    range === d ? "bg-primary-500 text-white" : "text-text-muted hover:bg-bg-subtle"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
            <GhostBtn onClick={load}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </GhostBtn>
          </div>
        }
      />

      {/* ── KPI Row ───────────────────────────────────────── */}
      {error && (
        <div role="alert" className="rounded-xl border border-danger/20 bg-danger-bg px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-bg border border-border rounded-2xl p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : data ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <RevStatCard
            label="Total Revenue"
            value={fmtNaira(data.totalRevenue)}
            icon={DollarSign}
            iconBg="bg-primary-50 text-primary-500"
          />
          <RevStatCard
            label="This Month"
            value={fmtNaira(data.monthRevenue)}
            icon={TrendingUp}
            iconBg="bg-success-bg text-success"
            change={growthPct}
            sublabel={data.lastMonthRevenue ? `vs ${fmtNaira(data.lastMonthRevenue)} last month` : undefined}
          />
          <RevStatCard
            label="Total Orders"
            value={data.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            iconBg="bg-violet-50 text-violet-600"
          />
          <RevStatCard
            label="Avg Order Value"
            value={fmtNaira(data.avgOrderValue)}
            icon={BarChart2}
            iconBg="bg-amber-50 text-warning"
          />
        </div>
      ) : null}

      {/* ── Revenue Chart ─────────────────────────────────── */}
      {data && (
        <div className="bg-bg border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-text">Revenue Trend</h3>
              <p className="text-xs text-text-faint mt-0.5">
                {view === "daily" ? `Last ${range} days` : "Last 12 months"}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-bg-subtle border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setView("daily")}
                className={`px-3 py-1.5 text-xs font-semibold transition-all ${view === "daily" ? "bg-primary-500 text-white" : "text-text-muted hover:bg-bg-muted"}`}
              >
                Daily
              </button>
              <button
                onClick={() => setView("monthly")}
                className={`px-3 py-1.5 text-xs font-semibold transition-all ${view === "monthly" ? "bg-primary-500 text-white" : "text-text-muted hover:bg-bg-muted"}`}
              >
                Monthly
              </button>
            </div>
          </div>

          <MiniBarChart
            data={chartData}
            valueKey="revenue"
            color="var(--color-primary-500, #f97316)"
          />

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-text-faint">{chartData[0]?.label}</span>
            <span className="text-xs text-text-faint">{chartData[chartData.length - 1]?.label}</span>
          </div>

          {/* Summary below chart */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
            {[
              {
                label: "Peak Day",
                value: fmtNaira(Math.max(...(data.dailyData?.map((d) => d.revenue) ?? [0]))),
              },
              {
                label: `${range}d Revenue`,
                value: fmtNaira(data.dailyData?.reduce((s, d) => s + d.revenue, 0) ?? 0),
              },
              {
                label: `${range}d Orders`,
                value: (data.dailyData?.reduce((s, d) => s + d.orders, 0) ?? 0).toString(),
              },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-base font-black text-text">{value}</p>
                <p className="text-xs text-text-faint mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Bottom Row: Payment Methods + Top Customers ─── */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Payment Method Breakdown */}
          <div className="bg-bg border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-primary-500" />
              <h3 className="font-bold text-text text-sm">Payment Methods</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(payMethods).map(([method, info]) => {
                const pct = totalPayRev ? Math.round((info.revenue / totalPayRev) * 100) : 0;
                const labels: Record<string, string> = {
                  paystack: "💳 Paystack",
                  whatsapp: "💬 WhatsApp",
                  bank_transfer: "🏦 Bank Transfer",
                };
                return (
                  <div key={method}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-text">{labels[method] ?? method}</span>
                      <div className="flex items-center gap-3 text-xs text-text-faint">
                        <span>{info.count} orders</span>
                        <span className="font-bold text-text">{fmtNaira(info.revenue)}</span>
                        <span className="text-primary-500 font-semibold">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(payMethods).length === 0 && (
                <p className="text-sm text-text-faint text-center py-6">No paid orders yet</p>
              )}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-bg border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <Users className="w-4 h-4 text-violet-500" />
              <h3 className="font-bold text-text text-sm">Top Customers</h3>
            </div>
            <div className="divide-y divide-border">
              {data.topCustomers.length ? data.topCustomers.map((c, i) => (
                <div key={c.email} className="flex items-center gap-3 px-5 py-3 hover:bg-bg-subtle transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center text-xs font-black text-primary-600 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{c.name}</p>
                    <p className="text-xs text-text-faint truncate">{c.email}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-text">{fmtNaira(c.revenue)}</p>
                    <p className="text-xs text-text-faint">{c.orders} order{c.orders !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-text-faint text-center py-10">No customers yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Recent Paid Orders Table ───────────────────────── */}
      {data?.recentOrders && data.recentOrders.length > 0 && (
        <div className="bg-bg border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <Package className="w-4 h-4 text-success" />
            <h3 className="font-bold text-text text-sm">Recent Paid Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-subtle border-b border-border">
                  {["Order", "Customer", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-text-faint uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-bg-subtle transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-primary-600">{o.orderNumber}</td>
                    <td className="px-4 py-3 text-text">{o.customerName}</td>
                    <td className="px-4 py-3 font-bold text-text">{fmtNaira(o.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        o.status === "delivered" ? "bg-success-bg text-success" :
                        o.status === "shipped" ? "bg-violet-50 text-violet-600" :
                        o.status === "cancelled" ? "bg-danger-bg text-danger" :
                        "bg-warning-bg text-warning"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-faint whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
