import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TurnoResponse, TurnoRequest, TurnoRegisterResponse } from '@oil-store/model';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private _http = inject(HttpClient);

  getAllTurnosByIdPerson(id: number = 6): Observable<TurnoResponse> {
    return this._http
      .get<TurnoResponse>(`${baseUrl}/turno/list/${id}`)
      .pipe(tap((resp) => console.log(resp)));
  }

  postRegisterTurnoByIdPersona(turno: TurnoRequest): Observable<TurnoRegisterResponse> {
    return this._http.post(`${baseUrl}/turno/registrar`, turno).pipe(
      tap((resp: any) => {
        console.log(resp);
        localStorage.setItem('turno', JSON.stringify(resp));
      })
    );
  }
  putRegisterTurnoByIdPersona(
    id: number,
    turno: TurnoRegisterResponse
  ): Observable<TurnoRegisterResponse> {
    return this._http.post(`${baseUrl}/turno/update${id}`, turno).pipe(
      tap((resp: any) => {
        console.log(resp);
      })
    );
  }
}
