import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormUtils } from '../../../utils/form.util';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DieselPipe, PremiumPipe, RegularPipe } from '../../../pipes';
import { MedirService } from '@oil-store/service';
import { AlertService } from 'src/app/service/alert.service';
import { IResponseMedidor } from '@oil-store/model/medir.interface';

@Component({
  selector: 'app-measurement',
  imports: [ReactiveFormsModule, CommonModule, DieselPipe, RegularPipe, PremiumPipe, DatePipe],
  templateUrl: './measurement.html',
})
export class Measurement {
  listaMeasure = signal<IResponseMedidor | null>(null);
  formUtils = FormUtils;

  private _medirService = inject(MedirService);
  private _alertService = inject(AlertService);

  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    diesel: ['', [Validators.required]],
    regular: ['', [Validators.required]],
    premiun: ['', [Validators.required]],
  });

  handlerNewMeassure() {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listMedition();
  }

  async onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    let sendMeassure = this.myForm.value;
    sendMeassure.idpersona = { idPersona: 1 };
    await this._medirService.postMedition(sendMeassure).subscribe({
      next: (resp: any) => {
        this._alertService.getAlert(
          'Medición creada',
          'Medición creada satisfactoriamente',
          'success'
        );
        this.listaMeasure()?.data.unshift(resp);
        this.myForm.reset();
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al crear la medición', 'error');
        return;
      },
    });
  }

  listMedition() {
    this._medirService.getAllMedidas().subscribe({
      next: (resp) => {
        console.log(resp);
        this.listaMeasure.set(resp);
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al obtener los turnos', 'error');
      },
    });
  }
}
