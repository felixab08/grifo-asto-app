import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { AlertService, LinkParamService } from 'src/app/service';
import { HeaderSelectVentas } from '@oil-store/components/header-select-ventas/header-select-ventas';
import { DetalleVentaService } from '@oil-store/service';
import { IVentasResponse, VentasContent } from '@oil-store/model';
import 'cally';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form.util';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ventas-institution',
  imports: [HeaderSelectVentas, ReactiveFormsModule, NgClass],
  templateUrl: './ventas-institution.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class VentasInstitution {
  @ViewChild('calendarRange', { static: false }) calendarRange!: ElementRef;
  private _detalleVentaSrv = inject(DetalleVentaService);
  public listDetalleVenta = signal<IVentasResponse | null>(null);
  private _alertService = inject(AlertService);
  public rangeFechaSelected = signal<string>('');
  public _linkService = inject(LinkParamService);

  handleCalendar = signal<boolean>(false);
  idTipeoVenta = signal<number>(0);

  modalOpen = signal(false);
  typeDialog = signal<'Crear' | 'Editar'>('Crear');
  @ViewChild('modalVentaRef') modalOrgRef!: ElementRef;

  formUtils = FormUtils;

  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    idDetalleVenta: [0],
    numVale: ['', [Validators.required]],
    persona: ['', [Validators.required]],
    placa: [''],
    area: [''],
    diesel: [0],
    regular: [0],
    premiun: [0],
    fechaVenta: ['', Validators.required],
    tipoVenta: {
      idTipoVenta: this.idTipeoVenta(),
    },
  });

  onRangeChange() {
    const value = this.calendarRange.nativeElement.value;
    this.rangeFechaSelected.set(value);
    let range = this.rangeFechaSelected().split('/');
    let startDate = range[0];
    let endDate = range[1];
    this.searchDetalleVenta(this.idTipeoVenta(), startDate, endDate);
  }

  listaVenta(id: any) {
    this.idTipeoVenta.set(id);
    id !== 0 ? this.handleCalendar.set(true) : this.handleCalendar.set(false);
    this.listDetalleVenta.set(null);
  }
  searchDetalleVenta(id: number, fechaInicio: string, fechaFin: string) {
    this._detalleVentaSrv
      .getAllTipoVenta({ page: 0, size: 100, id: id, startDate: fechaInicio, endDate: fechaFin })
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.listDetalleVenta.set(resp);
        },
        error: (err: any) => {
          this._alertService.getAlert('Error al obtener la lista de personas', err);
        },
      });
  }

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log(this.myForm.value);
  }

  onEdit(item: VentasContent) {
    this.myForm.patchValue({
      idDetalleVenta: item.idDetalleVenta,
      numVale: item.numVale,
      persona: item.persona,
      placa: item.placa,
      area: item.area,
      diesel: item.diesel,
      regular: item.regular,
      premiun: item.premiun,
      fechaVenta: item.fechaVenta,
      tipoVenta: {
        idTipoVenta: item.tipoVenta.idTipoVenta,
      },
    });
  }
  openModal(item: VentasContent, dialog?: HTMLDialogElement | null): void {
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
