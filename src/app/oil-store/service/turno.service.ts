import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  TurnoResponse,
  TurnoRequest,
  TurnoRegisterResponse,
  IReporteTurno,
  OptionsRequest,
} from '@oil-store/model';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private _http = inject(HttpClient);

  getAllTurnosByIdPerson(id: number, options: OptionsRequest): Observable<TurnoResponse> {
    const { page = 0, size = 10 } = options;
    const params = {
      page,
      size,
    };
    return this._http.get<TurnoResponse>(`${baseUrl}/turno/list/${id}`, { params });
  }

  postRegisterTurnoByIdPersona(turno: TurnoRequest): Observable<TurnoRegisterResponse> {
    return this._http.post<TurnoRegisterResponse>(`${baseUrl}/turno/registrar`, turno);
  }

  putRegisterTurnoByIdPersona(
    id: number,
    turno: TurnoRegisterResponse,
  ): Observable<TurnoRegisterResponse> {
    return this._http.put<TurnoRegisterResponse>(`${baseUrl}/turno/update/${id}`, turno);
  }

  getReporte(year: number) {
    return this._http.get<IReporteTurno>(`${baseUrl}/turno/reporte/${year}`);
  }
}
