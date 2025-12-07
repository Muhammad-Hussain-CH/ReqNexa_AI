import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

export type ProjectItem = {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  progress?: number;
  functionalCount?: number;
  nonFunctionalCount?: number;
  updatedAt?: string;
};

export default function ProjectGrid({ items }: { items: ProjectItem[] }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((p) => (
        <button key={p.id} onClick={() => navigate(`/projects/${p.id}`)} className="text-left">
          <div className="rounded border bg-white dark:bg-gray-800 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="font-semibold truncate">{p.name}</div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${p.type === "web" ? "bg-primary/10 text-primary" : p.type === "mobile" ? "bg-secondary/10 text-secondary" : "bg-accent/10 text-accent"}`}>{p.type}</span>
                <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><MoreHorizontal className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{p.description || ""}</div>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded">
              <div className="h-2 bg-primary rounded" style={{ width: `${p.progress ?? 0}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <div>
                <span className="mr-3">{p.functionalCount ?? 0} functional</span>
                <span>{p.nonFunctionalCount ?? 0} non-functional</span>
              </div>
              <div>{p.updatedAt || ""}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
