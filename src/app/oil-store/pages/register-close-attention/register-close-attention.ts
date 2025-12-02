import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form.util';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { createMedidaMapper } from '@mapper/medidor.mapper';
import { Medida, MedidorListResponse, MedidorRequest } from '@oil-store/model';
import { MedidorService } from '@oil-store/service';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-register-close-attention',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-close-attention.html',
})
export class RegisterCloseAttention {
  formUtils = FormUtils;
  public _alertService = inject(AlertService);

  activateRoute = inject(ActivatedRoute);

  typeRegister: string = this.activateRoute.snapshot.params['type'];
  idturno: string = this.activateRoute.snapshot.params['idturno'];
  router = inject(Router);

  private _medidorService = inject(MedidorService);
  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    pet11: ['', [Validators.required]],
    pet21: ['', [Validators.required]],
    reg12: ['', [Validators.required]],
    reg22: ['', [Validators.required]],
    pri13: ['', [Validators.required]],
    pri23: ['', [Validators.required]],
  });

  async onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if (this.typeRegister === 'iniciar') {
      const lisMedidas = createMedidaMapper(this.myForm.value, +this.idturno, this.typeRegister);

      await lisMedidas.map((medidor: MedidorRequest) =>
        this._medidorService.postMedidaByTurno(medidor).subscribe({
          next: (resp) => {
            this._alertService.getAlert(
              'Medida creada',
              'Medida creada satisfactoriamente',
              'success'
            );
          },
          error: (error: any) => {
            this._alertService.getAlert('Error!!!', 'Error al crear la medidor', 'error');
            return;
          },
        })
      );
    }

    if (this.typeRegister === 'cerrar') {
      const anterior: MedidorListResponse[] = JSON.parse(localStorage.getItem('registro') || '{}');
      const registro = createMedidaMapper(
        this.myForm.value,
        +this.idturno,
        this.typeRegister,
        anterior
      );
      await registro.map((medidor: MedidorRequest) =>
        this._medidorService.putMedidaByTurno(medidor.idMedida, medidor).subscribe({
          next: (resp) => {
            this._alertService.getAlert(
              'Medida Modificada',
              'Medida Modificada satisfactoriamente',
              'success'
            );
          },
          error: (error: any) => {
            this._alertService.getAlert('Error!!!', 'Error al modificar el medidor', 'error');
            return;
          },
        })
      );
      localStorage.removeItem('registro');
      localStorage.removeItem('turno');
    }
    this.myForm.reset();
    this.router.navigate(['/grifo/list-oil-store']);
  }

  ngOnDestroy(): void {
    if (this.typeRegister === 'iniciar') {
      localStorage.setItem('attention-type', 'iniciado');
    }
  }
}
