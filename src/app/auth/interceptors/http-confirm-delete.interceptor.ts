import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { StoreService } from 'src/app/service';
import { Observable, EMPTY } from 'rxjs';
import { filter, take, switchMap } from 'rxjs/operators';
import { IConfirmDelete } from '@auth/interfaces/confirDelete.interface';

export function confirmDeleteInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const _storeService = inject(StoreService);

  // Only handle DELETE requests
  if (req.method !== 'DELETE') return next(req);

  // If the request has the `noConfirm` param, remove it and continue
  if (req.params.get('noConfirm')) {
    const newReq = req.clone({ params: req.params.delete('noConfirm') });
    return next(newReq);
  }

  // Ask for confirmation via the shared _storeService and wait for an answer
  _storeService.isModalConfirm$.emit(true);

  return _storeService.responseModalConfirm$.pipe(
    filter((resp: IConfirmDelete) => resp.answered),
    take(1),
    switchMap((resp: IConfirmDelete) => {
      _storeService.isModalConfirm$.emit(false);
      _storeService.responseModalConfirmSubject.next({ answered: false, response: false });
      return resp.response ? next(req) : EMPTY;
    }),
  );
}
