import { Persona } from "./persona.interface";
import { IResponse } from "./response.interface";

export interface CombustibleResponse extends IResponse{
  data:    ICombustible[];
}

export interface ICombustible {
  idEntrada:    number;
  tipo:         string;
  cantidad:     number;
  fechaEntrada: Date;
  persona:      Persona;
}

export interface CombustibleRequest {
  tipo:     string;
  cantidad: number;
  persona:  Persona;
}


