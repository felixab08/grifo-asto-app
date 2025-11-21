import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormUtils } from '../../../utils/form.util';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedidoMock } from '../../../mock/medido.mock';
import { NoventaPipe } from '../../../pipes/noventa.pipe';
import { NoventaycincoPipe } from '../../../pipes/noventaycinco.pipe';
import { PetroleoPipe } from '../../../pipes/petroleo.pipe';

@Component({
  selector: 'app-measurement',
  imports: [ReactiveFormsModule, CommonModule, NoventaPipe, NoventaycincoPipe, PetroleoPipe],
  templateUrl: './measurement.html',
})
export class Measurement {
  lista_measure = MedidoMock;
  formUtils = FormUtils;
  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    petroleo: ['', [Validators.required]],
    regular: ['', [Validators.required]],
    premium: ['', [Validators.required]],
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
