import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form.util';
import { createRegisterCloseAttentionMapper } from '../../../mapper/register.mapper';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { createMedidaMapper } from '@mapper/medidor.mapper';
import { MedidorRequest } from '@oil-store/model';
import { MedidorService } from '@oil-store/service';

@Component({
  selector: 'app-register-close-attention',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-close-attention.html',
})
export class RegisterCloseAttention {
  formUtils = FormUtils;

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
    obs: [''],
  });

  async onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if (this.typeRegister === 'iniciar') {
      const lisMedidas = createMedidaMapper(this.myForm.value, +this.idturno, this.typeRegister);

      await lisMedidas.map((medidor: MedidorRequest) =>
        this._medidorService.postMedidaByTurno(medidor).subscribe()
      );
      console.log(lisMedidas);
    }

    if (this.typeRegister === 'cerrar') {
      const anterior = JSON.parse(localStorage.getItem('registro') || '{}');
      const registro = createRegisterCloseAttentionMapper(
        this.myForm.value,
        this.typeRegister,
        anterior
      );
      this.addnewRegister(registro);
      localStorage.removeItem('registro');
    }

    this.router.navigate(['/grifo/list-oil-store']);
    // this.myForm.reset();
  }
  addnewRegister(newData: any) {
    const pastRegister = JSON.parse(localStorage.getItem('attention') || '{}');
    const updatedRegister = [newData, ...pastRegister];
    localStorage.setItem('attention', JSON.stringify(updatedRegister));
  }

  ngOnDestroy(): void {
    if (this.typeRegister === 'iniciar') {
      localStorage.setItem('attention-type', 'iniciado');
    }
  }
}
