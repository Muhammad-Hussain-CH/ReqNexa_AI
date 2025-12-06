import { Requirement } from "../../types";

export default function RequirementDetailModal({ open, requirement, onClose }: { open: boolean; requirement: Requirement | null; onClose: () => void }) {
  if (!open || !requirement) return null;
  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="w-full max-w-2xl bg-white rounded shadow p-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{requirement.title}</div>
          <button className="px-3 py-1.5 rounded border" onClick={onClose}>Close</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
          <div><span className="text-gray-600">ID:</span> REQ-{String(requirement.id).slice(-4)}</div>
          <div><span className="text-gray-600">Type:</span> {requirement.type === "functional" ? "Functional" : "Non-Functional"}</div>
          <div><span className="text-gray-600">Category:</span> {requirement.category || "-"}</div>
          <div><span className="text-gray-600">Priority:</span> {requirement.priority}</div>
          <div><span className="text-gray-600">Status:</span> {requirement.status}</div>
          <div><span className="text-gray-600">Confidence:</span> {requirement.confidence_score ?? "-"}</div>
          <div><span className="text-gray-600">Created by:</span> -</div>
          <div><span className="text-gray-600">Created:</span> {new Date().toLocaleDateString()}</div>
          <div><span className="text-gray-600">Updated:</span> {new Date().toLocaleDateString()}</div>
        </div>
        <div className="mt-4">
          <div className="text-gray-600">Description</div>
          <div className="mt-1 border rounded p-3 text-sm whitespace-pre-wrap">{requirement.description || "No description"}</div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button className="px-3 py-1.5 rounded bg-primary text-white">Edit</button>
          <button className="px-3 py-1.5 rounded border">Override Classification</button>
          <button className="px-3 py-1.5 rounded border text-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
}
