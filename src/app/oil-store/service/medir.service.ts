import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Medida } from '@oil-store/model';
import { IResponseMedidor, MedidaRequest } from '@oil-store/model/medir.interface';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class MedirService {
  private _http = inject(HttpClient);

  getAllMedidas(cantidad = 10): Observable<IResponseMedidor> {
    return this._http.get<IResponseMedidor>(`${baseUrl}/medicion/list?cantidad=${cantidad}`);
  }

  postMedition(medida: MedidaRequest): Observable<Medida> {
    return this._http.post<Medida>(`${baseUrl}/medicion/registrar`, medida);
  }
}
