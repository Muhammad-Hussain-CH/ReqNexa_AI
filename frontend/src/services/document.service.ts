import { api } from "./api";

export type GenerateDocPayload = {
  project_id: string;
  type: "srs" | "user_stories" | "requirements_export";
  format: "pdf" | "docx" | "html" | "csv" | "json" | "xml";
  template?: "ieee" | "agile";
  options?: { include_toc?: boolean; include_glossary?: boolean; include_traceability?: boolean; include_diagrams?: boolean };
};

export async function generateDocument(payload: GenerateDocPayload) {
  const res = await api.post("/api/documents/generate", payload);
  return res.data;
}

export async function listDocuments(project_id: string) {
  const res = await api.get(`/api/documents/${project_id}/list`);
  return res.data;
}

export async function downloadDocument(document_id: string) {
  const res = await api.get(`/api/documents/${document_id}/download`, { responseType: "blob" });
  return res.data as Blob;
}

export async function deleteDocument(document_id: string) {
  const res = await api.delete(`/api/documents/${document_id}`);
  return res.data;
}

