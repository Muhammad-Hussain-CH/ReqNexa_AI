import { api } from "./api";

export async function getAllProjects(filters: { status?: string }, pagination: { page?: number; limit?: number }) {
  const res = await api.get("/api/projects", { params: { ...filters, ...pagination } });
  return res.data;
}

export async function getProjects(params: { page?: number; limit?: number; status?: string }) {
  const res = await api.get("/api/projects", { params });
  return res.data;
}

export async function getProjectById(id: string) {
  const res = await api.get(`/api/projects/${id}`);
  return res.data;
}

export async function createProject(body: { name: string; type: string; description?: string | null }) {
  const res = await api.post("/api/projects", body);
  return res.data;
}

export async function updateProject(id: string, data: Partial<{ name: string; description: string | null; status: string }>) {
  const res = await api.put(`/api/projects/${id}`, data);
  return res.data;
}

export async function deleteProject(id: string) {
  const res = await api.delete(`/api/projects/${id}`);
  return res.data;
}

export async function getProjectRequirements(projectId: string, filters?: Partial<{ type: string; priority: string; status: string; category: string }>, pagination?: Partial<{ page: number; limit: number }>) {
  const res = await api.get("/api/requirements", { params: { project_id: projectId, ...(filters || {}), ...(pagination || {}) } });
  return res.data;
}

export async function addTeamMember(projectId: string, userId: string, role: string, permissions?: Record<string, unknown>) {
  const res = await api.post(`/api/projects/${projectId}/members`, { user_id: userId, role, permissions });
  return res.data;
}

export async function removeTeamMember(projectId: string, userId: string) {
  const res = await api.delete(`/api/projects/${projectId}/members/${userId}`);
  return res.data;
}
