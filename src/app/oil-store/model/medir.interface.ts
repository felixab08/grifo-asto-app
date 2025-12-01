import { Persona } from './persona.interface';
import { IResponse } from './response.interface';

export interface IResponseMedidor extends IResponse {
  code:    number;
  data:    Medida[];
  message: string;
}

export interface Medida {
  idMedicion:    number;
  idpersona:     Persona;
  fechaMedicion: Date;
  diesel:        number;
  regular:       number;
  premiun:       number;
}


export interface MedidaRequest {
  idpersona: Idpersona;
  diesel:    number;
  regular:   number;
  premiun:   number;
}

export interface Idpersona {
  idPersona: number;
}
