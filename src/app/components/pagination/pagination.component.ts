import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [NgClass, RouterLink, FormsModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pages = input(0);
  totalElements = input(0);
  currentPage = input<number>(1); // N° de paginas
  currentSize = input<number>(5); // Cantidad de Datos que desea que venga en lista
  currentStatus = input<string>('All'); // Estado actual
  currentSearchTerm = input<string>(''); // Busqueda por termino
  currentDateStartValue = input<string>(''); // Fecha inicial del filtro
  currentDateEndValue = input<string>(''); // Fecha final del filtro

  itemsPage = signal(5);

  activePage = linkedSignal(this.currentPage);
  activeSize = linkedSignal(this.currentSize);
  activeStatus = linkedSignal(this.currentStatus);
  activeSearchTerm = linkedSignal(this.currentSearchTerm);

  _router = inject(Router);

  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });

  getPaginationButtons = computed(() => {
    const pages = this.pages();
    const active = this.activePage();
    const buttons: (number | string)[] = [];

    if (pages <= 5) {
      // Si hay 5 o menos páginas, mostrar todas
      return Array.from({ length: pages }, (_, i) => i + 1);
    }

    // Siempre agregar página 1
    buttons.push(1);

    // Si la página activa está lejos de la página 1, agregar puntos
    if (active > 3) {
      buttons.push('...');
    }

    // Agregar página anterior, actual y siguiente
    const startPage = Math.max(2, active - 1);
    const endPage = Math.min(pages - 1, active + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (!buttons.includes(i)) {
        buttons.push(i);
      }
    }

    // Si la página activa está lejos de la última página, agregar puntos
    if (active < pages - 2) {
      buttons.push('...');
    }

    // Siempre agregar última página
    if (!buttons.includes(pages)) {
      buttons.push(pages);
    }

    return buttons;
  });

  // TODO: mirar cuando se tiene mas datos
  getSizeList = computed(() => {
    const sizes = [5, 10, 25, 50];
    return [5, ...sizes.filter((size) => this.totalElements() * 2 >= size && size !== 5)];
  });

  previousPage() {
    if (this.activePage() > 1) {
      this.activePage.set(this.activePage() - 1);
    }
  }

  nextPage() {
    const pages = this.getPagesList();
    if (this.activePage() < pages[pages.length - 1]) {
      this.activePage.set(this.activePage() + 1);
    }
  }

  get activeSizeValue() {
    return this.activeSize();
  }
  set activeSizeValue(val: number) {
    this.activeSize.set(val);
  }

  onSizeChange(newSize: number) {
    this.activePage.set(1);
    this.activeSize.set(newSize);
    this._router.navigate([], {
      queryParams: this.buildQueryParams(1),
      queryParamsHandling: 'merge',
    });
  }

  buildQueryParams(page: number) {
    const params: Record<string, any> = {
      page,
      size: this.activeSize(),
      status: this.activeStatus(),
    };

    const term = this.activeSearchTerm();
    if (term !== null && term !== undefined && String(term).trim() !== '') {
      params['searchTerm'] = term;
    }

    const start = this.currentDateStartValue();
    if (start !== null && start !== undefined && String(start).trim() !== '') {
      params['dateInitialFilter'] = start;
    }

    const end = this.currentDateEndValue();
    if (end !== null && end !== undefined && String(end).trim() !== '') {
      params['dateEndFilter'] = end;
    }

    return params;
  }
}
