import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IRegisterUser } from '@oil-store/model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private _http = inject(HttpClient);

  postRegisterUser(user: IRegisterUser): Observable<IRegisterUser> {
    return this._http.post<IRegisterUser>(`${baseUrl}/auth/register`, user);
  }
}
