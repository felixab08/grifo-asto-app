import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AlertService, LinkParamService } from 'src/app/service';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { FilterComponent } from 'src/app/components/filter/filter.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form.util';
import { NgClass } from '@angular/common';
import { OrganizationService } from '@oil-store/service';

@Component({
  selector: 'app-instituciones-list',
  imports: [ReactiveFormsModule, PaginationComponent, FilterComponent, NgClass],
  templateUrl: './instituciones-list.html',
})
export default class InstitucionesList {
  private _organizationSrv = inject(OrganizationService);
  private _alertService = inject(AlertService);
  _linkService = inject(LinkParamService);
  private _router = inject(Router);
  modalOpen = signal(false);

  @ViewChild('modalOrgRef') modalOrgRef!: ElementRef;

  filterMenu = signal({
    searchShow: true,
    datesShow: false,
    selectShow: true,
    filterSelectList: [
      {
        id: true,
        value: 'ACTIVO',
      },
      {
        id: false,
        value: 'SUSPENDIDO',
      },
    ],
  });
  formUtils = FormUtils;

  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    nombreOrganization: ['', [Validators.required]],
    status: ['true', [Validators.required]],
    ruc: [''],
  });

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this._organizationSrv.getAllOrganization(this.myForm.value).subscribe({
      next: (resp: any) => {
        this._alertService.getAlert(
          'Organización creada',
          'Organización creada satisfactoriamente',
          'success',
        );
        this.listOrganizationRx.reload();
        this.myForm.reset();
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al crear la Organización', 'error');
        return;
      },
    });
  }
  onEdit(idOrganization: number) {}

  openModal(item: any, dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      this.modalOpen.set(true);
      console.log(item);
    } catch (err) {
      console.error('No se pudo abrir el modal', err);
    }
  }

  closeModal(dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
      this.modalOpen.set(false);
    } catch (err) {
      console.error('No se pudo cerrar el modal', err);
    }
  }

  listOrganizationRx = rxResource({
    params: () => ({
      page: this._linkService.currentPage() - 1,
      size: this._linkService.currentSize(),
      status: this._linkService.currentStatus(),
      searchTerm: this._linkService.currentSearchTerm(),
    }),
    stream: ({ params }) => {
      return this._organizationSrv.getAllOrganization({
        page: params.page,
        size: params.size,
        searchTerm: params.searchTerm,
        status: params.status === 'true' ? true : params.status === 'false' ? false : 'All',
      });
    },
  });

  changeState(state: string): void {
    this._router.navigate([], {
      queryParams: { status: state, page: 1, size: 5 },
      queryParamsHandling: 'merge',
    });
  }
}
