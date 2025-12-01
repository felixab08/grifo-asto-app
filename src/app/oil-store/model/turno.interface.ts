import { Persona } from "./persona.interface";
import { IResponse } from "./response.interface";

export interface TurnoResponse extends IResponse {
  data:    TurnoPersona[];
}

export interface TurnoPersona extends Persona {
  turnos:    Turno[];
}

export interface Turno {
  idTurno:       number;
  fecha_entrada: Date;
  fecha_salida:  Date;
  medidas:       Medida[];
  observaciones: string;
}

export interface Medida {
  idMedida: number;
  idTurno:  number;
  tipo:     string;
  entrada:  number;
  salida:   number;
}
