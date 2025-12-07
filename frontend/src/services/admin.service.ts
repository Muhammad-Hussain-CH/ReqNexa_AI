import { api } from "./api";

export async function getUsers(filters: { q?: string; role?: string; status?: string; page?: number; limit?: number } = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== null && String(v).length) params.set(k, String(v)); });
  const res = await api.get(`/api/admin/users?${params.toString()}`);
  return res.data;
}

export async function updateUserRole(userId: string, role: string) {
  const res = await api.put(`/api/admin/users/${userId}/role`, { role });
  return res.data;
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  const res = await api.put(`/api/admin/users/${userId}/status`, { is_active: isActive });
  return res.data;
}

export async function getAnalytics(filters: { date_from?: string; date_to?: string } = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
  const res = await api.get(`/api/admin/analytics?${params.toString()}`);
  return res.data;
}

export async function getActivityLogs(filters: { user_id?: string; action_type?: string; date_from?: string; date_to?: string; limit?: number; page?: number } = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== null && String(v).length) params.set(k, String(v)); });
  const res = await api.get(`/api/admin/activity?${params.toString()}`);
  return res.data;
}

export async function getSystemHealth() {
  const res = await api.get(`/api/admin/system/health`);
  return res.data;
}

