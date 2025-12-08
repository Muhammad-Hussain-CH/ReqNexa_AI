import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProjectGrid, { ProjectItem } from "../components/project/ProjectGrid";
import CreateProjectModal from "../components/project/CreateProjectModal";
import { getProjects } from "../services/project.service";
import { useProjectStore } from "../stores/project.store";
import { Search, LayoutGrid, List, ChevronDown, Plus } from "lucide-react";

export default function Projects() {
  const { projects, setProjects } = useProjectStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getProjects({ page, limit: 12, status: filter === "all" ? undefined : filter });
      setProjects(res.projects ?? []);
    })();
  }, [page, filter, setProjects]);

  const items: ProjectItem[] = useMemo(() =>
    projects
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .map((p) => ({ id: p.id, name: p.name, type: p.type, description: "", progress: Math.floor(Math.random() * 80) + 10, functionalCount: Math.floor(Math.random() * 10), nonFunctionalCount: Math.floor(Math.random() * 8), updatedAt: "2d ago" })),
    [projects, search]
  );

  const sorted = useMemo(() => {
    const arr = [...items];
    if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "status") arr.sort((a, b) => (a.progress ?? 0) - (b.progress ?? 0));
    return arr;
  }, [items, sort]);

  return (
    <DashboardLayout>
      <div className="space-y-4 bg-gradient-to-br from-background via-background to-blue-950/10 p-2 md:p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Projects</h1>
          <button className="px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2" onClick={() => setOpen(true)}><Plus className="w-4 h-4" /> New Project</button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input className="ml-2 bg-transparent outline-none text-sm dark:text-gray-100" placeholder="Search projects" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          <div className="flex items-center gap-1">
            <button className={`px-2 py-2 rounded ${view === "grid" ? "bg-gray-200 dark:bg-gray-700" : "border dark:border-gray-700"}`} onClick={() => setView("grid")}><LayoutGrid className="w-4 h-4" /></button>
            <button className={`px-2 py-2 rounded ${view === "list" ? "bg-gray-200 dark:bg-gray-700" : "border dark:border-gray-700"}`} onClick={() => setView("list")}><List className="w-4 h-4" /></button>
          </div>
          <select className="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
        </div>
        {sorted.length === 0 ? (
          <div className="h-64 grid place-items-center text-gray-500 dark:text-gray-400">No projects found</div>
        ) : view === "grid" ? (
          <ProjectGrid items={sorted} />
        ) : (
          <div className="space-y-2">
            {sorted.map((p) => (
              <div key={p.id} className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{p.type}</div>
                </div>
                <div className="w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded"><div className="h-2 bg-primary rounded" style={{ width: `${p.progress ?? 0}%` }} /></div>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-end gap-2">
          <button className="px-3 py-1.5 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">Prev</button>
          <button className="px-3 py-1.5 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>
      <CreateProjectModal open={open} onClose={() => setOpen(false)} />
    </DashboardLayout>
  );
}
