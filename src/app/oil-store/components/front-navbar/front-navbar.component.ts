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

  // temas (persistencia localStorage)
  public themes: string[] = ['retro', 'winter', 'valentine', 'aqua', 'forest'];
  public selectedTheme: string = 'retro';

  constructor() {
    // inicializar tema desde localStorage (si existe)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && this.themes.includes(savedTheme)) {
      this.applyTheme(savedTheme);
    } else {
      // asegurar tema por defecto
      this.applyTheme(this.selectedTheme);
    }

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

  applyTheme(theme: string) {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      this.selectedTheme = theme;
    } catch (e) {
      // ignore if not available
    }
  }

  onThemeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if (value) this.applyTheme(value);
  }
}
