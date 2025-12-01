import { inject, Injectable, signal } from '@angular/core';
import { StoreService } from './store.service';
import { AlertI } from '../interface/alert.interface';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  storeService = inject(StoreService);

  public isAlert = signal(false);

  public alertMenu = signal<AlertI>({
    title: '',
    message: '',
    type: 'success',
  });

  // TODO : verificar si se tiene que desuscribir en algun lugar
  constructor() {
    this.storeService.isAlertSubject.subscribe((isLoggedIn) => {
      this.isAlert.set(isLoggedIn);
    });
  }
  openAlert() {
    this.storeService.isAlertSubject.next(true);
  }

  closeAlert() {
    this.storeService.isAlertSubject.next(false);
  }

  public addAlert(snackbar: AlertI) {
    this.alertMenu.set(snackbar);
    this.openAlert();
    if (snackbar.timeout !== 0) {
      setTimeout(() => {
        this.closeAlert();
      }, snackbar.timeout || 5000);
    }
  }

  /**
   * getAlert()
   * imprime getAlert en una sola linea declarando solo el metodo y pasando los parametros
   * @param title:string
   * @param message:string
   * @param type:string 'success' | 'error' | 'info' | 'warning'
   * @param timeout?:number in ms (default 7000ms)
   * @param redirect?:AlertRedirect
   */
  public getAlert(
    title: string,
    message: string,
    type: string = 'info',
    timeout: number = 5000,
    redirect?: any
  ) {
    let snackBar: any = {
      id: new Date().getTime(),
      title: title,
      message: message,
      type: type,
      timeout: timeout ? timeout : 0,
    };
    if (redirect) snackBar.redirect = redirect;
    this.addAlert(snackBar);
  }
}
