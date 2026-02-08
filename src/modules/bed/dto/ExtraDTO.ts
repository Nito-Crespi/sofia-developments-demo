export interface ExtraDTO {
  id: number;
  proyectoId: number;
  tipo: 'CONSULTORIO'|'LOCAL'|'OFICINA';
  descripcion?: string;
}
