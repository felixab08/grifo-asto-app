import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { OrganizationService } from '@oil-store/service/organization.service';
import { TipoVentaService } from '@oil-store/service/tipoVenta.service';
import { AlertService, LinkParamService } from 'src/app/service';
import { FilterComponent } from 'src/app/components/filter/filter.component';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { Router } from '@angular/router';
import { FormUtils } from '@utils/form.util';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { HeaderSelectVentas } from '@oil-store/components/header-select-ventas/header-select-ventas';

@Component({
  selector: 'app-tipo-venta',
  imports: [ReactiveFormsModule, FilterComponent, PaginationComponent, NgClass, HeaderSelectVentas],
  templateUrl: './tipoVenta.html',
})
export default class TipoVenta {
  private _tipoVentaService = inject(TipoVentaService);
  private _organizationSrv = inject(OrganizationService);
  public _linkService = inject(LinkParamService);
  private _router = inject(Router);
  modalOpen = signal(false);
  typeDialog = signal<'Crear' | 'Editar'>('Crear');
  private _alertService = inject(AlertService);
  idOrga = signal(0);
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
    idTipoVenta: [0],
    tipo: ['', [Validators.required]],
    codigo: [''],
    status: [true, [Validators.required]],
    organization: {
      idOrganization: [null, [Validators.required]],
    },
  });

  listTipoVentaRx = rxResource({
    params: () => ({
      page: this._linkService.currentPage() - 1,
      size: this._linkService.currentSize(),
      status: this._linkService.currentStatus(),
      id: this.idOrga(),
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
  idorganizationSelected(event: any) {
    this.idOrga.set(event);
    this.myForm.patchValue({
      organization: { idOrganization: event },
    });
  }
  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    if (this.typeDialog() === 'Editar') {
      this._tipoVentaService
        .putTipoVenta(this.myForm.value.idTipoVenta, this.myForm.value)
        .subscribe({
          next: (resp: any) => {
            this._alertService.getAlert(
              'Tipo de venta editada',
              'Tipo de venta editada satisfactoriamente',
              'success',
            );
            this.listTipoVentaRx.reload();
            this.myForm.reset();
            this.closeModal(this.modalOrgRef?.nativeElement);
          },
          error: (err: any) => {
            this._alertService.getAlert('Error!!!', 'Error al editar la tipo de venta', 'error');
          },
        });
    } else {
      const data = this.myForm.value;
      delete data.idTipoVenta;
      this._tipoVentaService.postTipoVenta(data).subscribe({
        next: (resp: any) => {
          this._alertService.getAlert(
            'Tipo de venta creada',
            'Tipo de venta creada satisfactoriamente',
            'success',
          );
          this.listTipoVentaRx.reload();
          this.myForm.reset();
          this.closeModal(this.modalOrgRef?.nativeElement);
        },
        error: (err: any) => {
          this._alertService.getAlert('Error!!!', 'Error al crear la tipo de venta', 'error');
        },
      });
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

  onEdit(item: any) {
    this.myForm.patchValue({
      idTipoVenta: item.idTipoVenta,
      tipo: item.tipo,
      codigo: item.codigo,
      status: item.status,
      organization: {
        idOrganization: item.organization.idOrganization,
      },
    });
  }

  openModal(item: any, dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      this.modalOpen.set(true);
      this.typeDialog.set(item ? 'Editar' : 'Crear');
      this.onEdit(item);
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
