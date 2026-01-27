import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ITipoVentaResponse, OptionsRequest, TipoVentaContent } from '@oil-store/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class TipoVentaService {
  private _http = inject(HttpClient);

  getAllTipoVenta(options: OptionsRequest): Observable<ITipoVentaResponse> {
    const params: any = {
      page: options.page,
      size: options.size,
      id: options.id || 1,
    };
    if (options.status !== 'All') params.status = options.status;
    return this._http.get<ITipoVentaResponse>(`${baseUrl}/tipo-venta/list`, { params });
  }

  postTipoVenta(organization: TipoVentaContent): Observable<TipoVentaContent> {
    return this._http.post<TipoVentaContent>(`${baseUrl}/tipo-venta/registrar`, organization);
  }

  putTipoVenta(id: number, organization: TipoVentaContent): Observable<TipoVentaContent> {
    return this._http.put<TipoVentaContent>(`${baseUrl}/tipo-venta/editar/${id}`, organization);
  }
}
