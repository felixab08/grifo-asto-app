import { IPersonaResponse, UserData } from "@auth/interfaces/auth-response.interface";
import { IResponse } from "./response.interface";

export interface PersonaResponse extends IResponse {
  content: Persona[];
}

export interface Persona extends IPersonaResponse{
  idPersona: number;

}

export interface TurnoRequest {
  fechaEntrada: Date;
  persona:      Persona;
}

export interface TurnoRegisterResponse {
  idTurno:       number;
  observaciones: string;
  fechaEntrada?:  Date | string;
  fechaSalida:   Date | string;
  persona:       Persona;
  sum: number;
  rest: number;
}

export interface IReporteTurno {
  code:    number;
  valores: number[];
  meses:   string[];
}
