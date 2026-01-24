import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { OrganizationService } from '@oil-store/service/organization.service';
import { TipoVentaService } from '@oil-store/service/tipoVenta.service';
import { LinkParamService } from 'src/app/service';
import { FilterComponent } from 'src/app/components/filter/filter.component';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { Router } from '@angular/router';
import { FormUtils } from '@utils/form.util';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tipo-venta',
  imports: [ReactiveFormsModule, FilterComponent, PaginationComponent, NgClass],
  templateUrl: './tipoVenta.html',
})
export default class TipoVenta {
  private _tipoVentaService = inject(TipoVentaService);
  private _organizationSrv = inject(OrganizationService);
  public _linkService = inject(LinkParamService);
  private _router = inject(Router);
  modalOpen = signal(false);

  filterMenu = signal({
    searchShow: false,
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

  @ViewChild('modalOrgRef') modalOrgRef!: ElementRef;

  formUtils = FormUtils;

  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    nombreOrganization: ['', [Validators.required]],
    status: ['true', [Validators.required]],
    ruc: [''],
  });

  listTipoVentaRx = rxResource({
    params: () => ({
      page: this._linkService.currentPage() - 1,
      size: this._linkService.currentSize(),
      status: this._linkService.currentStatus(),
      id: 1,
    }),
    stream: ({ params }) => {
      return this._tipoVentaService.getAllTipoVenta({
        page: params.page,
        size: params.size,
        id: params.id,
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

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
  }

  listOrganizationRx = rxResource({
    params: () => ({
      page: 0,
      size: 100,
      status: true,
    }),
    stream: ({ params }) => {
      return this._organizationSrv.getAllOrganization({
        page: params.page,
        size: params.size,
        status: params.status,
      });
    },
  });

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
}
