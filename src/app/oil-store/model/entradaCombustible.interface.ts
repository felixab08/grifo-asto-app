import { Persona } from "./persona.interface";
import { IResponse } from "./response.interface";

export interface CombustibleResponse extends IResponse{
  content:          ICombustible[];
  page:             number;
  size:             number;
  totalElements:    number;
  totalPages:       number;
  first:            boolean;
  last:             boolean;
  hasNext:          boolean;
  hasPrevious:      boolean;
  numberOfElements: number;
  empty:            boolean;
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
