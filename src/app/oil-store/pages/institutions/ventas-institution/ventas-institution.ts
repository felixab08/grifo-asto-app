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
import { IVentasResponse } from '@oil-store/model';
import 'cally';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';

@Component({
  selector: 'app-ventas-institution',
  imports: [HeaderSelectVentas],
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
  onRangeChange() {
    const value = this.calendarRange.nativeElement.value;
    this.rangeFechaSelected.set(value);
    let range = this.rangeFechaSelected().split('/');
    let startDate = range[0];
    let endDate = range[1];

    console.log('Rango seleccionado:', startDate, endDate);
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
}
