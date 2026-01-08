import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '@oil-store/service/register.service';
import { FormUtils } from '@utils/form.util';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  private _fb = inject(FormBuilder);
  private _usersService = inject(RegisterService);
  private _alertService = inject(AlertService);

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
    this._usersService.postRegisterUser(this.myForm.value as any).subscribe({
      next: (resp) => {
        this.myForm.reset();
        this._alertService.getAlert(
          'Usuario Creado',
          'Usuario creado satisfactoriamente',
          'success'
        );
        this.myForm.reset();
        this.myForm.controls['activo'].setValue('true');
        this.myForm.controls['role'].setValue('ROLE_TRABAJADOR');
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al registrar el usuario', 'error');
      },
    });
    console.log('Form submitted', this.myForm.value);
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
