import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tyn-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
})
export class FilterComponent {
  selectFilter = output<string>();

  currentPage = input<number>(1); // N° de paginas
  currentSize = input<number>(5); // Cantidad de Datos que desea que venga en lista

  placeholder = input<string>('Buscar');
  currentSearchTerm = input<string>('');
  currentDateStartValue = input<string>('');
  currentDateEndValue = input<string>('');
  filterMenu = input.required<any>();

  startDate: string = '';
  endDate: string = '';

  _activateRoute = inject(ActivatedRoute);
  _router = inject(Router);

  statusParam =
    this._activateRoute.snapshot.queryParamMap.get('status') ?? 'All';
  isState = linkedSignal(() => this.statusParam);

  inputParam =
    this._activateRoute.snapshot.queryParamMap.get('searchTerm') ?? '';
  searchTermLink = linkedSignal<string>(
    () => this.inputParam ?? this.currentSearchTerm()
  );

  initialDateStartParam =
    this._activateRoute.snapshot.queryParamMap.get('dateInitialFilter') ?? '';
  initialDateStart = linkedSignal<string>(
    () => this.initialDateStartParam ?? this.currentDateStartValue()
  );

  initialDateEndParam =
    this._activateRoute.snapshot.queryParamMap.get('dateEndFilter') ?? '';
  initialDateEnd = linkedSignal<string>(
    () => this.initialDateEndParam ?? this.currentDateEndValue()
  );

  filterByStatus(status: string): void {
    status = status === 'All' ? '' : status;
    this.selectFilter.emit(status);
  }

  debounceEffect = effect((onCleanup) => {
    const value = this.searchTermLink() || '';
    const valueStart = this.initialDateStart();
    const valueEnd = this.initialDateEnd();
    const timeout = setTimeout(() => {
      this.onChangeFilter();
    }, 500);
    onCleanup(() => {
      clearTimeout(timeout);
    });
  });

  onChangeFilter() {
    const queryParams: any = {};

    if (this.currentSize()) {
      queryParams.size = this.currentSize();
    }
    if (this.currentPage()) {
      queryParams.page = this.currentPage();
    }
    if (this.isState() && this.isState().trim()) {
      queryParams.status = this.isState();
    }
    if (this.initialDateStart()) {
      queryParams.dateInitialFilter = this.initialDateStart();
    }
    if (this.initialDateEnd()) {
      queryParams.dateEndFilter = this.initialDateEnd();
    }
    if (this.searchTermLink()) {
      queryParams.page = 1;
      queryParams.size = 5;
    }
    queryParams.searchTerm = this.searchTermLink();
    this._router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
