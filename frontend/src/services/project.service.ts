import { api } from "./api";

export async function createProject(body: { name: string; type: string; description?: string | null }) {
  const res = await api.post("/api/projects", body);
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
