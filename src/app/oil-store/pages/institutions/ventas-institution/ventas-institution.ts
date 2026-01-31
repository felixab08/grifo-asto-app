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
import { IVentasResponse, OptionsRequest, TipoVentaContent, VentasContent } from '@oil-store/model';
import 'cally';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form.util';
import { NgClass, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-ventas-institution',
  imports: [HeaderSelectVentas, ReactiveFormsModule, NgClass, UpperCasePipe],
  templateUrl: './ventas-institution.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class VentasInstitution {
  @ViewChild('calendarRange', { static: false }) calendarRange!: ElementRef;
  private _detalleVentaSrv = inject(DetalleVentaService);
  public listDetalleVenta = signal<IVentasResponse | null>(null);
  public oldFilterOptions = signal<OptionsRequest | null>(null);
  private _alertService = inject(AlertService);
  public rangeFechaSelected = signal<string>('Seleccionar rango de fecha');
  public _linkService = inject(LinkParamService);

  handleCalendar = signal<boolean>(false);
  idTipeoVenta = signal<TipoVentaContent | null>(null);

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
    diesel: [],
    regular: [],
    premiun: [],
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
    if (this.idTipeoVenta() !== null)
      this.searchDetalleVenta(this.idTipeoVenta()!.idTipoVenta, startDate, endDate);
  }

  listaVenta(venta: TipoVentaContent | null) {
    this.idTipeoVenta.set(venta);
    this.rangeFechaSelected.set('Seleccionar rango de fecha');
    venta !== null ? this.handleCalendar.set(true) : this.handleCalendar.set(false);
    this.listDetalleVenta.set(null);
  }

  searchDetalleVenta(id: number, fechaInicio: string, fechaFin: string) {
    this.oldFilterOptions.set({
      startDate: fechaInicio,
      endDate: fechaFin,
    });
    this._detalleVentaSrv
      .getAllTipoVenta({ page: 0, size: 100, id: id, startDate: fechaInicio, endDate: fechaFin })
      .subscribe({
        next: (resp: any) => {
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
    this.myForm.value.tipoVenta.idTipoVenta = this.idTipeoVenta()?.idTipoVenta;
    if (this.typeDialog() === 'Crear') {
      delete this.myForm.value.idDetalleVenta;
      this._detalleVentaSrv.postTipoVenta(this.myForm.value).subscribe({
        next: (resp: any) => {
          this._alertService.getAlert('Éxito', 'Venta creada correctamente', 'success');
          this.closeModal(this.modalOrgRef?.nativeElement);
          this.listDetalleVenta.set(null);
          if (this.oldFilterOptions() !== undefined && this.oldFilterOptions() !== null) {
            this.searchDetalleVenta(
              this.idTipeoVenta()!.idTipoVenta,
              this.oldFilterOptions()!.startDate!,
              this.oldFilterOptions()!.endDate!,
            );
          }
        },
        error: (err: any) => {
          this._alertService.getAlert('Error al crear la venta', err);
        },
      });
    } else {
      this._detalleVentaSrv
        .putTipoVenta(this.myForm.value.idDetalleVenta, this.myForm.value)
        .subscribe({
          next: (resp: any) => {
            this._alertService.getAlert('Éxito', 'Venta actualizada correctamente', 'success');
            this.closeModal(this.modalOrgRef?.nativeElement);
            this.listDetalleVenta.set(null);
            if (this.oldFilterOptions() !== undefined && this.oldFilterOptions() !== null) {
              this.searchDetalleVenta(
                this.idTipeoVenta()!.idTipoVenta,
                this.oldFilterOptions()!.startDate!,
                this.oldFilterOptions()!.endDate!,
              );
            }
          },
          error: (err: any) => {
            this._alertService.getAlert('Error al actualizar la venta', err);
          },
        });
    }
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

  deleteVenta(id: number) {
    this._detalleVentaSrv.deleteVentas(id);
    this.searchDetalleVenta(
      this.idTipeoVenta()!.idTipoVenta,
      this.oldFilterOptions()!.startDate!,
      this.oldFilterOptions()!.endDate!,
    );
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

  descargarXLS(): void {
    // Lee la tabla HTML y genera un CSV con BOM UTF-8 (Excel lo abre correctamente)
    const table = document.querySelector<HTMLTableElement>('#simpleTable2');
    if (!table) {
      console.warn('Tabla no encontrada: #simpleTable1');
      return;
    }

    const rows = Array.from(table.querySelectorAll('tr'));
    const csvRows: string[] = [];

    for (const row of rows) {
      const cells = Array.from(row.querySelectorAll('th, td'));
      const values = cells.map((cell) => {
        let text = (cell.textContent || '').trim();
        // escapar comillas duplicándolas según CSV RFC
        text = text.replace(/"/g, '""');
        // envolver en comillas si contiene comas, saltos de línea o comillas
        if (/[,"\n]/.test(text)) {
          return `"${text}"`;
        }
        return text;
      });
      csvRows.push(values.join(','));
    }

    // prefijo BOM para que Excel reconozca UTF-8 correctamente
    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `REPORTE_${this.idTipeoVenta()?.organization?.nombreOrganization}-${new Date().toISOString().slice(0, 10)}.xlsx`;

    // descarga compatible con navegadores
    if ((navigator as any).msSaveBlob) {
      (navigator as any).msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}
