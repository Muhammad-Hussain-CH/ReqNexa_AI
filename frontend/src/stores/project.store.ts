import { create } from "zustand";
import { getAllProjects, getProjectById, createProject as apiCreateProject, updateProject as apiUpdateProject, deleteProject as apiDeleteProject, getProjectRequirements } from "../services/project.service";
import { updateRequirement as reqUpdate, deleteRequirement as reqDelete, bulkUpdateRequirements as reqBulkUpdate } from "../services/requirement.service";
import { api } from "../services/api";
import { Project, Requirement } from "../types";

type FilterState = { status?: string; type?: string; priority?: string; q?: string };

type ProjectState = {
  projects: Project[];
  activeProject: Project | null;
  currentProjectId: string | null;
  requirements: Requirement[];
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (id: string | null) => void;
  loadProjects: (filters?: FilterState, pagination?: { page?: number; limit?: number }) => Promise<void>;
  selectProject: (id: string) => Promise<void>;
  createProject: (data: { name: string; type: string; description?: string | null }) => Promise<Project | any>;
  updateProject: (id: string, data: Partial<{ name: string; description: string | null; status: string }>) => Promise<any>;
  deleteProject: (id: string) => Promise<any>;
  loadRequirements: (projectId: string, filters?: Partial<{ type: string; priority: string; status: string; category: string }>, pagination?: Partial<{ page: number; limit: number }>) => Promise<void>;
  updateRequirement: (id: string, data: Partial<Requirement>) => Promise<void>;
  deleteRequirement: (id: string) => Promise<void>;
  bulkUpdateRequirements: (ids: string[], updates: Partial<{ status: string; priority: string; category: string | null }>) => Promise<void>;
};

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  activeProject: null,
  currentProjectId: null,
  requirements: [],
  filters: {},
  isLoading: false,
  error: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (id) => set({ currentProjectId: id }),
  async loadProjects(filters, pagination) {
    set({ isLoading: true, error: null });
    try {
      const res = await getAllProjects(filters || {}, pagination || {});
      set({ projects: res.projects ?? [], isLoading: false });
    } catch (e: any) {
      set({ error: e?.message || "Failed to load projects", isLoading: false });
    }
  },
  async selectProject(id) {
    set({ isLoading: true, error: null, currentProjectId: id });
    try {
      const res = await getProjectById(id);
      set({ activeProject: res.project ?? res, isLoading: false });
    } catch (e: any) {
      set({ error: e?.message || "Failed to load project", isLoading: false });
    }
  },
  async createProject(data) {
    set({ isLoading: true, error: null });
    try {
      const res = await apiCreateProject(data);
      set((s) => ({ projects: [res.project ?? res, ...s.projects], isLoading: false }));
      return res.project ?? res;
    } catch (e: any) {
      set({ error: e?.message || "Failed to create project", isLoading: false });
      throw e;
    }
  },
  async updateProject(id, data) {
    set({ isLoading: true, error: null });
    try {
      const res = await apiUpdateProject(id, data);
      set((s) => ({
        projects: s.projects.map((p) => (p.id === id ? (res.project ?? res) : p)),
        activeProject: s.activeProject && s.activeProject.id === id ? (res.project ?? res) : s.activeProject,
        isLoading: false,
      }));
      return res.project ?? res;
    } catch (e: any) {
      set({ error: e?.message || "Failed to update project", isLoading: false });
      throw e;
    }
  },
  async deleteProject(id) {
    set({ isLoading: true, error: null });
    try {
      const res = await apiDeleteProject(id);
      set((s) => ({ projects: s.projects.filter((p) => p.id !== id), isLoading: false }));
      return res;
    } catch (e: any) {
      set({ error: e?.message || "Failed to delete project", isLoading: false });
      throw e;
    }
  },
  async loadRequirements(projectId, filters, pagination) {
    set({ isLoading: true, error: null });
    try {
      const res = await getProjectRequirements(projectId, filters, pagination);
      set({ requirements: res.requirements ?? res.items ?? [], isLoading: false });
    } catch (e: any) {
      set({ error: e?.message || "Failed to load requirements", isLoading: false });
    }
  },
  async updateRequirement(id, data) {
    set({ isLoading: true, error: null });
    try {
      const res = await reqUpdate(id, data);
      set((s) => ({ requirements: s.requirements.map((r) => (r.id === id ? (res.requirement ?? res) : r)), isLoading: false }));
    } catch (e: any) {
      set({ error: e?.message || "Failed to update requirement", isLoading: false });
      throw e;
    }
  },
  async deleteRequirement(id) {
    set({ isLoading: true, error: null });
    try {
      await reqDelete(id);
      set((s) => ({ requirements: s.requirements.filter((r) => r.id !== id), isLoading: false }));
    } catch (e: any) {
      set({ error: e?.message || "Failed to delete requirement", isLoading: false });
      throw e;
    }
  },
  async bulkUpdateRequirements(ids, updates) {
    set({ isLoading: true, error: null });
    try {
      const res = await reqBulkUpdate(ids, updates);
      const updated = res.requirements ?? [];
      set((s) => ({ requirements: s.requirements.map((r) => {
        const u = updated.find((x: any) => x.id === r.id);
        return u ? u : r;
      }), isLoading: false }));
    } catch (e: any) {
      set({ error: e?.message || "Failed to bulk update requirements", isLoading: false });
      throw e;
    }
  },
}));
