import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { OrganizationService } from '@oil-store/service/organization.service';
import { AlertService, LinkParamService } from 'src/app/service';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { FilterComponent } from 'src/app/components/filter/filter.component';
import { Router } from '@angular/router';
import { HeaderSelectVentas } from '@oil-store/components/header-select-ventas/header-select-ventas';
import { PersonaResponse } from '@oil-store/model';

@Component({
  selector: 'app-ventas-institution',
  imports: [HeaderSelectVentas],
  templateUrl: './ventas-institution.html',
})
export default class VentasInstitution {}
