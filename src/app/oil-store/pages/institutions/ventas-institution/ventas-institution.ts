import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { OrganizationService } from '@oil-store/service/organization.service';
import { AlertService, LinkParamService } from 'src/app/service';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { FilterComponent } from 'src/app/components/filter/filter.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas-institution',
  imports: [PaginationComponent, FilterComponent],
  templateUrl: './ventas-institution.html',
})
export class VentasInstitution {}
