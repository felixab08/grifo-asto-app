import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IPersonaResponse, UserData } from '@auth/interfaces/auth-response.interface';
import { AuthService } from '@auth/services/auth.service';
import { navMenu, navMenuAdmin } from '@oil-store/constant/oil-data.contant';
import { StoreService } from 'src/app/service/store.service';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.component.html',
})
export class FrontNavbarComponent {
  public storeService = inject(StoreService);
  public isLogin: boolean = false;
  _authService = inject(AuthService);
  public user: IPersonaResponse | undefined;

  navMenu = navMenu;
  constructor() {
    let user = localStorage.getItem('user');
    if (user) this.storeService.user.next(JSON.parse(user));

    this.storeService.isLoginSubject.subscribe((isLoggedIn) => {
      this.isLogin = isLoggedIn;
    });

    this.storeService.user.subscribe((user) => {
      this.user = user;
      user?.role.includes('ROLE_TRABAJADOR')
        ? (this.navMenu = navMenu)
        : (this.navMenu = navMenuAdmin);
    });
  }
}
