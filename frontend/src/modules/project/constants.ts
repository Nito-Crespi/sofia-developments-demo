import type { ConstructionType, Project } from "./dto/project.dto";

// Estados
export const STATUS_COLORS: Record<Project["status"], string> = {
  planning: "blue",
  in_progress: "default",
  paused: "warning",
  completed: "success",
  cancelled: "error",
};

export const STATUS_LABELS: Record<Project["status"], string> = {
  planning: "Planificación",
  in_progress: "En Progreso",
  paused: "Pausado",
  completed: "Completado",
  cancelled: "Cancelado",
};

export const STATUS_OPTIONS = [
  { label: "Planificación", value: "planning" },
  { label: "En Progreso", value: "in_progress" },
  { label: "Pausado", value: "paused" },
  { label: "Completado", value: "completed" },
  { label: "Cancelado", value: "cancelled" },
] as const;

// Prioridad
export const PRIORITY_COLORS: Record<Project["priority"], string> = {
  low: "default",
  medium: "blue",
  high: "orange",
  urgent: "red",
};

export const PRIORITY_LABELS: Record<Project["priority"], string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
};

export const PRIORITY_OPTIONS = [
  { label: "Baja", value: "low" },
  { label: "Media", value: "medium" },
  { label: "Alta", value: "high" },
  { label: "Urgente", value: "urgent" },
] as const;

// Tipo de Construcción
export const CONSTRUCTION_TYPE_LABELS: Record<ConstructionType, string> = {
  residential: "Residencial",
  commercial: "Comercial",
  industrial: "Industrial",
  infrastructure: "Infraestructura",
  renovation: "Renovación",
};

export const CONSTRUCTION_TYPE_OPTIONS = [
  { label: "Residencial", value: "residential" },
  { label: "Comercial", value: "commercial" },
  { label: "Industrial", value: "industrial" },
  { label: "Infraestructura", value: "infrastructure" },
  { label: "Renovación", value: "renovation" },
] as const;

// Permisos y Licencias
export const PERMIT_STATUS_COLORS = {
  pending: "warning",
  approved: "success",
  rejected: "error",
} as const;

export const PERMIT_STATUS_LABELS = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
} as const;

export const PERMIT_STATUS_OPTIONS = [
  { label: "Pendiente", value: "pending" },
  { label: "Aprobado", value: "approved" },
  { label: "Rechazado", value: "rejected" },
] as const;

export const STORAGE_KEYS = {
  PROJECTS: "demo_projects_storage",
} as const;
