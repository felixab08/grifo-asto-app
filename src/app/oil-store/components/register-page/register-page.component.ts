import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form.util';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  private _fb = inject(FormBuilder);
  formUtils = FormUtils;
  lookIconIsPassword = signal(true);
  lookIconIsPasswordConfirm = signal(true);

  myForm = this._fb.group(
    {
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: ['', [Validators.minLength(9), Validators.maxLength(9)]],
      email: ['', [Validators.pattern(FormUtils.emailPattern)]],
      username: ['', [Validators.required]],
      role: ['ROLE_TRABAJADOR', [Validators.required]],
      activo: ['true', [Validators.required]],
      newpassword: ['', [Validators.required, this.formUtils.passwordSeguraValidator()]],
      confirmationPassword: ['', [Validators.required]],
    },
    {
      validators: this.formUtils.passIgualesValidator('newpassword', 'confirmationPassword'),
    }
  );

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log('Form submitted', this.myForm.value);
    this.myForm.reset();
    this.myForm.controls['activo'].setValue('true');
    this.myForm.controls['role'].setValue('ROLE_TRABAJADOR');
  }

  changeTypeInput() {
    const inputPassword = document.getElementById('newpassword') as HTMLInputElement;
    if (inputPassword.type === 'password') {
      inputPassword.type = 'text';
      this.lookIconIsPassword.set(false);
    } else {
      inputPassword.type = 'password';
      this.lookIconIsPassword.set(true);
    }
  }
  changeTypeInputConfirm() {
    const inputPassword = document.getElementById('confirmationPassword') as HTMLInputElement;
    if (inputPassword.type === 'password') {
      inputPassword.type = 'text';
      this.lookIconIsPasswordConfirm.set(false);
    } else {
      inputPassword.type = 'password';
      this.lookIconIsPasswordConfirm.set(true);
    }
  }
}
