import { EventEmitter, Injectable } from '@angular/core';
import { IPersonaResponse } from '@auth/interfaces/auth-response.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  /*
  SHARED and REACTIVE data (no STORAGE)
  We need share and react at data change,
  but we don't need store your current states.
  If we need update yours states,
  we need make a new request to the service
  no need for refresh each components.
 */
  public isSessionActive$ = new EventEmitter<boolean>();
  public isLoading$ = new EventEmitter<boolean>();
  public isModalConfirm$ = new EventEmitter<boolean>();
  public menuIzquierdo$ = new EventEmitter<any[]>();

  // SHARED, REACTIVE and STORED DATA
  // We need share, react and store at each data change,
  // If we need update yours states, we need make a new request
  // to the service and all subscribers will react at this change.

  isLoginSubject = new BehaviorSubject<boolean>(false);
  user = new BehaviorSubject<IPersonaResponse | undefined>(undefined);
  isAlertSubject = new BehaviorSubject<boolean>(false);
}
