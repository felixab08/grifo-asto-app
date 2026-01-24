import { Component, inject, signal } from '@angular/core';
import { PersonaResponse } from '@oil-store/model';
import { OrganizationService } from '@oil-store/service/organization.service';
import { AlertService } from 'src/app/service';

@Component({
  selector: 'app-header-select-ventas',
  imports: [],
  templateUrl: './header-select-ventas.html',
})
export class HeaderSelectVentas {
  private _organizationSrv = inject(OrganizationService);
  private _alertService = inject(AlertService);

  listOrganizationData = signal<PersonaResponse | null>(null);

  constructor() {
    this.listOrganizaciones();
  }

  listOrganizaciones() {
    this._organizationSrv
      .getAllOrganization({ page: 0, size: 100, searchTerm: '', status: true })
      .subscribe({
        next: (resp: any) => {
          console.log(resp);

          this.listOrganizationData.set(resp);
        },
        error: (err: any) => {
          this._alertService.getAlert('Error al obtener la lista de personas', err);
        },
      });
  }
}
