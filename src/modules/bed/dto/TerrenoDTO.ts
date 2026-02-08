export interface TerrenoDTO {
  id: number;
  proyectoId: number;
  ubicacion: string; //clase apropiada
  localidad: string;
  superficieM2: number;  //aumenta si se compran terrenos vecinos
  descripcion?: string;
}
