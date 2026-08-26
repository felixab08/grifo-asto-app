import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { lastMedidaMapper } from '@mapper/medidor.mapper';
import { MedidorService, TurnoService } from '@oil-store/service';
import { FormUtils } from '@utils/form.util';
import { AlertService } from 'src/app/service';

@Component({
  selector: 'app-medidas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './medidas.component.html',
})
export class MedidasComponent {
  idturno = input.required<number>();
  created = output<boolean>();
  formUtils = FormUtils;
  public _alertService = inject(AlertService);
  private _fb = inject(FormBuilder);
  private _medidorService = inject(MedidorService);

  myForm: FormGroup = this._fb.group({
    // entrada
    pet11star: ['', [Validators.required]],
    pet21star: ['', [Validators.required]],
    reg12star: ['', [Validators.required]],
    reg22star: ['', [Validators.required]],
    pri13star: ['', [Validators.required]],
    pri23star: ['', [Validators.required]],
    // salida
    pet11exit: ['', [Validators.required]],
    pet21exit: ['', [Validators.required]],
    reg12exit: ['', [Validators.required]],
    reg22exit: ['', [Validators.required]],
    pri13exit: ['', [Validators.required]],
    pri23exit: ['', [Validators.required]],
  });

  async onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    const lisMedidas = lastMedidaMapper(this.myForm.value, this.idturno());
    await lisMedidas.map((medidor: any) =>
      this._medidorService.postMedidaByTurno(medidor).subscribe({
        next: (resp) => {
          this._alertService.getAlert(
            'Medida creada',
            'Medida creada satisfactoriamente',
            'success',
          );
          this.created.emit(true);
        },
        error: (error: any) => {
          this._alertService.getAlert('Error!!!', 'Error al crear la medidor', 'error');
          return;
        },
      }),
    );
  }
}
