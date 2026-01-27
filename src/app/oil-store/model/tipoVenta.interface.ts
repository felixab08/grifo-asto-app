import { IResponse } from "./response.interface";

export interface ITipoVentaResponse extends IResponse{
  content:          TipoVentaContent[];

}

export interface TipoVentaContent {
  idTipoVenta:  number;
  tipo:         string;
  codigo:       string;
  status:       boolean;
  organization: {
    idOrganization:     number;
    nombreOrganization?: string;
  };
}

