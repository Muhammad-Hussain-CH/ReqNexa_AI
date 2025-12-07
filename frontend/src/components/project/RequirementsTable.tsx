import { useEffect, useMemo, useState } from "react";
import { Edit, Trash } from "lucide-react";
import { Requirement } from "../../types";

type PageSize = 10 | 25 | 50 | 100;

type Props = {
  items: Requirement[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onRowClick?: (req: Requirement) => void;
  onEdit?: (req: Requirement) => void;
  onDelete?: (req: Requirement) => void;
  onBulkUpdate?: (ids: string[]) => void;
};

export default function RequirementsTable({ items, isLoading, error, onRetry, onRowClick, onEdit, onDelete, onBulkUpdate }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<keyof Requirement | "created_at">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [items, pageSize, typeFilter, priorityFilter, statusFilter]);

  const filtered = useMemo(() => items.filter((it) => {
    if (typeFilter && it.type !== typeFilter) return false;
    if (priorityFilter && it.priority !== priorityFilter) return false;
    if (statusFilter && it.status !== statusFilter) return false;
    return true;
  }), [items, typeFilter, priorityFilter, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = (a as any)[sortKey] ?? "";
      const vb = (b as any)[sortKey] ?? "";
      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      if (typeof va === "number" && typeof vb === "number") return sortDir === "asc" ? va - vb : vb - va;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = useMemo(() => sorted.slice((page - 1) * pageSize, page * pageSize), [sorted, page, pageSize]);

  function toggleAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) setSelected(paged.map((x) => x.id));
    else setSelected([]);
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((s) => checked ? [...s, id] : s.filter((x) => x !== id));
  }

  function changeSort(k: keyof Requirement | "created_at") {
    if (sortKey === k) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <select className="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="functional">Functional</option>
          <option value="non_functional">Non-Functional</option>
        </select>
        <select className="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select className="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="review">Review</option>
          <option value="approved">Approved</option>
        </select>
        <select className="px-3 py-2 border rounded ml-auto dark:bg-gray-800 dark:border-gray-700" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value) as PageSize)}>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {isLoading && (
        <div className="rounded border bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
          <div className="animate-pulse space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded border bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
          <div className="text-red-600">{error}</div>
          {onRetry && <button className="mt-2 px-3 py-1.5 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={onRetry}>Retry</button>}
        </div>
      )}

      {!isLoading && !error && paged.length === 0 && (
        <div className="h-48 grid place-items-center text-gray-500 dark:text-gray-400">
          No requirements yet. Start a conversation to gather requirements.
        </div>
      )}

      {!isLoading && !error && paged.length > 0 && (
        <div className="rounded border bg-white dark:bg-gray-800 dark:border-gray-700 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="p-2"><input type="checkbox" onChange={toggleAll} checked={selected.length === paged.length && paged.length > 0} /></th>
                <th className="p-2 text-left cursor-pointer" onClick={() => changeSort("id")}>ID</th>
                <th className="p-2 text-left cursor-pointer" onClick={() => changeSort("title")}>Title</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Priority</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r) => (
                <tr key={r.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-2"><input type="checkbox" checked={selected.includes(r.id)} onChange={(e) => toggleOne(r.id, e.target.checked)} /></td>
                  <td className="p-2">REQ-{String(r.id).slice(-4)}</td>
                  <td className="p-2"><button className="text-primary" onClick={() => onRowClick && onRowClick(r)}>{r.title}</button></td>
                  <td className="p-2"><span className={`text-xs px-2 py-1 rounded ${r.type === "functional" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>{r.type === "functional" ? "Functional" : "Non-Functional"}</span></td>
                  <td className="p-2 text-xs text-gray-600 dark:text-gray-400">{r.category || "-"}</td>
                  <td className="p-2"><span className={`text-xs px-2 py-1 rounded ${r.priority === "high" ? "bg-red-100 text-red-600" : r.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-600"}`}>{r.priority}</span></td>
                  <td className="p-2"><span className={`text-xs px-2 py-1 rounded ${r.status === "approved" ? "bg-green-100 text-green-700" : r.status === "review" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>{r.status}</span></td>
                  <td className="p-2">{new Date().toLocaleDateString()}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => onEdit && onEdit(r)}><Edit className="w-4 h-4" /></button>
                      <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => onDelete && onDelete(r)}><Trash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="text-sm">{selected.length} selected</div>
          <button className="px-3 py-1.5 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => onBulkUpdate && onBulkUpdate(selected)}>Bulk Update</button>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <button className="px-3 py-1.5 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <div className="text-sm">Page {page} / {totalPages}</div>
        <button className="px-3 py-1.5 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
      </div>
    </div>
  );
}
