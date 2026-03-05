import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FrontNavbarComponent } from '../components/front-navbar/front-navbar.component';
import { RouterOutlet } from '@angular/router';
import { StoreService } from 'src/app/service/store.service';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { AlertService } from 'src/app/service/alert.service';
import { IConfirmDelete } from '@auth/interfaces/confirDelete.interface';

@Component({
  selector: 'app-page',
  imports: [FrontNavbarComponent, RouterOutlet, AlertComponent],
  templateUrl: './oil-store.layout.html',
})
export class OilLayout {
  public _storeService = inject(StoreService);
  public _alertService = inject(AlertService);
  isModalConfirm: boolean = true;

  @ViewChild('modalRef') modalRef!: ElementRef;

  constructor() {
    // Listen modal open/close and act accordingly
    this._storeService.isModalConfirm$.subscribe((isModalConfirm) => {
      this.isModalConfirm = isModalConfirm;
      const dialog = this.modalRef?.nativeElement ?? null;
      if (isModalConfirm) {
        this.openModal(dialog);
      } else {
        this.closeModal(dialog);
      }
    });
  }

  onDialogClick(event: Event) {
    const dialogEl = this.modalRef?.nativeElement as HTMLDialogElement | undefined;
    if (!dialogEl) return;
    if (event.target === dialogEl) {
      this.closeDialog();
    }
  }

  openModal(dialog: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    } catch (err) {
      console.error('No se pudo abrir el modal', err);
    }
  }

  closeModal(dialog: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    } catch (err) {
      console.error('No se pudo cerrar el modal', err);
    }
  }

  confirm() {
    let answerConfirm: IConfirmDelete = {
      answered: true,
      response: true,
    };
    this._storeService.responseModalConfirmSubject.next(answerConfirm);
    this.closeModal(this.modalRef?.nativeElement);
  }

  closeDialog() {
    let answerConfirm: IConfirmDelete = {
      answered: true,
      response: false,
    };
    this._storeService.responseModalConfirmSubject.next(answerConfirm);
    this.closeModal(this.modalRef?.nativeElement);
  }
}
