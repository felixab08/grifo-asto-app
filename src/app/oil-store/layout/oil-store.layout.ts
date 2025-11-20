import { Component } from '@angular/core';
import { FrontNavbarComponent } from '../components/front-navbar/front-navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-page',
  imports: [FrontNavbarComponent, RouterOutlet],
  templateUrl: './oil-store.layout.html',
})
export class OilLayout {}
