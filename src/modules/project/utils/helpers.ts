/**
 * Genera un ID único para proyectos
 * @returns String con formato proj_timestamp_random
 */
export function generateProjectId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
