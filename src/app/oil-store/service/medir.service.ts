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

  getAllMedidas(): Observable<IResponseMedidor> {
    return this._http
      .get<IResponseMedidor>(`${baseUrl}/medicion/list`)
      .pipe(tap((resp) => console.log(resp)));
  }

  postMedition(medida: MedidaRequest, cantidad = 10): Observable<Medida> {
    return this._http.post(`${baseUrl}/medicion/registrar?cantidad=${cantidad}`, medida).pipe(
      tap((resp: any) => {
        console.log(resp);
      })
    );
  }
}
