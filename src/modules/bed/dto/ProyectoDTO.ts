import type { TerrenoDTO } from "./TerrenoDTO";
import type { EtapaDTO } from "./EtapaDTO";
import type { ViviendaDTO } from "./ViviendaDTO";
import type { AmenityDTO } from "./AmenityDTO";
import type { ExtraDTO } from "./ExtraDTO";

export interface ProyectoDTO {
    id: number;
    nombre: string;
    descripcion?: string;
      
    terreno: TerrenoDTO;
    etapa: EtapaDTO;
  
    viviendas: ViviendaDTO[];
    amenities: AmenityDTO[];
    extras: ExtraDTO[];
  }
  