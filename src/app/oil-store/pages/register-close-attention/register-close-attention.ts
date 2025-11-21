import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form.util';
import { createRegisterCloseAttentionMapper } from '../../../mapper/register.mapper';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register-close-attention',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-close-attention.html',
})
export class RegisterCloseAttention {
  formUtils = FormUtils;

  activateRoute = inject(ActivatedRoute);

  typeRegister: string = this.activateRoute.snapshot.params['type'];
  router = inject(Router);

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

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if (this.typeRegister === 'iniciar') {
      const registro = createRegisterCloseAttentionMapper(this.myForm.value, this.typeRegister);
      localStorage.setItem('registro', JSON.stringify(registro));
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

    this.router.navigate(['/list-oil-store']);
    // this.myForm.reset();
  }
  addnewRegister(newData: any) {
    const pastRegister = JSON.parse(localStorage.getItem('attention') || '{}');
    const updatedRegister = [newData, ...pastRegister];
    console.log(updatedRegister);
    localStorage.setItem('attention', JSON.stringify(updatedRegister));
  }

  ngOnDestroy(): void {
    if (this.typeRegister === 'iniciar') {
      localStorage.setItem('attention-type', 'iniciado');
    }
  }
}
