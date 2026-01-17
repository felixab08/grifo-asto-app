import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OptionsRequest, PersonaResponse } from '@oil-store/model';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private _http = inject(HttpClient);

  getAllPerson(options: OptionsRequest): Observable<PersonaResponse> {
    const { page = 0, size = 10 } = options;
    const params = {
      page,
      size,
    };
    return this._http.get<PersonaResponse>(`${baseUrl}/persona/list`, { params });
  }

  postRegisterUser(user: PersonaResponse): Observable<PersonaResponse> {
    return this._http.post<PersonaResponse>(`${baseUrl}/persona/registrar`, user);
  }
}
