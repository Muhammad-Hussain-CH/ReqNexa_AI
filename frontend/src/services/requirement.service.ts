import { api } from "./api";

export async function updateRequirement(id: string, data: Partial<{ title: string; description: string | null; type: string; category: string | null; priority: string; status: string }>) {
  const res = await api.put(`/api/requirements/${id}`, data);
  return res.data;
}

export async function deleteRequirement(id: string) {
  const res = await api.delete(`/api/requirements/${id}`);
  return res.data;
}

export async function bulkUpdateRequirements(requirement_ids: string[], updates: Partial<{ status: string; priority: string; category: string | null }>) {
  const res = await api.put(`/api/requirements/bulk`, { requirement_ids, updates });
  return res.data;
}
