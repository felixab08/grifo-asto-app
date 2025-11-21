import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.component.html',
})
export class FrontNavbarComponent {
  navMenu = [
    { name: 'Corte', routes: ['/grifo/list-oil-store'] },
    { name: 'Medición', routes: ['/grifo/measurement'] },
    { name: 'Entrada', routes: ['/grifo/entrance'] },
    { name: 'Administrador', routes: ['/grifo/admision'] },
    // { name: 'Estadisticas', routes: ['/grifo/list-oil-store'] },
  ];
}
