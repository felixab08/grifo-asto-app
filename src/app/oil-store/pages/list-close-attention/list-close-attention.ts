import { JsonPipe, NgClass, NgStyle } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CloseAttentionMock } from '../../../mock/lista-cierre.mock';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-close-attention',
  imports: [NgStyle],
  templateUrl: './list-close-attention.html',
})
export class ListCloseAttention {
  lista_close_data = CloseAttentionMock.turno_dia;
  router = inject(Router);
  turno = signal<'iniciar' | 'cerrar' | 'iniciado'>('iniciar');
  ngOnInit(): void {
    this.turno.set((localStorage.getItem('attention-type') as 'iniciar' | 'cerrar') || 'iniciar');
    if (localStorage.getItem('attention-type') === 'iniciado') {
      this.turno.set('cerrar');
    }
    if (!localStorage.getItem('attention')) {
      localStorage.setItem('attention', JSON.stringify(this.lista_close_data));
    } else {
      this.lista_close_data = JSON.parse(localStorage.getItem('attention') || '[]');
    }
  }
  handlerTurno() {
    localStorage.setItem('attention-type', 'iniciar');
    this.router.navigate(['/register-close-attention', this.turno()]);
  }
}
