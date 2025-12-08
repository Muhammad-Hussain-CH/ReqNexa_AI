import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuthStore } from "../stores/auth.store";
import { useAdminStore } from "../stores/admin.store";
import UserTable from "../components/admin/UserTable";
import AnalyticsChart from "../components/admin/AnalyticsChart";
import ActivityLog from "../components/admin/ActivityLog";

export default function Admin() {
  const { user, checkAuth, isLoading } = useAuthStore();
  const { analytics, analyticsLoading, loadAnalytics, systemHealth, systemLoading, loadSystemHealth } = useAdminStore();
  const [tab, setTab] = useState("users");
  const [range, setRange] = useState("7d");

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => {
    const now = new Date();
    const from = new Date(now.getTime() - (range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365) * 24 * 60 * 60 * 1000);
    loadAnalytics({ date_from: from.toISOString(), date_to: now.toISOString() });
  }, [range, loadAnalytics]);
  useEffect(() => { loadSystemHealth(); }, [loadSystemHealth]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;
  if (!user || user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Admin Console</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded border" onClick={() => loadSystemHealth()}>Refresh Health</button>
          </div>
        </div>
        <div className="flex items-center gap-2 border-b">
          {[
            { k: "users", t: "Users" },
            { k: "projects", t: "Projects" },
            { k: "analytics", t: "Analytics" },
            { k: "activity", t: "Activity Logs" },
            { k: "health", t: "System Health" },
          ].map((x) => (
            <button key={x.k} onClick={() => setTab(x.k)} className={`px-3 py-2 ${tab === x.k ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}>{x.t}</button>
          ))}
        </div>
        {tab === "users" && (
          <UserTable />
        )}
        {tab === "projects" && (
          <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
            <div className="text-gray-600 dark:text-gray-300">All Projects view can be implemented similarly to users table (owner, type, requirements count, status, created). For now, use the Projects page for detailed management.</div>
          </div>
        )}
        {tab === "analytics" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Date range</label>
              <select className="px-3 py-2 border rounded" value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
              <button className="ml-auto px-3 py-1.5 rounded border" onClick={() => window.print()}>Export</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
                <div className="text-sm text-gray-600">Total Users</div>
                <div className="text-2xl font-semibold">{analyticsLoading ? "…" : analytics?.users?.total ?? 0}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
                <div className="text-sm text-gray-600">Active Users (24h)</div>
                <div className="text-2xl font-semibold">{analyticsLoading ? "…" : analytics?.users?.active_users?.last_24h ?? 0}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
                <div className="text-sm text-gray-600">Total Projects</div>
                <div className="text-2xl font-semibold">{analyticsLoading ? "…" : analytics?.projects?.total ?? 0}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
                <div className="text-sm text-gray-600">Total Requirements</div>
                <div className="text-2xl font-semibold">{analyticsLoading ? "…" : analytics?.requirements?.total ?? 0}</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
                <div className="text-sm text-gray-600">Storage Used</div>
                <div className="text-2xl font-semibold">{systemLoading ? "…" : Math.round((systemHealth?.storage?.used_bytes || 0) / 1024 / 1024)} MB</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
                <div className="font-semibold mb-2">Users by Role</div>
                <AnalyticsChart type="pie" data={(analytics?.users?.by_role || []).map((r: any) => ({ name: r.role, value: r.count }))} />
              </div>
              <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
                <div className="font-semibold mb-2">Projects by Status</div>
                <AnalyticsChart type="pie" data={(analytics?.projects?.by_status || []).map((r: any) => ({ name: r.status, value: r.count }))} />
              </div>
              <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
                <div className="font-semibold mb-2">Requirements by Type</div>
                <AnalyticsChart type="bar" data={(analytics?.requirements?.by_type || []).map((r: any) => ({ name: r.type, value: r.count }))} />
              </div>
            </div>
          </div>
        )}
        {tab === "activity" && (
          <ActivityLog />
        )}
        {tab === "health" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
              <div className="font-semibold">Database Status</div>
              <div className="text-sm mt-2 dark:text-gray-300">PostgreSQL: {systemLoading ? "…" : (systemHealth?.database?.postgres ? "OK" : "Down")}</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
              <div className="font-semibold">API Status</div>
              <div className="text-sm mt-2 dark:text-gray-300">Provider: {systemLoading ? "…" : systemHealth?.ai_provider?.name || "-"}</div>
              <div className="text-sm dark:text-gray-300">Status: {systemLoading ? "…" : systemHealth?.ai_provider?.status || "unknown"}</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
              <div className="font-semibold">Server Health</div>
              <div className="text-sm mt-2 dark:text-gray-300">Memory Used: {systemLoading ? "…" : Math.round(((systemHealth?.server?.memory?.used || 0) / (systemHealth?.server?.memory?.total || 1)) * 100)}%</div>
              <div className="text-sm dark:text-gray-300">CPU Load: {systemLoading ? "…" : (systemHealth?.server?.cpuLoad || []).map((x: number) => x.toFixed(2)).join(", ")}</div>
              <div className="text-sm dark:text-gray-300">Last Checked: {systemLoading ? "…" : new Date(systemHealth?.checked_at || Date.now()).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
