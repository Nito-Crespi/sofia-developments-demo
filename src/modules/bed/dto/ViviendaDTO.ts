export interface ViviendaDTO {
  id: number;
  proyectoId: number;

  codigo: string;        // ej: "Casa 3"
  tipo: 'CASA' | 'DEPTO' | 'DUPLEX';
  superficieM2: number;
  dormitorios: number;
  banios: number;

  estado: 'PLANIFICADA' |'DISPONIBLE' | 'VENDIDA_POZO' | 'VENDIDA';
  
  precio?: number;
}
