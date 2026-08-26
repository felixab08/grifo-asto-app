import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ContentTurno,
  OptionsRequest,
  TurnoRegisterResponse,
  TurnoResponse,
} from '@oil-store/model';
import { TurnoService } from '@oil-store/service';
import { FormUtils } from '@utils/form.util';
import { AlertService, StoreService } from 'src/app/service';
import { MedidasComponent } from '@oil-store/components';

@Component({
  selector: 'app-corte',
  imports: [CommonModule, ReactiveFormsModule, MedidasComponent],
  templateUrl: './corte.page.html',
})
export class CortePage {
  private _storeService = inject(StoreService);
  private _turnoService = inject(TurnoService);
  private _alertService = inject(AlertService);
  private fb = inject(FormBuilder);
  formUtils = FormUtils;
  turno = signal<TurnoRegisterResponse | null>(null);
  idPersona = signal(1);
  checkNextForm = signal(true);

  // State signals
  // Formulario para cerrar turno
  myForm: FormGroup = this.fb.group({
    obs: [''],
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
  onSave(): void {
    let dateForm = this.myForm.value;
    dateForm.fechaEntrada = new Date();
    dateForm.persona = {
      idPersona: this.idPersona(),
    };
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
}
