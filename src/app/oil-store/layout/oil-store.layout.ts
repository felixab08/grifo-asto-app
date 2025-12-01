import { Component, inject } from '@angular/core';
import { FrontNavbarComponent } from '../components/front-navbar/front-navbar.component';
import { RouterOutlet } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-page',
  imports: [FrontNavbarComponent, RouterOutlet, AlertComponent],
  templateUrl: './oil-store.layout.html',
})
export class OilLayout {
  public storeService = inject(StoreService);
  public _alertService = inject(AlertService);
}
