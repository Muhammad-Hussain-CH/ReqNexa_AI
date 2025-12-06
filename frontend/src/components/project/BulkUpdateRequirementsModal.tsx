import { useState } from "react";

export default function BulkUpdateRequirementsModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: (updates: { status?: string; priority?: string; category?: string | null }) => Promise<void> }) {
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!open) return null;
  async function submit() {
    setError(null);
    setLoading(true);
    try {
      await onConfirm({ status: status || undefined, priority: priority || undefined, category: category || undefined });
      onClose();
    } catch (e: any) {
      setError(e?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <div className="text-lg font-semibold">Bulk Update Requirements</div>
        {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select className="w-full px-3 py-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">No change</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Priority</label>
            <select className="w-full px-3 py-2 border rounded" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">No change</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Category (NFR)</label>
            <input className="w-full px-3 py-2 border rounded" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button className="px-3 py-2 rounded border" onClick={onClose}>Cancel</button>
          <button className="px-3 py-2 rounded bg-primary text-white" onClick={submit} disabled={loading}>{loading ? "Updating..." : "Update"}</button>
        </div>
      </div>
    </div>
  );
}
