import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CombustibleRequest, CombustibleResponse, ICombustible } from '@oil-store/model';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class EntradaCombustibleService {
  private _http = inject(HttpClient);

  getAllEntradas(cantidad = 10): Observable<CombustibleResponse> {
    return this._http
      .get<CombustibleResponse>(`${baseUrl}/entrada-combustible/list`)
      .pipe(tap((resp) => console.log(resp)));
  }

  postEntradas(medida: CombustibleRequest): Observable<ICombustible> {
    return this._http.post(`${baseUrl}/entrada-combustible/registrar`, medida).pipe(
      tap((resp: any) => {
        console.log(resp);
      })
    );
  }
}
