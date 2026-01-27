import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IOrganizationListResponse,
  IOrganizationResp,
  ITipoVentaResponse,
  TipoVentaContent,
} from '@oil-store/model';
import { OrganizationService, TipoVentaService } from '@oil-store/service';
import { AlertService } from 'src/app/service';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-header-select-ventas',
  imports: [FormsModule, NgClass],
  templateUrl: './header-select-ventas.html',
})
export class HeaderSelectVentas {
  private _organizationSrv = inject(OrganizationService);
  private _tipoVentaService = inject(TipoVentaService);

  private _alertService = inject(AlertService);
  organizationSelected = 'All';
  tipoVentaSelected = 'All';
  listOrganizationData = signal<IOrganizationResp[] | null>(null);
  listTipoVentaData = signal<TipoVentaContent[] | null>(null);

  lookTypeVenta = input<boolean>(true);
  idorganization = output<number>();
  idTipoVenta = output<number>();

  constructor() {
    this.listOrganizaciones();
  }

  listOrganizaciones() {
    this.idTipoVenta.emit(0);
    this.tipoVentaSelected = 'All';
    this.organizationSelected = 'All';
    this.listTipoVentaData.set(null);
    this._organizationSrv
      .getAllOrganization({ page: 0, size: 100, searchTerm: '', status: true })
      .subscribe({
        next: (resp: IOrganizationListResponse) => {
          this.listOrganizationData.set(resp.content);
        },
        error: (err: any) => {
          this._alertService.getAlert('Error al obtener la lista de personas', err);
        },
      });
  }

  listTipoVentas(value: any) {
    this.idorganization.emit(value);
    this.idTipoVenta.emit(0);
    this._tipoVentaService
      .getAllTipoVenta({ page: 0, size: 100, id: value, status: true })
      .subscribe({
        next: (resp: ITipoVentaResponse) => {
          this.listTipoVentaData.set(resp.content);
        },
        error: (err: any) => {
          this._alertService.getAlert('Error al obtener la lista de personas', err);
        },
      });
  }

  listaVentas(value: any) {
    this.idTipoVenta.emit(value);
  }
}
