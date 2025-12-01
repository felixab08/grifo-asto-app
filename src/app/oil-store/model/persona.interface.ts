import { IResponse } from "./response.interface";

export interface PersonaResponse extends IResponse {
  data: Persona[];
}

export interface Persona {
  idPersona?:   number;
  nombre:       string;
  apellido:     string;
  telefono:     string;
  fechaCreate?: Date;
}

export interface TurnoRequest {
  fechaEntrada: Date;
  persona:      Persona;
}

export interface TurnoRegisterResponse {
  idTurno:       number;
  observaciones: string;
  fechaEntrada:  Date;
  fechaSalida:   Date;
  persona:       Persona;
}

