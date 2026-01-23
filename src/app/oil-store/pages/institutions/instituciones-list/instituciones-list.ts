import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { OrganizationService } from '@oil-store/service/organization.service';
import { AlertService, LinkParamService } from 'src/app/service';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { FilterComponent } from 'src/app/components/filter/filter.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instituciones-list',
  imports: [PaginationComponent, FilterComponent],
  templateUrl: './instituciones-list.html',
})
export default class InstitucionesList {
  private _organizationSrv = inject(OrganizationService);
  private _alertService = inject(AlertService);
  _linkService = inject(LinkParamService);
  private _router = inject(Router);
  filterMenu = signal({
    searchShow: true,
    datesShow: false,
    selectShow: true,
    filterSelectList: [
      {
        id: true,
        value: 'ACTIVE',
      },
      {
        id: false,
        value: 'SUSPENDED',
      },
    ],
  });

  listOrganizationRx = rxResource({
    params: () => ({
      page: this._linkService.currentPage() - 1,
      size: this._linkService.currentSize(),
      status: this._linkService.currentStatus(),
      searchTerm: this._linkService.currentSearchTerm(),
    }),
    stream: ({ params }) => {
      return this._organizationSrv.getAllOrganization({
        page: params.page,
        size: params.size,
        searchTerm: params.searchTerm,
        status: params.status === 'true' ? true : params.status === 'false' ? false : undefined,
      });
    },
  });
  changeState(state: string): void {
    this._router.navigate([], {
      queryParams: { status: state, page: 1, size: 5 },
      queryParamsHandling: 'merge',
    });
  }
}
