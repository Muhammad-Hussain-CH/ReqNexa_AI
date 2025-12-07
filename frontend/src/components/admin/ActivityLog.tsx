import { useEffect, useState } from "react";
import { useAdminStore } from "../../stores/admin.store";

export default function ActivityLog() {
  const { activity, activityLoading, loadActivity } = useAdminStore();
  const [userId, setUserId] = useState("");
  const [actionType, setActionType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  async function refresh() {
    await loadActivity({ user_id: userId || undefined, action_type: actionType || undefined, date_from: dateFrom || undefined, date_to: dateTo || undefined, limit: 50, page: 1 });
  }

  useEffect(() => { refresh(); }, [userId, actionType, dateFrom, dateTo]);
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => { refresh(); }, 30000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input className="px-3 py-2 border rounded" placeholder="Filter by user id" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <input className="px-3 py-2 border rounded" placeholder="Action type" value={actionType} onChange={(e) => setActionType(e.target.value)} />
        <input className="px-3 py-2 border rounded" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <input className="px-3 py-2 border rounded" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        <label className="ml-auto flex items-center gap-2 text-sm"><input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} /> Auto-refresh</label>
      </div>
      <div className="rounded border bg-white overflow-x-auto">
        {activityLoading && <div className="p-4">Loading...</div>}
        {!activityLoading && activity && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Timestamp</th>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Entity</th>
                <th className="p-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {activity.items.map((a: any) => (
                <tr key={a.id} className="border-b">
                  <td className="p-2">{new Date(a.created_at).toLocaleString()}</td>
                  <td className="p-2">{a.user_id || "-"}</td>
                  <td className="p-2">{a.action}</td>
                  <td className="p-2">{a.entity_type || "-"} {a.entity_id || ""}</td>
                  <td className="p-2"><pre className="text-xs whitespace-pre-wrap">{JSON.stringify(a.metadata || {}, null, 2)}</pre></td>
                </tr>
              ))}
              {activity.items.length === 0 && (
                <tr><td className="p-4 text-center text-gray-600" colSpan={5}>No activity</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

