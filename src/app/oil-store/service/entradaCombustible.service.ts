import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CombustibleRequest, CombustibleResponse, ICombustible } from '@oil-store/model';
import { OptionsRequest } from '@oil-store/model/services.interface';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class EntradaCombustibleService {
  private _http = inject(HttpClient);

  getAllEntradas(options: OptionsRequest): Observable<CombustibleResponse> {
    const { page = 0, size = 5 } = options;
    const params = {
      page,
      size,
    };
    return this._http.get<CombustibleResponse>(`${baseUrl}/entrada-combustible/list`, { params });
  }

  postEntradas(medida: CombustibleRequest): Observable<ICombustible> {
    return this._http.post<ICombustible>(`${baseUrl}/entrada-combustible/registrar`, medida);
  }
}
