import { IResponse } from "./response.interface";

export interface TurnoResponse extends IResponse {
  data:    TurnoPersona;
}

export interface TurnoPersona {
  turnos:    Turno;
  nombre:    string;
  apellido:  string;
  idPersona: number;
}

export interface Medida {
  idMedida: number;
  idTurno?:  number;
  tipo?:     string;
  entrada:  number;
  salida?:   number;
}

export interface Turno extends IResponse{
  content:          ContentTurno[];
}

export interface ContentTurno {
  idTurno:       number;
  fecha_entrada: Date;
  fecha_salida:  Date;
  medidas:       Medida[];
  observaciones:  string;
  sum:           number;
  rest:          number;
}



export enum Tipo {
  Petroleo = "petroleo",
  Primiun = "primiun",
  Regular = "regular",
}
