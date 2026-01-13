import { IPersonaResponse, UserData } from "@auth/interfaces/auth-response.interface";
import { IResponse } from "./response.interface";
import { Idpersona } from './medir.interface';

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
  fechaEntrada:  Date;
  fechaSalida:   Date;
  persona:       Persona;
}

