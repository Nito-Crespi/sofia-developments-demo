import { create } from "zustand";
import type { Project, ProjectFormData } from "../dto/project.dto";
import { STORAGE_KEYS } from "../constants";
import { generateProjectId } from "../utils/helpers";

type ProjectsState = {
  projects: Project[];
  // Operaciones CRUD
  getAll: () => Project[];
  getById: (id: string) => Project | null;
  create: (data: ProjectFormData) => Project;
  update: (id: string, data: Partial<ProjectFormData>) => void;
  delete: (id: string) => void;
  // Filtros
  getByStatus: (status: Project["status"]) => Project[];
  getByManager: (manager: string) => Project[];
};

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (error) {
    console.error("Error saving projects:", error);
  }
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: loadProjects(),

  getAll: () => get().projects,

  getById: (id: string) => {
    return get().projects.find((p) => p.id === id) ?? null;
  },

  create: (data: ProjectFormData) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...data,
      id: generateProjectId(),
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...get().projects, newProject];
    saveProjects(updated);
    set({ projects: updated });
    return newProject;
  },

  update: (id: string, data: Partial<ProjectFormData>) => {
    const updated = get().projects.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p,
    );
    saveProjects(updated);
    set({ projects: updated });
  },

  delete: (id: string) => {
    const updated = get().projects.filter((p) => p.id !== id);
    saveProjects(updated);
    set({ projects: updated });
  },

  getByStatus: (status) => {
    return get().projects.filter((p) => p.status === status);
  },

  getByManager: (manager) => {
    return get().projects.filter((p) => p.projectManager === manager);
  },
}));
