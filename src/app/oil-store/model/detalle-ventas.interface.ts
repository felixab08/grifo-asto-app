import { IResponse } from "./response.interface";

export interface IVentasResponse extends IResponse{
  content:          VentasContent[];
}

export interface VentasContent {
  idDetalleVenta: number;
  numVale:        string;
  persona:        string;
  placa:          string;
  area:           string;
  fechaVenta:     Date;
  diesel:         number;
  regular:        number;
  premiun:        number;
  tipoVenta:      any;
}

export interface IVentasReq {
  numVale:    string;
  persona:    string;
  placa:      string;
  area:       string;
  diesel:     string;
  regular:    string;
  premiun:    string;
  fechaVenta: Date;
  tipoVenta:  TipoVenta;
}

export interface TipoVenta {
  idTipoVenta: number;
}

