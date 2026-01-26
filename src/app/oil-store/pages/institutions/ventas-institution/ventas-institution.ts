import { Component, inject, signal } from '@angular/core';
import { AlertService } from 'src/app/service';
import { HeaderSelectVentas } from '@oil-store/components/header-select-ventas/header-select-ventas';
import { DetalleVentaService } from '@oil-store/service';
import { IVentasResponse } from '@oil-store/model';

@Component({
  selector: 'app-ventas-institution',
  imports: [HeaderSelectVentas],
  templateUrl: './ventas-institution.html',
})
export default class VentasInstitution {
  private _detalleVentaSrv = inject(DetalleVentaService);
  public listDetalleVenta = signal<IVentasResponse | null>(null);
  private _alertService = inject(AlertService);

  listaVenta(id: any) {
    this._detalleVentaSrv.getAllTipoVenta({ page: 0, size: 100, id: id }).subscribe({
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
