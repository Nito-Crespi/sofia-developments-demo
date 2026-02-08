//Etapa segun kanban
export interface EtapaDTO {
  estado: 'NO_CONFIRMADO' 
  |'CONFIRMADO_A_CONSTRUCCION' 
  | 'EN_PROGRESO' 
  | 'FINALIZADO';
}
