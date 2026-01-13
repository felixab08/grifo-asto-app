import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LinkParamService {
  _activatedRoute = inject(ActivatedRoute);
  currentPage = toSignal(
    this._activatedRoute.queryParamMap.pipe(
      map((params) => (params.get('page') ? +params.get('page')! : 1)),
      map((page) => (isNaN(page) ? 1 : page))
    ),
    {
      initialValue: 1,
    }
  );

  currentSize = toSignal(
    this._activatedRoute.queryParamMap.pipe(
      map((params) => (params.get('size') ? +params.get('size')! : 5)),
      map((size) => (isNaN(size) ? 5 : size))
    ),
    {
      initialValue: 5,
    }
  );
  currentStatus = toSignal(
    this._activatedRoute.queryParamMap.pipe(
      map((params) => (params.get('status') ? params.get('status')! : 'All'))
    ),
    {
      initialValue: 'All',
    }
  );
  currentSearchTerm = toSignal(
    this._activatedRoute.queryParamMap.pipe(
      map((params) =>
        params.get('searchTerm') ? params.get('searchTerm')! : ''
      )
    ),
    {
      initialValue: '',
    }
  );
  currentDateInitialFilter = toSignal(
    this._activatedRoute.queryParamMap.pipe(
      map((params) =>
        params.get('dateInitialFilter') ? params.get('dateInitialFilter')! : ''
      )
    ),
    {
      initialValue: '',
    }
  );
  currentDateEndFilter = toSignal(
    this._activatedRoute.queryParamMap.pipe(
      map((params) =>
        params.get('dateEndFilter') ? params.get('dateEndFilter')! : ''
      )
    ),
    {
      initialValue: '',
    }
  );
}
