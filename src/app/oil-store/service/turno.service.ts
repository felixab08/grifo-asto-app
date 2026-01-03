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

  getAllTurnosByIdPerson(id: number): Observable<TurnoResponse> {
    return this._http.get<TurnoResponse>(`${baseUrl}/turno/list/${id}`);
  }

  postRegisterTurnoByIdPersona(turno: TurnoRequest): Observable<TurnoRegisterResponse> {
    return this._http.post<TurnoRegisterResponse>(`${baseUrl}/turno/registrar`, turno);
  }

  putRegisterTurnoByIdPersona(
    id: number,
    turno: TurnoRegisterResponse
  ): Observable<TurnoRegisterResponse> {
    return this._http.put<TurnoRegisterResponse>(`${baseUrl}/turno/update/${id}`, turno);
  }
}
