export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "paused"
  | "completed"
  | "cancelled";

export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export type ConstructionType =
  | "residential"
  | "commercial"
  | "industrial"
  | "infrastructure"
  | "renovation";

export type Project = {
  id: string;

  // Información General
  name: string;
  code: string; // Código único del proyecto (ej: PROJ-2024-001)
  description: string;
  location: string;
  client: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  amenities: Amenity[];
  extras: Extra[];
  livingunits: LivingUnit[]; //like houses or appartments

  // Fechas
  startDate: string; // ISO format
  estimatedEndDate: string;
  actualEndDate?: string;

  // Información Financiera
  budget: number; // Presupuesto total
  currentCost: number; // Costos actuales
  paymentsReceived: number; // Pagos recibidos del cliente
  estimatedProfit: number; // Ganancia estimada

  // Información Técnica
  constructionType: ConstructionType;
  area: number; // Área en m²
  floors?: number; // Número de pisos
  technicalSpecs: string; // Especificaciones técnicas
  mainMaterials: string[]; // Materiales principales

  // Recursos Humanos
  projectManager: string; // Responsable del proyecto
  assignedTeam: string[]; // Equipo asignado

  // Permisos y Licencias
  permits: {
    name: string;
    status: "pending" | "approved" | "rejected";
    expiryDate?: string;
  }[];

  // Notas y Documentos
  notes: string;
  documents: string[]; // URLs o referencias a documentos

  // Metadatos
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type ProjectFormData = Omit<Project, "id" | "createdAt" | "updatedAt">;


export type AmenityType =
  | "Pileta"
  | "SUM"
  | "GYM";

export interface Amenity{
  type: AmenityType;
  details?: string;
}

export type ExtraType =
  | "CONSULTORIO"
  | "LOCAL"
  | "OFICINA";

export interface Extra{
  type: ExtraType;
  details?: string;
}

export type LivingUnitType = "CASA" | "DEPTO" | "DUPLEX";
export type LivingUnitState = "PLANIFICADA" |"DISPONIBLE" | "VENDIDA_POZO" | "VENDIDA";

export interface LivingUnit { //for example, an appartment
  code: string;        // ex: "Casa 3", "5A"
  type: LivingUnitType;
  areaM2: number;
  dorms: number;
  baths: number;
  state: LivingUnitState;
  price?: number;
}
