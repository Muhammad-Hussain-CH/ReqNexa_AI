import { useState } from "react";
import Modal from "../common/Modal";
import { generateDocument } from "../../services/document.service";
import { toast } from "react-hot-toast";

type Props = {
  projectId: string;
  open: boolean;
  onClose: () => void;
  onGenerated?: (doc: any) => void;
};

export default function GenerateDocumentModal({ projectId, open, onClose, onGenerated }: Props) {
  const [type, setType] = useState<"srs" | "user_stories" | "requirements_export">("srs");
  const [format, setFormat] = useState<"pdf" | "docx" | "html" | "csv" | "json" | "xml">("pdf");
  const [template, setTemplate] = useState<"ieee" | "agile">("ieee");
  const [include_toc, setIncludeToc] = useState(true);
  const [include_glossary, setIncludeGlossary] = useState(false);
  const [include_traceability, setIncludeTraceability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableFormats = type === "srs" ? ["pdf", "docx", "html"] as const : type === "requirements_export" ? ["csv", "json", "xml"] as const : ["json"] as const;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { project_id: projectId, type, format, template: type === "srs" ? template : undefined, options: type === "srs" ? { include_toc, include_glossary, include_traceability } : undefined } as any;
      const res = await generateDocument(payload);
      toast.success("Document generated");
      if (onGenerated) onGenerated(res);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || "Failed to generate document");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="text-lg font-semibold">Generate Document</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1 dark:text-gray-300">Type</label>
            <select className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={type} onChange={(e) => { const t = e.target.value as any; setType(t); setFormat(t === "srs" ? "pdf" : t === "requirements_export" ? "csv" : "json"); }}>
              <option value="srs">SRS (IEEE 830)</option>
              <option value="user_stories">User Stories</option>
              <option value="requirements_export">Requirements Export</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 dark:text-gray-300">Format</label>
            <select className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={format} onChange={(e) => setFormat(e.target.value as any)}>
              {availableFormats.map((f) => (
                <option key={f} value={f}>{f.toUpperCase()}</option>
              ))}
            </select>
          </div>
          {type === "srs" && (
            <div>
              <label className="block text-sm mb-1 dark:text-gray-300">Template</label>
              <select className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={template} onChange={(e) => setTemplate(e.target.value as any)}>
                <option value="ieee">IEEE</option>
                <option value="agile">Agile</option>
              </select>
            </div>
          )}
        </div>
        {type === "srs" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 text-sm dark:text-gray-300"><input type="checkbox" checked={include_toc} onChange={(e) => setIncludeToc(e.target.checked)} /> Include TOC</label>
            <label className="flex items-center gap-2 text-sm dark:text-gray-300"><input type="checkbox" checked={include_glossary} onChange={(e) => setIncludeGlossary(e.target.checked)} /> Include Glossary</label>
            <label className="flex items-center gap-2 text-sm dark:text-gray-300"><input type="checkbox" checked={include_traceability} onChange={(e) => setIncludeTraceability(e.target.checked)} /> Include Traceability</label>
          </div>
        )}
        <div className="flex items-center gap-2 justify-end">
          <button type="button" className="px-3 py-1.5 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 rounded bg-primary text-white">{isSubmitting ? "Generating..." : "Generate"}</button>
        </div>
      </form>
    </Modal>
  );
}
