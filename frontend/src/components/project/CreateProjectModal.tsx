import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../../services/project.service";

export default function CreateProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("web");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError("Project name is required"); return; }
    setLoading(true);
    try {
      const res = await createProject({ name, type, description });
      onClose();
      navigate(`/chat/${res.project?.id || res.id}`);
    } catch {
      setError("Unable to create project");
    } finally {
      setLoading(false);
    }
  }
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <form className="w-full max-w-md bg-white dark:bg-gray-800 rounded shadow p-6 space-y-3" onSubmit={onSubmit}>
        <div className="text-lg font-semibold">New Project</div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Project name</label>
          <input className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Project type</label>
          <select className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="web">Web App</option>
            <option value="mobile">Mobile App</option>
            <option value="desktop">Desktop</option>
            <option value="api">API</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Description</label>
          <textarea className="w-full px-3 py-2 border rounded resize-none dark:bg-gray-800 dark:border-gray-700" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button type="button" className="px-3 py-2 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-3 py-2 rounded bg-primary text-white" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
        </div>
      </form>
    </div>
  );
}
