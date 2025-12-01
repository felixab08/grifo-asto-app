import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PersonaResponse } from '@oil-store/model';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private _http = inject(HttpClient);

  getAllPerson(): Observable<PersonaResponse> {
    return this._http
      .get<PersonaResponse>(`${baseUrl}/persona/list`)
      .pipe(tap((resp) => console.log(resp)));
  }

  postRegisterUser(user: PersonaResponse): Observable<PersonaResponse> {
    return this._http.post(`${baseUrl}/persona/registrar`, user).pipe(
      tap((resp: any) => {
        console.log(resp);
      })
    );
  }
}
