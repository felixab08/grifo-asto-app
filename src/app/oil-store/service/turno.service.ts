import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  TurnoResponse,
  TurnoRequest,
  TurnoRegisterResponse,
  IReporteTurno,
  OptionsRequest,
} from '@oil-store/model';
import { map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { addTotalTurnoMapper } from '@mapper/addTotalTurno.mapper';

const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private _http = inject(HttpClient);

  getAllTurnosByIdPerson(options: OptionsRequest): Observable<TurnoResponse> {
    const { id = 0, page = 0, size = 10 } = options;
    const params = {
      page,
      size,
    };
    return this._http.get<TurnoResponse>(`${baseUrl}/turno/list/${id}`, { params }).pipe(
      map((resp: TurnoResponse) => ({
        ...resp,
        data: {
          ...resp.data,
          content: addTotalTurnoMapper(resp.data.content),
        },
      })),
    );
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
