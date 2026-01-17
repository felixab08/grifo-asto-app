import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PersonaService } from '@oil-store/service';
import { AlertService, LinkParamService } from 'src/app/service';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { DatePipe, NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '@oil-store/service/register.service';
import { FormUtils } from '@utils/form.util';

@Component({
  selector: 'app-personal-list',
  imports: [PaginationComponent, DatePipe, ReactiveFormsModule, NgClass],
  templateUrl: './personal-list.html',
})
export class PersonalList {
  _linkService = inject(LinkParamService);
  private _personaService = inject(PersonaService);
  private _fb = inject(FormBuilder);
  private _usersService = inject(RegisterService);
  private _alertService = inject(AlertService);

  formUtils = FormUtils;
  lookIconIsPassword = signal(false);
  lookIconIsPasswordConfirm = signal(false);

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
    },
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
          'success',
        );
        this.myForm.reset();
        this.myForm.controls['activo'].setValue('true');
        this.myForm.controls['role'].setValue('ROLE_TRABAJADOR');
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al registrar el usuario', 'error');
      },
    });
  }

  changeTypeInput() {
    this.lookIconIsPassword.update((value) => !value);
  }
  changeTypeInputConfirm() {
    this.lookIconIsPasswordConfirm.update((value) => !value);
  }
  listaPersonal = rxResource({
    params: () => ({
      page: this._linkService.currentPage() - 1,
      size: this._linkService.currentSize(),
    }),
    stream: ({ params }) => {
      return this._personaService.getAllPerson({
        page: params.page,
        size: params.size,
      });
    },
  });
}
