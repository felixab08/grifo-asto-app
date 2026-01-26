import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IVentasReq, IVentasResponse, OptionsRequest } from '@oil-store/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class DetalleVentaService {
  private _http = inject(HttpClient);

  getAllTipoVenta(options: OptionsRequest): Observable<IVentasResponse> {
    console.log(options);

    const params: any = {
      page: options.page,
      size: options.size,
      id: options.id || 1,
      startDate: options.startDate ? options.startDate : new Date(0).toISOString(),
      endDate: options.endDate ? options.endDate : new Date(0).toISOString(),
    };
    return this._http.get<IVentasResponse>(`${baseUrl}/detalle-venta/list`, { params });
  }

  postTipoVenta(organization: IVentasReq): Observable<IVentasReq> {
    return this._http.post<IVentasReq>(`${baseUrl}/detalle-venta/registrar`, organization);
  }

  putTipoVenta(id: number, organization: IVentasReq): Observable<IVentasReq> {
    return this._http.put<IVentasReq>(`${baseUrl}/detalle-venta/editar/${id}`, organization);
  }
}
