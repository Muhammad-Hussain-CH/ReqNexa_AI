import { create } from "zustand";
import { getUsers, updateUserRole, updateUserStatus, getAnalytics, getActivityLogs, getSystemHealth } from "../services/admin.service";

type UserItem = { id: string; name: string; email: string; role: string; status: string; created_at: string; project_count: number };

type AdminState = {
  users: UserItem[];
  usersLoading: boolean;
  usersError: string | null;
  analytics: any;
  analyticsLoading: boolean;
  activity: { items: any[]; page: number; limit: number } | null;
  activityLoading: boolean;
  systemHealth: any | null;
  systemLoading: boolean;
  loadUsers: (filters?: { q?: string; role?: string; status?: string; page?: number; limit?: number }) => Promise<void>;
  changeUserRole: (id: string, role: string) => Promise<void>;
  changeUserStatus: (id: string, isActive: boolean) => Promise<void>;
  loadAnalytics: (filters?: { date_from?: string; date_to?: string }) => Promise<void>;
  loadActivity: (filters?: { user_id?: string; action_type?: string; date_from?: string; date_to?: string; limit?: number; page?: number }) => Promise<void>;
  loadSystemHealth: () => Promise<void>;
};

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  usersLoading: false,
  usersError: null,
  analytics: null,
  analyticsLoading: false,
  activity: null,
  activityLoading: false,
  systemHealth: null,
  systemLoading: false,
  async loadUsers(filters) {
    set({ usersLoading: true, usersError: null });
    try { const res = await getUsers(filters || {}); set({ users: res.items || [], usersLoading: false }); }
    catch (e: any) { set({ usersError: e?.response?.data?.error || e?.message || "Failed to load users", usersLoading: false }); }
  },
  async changeUserRole(id, role) {
    set({ usersLoading: true });
    try { await updateUserRole(id, role); set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, role } : u)), usersLoading: false })); }
    catch (e: any) { set({ usersError: e?.response?.data?.error || e?.message || "Failed to update role", usersLoading: false }); }
  },
  async changeUserStatus(id, isActive) {
    set({ usersLoading: true });
    try { await updateUserStatus(id, isActive); set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, status: isActive ? "active" : "inactive" } : u)), usersLoading: false })); }
    catch (e: any) { set({ usersError: e?.response?.data?.error || e?.message || "Failed to update status", usersLoading: false }); }
  },
  async loadAnalytics(filters) {
    set({ analyticsLoading: true });
    try { const res = await getAnalytics(filters || {}); set({ analytics: res, analyticsLoading: false }); }
    catch (e: any) { set({ analyticsLoading: false }); }
  },
  async loadActivity(filters) {
    set({ activityLoading: true });
    try { const res = await getActivityLogs(filters || {}); set({ activity: res, activityLoading: false }); }
    catch (e: any) { set({ activityLoading: false }); }
  },
  async loadSystemHealth() {
    set({ systemLoading: true });
    try { const res = await getSystemHealth(); set({ systemHealth: res, systemLoading: false }); }
    catch (e: any) { set({ systemLoading: false }); }
  },
}));

