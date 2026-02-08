export interface AmenityDTO {
  id: number;
  proyectoId: number;
  tipo: 'Pileta'| 'SUM'| 'GYM';
  descripcion?: string;
}
