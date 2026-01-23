import { IResponse } from "./response.interface";

export interface IOrganizationReq {
  nombreOrganization: string;
  status:             string;
  ruc:                string;
}
export interface IOrganizationResp {
  idOrganization: string;
  nombreOrganization: string;
  status:             string;
  ruc:                string;
}

export interface IOrganizationListResponse extends IResponse{
  content:          IOrganizationResp[];

}
