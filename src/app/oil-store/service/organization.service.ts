import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  IOrganizationListResponse,
  IOrganizationReq,
  IOrganizationResp,
  OptionsRequest,
} from '@oil-store/model';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private _http = inject(HttpClient);

  getAllOrganization(options: OptionsRequest): Observable<IOrganizationListResponse> {
    const params: any = {
      page: options.page,
      size: options.size,
      searchTerm: options.searchTerm || '',
    };
    if (options.status !== 'All') params.status = options.status;
    return this._http.get<IOrganizationListResponse>(`${baseUrl}/organization/list`, { params });
  }

  postOrganization(organization: IOrganizationReq): Observable<IOrganizationResp> {
    return this._http.post<IOrganizationResp>(`${baseUrl}/organization/registrar`, organization);
  }

  putOrganization(id: number, organization: IOrganizationResp): Observable<IOrganizationResp> {
    return this._http.put<IOrganizationResp>(`${baseUrl}/organization/editar/${id}`, organization);
  }
}
