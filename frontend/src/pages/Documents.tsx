import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { listDocuments, downloadDocument, deleteDocument } from "../services/document.service";
import { toast } from "react-hot-toast";

type DocItem = { document_id: string; filename: string; format: string; size: number; created_at: string };

export default function Documents() {
  const { id } = useParams();
  const [items, setItems] = useState<DocItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await listDocuments(id);
      setItems(res.documents || []);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function onDownload(doc: DocItem) {
    try {
      const blob = await downloadDocument(doc.document_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to download");
    }
  }

  async function onDelete(doc: DocItem) {
    try {
      await deleteDocument(doc.document_id);
      toast.success("Document deleted");
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e?.message || "Failed to delete");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/projects" className="text-primary">Projects</Link>
            <span>/</span>
            <Link to={`/projects/${id}`} className="text-primary">Project</Link>
            <span>/</span>
            <span>Documents</span>
          </div>
          <Link to={`/projects/${id}`} className="px-3 py-1.5 rounded border">Back</Link>
        </div>
        <div className="rounded border bg-white overflow-x-auto">
          {isLoading && (
            <div className="p-4">Loading...</div>
          )}
          {error && !isLoading && (
            <div className="p-4 text-red-600">{error}</div>
          )}
          {!isLoading && !error && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Filename</th>
                  <th className="p-2 text-left">Format</th>
                  <th className="p-2 text-left">Size</th>
                  <th className="p-2 text-left">Created</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((d) => (
                  <tr key={d.document_id} className="border-b">
                    <td className="p-2">{d.filename}</td>
                    <td className="p-2">{d.format.toUpperCase()}</td>
                    <td className="p-2">{Math.round(d.size / 1024)} KB</td>
                    <td className="p-2">{new Date(d.created_at).toLocaleString()}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <button className="px-2 py-1 rounded border" onClick={() => onDownload(d)}>Download</button>
                        <button className="px-2 py-1 rounded border" onClick={() => onDelete(d)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td className="p-4 text-center text-gray-600" colSpan={5}>No documents yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

