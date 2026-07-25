import type { Project } from "../dto/project.dto";

/**
 * Datos de ejemplo para proyectos de construcción
 * Puedes importar y usar estos datos para poblar el sistema
 */
export const SAMPLE_PROJECTS: Omit<
  Project,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    name: "Torre Residencial Vista Mar",
    code: "PROJ-2024-001",
    description:
      "Edificio residencial de lujo con 15 pisos, vista al mar, amenities completos incluyendo piscina, gimnasio y salón de eventos.",
    location: "Av. Costanera 4500, Mar del Plata, Buenos Aires",
    client: "Inmobiliaria Del Mar S.A.",
    status: "in_progress",
    priority: "high",
    startDate: "2024-01-15T00:00:00.000Z",
    estimatedEndDate: "2025-12-31T00:00:00.000Z",
    budget: 15000000,
    currentCost: 8500000,
    paymentsReceived: 10000000,
    estimatedProfit: 3500000,
    constructionType: "residential",
    area: 12000,
    floors: 15,
    technicalSpecs:
      "Estructura de hormigón armado H30, terminaciones de primera calidad, ascensores Otis, instalaciones con domótica completa.",
    mainMaterials: [
      "Hormigón H30",
      "Acero ADN-420",
      "Vidrio DVH",
      "Porcelanato importado",
    ],
    projectManager: "Ing. María Rodriguez",
    assignedTeam: [
      "Arq. Juan Pérez",
      "Ing. Carlos Gómez",
      "Capataz Roberto Silva",
      "Electricista Ana Martínez",
    ],
    permits: [
      {
        name: "Permiso de Construcción Municipal",
        status: "approved",
        expiryDate: "2025-12-31T00:00:00.000Z",
      },
      {
        name: "Habilitación Bomberos",
        status: "approved",
        expiryDate: "2026-01-31T00:00:00.000Z",
      },
      {
        name: "Certificado Ambiental",
        status: "pending",
      },
    ],
    notes:
      "Proyecto con alta demanda. Se han vendido 8 de 15 unidades en preventa. Coordinar con cliente para lanzamiento comercial del resto de las unidades.",
    documents: [
      "planos_arquitectonicos_v3.pdf",
      "estudio_suelos_geotecnico.pdf",
      "memoria_calculo_estructural.pdf",
    ],
    createdBy: "nito",
  },
  {
    name: "Centro Comercial Plaza Norte",
    code: "PROJ-2024-002",
    description:
      "Shopping center de 3 niveles con 120 locales comerciales, cines multiplex, patio de comidas y estacionamiento subterráneo.",
    location: "Ruta Panamericana Km 38, Pilar, Buenos Aires",
    client: "Grupo Desarrollos Comerciales",
    status: "planning",
    priority: "urgent",
    startDate: "2024-06-01T00:00:00.000Z",
    estimatedEndDate: "2026-06-30T00:00:00.000Z",
    budget: 45000000,
    currentCost: 2500000,
    paymentsReceived: 5000000,
    estimatedProfit: 8000000,
    constructionType: "commercial",
    area: 35000,
    floors: 3,
    technicalSpecs:
      "Estructura metálica con losa colaborante, fachada de vidrio templado, sistema HVAC centralizado, sistema contra incendios automático.",
    mainMaterials: [
      "Perfiles metálicos IPN",
      "Losa colaborante",
      "Vidrio templado 10mm",
      "Deck metálico",
    ],
    projectManager: "Ing. Fernando Sánchez",
    assignedTeam: [
      "Arq. Laura Fernández",
      "Ing. Civil Miguel Ruiz",
      "Ing. Eléctrico Pablo Torres",
    ],
    permits: [
      {
        name: "Factibilidad Municipal",
        status: "pending",
      },
      {
        name: "Impacto Ambiental",
        status: "pending",
      },
      {
        name: "Habilitación Vial",
        status: "approved",
        expiryDate: "2024-12-31T00:00:00.000Z",
      },
    ],
    notes:
      "En fase de aprobación de permisos. Cliente solicita inicio urgente. Preparar logística de obra para arranque inmediato una vez aprobados los permisos.",
    documents: [
      "estudio_factibilidad.pdf",
      "proyecto_ejecutivo_arquitectura.pdf",
    ],
    createdBy: "nito",
  },
  {
    name: "Planta Industrial AutoParts",
    code: "PROJ-2023-045",
    description:
      "Nave industrial para fabricación de autopartes con oficinas administrativas, depósito y zona de carga.",
    location: "Parque Industrial Zárate, Buenos Aires",
    client: "AutoParts Argentina S.A.",
    status: "completed",
    priority: "medium",
    startDate: "2023-03-01T00:00:00.000Z",
    estimatedEndDate: "2024-01-31T00:00:00.000Z",
    actualEndDate: "2024-02-15T00:00:00.000Z",
    budget: 8500000,
    currentCost: 8200000,
    paymentsReceived: 8500000,
    estimatedProfit: 300000,
    constructionType: "industrial",
    area: 5500,
    floors: 1,
    technicalSpecs:
      "Nave industrial con cubierta metálica liviana, portones seccionales automáticos, instalación eléctrica trifásica 380V, playa de maniobras.",
    mainMaterials: [
      "Estructura metálica",
      "Chapa trapezoidal",
      "Hormigón H21",
      "Portones seccionales",
    ],
    projectManager: "Ing. Roberto Díaz",
    assignedTeam: [
      "Capataz Luis Ramírez",
      "Soldador especializado José García",
    ],
    permits: [
      {
        name: "Habilitación Industrial",
        status: "approved",
        expiryDate: "2029-12-31T00:00:00.000Z",
      },
      {
        name: "Seguridad e Higiene",
        status: "approved",
        expiryDate: "2025-12-31T00:00:00.000Z",
      },
    ],
    notes:
      "Proyecto finalizado exitosamente. Cliente muy satisfecho con los tiempos y calidad. Posible nuevo proyecto en planificación.",
    documents: [
      "acta_recepcion_final.pdf",
      "certificado_final_obra.pdf",
      "manual_mantenimiento.pdf",
    ],
    createdBy: "nito",
  },
  {
    name: "Puente Vehicular Ruta 9",
    code: "PROJ-2024-003",
    description:
      "Construcción de puente vehicular de dos carriles sobre arroyo, con estructura de hormigón pretensado.",
    location: "Ruta Nacional 9, Km 245, Córdoba",
    client: "Vialidad Nacional - Ministerio de Obras Públicas",
    status: "cancelled",
    priority: "high",
    startDate: "2024-02-01T00:00:00.000Z",
    estimatedEndDate: "2024-11-30T00:00:00.000Z",
    budget: 12000000,
    currentCost: 7800000,
    paymentsReceived: 8000000,
    estimatedProfit: 2000000,
    constructionType: "infrastructure",
    area: 850,
    technicalSpecs:
      "Puente de 85m de luz, dos carriles de 3.5m cada uno, estructura de vigas pretensadas, fundaciones profundas con pilotes.",
    mainMaterials: [
      "Hormigón H40",
      "Cables de pretensado",
      "Acero ADN-420",
      "Asfalto CAC",
    ],
    projectManager: "Ing. Alberto Mendoza",
    assignedTeam: [
      "Ing. Estructural Sandra López",
      "Topógrafo Martín Castro",
      "Capataz General Pedro Flores",
      "Operador Grúa Raúl Moreno",
    ],
    permits: [
      {
        name: "Permiso Vialidad Nacional",
        status: "approved",
        expiryDate: "2025-01-31T00:00:00.000Z",
      },
      {
        name: "Impacto Ambiental Hídrico",
        status: "approved",
        expiryDate: "2025-12-31T00:00:00.000Z",
      },
      {
        name: "Corte de Ruta",
        status: "approved",
        expiryDate: "2024-12-31T00:00:00.000Z",
      },
    ],
    notes:
      "Obra crítica para el sistema vial de la zona. Coordinar trabajos nocturnos para minimizar impacto en el tránsito. Seguimiento estricto de plazos.",
    documents: [
      "proyecto_estructural.pdf",
      "estudio_hidraulico.pdf",
      "plan_gestion_trafico.pdf",
    ],
    createdBy: "santi",
  },
  {
    name: "Renovación Hotel Boutique Centro",
    code: "PROJ-2024-004",
    description:
      "Renovación completa de hotel boutique histórico: 25 habitaciones, restaurante, spa y terraza.",
    location: "Av. de Mayo 850, CABA",
    client: "Hoteles de Autor S.R.L.",
    status: "paused",
    priority: "low",
    startDate: "2024-04-01T00:00:00.000Z",
    estimatedEndDate: "2024-10-31T00:00:00.000Z",
    budget: 5500000,
    currentCost: 2100000,
    paymentsReceived: 2000000,
    estimatedProfit: 800000,
    constructionType: "renovation",
    area: 2800,
    floors: 5,
    technicalSpecs:
      "Preservación de fachada histórica, renovación completa de instalaciones, nuevos baños en suite, sistema de climatización VRV.",
    mainMaterials: [
      "Porcelanato",
      "Sanitarios importados",
      "Carpintería de PVC DVH",
      "Membrana asfáltica",
    ],
    projectManager: "Arq. Valentina Russo",
    assignedTeam: [
      "Maestro Mayor Pablo Herrera",
      "Instalador sanitario Javier Benítez",
    ],
    permits: [
      {
        name: "Dirección de Patrimonio Histórico",
        status: "approved",
        expiryDate: "2025-04-30T00:00:00.000Z",
      },
      {
        name: "Permiso Municipal de Obra",
        status: "approved",
        expiryDate: "2024-12-31T00:00:00.000Z",
      },
    ],
    notes:
      "Obra pausada por solicitud del cliente debido a revisión de diseño de interiores. Reinicio estimado en 2 meses. Mantener comunicación con proveedor de materiales especiales.",
    documents: [
      "relevamiento_fotografico.pdf",
      "propuesta_diseno_interior_v2.pdf",
    ],
    createdBy: "nito",
  },
  {
    name: "Barrio Privado Las Palmeras",
    code: "PROJ-2023-052",
    description:
      "Urbanización de barrio cerrado con 45 lotes, clubhouse, canchas deportivas y laguna artificial.",
    location: "Camino del Buen Ayre Km 12, Ezeiza, Buenos Aires",
    client: "Desarrollos Urbanos del Sur",
    status: "in_progress",
    priority: "medium",
    startDate: "2023-08-01T00:00:00.000Z",
    estimatedEndDate: "2025-03-31T00:00:00.000Z",
    budget: 28000000,
    currentCost: 18500000,
    paymentsReceived: 20000000,
    estimatedProfit: 5500000,
    constructionType: "residential",
    area: 125000,
    technicalSpecs:
      "Movimiento de suelos, red de agua potable, cloacas, desagües pluviales, red eléctrica subterránea, alumbrado público, portería automatizada.",
    mainMaterials: [
      "Caños PVC",
      "Cable subterráneo",
      "Adoquines de hormigón",
      "Especies forestales nativas",
    ],
    projectManager: "Ing. Gabriela Morales",
    assignedTeam: [
      "Ing. Hidráulico Ricardo Navarro",
      "Topógrafo Juan Medina",
      "Paisajista Clara Domínguez",
      "Electricista Mateo Vega",
      "Capataz de Movimiento de Suelos Omar Ríos",
    ],
    permits: [
      {
        name: "Factibilidad de Servicios",
        status: "approved",
        expiryDate: "2026-12-31T00:00:00.000Z",
      },
      {
        name: "Evaluación Impacto Ambiental",
        status: "approved",
        expiryDate: "2027-08-31T00:00:00.000Z",
      },
      {
        name: "Subdivisión Catastral",
        status: "pending",
      },
    ],
    notes:
      "Fase 1 (primera 20 lotes) completada. En ejecución Fase 2. Alto interés de compradores, coordinar con área comercial para visitas guiadas sin interferir en obra.",
    documents: [
      "plano_subdivision.pdf",
      "proyecto_redes_infraestructura.pdf",
      "reglamento_construccion_barrio.pdf",
    ],
    createdBy: "nito",
  },
];

/**
 * Función helper para cargar los datos de ejemplo en el store
 * Uso:
 * import { loadSampleProjects } from './data/sampleProjects';
 * loadSampleProjects();
 */
export function loadSampleProjects() {
  const now = new Date().toISOString();
  const projectsWithMetadata: Project[] = SAMPLE_PROJECTS.map(
    (project, index) => ({
      ...project,
      id: `sample_${index + 1}`,
      createdAt: now,
      updatedAt: now,
    }),
  );

  try {
    localStorage.setItem(
      "demo_projects_storage",
      JSON.stringify(projectsWithMetadata),
    );
    console.log(
      `✅ ${projectsWithMetadata.length} proyectos de ejemplo cargados exitosamente`,
    );
    return projectsWithMetadata;
  } catch (error) {
    console.error("Error al cargar proyectos de ejemplo:", error);
    return [];
  }
}
