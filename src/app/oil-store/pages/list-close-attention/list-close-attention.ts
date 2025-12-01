import { DatePipe, JsonPipe, NgClass, NgStyle } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AttentionMock } from '../../../mock/lista-cierre.mock';
import { Router } from '@angular/router';
import { TurnoService } from '@oil-store/service';
import { TurnoRequest, TurnoResponse } from '@oil-store/model';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-list-close-attention',
  imports: [NgStyle, DatePipe],
  templateUrl: './list-close-attention.html',
})
export class ListCloseAttention {
  lista_close_data = AttentionMock.data[0].turnos;
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
  ngOnInit(): void {
    this.stateturno.set(
      (localStorage.getItem('attention-type') as 'iniciar' | 'cerrar') || 'iniciar'
    );
    if (localStorage.getItem('attention-type') === 'iniciado') {
      this.stateturno.set('cerrar');
    }
    if (!localStorage.getItem('attention')) {
      localStorage.setItem('attention', JSON.stringify(this.lista_close_data));
    } else {
      this.lista_close_data = JSON.parse(localStorage.getItem('attention') || '[]');
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

  handlerTurno(idturno: number = 9) {
    localStorage.setItem('attention-type', 'iniciar');
    this.router.navigate(['/grifo/register-close-attention', this.stateturno(), idturno]);
  }
}
