import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MedidorRequest, MedidorResponse } from '@oil-store/model';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class MedidorService {
  private _http = inject(HttpClient);

  postMedidaByTurno(medida: MedidorRequest): Observable<MedidorResponse> {
    console.log('medida--------------->');
    console.log(medida);

    return this._http.post(`${baseUrl}/registro-medidor/registrar`, medida).pipe(
      tap((resp: any) => {
        console.log(resp);
      })
    );
  }
  putMedidaByTurno(id: number, turno: MedidorRequest): Observable<MedidorResponse> {
    return this._http.post(`${baseUrl}/registro-medidor/update${id}`, turno).pipe(
      tap((resp: any) => {
        console.log(resp);
      })
    );
  }
}
