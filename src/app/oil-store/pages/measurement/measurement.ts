import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormUtils } from '../../../utils/form.util';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DieselPipe, PremiumPipe, RegularPipe } from '../../../pipes';
import { MedirService } from '@oil-store/service';
import { AlertService } from 'src/app/service/alert.service';
import { LinkParamService, StoreService } from 'src/app/service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { MedidaContent } from '@oil-store/model/medir.interface';
import { IPersonaStore } from '@auth/interfaces/auth-response.interface';

@Component({
  selector: 'app-measurement',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DieselPipe,
    RegularPipe,
    PremiumPipe,
    DatePipe,
    PaginationComponent,
  ],
  templateUrl: './measurement.html',
})
export class Measurement {
  formUtils = FormUtils;
  @ViewChild('modalMedidaRef') modalMedidaRef!: ElementRef;
  modalOpen = signal(false);
  typeDialog = signal<'Crear' | 'Editar'>('Crear');
  storeService = inject(StoreService);
  user: IPersonaStore | null = null;
  private _medirService = inject(MedirService);
  private _alertService = inject(AlertService);
  _linkService = inject(LinkParamService);

  ngOnInit(): void {
    this.storeService.user.subscribe((user: any) => {
      const { email, role, ...personaData } = user!;
      this.user = personaData;
    });
  }
  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    idMedicion: [0],
    diesel: ['', [Validators.required, Validators.min(0), Validators.max(230)]],
    regular: ['', [Validators.required, Validators.min(0), Validators.max(230)]],
    premiun: ['', [Validators.required, Validators.min(0), Validators.max(230)]],
  });

  async onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    let sendMeassure = this.myForm.value;
    sendMeassure.idpersona = { idPersona: this.user?.idPersona };
    if (this.typeDialog() === 'Crear') {
      delete this.myForm.value.idMedicion;
      await this._medirService.postMedition(sendMeassure).subscribe({
        next: (resp: any) => {
          this._alertService.getAlert(
            'Medición creada',
            'Medición creada satisfactoriamente',
            'success',
          );
          this.listaMeasure.reload();
          this.myForm.reset();
        },
        error: (error: any) => {
          this._alertService.getAlert('Error!!!', 'Error al crear la medición', 'error');
          return;
        },
      });
    } else {
      console.log(this.myForm.value);

      this._medirService.putMedition(this.myForm.value.idMedicion, sendMeassure).subscribe({
        next: (resp: any) => {
          this._alertService.getAlert(
            'Medición actualizada',
            'Medición actualizada satisfactoriamente',
            'success',
          );
          this.listaMeasure.reload();
          this.closeModal(this.modalMedidaRef.nativeElement);
        },
        error: (error: any) => {
          this._alertService.getAlert('Error!!!', 'Error al actualizar la medición', 'error');
          return;
        },
      });
    }
  }

  listaMeasure = rxResource({
    params: () => ({
      page: this._linkService.currentPage() - 1,
      size: this._linkService.currentSize(),
    }),
    stream: ({ params }) => {
      return this._medirService.getAllMedidas({
        page: params.page,
        size: params.size,
      });
    },
  });

  deleteMedida(id: number) {
    this._medirService.deleteMedition(id).subscribe({
      next: (resp: any) => {
        this._alertService.getAlert(
          'Medición eliminada',
          'Medición eliminada satisfactoriamente',
          'success',
        );
        this.listaMeasure.reload();
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al eliminar la medición', 'error');
        return;
      },
    });
  }
  openModal(item: MedidaContent, dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      this.modalOpen.set(true);
      this.typeDialog.set(item ? 'Editar' : 'Crear');
      this.onEdit(item);
    } catch (err) {
      console.error('No se pudo abrir el modal', err);
    }
  }

  closeModal(dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
      this.modalOpen.set(false);
    } catch (err) {
      console.error('No se pudo cerrar el modal', err);
    }
  }
  onEdit(item: MedidaContent) {
    this.myForm.patchValue({
      idMedicion: item.idMedicion,
      diesel: item.diesel,
      regular: item.regular,
      premiun: item.premiun,
    });
  }
}
