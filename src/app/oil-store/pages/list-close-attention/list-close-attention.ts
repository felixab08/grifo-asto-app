import { DatePipe, JsonPipe, NgClass, NgStyle } from '@angular/common';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AttentionMock } from '../../../mock/lista-cierre.mock';
import { Router } from '@angular/router';
import { TurnoService } from '@oil-store/service';
import { TurnoRequest, TurnoResponse } from '@oil-store/model';
import { AlertService } from 'src/app/service/alert.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ɵInternalFormsSharedModule,
} from '@angular/forms';

@Component({
  selector: 'app-list-close-attention',
  imports: [NgStyle, DatePipe, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './list-close-attention.html',
})
export class ListCloseAttention {
  @ViewChild('modalTurnoRef') modalTurnoRef!: ElementRef;
  modalOpen = signal(false);
  observaciones = '';
  router = inject(Router);
  stateturno = signal<'iniciar' | 'cerrar' | 'iniciado'>('iniciar');
  turnoList = signal<TurnoResponse | null>(null);

  _turnoService = inject(TurnoService);
  public _alertService = inject(AlertService);

  registroTurno: TurnoRequest = {
    fechaEntrada: new Date(),
    persona: {
      idPersona: 6,
      nombre: 'Carlos 33',
      apellido: 'ASTO BERROCAL',
      telefono: '999999999',
    },
  };
  private _fb = inject(FormBuilder);
  myForm: FormGroup = this._fb.group({
    obs: [''],
  });
  ngOnInit(): void {
    this.stateturno.set(
      (localStorage.getItem('attention-type') as 'iniciar' | 'cerrar') || 'iniciar'
    );
    if (localStorage.getItem('attention-type') === 'iniciado') {
      this.stateturno.set('cerrar');
    }
    this.listTurnoByPerson();
  }

  listTurnoByPerson() {
    this._turnoService.getAllTurnosByIdPerson(6).subscribe({
      next: (resp) => {
        console.log(resp);
        this.turnoList.set(resp);
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al obtener los turnos', 'error');
      },
    });
  }

  onSave() {
    if (this.stateturno() === 'iniciar') {
      this._turnoService.postRegisterTurnoByIdPersona(this.registroTurno).subscribe({
        next: (resp) => {
          this._alertService.getAlert('Turno Creado', 'Turno creado satisfactoriamente', 'success');
          this.handlerTurno(resp.idTurno);
        },
        error: (error: any) => {
          this._alertService.getAlert('Error!!!', 'Error al registrar el usuario', 'error');
        },
      });
    }
    if (this.stateturno() === 'cerrar') {
      this.openModal(this.modalTurnoRef.nativeElement);
    }
  }
  guardarObservaciones() {
    const turno = JSON.parse(localStorage.getItem('turno') || '{}');
    turno.fechaSalida = new Date().toISOString();
    turno.observaciones = this.myForm.get('obs')?.value || '';
    this._turnoService.putRegisterTurnoByIdPersona(turno.idTurno, turno).subscribe({
      next: (resp) => {
        this._alertService.getAlert('Turno editado', 'Turno editado satisfactoriamente', 'success');
        const listMedidas = this.turnoList()?.data[0].turnos[0].medidas;
        localStorage.setItem('registro', JSON.stringify(listMedidas));
        this.handlerTurno(turno.idTurno);
      },
      error: (error: any) => {
        this._alertService.getAlert('Error!!!', 'Error al registrar el usuario', 'error');
      },
    });
  }
  handlerTurno(idturno: number = 9) {
    localStorage.setItem('attention-type', 'iniciar');
    this.router.navigate(['/grifo/register-close-attention', this.stateturno(), idturno]);
  }

  openModal(dialog?: HTMLDialogElement | null): void {
    console.log('entro');

    if (!dialog) return;
    try {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      this.modalOpen.set(true);
    } catch (err) {
      console.error('No se pudo abrir el modal', err);
    }
  }

  closeModal(dialog?: HTMLDialogElement | null): void {
    if (!dialog) return;
    try {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
      this.modalOpen.set(false);
    } catch (err) {
      console.error('No se pudo cerrar el modal', err);
    }
  }
}
