import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DieselPipe, RegularPipe, PremiumPipe } from '../../../pipes';
import { FormUtils } from '../../../utils/form.util';
import { EntranceMock } from '../../../mock/entrada.mock';

@Component({
  selector: 'app-entrance-diesel',
  imports: [ReactiveFormsModule, CommonModule, DatePipe],
  templateUrl: './entrance-diesel.html',
})
export class EntranceDiesel {
  lista_entranse = EntranceMock;
  formUtils = FormUtils;
  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    typeOil: ['', [Validators.required]],
    diesel: ['', [Validators.required]],
  });

  handlerNewMeassure() {}

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log(this.myForm.value);
  }
}
