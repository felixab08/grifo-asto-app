import { IResponse } from "./response.interface";

export interface ITipoVentaResponse extends IResponse{
  content:          TipoVentaContent[];

}

export interface TipoVentaContent {
  idTipoVenta:  number;
  tipo:         string;
  codigo:       string;
  status:       boolean;
  premiun:      number;
  regular:      number;
  diesel:       number;
  organization: {
    idOrganization:     number;
    nombreOrganization?: string;
  };
}

