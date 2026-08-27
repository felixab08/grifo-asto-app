import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TurnoRegisterResponse, TurnoResponse } from '@oil-store/model';
import { TurnoService } from '@oil-store/service';
import { FormUtils } from '@utils/form.util';
import { AlertService, StoreService } from 'src/app/service';
import { MedidasComponent } from '@oil-store/components';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-corte',
  imports: [CommonModule, ReactiveFormsModule, MedidasComponent, RouterLink],
  templateUrl: './corte.page.html',
})
export class CortePage {
  private _storeService = inject(StoreService);
  private _turnoService = inject(TurnoService);
  private _alertService = inject(AlertService);
  private _fb = inject(FormBuilder);
  formUtils = FormUtils;
  turno = signal<TurnoRegisterResponse | null>(null);
  idPersona = signal(1);
  checkNextForm = signal(true);

  // State signals
  // Formulario para cerrar turno
  myForm: FormGroup = this._fb.group({
    observaciones: [''],
    sum: [0, [Validators.required]],
    rest: [0, [Validators.required]],
    fechaSalida: ['', [Validators.required]],
  });
  ngOnInit(): void {
    this._storeService.user.subscribe((user: any) => {
      if (!user) return;
      this.idPersona.set(user.idPersona);
    });
  }
  createForm() {
    this.myForm = this._fb.group({
      observaciones: [''],
      sum: [0, [Validators.required]],
      rest: [0, [Validators.required]],
      fechaSalida: ['', [Validators.required]],
    });
  }

  onSave(): void {
    const hoy = this.myForm.controls['fechaSalida'].value;
    console.log(hoy);

    let dateForm = this.myForm.value;
    dateForm.fechaSalida = this.formatToInputDate(
      this.myForm.controls['fechaSalida'].value + 'T22:19:02.177Z',
    );
    dateForm.fechaEntrada = this.formatToInputDate(
      this.myForm.controls['fechaSalida'].value + 'T22:19:02.177Z',
    );
    dateForm.persona = {
      idPersona: this.idPersona(),
    };
    console.log(dateForm);
    this._turnoService.postRegisterTurnoByIdPersona(dateForm).subscribe({
      next: (resp) => {
        this._alertService.getAlert('Turno Creado', 'Turno creado satisfactoriamente', 'success');
        this.turno.set(resp);
        this.checkNextForm.set(false);
      },
      error: () => {
        this._alertService.getAlert('Error', 'Error al registrar el turno', 'error');
      },
    });
  }
  created(e: boolean) {
    this.checkNextForm.set(e);
    this.myForm.reset();
    this.createForm();
  }
  private formatToInputDate(dateLike: Date | string | null): string {
    if (!dateLike) return '';
    const d = new Date(dateLike);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
